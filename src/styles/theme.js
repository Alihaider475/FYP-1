// SafeSite AI - Professional Design System
// Modern Enterprise Theme with Navy Blue accent

export const THEME = {
  // Primary Colors
  colors: {
    // Core
    primary: '#0f172a',      // Navy Blue - Main brand color
    primaryLight: '#1e293b', // Lighter navy
    primaryDark: '#020617',  // Darker navy

    // Accent
    accent: '#3b82f6',       // Blue - Primary actions
    accentLight: '#60a5fa',  // Light blue
    accentDark: '#2563eb',   // Dark blue

    // Semantic
    success: '#22c55e',      // Green
    successLight: '#4ade80',
    successBg: 'rgba(34, 197, 94, 0.1)',

    error: '#ef4444',        // Red
    errorLight: '#f87171',
    errorBg: 'rgba(239, 68, 68, 0.1)',

    warning: '#f59e0b',      // Amber
    warningLight: '#fbbf24',
    warningBg: 'rgba(245, 158, 11, 0.1)',

    info: '#06b6d4',         // Cyan
    infoLight: '#22d3ee',
    infoBg: 'rgba(6, 182, 212, 0.1)',

    // Neutrals
    background: '#f8fafc',   // Light gray background
    surface: '#ffffff',      // White cards
    surfaceAlt: '#f1f5f9',   // Alternative surface

    // Text
    textPrimary: '#0f172a',  // Dark text
    textSecondary: '#64748b', // Gray text
    textMuted: '#94a3b8',    // Muted text
    textInverse: '#ffffff',  // White text

    // Border
    border: '#e2e8f0',
    borderLight: '#f1f5f9',

    // Special
    purple: '#8b5cf6',
    pink: '#ec4899',
    orange: '#f97316',
    teal: '#14b8a6',
  },

  // Typography
  typography: {
    // Font sizes
    h1: 32,
    h2: 28,
    h3: 24,
    h4: 20,
    h5: 18,
    h6: 16,
    body: 14,
    caption: 12,
    small: 10,

    // Font weights
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  // Border Radius
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,
  },

  // Shadows
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 8,
    },
  },
};

// Gradient presets
export const GRADIENTS = {
  primary: ['#0f172a', '#1e293b'],
  accent: ['#3b82f6', '#2563eb'],
  success: ['#22c55e', '#16a34a'],
  error: ['#ef4444', '#dc2626'],
  warning: ['#f59e0b', '#d97706'],
  purple: ['#8b5cf6', '#7c3aed'],
  dark: ['#1e293b', '#0f172a'],
};

// Avatar colors for user initials
export const AVATAR_COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#d946ef', // Fuchsia
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#14b8a6', // Teal
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
];

// Get avatar color based on name
export const getAvatarColor = (name) => {
  if (!name) return AVATAR_COLORS[0];
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Common component styles
export const COMMON_STYLES = {
  // Cards
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    ...THEME.shadows.md,
  },

  // Buttons
  primaryButton: {
    backgroundColor: THEME.colors.accent,
    borderRadius: THEME.borderRadius.md,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },

  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },

  // Input
  input: {
    backgroundColor: THEME.colors.surfaceAlt,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: THEME.typography.body,
  },

  // Header
  header: {
    backgroundColor: THEME.colors.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: THEME.borderRadius.xxl,
    borderBottomRightRadius: THEME.borderRadius.xxl,
  },
};

export default THEME;
