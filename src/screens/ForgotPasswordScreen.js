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
  Mail,
  ArrowLeft,
  KeyRound,
  ChevronRight,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles, COLORS } from './styles/ForgotPasswordStyles';
import { supabase } from '../auth/supabase';

const ForgotPasswordScreen = ({ onNavigateToVerify, onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendCode = async () => {
    setEmailError('');

    if (!email.trim()) {
      setEmailError('Email address is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.toLowerCase().trim(),
        {
          redirectTo: 'safesite://reset-password',
        }
      );

      if (error) {
        if (error.message.includes('rate limit')) {
          Alert.alert(
            'Too Many Requests',
            'Please wait a few minutes before requesting another password reset.',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert('Error', error.message, [{ text: 'OK' }]);
        }
        setLoading(false);
        return;
      }

      Alert.alert(
        'Reset Email Sent',
        `We've sent a password reset link to ${email}. Please check your inbox and click the link to reset your password.`,
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
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.', [
        { text: 'OK' },
      ]);
    } finally {
      setLoading(false);
    }
  };

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
                <KeyRound size={32} color={COLORS.accent} strokeWidth={2} />
              </View>
            </View>

            {/* Header Text */}
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>
                No worries! Enter your email address and we'll send you a verification code to reset your password.
              </Text>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={[
                  styles.inputContainer,
                  isFocused && styles.inputContainerFocused,
                  emailError && styles.inputContainerError,
                ]}>
                  <Mail
                    size={20}
                    color={emailError ? COLORS.error : (isFocused ? COLORS.accent : COLORS.muted)}
                    strokeWidth={2}
                  />
                  <TextInput
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setEmailError('');
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    mode="flat"
                    placeholder="Enter your email address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.textInput}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    textColor={COLORS.primary}
                    placeholderTextColor={COLORS.muted}
                  />
                </View>
                {emailError ? (
                  <Text style={styles.errorText}>{emailError}</Text>
                ) : null}
              </View>

              {/* Send Code Button */}
              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.primaryButtonLoading]}
                onPress={handleSendCode}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={loading ? ['#94a3b8', '#94a3b8'] : ['#3b82f6', '#2563eb']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.primaryButtonText}>
                    {loading ? 'Sending Code...' : 'Send Verification Code'}
                  </Text>
                  {!loading && (
                    <ChevronRight size={20} color={COLORS.surface} strokeWidth={2.5} />
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Back to Login Link */}
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={onBackToLogin}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryButtonText}>Back to Sign In</Text>
              </TouchableOpacity>
            </View>

            {/* Help Text */}
            <View style={styles.helpContainer}>
              <Text style={styles.helpText}>
                Remember your password?{' '}
                <Text style={styles.helpLink} onPress={onBackToLogin}>
                  Sign In
                </Text>
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ForgotPasswordScreen;
