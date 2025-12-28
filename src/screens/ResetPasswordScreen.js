import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  StatusBar,
} from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import {
  Eye,
  EyeOff,
  Lock,
  ArrowLeft,
  Check,
  LockKeyhole,
  CircleCheck,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles, COLORS } from './styles/ResetPasswordStyles';
import { supabase } from '../auth/supabase';

const ResetPasswordScreen = ({ email, onPasswordReset, onBackToLogin }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validatePassword = (password) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return '';
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthInfo = (strength) => {
    if (strength <= 1) return { label: 'Weak', color: COLORS.error, width: '20%' };
    if (strength <= 2) return { label: 'Fair', color: COLORS.warning, width: '40%' };
    if (strength <= 3) return { label: 'Good', color: COLORS.warning, width: '60%' };
    if (strength <= 4) return { label: 'Strong', color: COLORS.success, width: '80%' };
    return { label: 'Very Strong', color: COLORS.success, width: '100%' };
  };

  const handleResetPassword = async () => {
    setNewPasswordError('');
    setConfirmPasswordError('');

    let hasError = false;

    const passwordValidation = validatePassword(newPassword);
    if (!newPassword.trim()) {
      setNewPasswordError('Password is required');
      hasError = true;
    } else if (passwordValidation) {
      setNewPasswordError(passwordValidation);
      hasError = true;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Please confirm your password');
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        if (error.message.includes('same as')) {
          setNewPasswordError('New password must be different from your current password');
        } else if (error.message.includes('session')) {
          Alert.alert(
            'Session Expired',
            'Your password reset link has expired. Please request a new one.',
            [
              {
                text: 'OK',
                onPress: () => {
                  if (onBackToLogin) {
                    onBackToLogin();
                  }
                },
              },
            ]
          );
        } else {
          Alert.alert('Error', error.message, [{ text: 'OK' }]);
        }
        setLoading(false);
        return;
      }

      // Sign out after password reset to require fresh login
      await supabase.auth.signOut();

      Alert.alert(
        'Password Reset Successful',
        'Your password has been updated successfully. You can now sign in with your new password.',
        [
          {
            text: 'Sign In',
            onPress: () => {
              if (onPasswordReset) {
                onPasswordReset();
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.', [
        { text: 'OK' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const strengthInfo = getStrengthInfo(passwordStrength);

  const requirements = [
    { text: 'At least 6 characters', met: newPassword.length >= 6 },
    { text: 'One uppercase letter', met: /[A-Z]/.test(newPassword) },
    { text: 'One number', met: /[0-9]/.test(newPassword) },
  ];

  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Gradient Header Background */}
      <LinearGradient
        colors={['#1e293b', '#334155', '#475569']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerPattern}>
          <View style={[styles.patternCircle, styles.patternCircle1]} />
          <View style={[styles.patternCircle, styles.patternCircle2]} />
          <View style={[styles.patternCircle, styles.patternCircle3]} />
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackToLogin}
            activeOpacity={0.7}
          >
            <ArrowLeft size={22} color={COLORS.surface} strokeWidth={2.5} />
          </TouchableOpacity>

          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim },
                ],
              },
            ]}
          >
            {/* Icon Container */}
            <View style={styles.iconOuterContainer}>
              <View style={styles.iconContainer}>
                <LockKeyhole size={32} color={COLORS.accent} strokeWidth={2} />
              </View>
            </View>

            {/* Header Text */}
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Create New Password</Text>
              <Text style={styles.subtitle}>
                Your new password must be different from previously used passwords
              </Text>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              {/* New Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>New Password</Text>
                <View style={[
                  styles.inputContainer,
                  newPasswordFocused && styles.inputContainerFocused,
                  newPasswordError && styles.inputContainerError,
                ]}>
                  <Lock
                    size={20}
                    color={newPasswordError ? COLORS.error : (newPasswordFocused ? COLORS.accent : COLORS.muted)}
                    strokeWidth={2}
                  />
                  <TextInput
                    value={newPassword}
                    onChangeText={(text) => {
                      setNewPassword(text);
                      setNewPasswordError('');
                    }}
                    onFocus={() => setNewPasswordFocused(true)}
                    onBlur={() => setNewPasswordFocused(false)}
                    mode="flat"
                    placeholder="Enter new password"
                    secureTextEntry={!showNewPassword}
                    style={styles.textInput}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    textColor={COLORS.primary}
                    placeholderTextColor={COLORS.muted}
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    style={styles.eyeButton}
                  >
                    {showNewPassword ? (
                      <EyeOff size={20} color={COLORS.muted} strokeWidth={2} />
                    ) : (
                      <Eye size={20} color={COLORS.muted} strokeWidth={2} />
                    )}
                  </TouchableOpacity>
                </View>
                {newPasswordError ? (
                  <Text style={styles.errorText}>{newPasswordError}</Text>
                ) : null}

                {/* Password Strength Indicator */}
                {newPassword.length > 0 && (
                  <View style={styles.strengthSection}>
                    <View style={styles.strengthBarContainer}>
                      <View style={styles.strengthBarBackground}>
                        <View
                          style={[
                            styles.strengthBarFill,
                            { width: strengthInfo.width, backgroundColor: strengthInfo.color },
                          ]}
                        />
                      </View>
                      <Text style={[styles.strengthLabel, { color: strengthInfo.color }]}>
                        {strengthInfo.label}
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={[
                  styles.inputContainer,
                  confirmPasswordFocused && styles.inputContainerFocused,
                  confirmPasswordError && styles.inputContainerError,
                  passwordsMatch && styles.inputContainerSuccess,
                ]}>
                  <Lock
                    size={20}
                    color={
                      confirmPasswordError
                        ? COLORS.error
                        : passwordsMatch
                          ? COLORS.success
                          : confirmPasswordFocused
                            ? COLORS.accent
                            : COLORS.muted
                    }
                    strokeWidth={2}
                  />
                  <TextInput
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      setConfirmPasswordError('');
                    }}
                    onFocus={() => setConfirmPasswordFocused(true)}
                    onBlur={() => setConfirmPasswordFocused(false)}
                    mode="flat"
                    placeholder="Confirm new password"
                    secureTextEntry={!showConfirmPassword}
                    style={styles.textInput}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    textColor={COLORS.primary}
                    placeholderTextColor={COLORS.muted}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeButton}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color={COLORS.muted} strokeWidth={2} />
                    ) : (
                      <Eye size={20} color={COLORS.muted} strokeWidth={2} />
                    )}
                  </TouchableOpacity>
                </View>
                {confirmPasswordError ? (
                  <Text style={styles.errorText}>{confirmPasswordError}</Text>
                ) : passwordsMatch ? (
                  <View style={styles.matchIndicator}>
                    <CircleCheck size={14} color={COLORS.success} strokeWidth={2.5} />
                    <Text style={styles.matchText}>Passwords match</Text>
                  </View>
                ) : null}
              </View>

              {/* Password Requirements */}
              <View style={styles.requirementsCard}>
                <Text style={styles.requirementsTitle}>Password Requirements</Text>
                {requirements.map((req, index) => (
                  <View key={index} style={styles.requirementRow}>
                    <View style={[
                      styles.requirementCheck,
                      req.met && styles.requirementCheckMet,
                    ]}>
                      <Check
                        size={12}
                        color={req.met ? COLORS.surface : COLORS.muted}
                        strokeWidth={3}
                      />
                    </View>
                    <Text style={[
                      styles.requirementText,
                      req.met && styles.requirementTextMet,
                    ]}>
                      {req.text}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Reset Password Button */}
              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.primaryButtonLoading]}
                onPress={handleResetPassword}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={loading ? ['#94a3b8', '#94a3b8'] : ['#10b981', '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.primaryButtonText}>
                    {loading ? 'Updating Password...' : 'Reset Password'}
                  </Text>
                  {!loading && (
                    <Check size={20} color={COLORS.surface} strokeWidth={2.5} />
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Security Note */}
            <View style={styles.securityNote}>
              <LockKeyhole size={16} color={COLORS.muted} strokeWidth={2} />
              <Text style={styles.securityText}>
                Your password is encrypted and secure
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ResetPasswordScreen;
