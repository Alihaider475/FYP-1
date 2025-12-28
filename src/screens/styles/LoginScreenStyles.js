import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from './colors';

const { height, width } = Dimensions.get('window');

// LoginScreen Professional Theme
const LOGIN_COLORS = {
  ...COLORS,
  primary: '#0f172a',
  background: '#f8fafc',
  gradientStart: '#0f172a',
  gradientEnd: '#1e293b',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LOGIN_COLORS.background,
  },
  backgroundTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.38,
    backgroundColor: LOGIN_COLORS.primary,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  circleOne: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  circleTwo: {
    position: 'absolute',
    top: 120,
    left: -80,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
  },

  // Header Section
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.surface,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '400',
  },

  // Form Card
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 28,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 12,
  },

  // Input Styles
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: LOGIN_COLORS.primary,
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  inputWrapperFocused: {
    borderColor: COLORS.accent,
    backgroundColor: '#ffffff',
  },
  inputIcon: {
    paddingLeft: 16,
    paddingRight: 4,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 15,
    height: 54,
    color: LOGIN_COLORS.primary,
  },
  eyeIcon: {
    paddingRight: 16,
    paddingLeft: 8,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 8,
    marginLeft: 4,
    fontWeight: '500',
  },

  // Forgot Password
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    paddingVertical: 4,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: COLORS.accent,
    fontWeight: '600',
  },

  // Sign In Button
  signInButton: {
    backgroundColor: LOGIN_COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: LOGIN_COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  signInButtonDisabled: {
    opacity: 0.7,
    shadowOpacity: 0,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.surface,
    letterSpacing: 0.3,
  },
  signInButtonIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    fontSize: 13,
    color: COLORS.secondary,
    marginHorizontal: 16,
    fontWeight: '500',
  },

  // Create Account Button
  createAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(59, 130, 246, 0.04)',
  },
  createAccountText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.accent,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 36,
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: '500',
  },
});

export { COLORS, LOGIN_COLORS };
