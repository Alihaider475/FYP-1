import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from './colors';

const { height } = Dimensions.get('window');

// WhitelistManager uses the Modern Enterprise Navy Blue theme
const WHITELIST_COLORS = {
  ...COLORS,
  primary: '#0f172a',
  background: '#f8fafc',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITELIST_COLORS.background,
  },
  backgroundTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.28,
    backgroundColor: WHITELIST_COLORS.primary,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  circleOne: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  circleTwo: {
    position: 'absolute',
    top: 80,
    left: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },

  // Stats Card
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: WHITELIST_COLORS.primary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },

  // Add Email Card
  addEmailCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  addEmailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  addEmailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: WHITELIST_COLORS.primary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITELIST_COLORS.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  inputIcon: {
    paddingLeft: 16,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 14,
    height: 50,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    paddingLeft: 4,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
  },
  addButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.surface,
  },

  // Email List Card
  listCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  listHeader: {
    marginBottom: 12,
  },
  listTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: WHITELIST_COLORS.primary,
    flex: 1,
  },
  countBadge: {
    backgroundColor: COLORS.accent,
    fontSize: 12,
  },

  // Search
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITELIST_COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  searchIcon: {
    paddingLeft: 14,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 14,
    height: 44,
  },
  divider: {
    marginBottom: 12,
  },

  // Email Items
  emailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  emailInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emailTextContainer: {
    flex: 1,
  },
  emailText: {
    fontSize: 14,
    fontWeight: '500',
    color: WHITELIST_COLORS.primary,
    marginBottom: 2,
  },
  emailStatus: {
    fontSize: 12,
    color: COLORS.success,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailDivider: {
    marginLeft: 52,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 12,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.secondary,
  },
});

export { COLORS };
