import React, { useState, useRef, useEffect } from 'react';
import {View,KeyboardAvoidingView,Platform,ScrollView,TouchableOpacity,Animated,Alert,
} from 'react-native';
import { TextInput, Text, Snackbar } from 'react-native-paper';
import {Shield,Eye,EyeOff,Mail,Lock,User,ArrowRight,ArrowLeft,UserPlus,ShieldAlert,CheckCircle,Clock,
  Building} from 'lucide-react-native';
import { styles, COLORS } from './styles/RegisterScreenStyles';

// Simulated Database - Approved Users (can register directly)
export const APPROVED_EMAILS = [
  'admin@site.com',
];

// Simulated Database - Pending Registration Requests
export let PENDING_REQUESTS = [
  {
    id: '1',
    fullName: 'Ali Haider',
    email: 'ali.haider@company.com',
    jobTitle: 'Safety Manager',
    requestedAt: '2024-02-11T10:30:00Z',
    status: 'pending',
  },
  {
    id: '2',
    fullName: 'Tariq',
    email: 'tariq@company.com',
    jobTitle: 'Site Supervisor',
    requestedAt: '2024-02-11T11:15:00Z',
    status: 'pending',
  },
];

// Simulated Database - Registered Users (users who completed registration)
export let REGISTERED_USERS = [];

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
  const emailLower = email.toLowerCase();
  if (!APPROVED_EMAILS.includes(emailLower)) {
    APPROVED_EMAILS.push(emailLower);
  }
};

export const addRegisteredUser = (user) => {
  const userExists = REGISTERED_USERS.some(
    (u) => u.email.toLowerCase() === user.email.toLowerCase()
  );
  if (!userExists) {
    REGISTERED_USERS = [...REGISTERED_USERS, { ...user, registeredAt: new Date().toISOString() }];
  }
};

export const getPendingRequests = () => PENDING_REQUESTS;
export const getApprovedEmails = () => APPROVED_EMAILS;
export const getRegisteredUsers = () => REGISTERED_USERS;

const RegisterScreen = ({ onRegisterSuccess, onBackToLogin }) => {
  // Form input states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Loading state
  const [loading, setLoading] = useState(false);

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

  const handleRegister = () => {
    // First check if form is valid
    if (!validateForm()) return;

    // Show loading state
    setLoading(true);

    // Simulate submission delay (like API call)
    setTimeout(() => {
      const normalizedEmail = email.toLowerCase().trim();

      // Check if email is already approved by admin
      const isApproved = getApprovedEmails().includes(normalizedEmail);

      if (isApproved) {
        // Email is approved - registration successful!
        const successUser = {
          id: Date.now().toString(),
          fullName: fullName.trim(),
          email: normalizedEmail,
          jobTitle: jobTitle.trim(),
          password: password,
          status: 'registered',
        };

        addRegisteredUser(successUser);
        setLoading(false);

        // Show success - user can now login
        Alert.alert(
          'Registration Successful!',
          `Welcome ${fullName}! Your account has been created.\n\nYou can now login to SafeSite AI.`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Clear all form fields
                setFullName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setJobTitle('');
                
                // Go back to login screen
                if (onBackToLogin) {
                  onBackToLogin();
                }
              },
            },
          ]
        );

        // Show success notification
        showSnackbar('Account created successfully! You can now login.', 'success');
      } else {
        // Email not approved yet - add to pending requests
        const newRequest = {
          id: Date.now().toString(),
          fullName: fullName.trim(),
          email: normalizedEmail,
          jobTitle: jobTitle.trim(),
          requestedAt: '2024-02-11T12:00:00Z',
          status: 'pending',
        };

        addPendingRequest(newRequest);
        setLoading(false);

        // Show pending message
        Alert.alert(
          'Registration Submitted',
          `Hi ${fullName}, your registration request has been submitted.\n\nPlease wait for admin approval.`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Clear all form fields
                setFullName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setJobTitle('');
                
                // Go back to login screen
                if (onBackToLogin) {
                  onBackToLogin();
                }
              },
            },
          ]
        );

        // Show pending notification
        showSnackbar('Registration request submitted. Waiting for admin approval.', 'pending');
      }
    }, 500);
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
