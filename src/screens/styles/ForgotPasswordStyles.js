import { StyleSheet, Dimensions, Platform } from 'react-native';
import { COLORS } from './colors';

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.42,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerPattern: {
    flex: 1,
    overflow: 'hidden',
  },
  patternCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  patternCircle1: {
    width: 200,
    height: 200,
    top: -60,
    right: -40,
  },
  patternCircle2: {
    width: 150,
    height: 150,
    top: 80,
    left: -50,
  },
  patternCircle3: {
    width: 100,
    height: 100,
    bottom: 40,
    right: 40,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 60 : 50,
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
    paddingTop: 24,
  },
  iconOuterContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
  headerTextContainer: {
    alignItems: 'center',
    marginBottom: 28,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.surface,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
    paddingHorizontal: 16,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputContainerFocused: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(59, 130, 246, 0.04)',
  },
  inputContainerError: {
    borderColor: COLORS.error,
    backgroundColor: 'rgba(239, 68, 68, 0.04)',
  },
  textInput: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 15,
    marginLeft: 8,
    height: 56,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    marginTop: 8,
    marginLeft: 4,
    fontWeight: '500',
  },
  primaryButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 20,
  },
  primaryButtonLoading: {
    opacity: 0.8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.surface,
    letterSpacing: 0.3,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    color: COLORS.muted,
    fontSize: 13,
    marginHorizontal: 16,
    fontWeight: '500',
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  helpContainer: {
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 40,
  },
  helpText: {
    fontSize: 14,
    color: COLORS.secondary,
  },
  helpLink: {
    color: COLORS.accent,
    fontWeight: '600',
  },
});

export { COLORS };
