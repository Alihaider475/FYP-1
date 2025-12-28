import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { TextInput, Text, Snackbar } from 'react-native-paper';
import {
  Shield,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  UserPlus,
  ShieldAlert,
  CheckCircle,
  Clock,
  Building,
} from 'lucide-react-native';
import { styles, COLORS, REGISTER_COLORS } from './styles/RegisterScreenStyles';
import { supabase } from '../auth/supabase';

// Simulated Database - Approved Users (can register directly)
export const APPROVED_EMAILS = [
  'admin@site.com',
];

// Simulated Database - Pending Registration Requests
export let PENDING_REQUESTS = [];

// Simulated Database - Denied Requests
export let DENIED_REQUESTS = [];

// Helper functions to manage requests (exported for AdminApprovalScreen)
export const addPendingRequest = (request) => {
  PENDING_REQUESTS = [...PENDING_REQUESTS, request];
};

export const removePendingRequest = (email) => {
  PENDING_REQUESTS = PENDING_REQUESTS.filter(
    (req) => req.email.toLowerCase() !== email.toLowerCase()
  );
};

export const addToApproved = (email) => {
  if (!APPROVED_EMAILS.includes(email.toLowerCase())) {
    APPROVED_EMAILS.push(email.toLowerCase());
  }
};

export const addToDenied = (request) => {
  DENIED_REQUESTS = [...DENIED_REQUESTS, { ...request, deniedAt: new Date().toISOString() }];
};

export const getPendingRequests = () => PENDING_REQUESTS;
export const getApprovedEmails = () => APPROVED_EMAILS;

const RegisterScreen = ({ onRegisterSuccess, onBackToLogin }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Snackbar states
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('error'); // 'error', 'success', or 'pending'

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    jobTitle: '',
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      jobTitle: '',
    };
    let isValid = true;

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Check if email is already approved
  const isEmailApproved = (emailToCheck) => {
    const normalizedEmail = emailToCheck.toLowerCase().trim();
    return APPROVED_EMAILS.some(
      (approvedEmail) => approvedEmail.toLowerCase() === normalizedEmail
    );
  };

  // Check if request is already pending
  const isRequestPending = (emailToCheck) => {
    const normalizedEmail = emailToCheck.toLowerCase().trim();
    return PENDING_REQUESTS.some(
      (request) => request.email.toLowerCase() === normalizedEmail
    );
  };

  // Check if request was denied
  const isRequestDenied = (emailToCheck) => {
    const normalizedEmail = emailToCheck.toLowerCase().trim();
    return DENIED_REQUESTS.some(
      (request) => request.email.toLowerCase() === normalizedEmail
    );
  };

  // Show snackbar notification
  const showSnackbar = (message, type = 'error') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);

    const normalizedEmail = email.toLowerCase().trim();

    // Check if request is already pending
    if (isRequestPending(email)) {
      setLoading(false);
      Alert.alert(
        'Request Already Pending',
        'Your registration request is already under review. Please wait for admin approval.',
        [{ text: 'OK', style: 'default' }]
      );
      showSnackbar('Your request is already pending approval.', 'pending');
      return;
    }

    // Check if request was previously denied
    if (isRequestDenied(email)) {
      setLoading(false);
      Alert.alert(
        'Request Previously Denied',
        'Your registration request was previously denied. Please contact your Site Administrator for more information.',
        [{ text: 'OK', style: 'default' }]
      );
      showSnackbar('Your previous request was denied. Contact your administrator.', 'error');
      return;
    }

    try {
      // Register with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: password,
        options: {
          data: {
            full_name: fullName.trim(),
            job_title: jobTitle.trim(),
            is_approved: isEmailApproved(email),
          },
        },
      });

      if (error) {
        // Handle specific Supabase auth errors
        if (error.message.includes('User already registered')) {
          setErrors((prev) => ({ ...prev, email: 'This email is already registered' }));
          showSnackbar('This email is already registered. Try logging in.', 'error');
        } else if (error.message.includes('Password')) {
          setErrors((prev) => ({ ...prev, password: error.message }));
          showSnackbar(error.message, 'error');
        } else {
          Alert.alert('Registration Error', error.message, [{ text: 'OK' }]);
          showSnackbar(error.message, 'error');
        }
        setLoading(false);
        return;
      }

      // Check if email is already approved (can register directly)
      if (isEmailApproved(email)) {
        showSnackbar('Account created successfully! Please check your email to verify.', 'success');
        Alert.alert(
          'Account Created',
          'Your account has been created. Please check your email to verify your account, then you can log in.',
          [
            {
              text: 'OK',
              onPress: () => {
                if (onRegisterSuccess) {
                  onRegisterSuccess({
                    id: data.user?.id,
                    fullName,
                    email: normalizedEmail,
                    jobTitle
                  });
                }
              },
            },
          ]
        );
        setLoading(false);
        return;
      }

      // Submit new registration request for non-approved emails
      const newRequest = {
        id: data.user?.id || Date.now().toString(),
        fullName: fullName.trim(),
        email: normalizedEmail,
        jobTitle: jobTitle.trim(),
        requestedAt: new Date().toISOString(),
        status: 'pending',
      };

      addPendingRequest(newRequest);

      // Show success message for request submission
      Alert.alert(
        'Request Submitted',
        'Your account has been created and registration request submitted. Please check your email to verify your account. You will be able to log in once the Site Administrator approves your request.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Clear form
              setFullName('');
              setEmail('');
              setPassword('');
              setConfirmPassword('');
              setJobTitle('');
            },
          },
        ]
      );
      showSnackbar('Registration request submitted! Check email & await approval.', 'success');
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.', [
        { text: 'OK' },
      ]);
      showSnackbar('An unexpected error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    if (onBackToLogin) {
      onBackToLogin();
    }
  };

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const getSnackbarColor = () => {
    switch (snackbarType) {
      case 'success':
        return COLORS.success;
      case 'pending':
        return COLORS.warning;
      default:
        return COLORS.error;
    }
  };

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
              <Text style={styles.welcomeText}>Request Access</Text>
              <Text style={styles.subtitleText}>
                Submit your registration for admin approval
              </Text>
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
              <View style={styles.infoBox}>
                <Clock size={16} color={COLORS.accent} />
                <Text style={styles.infoText}>
                  Your request will be reviewed by the Site Administrator. You'll receive access once approved.
                </Text>
              </View>

              {/* Submit Request Button */}
              <TouchableOpacity
                style={[styles.signUpButton, loading && styles.signUpButtonDisabled]}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
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

            {/* Footer */}
            <View style={styles.footer}>
              <Shield size={16} color={COLORS.secondary} />
              <Text style={styles.footerText}>
                Your data is protected with encryption
              </Text>
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
