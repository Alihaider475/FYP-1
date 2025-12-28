import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  TextInput as RNTextInput,
  StatusBar,
} from 'react-native';
import { Text } from 'react-native-paper';
import {
  ArrowLeft,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles, COLORS } from './styles/VerifyCodeStyles';

const VerifyCodeScreen = ({ email, expectedCode, onNavigateToReset, onBackToForgotPassword }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

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

    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 600);
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const shakeInputs = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleCodeChange = (text, index) => {
    const numericText = text.replace(/[^0-9]/g, '');

    if (numericText.length <= 1) {
      const newCode = [...code];
      newCode[index] = numericText;
      setCode(newCode);
      setError('');

      if (numericText.length === 1 && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      if (numericText.length === 1 && index === 5) {
        const fullCode = newCode.join('');
        if (fullCode.length === 6) {
          verifyCode(fullCode);
        }
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyCode = async (fullCode) => {
    setLoading(true);
    setError('');

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);

    if (fullCode === expectedCode) {
      if (onNavigateToReset) {
        onNavigateToReset({ email });
      }
    } else {
      setError('Invalid code. Please check and try again.');
      shakeInputs();
      setCode(['', '', '', '', '', '']);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 300);
    }
  };

  const handleVerify = () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    verifyCode(fullCode);
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendTimer(60);
    setCode(['', '', '', '', '', '']);
    setError('');

    await new Promise((resolve) => setTimeout(resolve, 1000));

    Alert.alert(
      'Code Resent',
      `A new verification code has been sent to ${email}\n\n(Demo code: ${expectedCode})`,
      [{ text: 'OK' }]
    );

    inputRefs.current[0]?.focus();
  };

  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
    : 'your email';

  const isCodeComplete = code.every((digit) => digit !== '');

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
            onPress={onBackToForgotPassword}
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
                <ShieldCheck size={32} color={COLORS.accent} strokeWidth={2} />
              </View>
            </View>

            {/* Header Text */}
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Verify Your Email</Text>
              <Text style={styles.subtitle}>
                We've sent a 6-digit verification code to{'\n'}
                <Text style={styles.emailHighlight}>{maskedEmail}</Text>
              </Text>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              {/* Code Input Label */}
              <Text style={styles.inputLabel}>Enter Verification Code</Text>

              {/* Code Input Boxes */}
              <Animated.View
                style={[
                  styles.codeContainer,
                  { transform: [{ translateX: shakeAnim }] },
                ]}
              >
                {code.map((digit, index) => (
                  <View
                    key={index}
                    style={[
                      styles.codeInputWrapper,
                      digit && styles.codeInputWrapperFilled,
                      error && styles.codeInputWrapperError,
                    ]}
                  >
                    <RNTextInput
                      ref={(ref) => (inputRefs.current[index] = ref)}
                      style={styles.codeInput}
                      value={digit}
                      onChangeText={(text) => handleCodeChange(text, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      selectTextOnFocus
                      selectionColor={COLORS.accent}
                    />
                  </View>
                ))}
              </Animated.View>

              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* Verify Button */}
              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.primaryButtonLoading]}
                onPress={handleVerify}
                disabled={loading || !isCodeComplete}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    loading || !isCodeComplete
                      ? ['#94a3b8', '#94a3b8']
                      : ['#10b981', '#059669']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.primaryButtonText}>
                    {loading ? 'Verifying...' : 'Verify & Continue'}
                  </Text>
                  {!loading && (
                    <CheckCircle2 size={20} color={COLORS.surface} strokeWidth={2.5} />
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Resend Section */}
              <View style={styles.resendSection}>
                <Text style={styles.resendLabel}>Didn't receive the code?</Text>
                <TouchableOpacity
                  onPress={handleResendCode}
                  disabled={!canResend}
                  activeOpacity={0.7}
                  style={styles.resendButton}
                >
                  <RefreshCw
                    size={16}
                    color={canResend ? COLORS.accent : COLORS.muted}
                    strokeWidth={2.5}
                  />
                  <Text
                    style={[
                      styles.resendText,
                      !canResend && styles.resendTextDisabled,
                    ]}
                  >
                    {canResend ? 'Resend Code' : `Resend in ${resendTimer}s`}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
              </View>

              {/* Change Email Link */}
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={onBackToForgotPassword}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryButtonText}>Change Email Address</Text>
              </TouchableOpacity>
            </View>

            {/* Security Note */}
            <View style={styles.securityNote}>
              <ShieldCheck size={16} color={COLORS.muted} strokeWidth={2} />
              <Text style={styles.securityText}>
                For your security, the code expires in 10 minutes
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default VerifyCodeScreen;
