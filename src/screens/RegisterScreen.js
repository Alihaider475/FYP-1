import React, { useState, useRef, useEffect } from 'react';
import {View,KeyboardAvoidingView,Platform,ScrollView,TouchableOpacity,Animated,Alert,
} from 'react-native';
import { TextInput, Text, Snackbar } from 'react-native-paper';
import {Shield,Eye,EyeOff,Mail,Lock,User,ArrowRight,ArrowLeft,UserPlus,ShieldAlert,CheckCircle,Clock,
  Building} from 'lucide-react-native';
import { styles, COLORS } from './styles/RegisterScreenStyles';
import { useWorkerSignup } from '../hooks/useWorkerSignup';

const RegisterScreen = ({ navigation, onRegisterSuccess, onBackToLogin }) => {
  const { handleSignup, isLoading, isBlocked } = useWorkerSignup(navigation);
  // Form input states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Notification states
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('error');

  // Form validation error states
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    jobTitle: '',
  });

  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Run animations when component loads
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateForm = () => {
    // Create empty error object
    const newErrors = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      jobTitle: '',
    };
    let isValid = true;

    // Check if full name is entered
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    // Check if email is entered
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    }

    // Check if job title is entered
    if (!jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
      isValid = false;
    }

    // Check if password is entered
    if (!password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    // Check if passwords match
    if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    // Update error state
    setErrors(newErrors);
    return isValid;
  };

  const handleBackToLogin = () => {
    // Navigate back to login screen
    if (onBackToLogin) {
      onBackToLogin();
    }
  };

  // Show notification message at bottom of screen
  const showSnackbar = (message, type = 'error') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  // Clear error message for a specific field
  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // Get color based on notification type (success, error, pending)
  const getSnackbarColor = () => {
    switch (snackbarType) {
      case 'success':
        return COLORS.success;  // Green
      case 'pending':
        return COLORS.warning;  // Yellow
      default:
        return COLORS.error;    // Red
    }
  };

  // Get icon based on notification type
  const getSnackbarIcon = () => {
    switch (snackbarType) {
      case 'success':
        return <CheckCircle size={18} color={COLORS.surface} />;
      case 'pending':
        return <Clock size={18} color={COLORS.surface} />;
      default:
        return <ShieldAlert size={18} color={COLORS.surface} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Design */}
      <View style={styles.backgroundTop}>
        <View style={styles.circleOne} />
        <View style={styles.circleTwo} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackToLogin}
            >
              <ArrowLeft size={22} color={COLORS.surface} />
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <UserPlus size={32} color={COLORS.accent} strokeWidth={2} />
              </View>
              <Text style={styles.welcomeText}>Create Account</Text>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              {/* Full Name Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <User size={20} color={errors.fullName ? COLORS.error : COLORS.secondary} />
                  </View>
                  <TextInput
                    value={fullName}
                    onChangeText={(text) => {
                      setFullName(text);
                      clearError('fullName');
                    }}
                    mode="flat"
                    placeholder="Enter your full name"
                    autoCapitalize="words"
                    style={styles.input}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    textColor={COLORS.primary}
                    placeholderTextColor={COLORS.secondary}
                  />
                </View>
                {errors.fullName ? (
                  <Text style={styles.errorText}>{errors.fullName}</Text>
                ) : null}
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <Mail size={20} color={errors.email ? COLORS.error : COLORS.secondary} />
                  </View>
                  <TextInput
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      clearError('email');
                    }}
                    mode="flat"
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.input}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    textColor={COLORS.primary}
                    placeholderTextColor={COLORS.secondary}
                  />
                </View>
                {errors.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}
              </View>

              {/* Job Title Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Job Title / Role</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <Building size={20} color={errors.jobTitle ? COLORS.error : COLORS.secondary} />
                  </View>
                  <TextInput
                    value={jobTitle}
                    onChangeText={(text) => {
                      setJobTitle(text);
                      clearError('jobTitle');
                    }}
                    mode="flat"
                    placeholder="e.g., Site Manager, Supervisor"
                    autoCapitalize="words"
                    style={styles.input}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    textColor={COLORS.primary}
                    placeholderTextColor={COLORS.secondary}
                  />
                </View>
                {errors.jobTitle ? (
                  <Text style={styles.errorText}>{errors.jobTitle}</Text>
                ) : null}
              </View>

              {/* Company Code Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Company Code</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <Shield size={20} color={COLORS.secondary} />
                  </View>
                  <TextInput
                    value={companyCode}
                    onChangeText={(text) => setCompanyCode(text)}
                    mode="flat"
                    placeholder="Enter your company code"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.input}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    textColor={COLORS.primary}
                    placeholderTextColor={COLORS.secondary}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <Lock size={20} color={errors.password ? COLORS.error : COLORS.secondary} />
                  </View>
                  <TextInput
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      clearError('password');
                    }}
                    mode="flat"
                    placeholder="Create a password"
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    textColor={COLORS.primary}
                    placeholderTextColor={COLORS.secondary}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color={COLORS.secondary} />
                    ) : (
                      <Eye size={20} color={COLORS.secondary} />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <Lock size={20} color={errors.confirmPassword ? COLORS.error : COLORS.secondary} />
                  </View>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      clearError('confirmPassword');
                    }}
                    mode="flat"
                    placeholder="Confirm your password"
                    secureTextEntry={!showConfirmPassword}
                    style={styles.input}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    textColor={COLORS.primary}
                    placeholderTextColor={COLORS.secondary}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color={COLORS.secondary} />
                    ) : (
                      <Eye size={20} color={COLORS.secondary} />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword ? (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                ) : null}
              </View>

              {/* Info Box */}
             

              {/* Submit Request Button */}
              <TouchableOpacity
                style={[styles.signUpButton, (isLoading || isBlocked) && styles.signUpButtonDisabled]}
                onPress={() => handleSignup({ name: fullName, email, password, designation: jobTitle, company_code: companyCode })}
                disabled={isLoading || isBlocked}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <Text style={styles.signUpButtonText}>Submitting Request...</Text>
                ) : (
                  <>
                    <Text style={styles.signUpButtonText}>Submit Request</Text>
                    <View style={styles.signUpButtonIcon}>
                      <ArrowRight size={20} color={COLORS.surface} />
                    </View>
                  </>
                )}
              </TouchableOpacity>

              {/* Sign In Link */}
              <View style={styles.signInContainer}>
                <Text style={styles.signInText}>Already have an account? </Text>
                <TouchableOpacity onPress={handleBackToLogin}>
                  <Text style={styles.signInLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>

            
            
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Snackbar for notifications */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
        style={{
          backgroundColor: getSnackbarColor(),
          marginBottom: 20,
          marginHorizontal: 16,
          borderRadius: 12,
        }}
        action={{
          label: 'Dismiss',
          textColor: COLORS.surface,
          onPress: () => setSnackbarVisible(false),
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {getSnackbarIcon()}
          <Text style={{ color: COLORS.surface, flex: 1, fontSize: 13 }}>
            {snackbarMessage}
          </Text>
        </View>
      </Snackbar>
    </View>
  );
};

export default RegisterScreen;
