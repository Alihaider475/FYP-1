import React, { useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Text } from 'react-native-paper';
import {
  ShieldCheck,
  Users,
  UserCheck,
  Clock,
  LogOut,
  Activity,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
  Mail,
  Building2,
  Settings,
  BarChart3,
  ShieldOff,
  Zap,
  DollarSign,
  HardHat,
  MapPin,
  UserPlus,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import useAdminDashboard from '../hooks/useAdminDashboard';

const COLORS = {
  primary: '#0f172a',
  secondary: '#64748b',
  accent: '#3b82f6',
  surface: '#ffffff',
  background: '#f1f5f9',
  error: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
  muted: '#94a3b8',
  card: '#ffffff',
  gradient1: '#1e293b',
  gradient2: '#334155',
};

// ─── Animated Counter ───
const AnimatedCounter = ({ value, style, prefix = '', suffix = '' }) => {
  const animValue = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = React.useState(0);

  useEffect(() => {
    animValue.setValue(0);
    const listener = animValue.addListener(({ value: v }) => setDisplay(Math.round(v)));
    Animated.timing(animValue, {
      toValue: value,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    return () => animValue.removeListener(listener);
  }, [value]);

  return (
    <Text style={style}>
      {prefix}{display.toLocaleString()}{suffix}
    </Text>
  );
};

// ─── Helpers ───
const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' });
};

const getInitials = (name) => {
  if (!name) return 'AD';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

const ACTIVITY_CONFIG = {
  violation: { icon: AlertTriangle, color: COLORS.error, bg: 'rgba(239, 68, 68, 0.1)' },
  user_approved: { icon: UserCheck, color: COLORS.success, bg: 'rgba(34, 197, 94, 0.1)' },
  user_pending: { icon: UserPlus, color: COLORS.warning, bg: 'rgba(245, 158, 11, 0.1)' },
};

// ─── Main Screen ───
const AdminDashboardScreen = ({ navigation, userName, userEmail, onLogout }) => {
  const { stats, recentActivity, isLoading, fetchDashboard } = useAdminDashboard();

  // Staggered menu animations
  const menuAnims = useRef(
    Array.from({ length: 7 }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(30),
    }))
  ).current;

  const headerAnim = useRef(new Animated.Value(0)).current;
  const snapshotAnim = useRef(new Animated.Value(0)).current;
  const feedAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isLoading) {
      // Header fade in
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();

      // Snapshot row
      Animated.timing(snapshotAnim, {
        toValue: 1,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }).start();

      // Staggered menu items
      const menuAnimations = menuAnims.map((anim, i) =>
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 400,
            delay: 300 + i * 100,
            useNativeDriver: true,
          }),
          Animated.timing(anim.translateY, {
            toValue: 0,
            duration: 400,
            delay: 300 + i * 100,
            useNativeDriver: true,
          }),
        ])
      );
      Animated.parallel(menuAnimations).start();

      // Activity feed
      Animated.timing(feedAnim, {
        toValue: 1,
        duration: 500,
        delay: 300 + 7 * 100,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading]);

  const handleLogout = () => {
    if (onLogout) onLogout();
  };

  const menuItems = [
    {
      id: 'approvals',
      title: 'User Approvals',
      subtitle: 'Manage registration requests',
      icon: UserCheck,
      color: '#22c55e',
      bgColor: 'rgba(34, 197, 94, 0.1)',
      badge: stats.pendingCount > 0 ? stats.pendingCount : null,
      onPress: () => navigation.navigate('AdminApproval'),
    },
    {
      id: 'users',
      title: 'All Users',
      subtitle: 'View registered users',
      icon: Users,
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      badge: stats.totalUsers > 0 ? stats.totalUsers : null,
      onPress: () => navigation.navigate('AdminApproval'),
    },
    {
      id: 'companies',
      title: 'Company & Sites',
      subtitle: 'Generate codes & manage sites',
      icon: Building2,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      badge: stats.activeSites > 0 ? stats.activeSites : null,
      onPress: () => navigation.navigate('CompanyManager'),
    },
    {
      id: 'settings',
      title: 'Global Settings',
      subtitle: 'Configure warnings & penalties',
      icon: Settings,
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)',
      onPress: () => navigation.navigate('GlobalSettings'),
    },
    {
      id: 'analytics',
      title: 'System Analytics',
      subtitle: 'Fines, violations & stats',
      icon: BarChart3,
      color: '#06b6d4',
      bgColor: 'rgba(6, 182, 212, 0.1)',
      onPress: () => navigation.navigate('AdminAnalytics'),
    },
    {
      id: 'killswitch',
      title: 'Manager Control',
      subtitle: 'Suspend or reactivate managers',
      icon: ShieldOff,
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      onPress: () => navigation.navigate('ManagerControl'),
    },
    {
      id: 'whitelist',
      title: 'Whitelist Manager',
      subtitle: 'Manage whitelisted emails',
      icon: Mail,
      color: '#ec4899',
      bgColor: 'rgba(236, 72, 153, 0.1)',
      onPress: () => navigation.navigate('WhitelistManager'),
    },
  ];

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={{ color: COLORS.muted, marginTop: 12, fontSize: 14 }}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.gradient1} />

      {/* Header */}
      <LinearGradient colors={[COLORS.gradient1, COLORS.gradient2]} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.adminBadge}>
            <ShieldCheck size={14} color={COLORS.surface} />
            <Text style={styles.adminBadgeText}>ADMIN PANEL</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={fetchDashboard}>
              <RefreshCw size={20} color={COLORS.surface} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
              <LogOut size={20} color={COLORS.surface} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(userName)}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.nameText}>{userName || 'Administrator'}</Text>
            <Text style={styles.emailText}>{userEmail}</Text>
          </View>
        </View>

        {/* Live Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(251, 191, 36, 0.2)' }]}>
              <Clock size={20} color="#fbbf24" />
            </View>
            <AnimatedCounter value={stats.pendingCount} style={styles.statNumber} />
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(34, 197, 94, 0.2)' }]}>
              <UserCheck size={20} color="#22c55e" />
            </View>
            <AnimatedCounter value={stats.approvedCount} style={styles.statNumber} />
            <Text style={styles.statLabel}>Approved</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
              <Activity size={20} color="#3b82f6" />
            </View>
            <AnimatedCounter value={stats.totalUsers} style={styles.statNumber} />
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchDashboard} colors={[COLORS.accent]} />
        }
      >
        {/* Today's Snapshot */}
        <Animated.View style={{ opacity: snapshotAnim }}>
          <View style={styles.snapshotContainer}>
            <View style={styles.snapshotHeader}>
              <Zap size={16} color={COLORS.accent} />
              <Text style={styles.snapshotTitle}>Today's Snapshot</Text>
            </View>
            <View style={styles.snapshotRow}>
              <View style={styles.snapshotItem}>
                <View style={[styles.snapshotIcon, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                  <AlertTriangle size={16} color={COLORS.error} />
                </View>
                <AnimatedCounter value={stats.todayViolations} style={styles.snapshotValue} />
                <Text style={styles.snapshotLabel}>Violations</Text>
              </View>
              <View style={styles.snapshotDivider} />
              <View style={styles.snapshotItem}>
                <View style={[styles.snapshotIcon, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                  <DollarSign size={16} color={COLORS.warning} />
                </View>
                <AnimatedCounter value={stats.todayFines} style={styles.snapshotValue} prefix="PKR " />
                <Text style={styles.snapshotLabel}>Fines</Text>
              </View>
              <View style={styles.snapshotDivider} />
              <View style={styles.snapshotItem}>
                <View style={[styles.snapshotIcon, { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}>
                  <HardHat size={16} color={COLORS.success} />
                </View>
                <AnimatedCounter value={stats.activeWorkers} style={styles.snapshotValue} />
                <Text style={styles.snapshotLabel}>Workers</Text>
              </View>
              <View style={styles.snapshotDivider} />
              <View style={styles.snapshotItem}>
                <View style={[styles.snapshotIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                  <MapPin size={16} color={COLORS.accent} />
                </View>
                <AnimatedCounter value={stats.activeSites} style={styles.snapshotValue} />
                <Text style={styles.snapshotLabel}>Sites</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Alert Banner */}
        {stats.pendingCount > 0 && (
          <TouchableOpacity
            style={styles.alertBanner}
            onPress={() => navigation.navigate('AdminApproval')}
            activeOpacity={0.8}
          >
            <View style={styles.alertIcon}>
              <AlertTriangle size={20} color="#f59e0b" />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>
                {stats.pendingCount} Pending Approval{stats.pendingCount > 1 ? 's' : ''}
              </Text>
              <Text style={styles.alertSubtitle}>Tap to review requests</Text>
            </View>
            <ChevronRight size={20} color={COLORS.warning} />
          </TouchableOpacity>
        )}

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Admin Controls</Text>
        </View>

        {/* Menu Items — Staggered Animation */}
        {menuItems.map((item, index) => (
          <Animated.View
            key={item.id}
            style={{
              opacity: menuAnims[index].opacity,
              transform: [{ translateY: menuAnims[index].translateY }],
            }}
          >
            <TouchableOpacity
              style={styles.menuCard}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.bgColor }]}>
                <item.icon size={22} color={item.color} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              {item.badge !== null && item.badge !== undefined && (
                <View style={styles.menuBadge}>
                  <Text style={styles.menuBadgeText}>{item.badge}</Text>
                </View>
              )}
              <ChevronRight size={20} color={COLORS.muted} />
            </TouchableOpacity>
          </Animated.View>
        ))}

        {/* Live Activity Feed */}
        <Animated.View style={{ opacity: feedAnim }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>

          <View style={styles.activityCard}>
            {recentActivity.length === 0 ? (
              <View style={styles.emptyActivity}>
                <Activity size={28} color={COLORS.muted} />
                <Text style={styles.emptyText}>No recent activity</Text>
              </View>
            ) : (
              recentActivity.map((item, index) => {
                const config = ACTIVITY_CONFIG[item.type] || ACTIVITY_CONFIG.violation;
                const IconComponent = config.icon;
                return (
                  <View
                    key={item.id}
                    style={[
                      styles.activityRow,
                      index < recentActivity.length - 1 && styles.activityRowBorder,
                    ]}
                  >
                    <View style={[styles.activityIcon, { backgroundColor: config.bg }]}>
                      <IconComponent size={16} color={config.color} />
                    </View>
                    <View style={styles.activityInfo}>
                      <Text style={styles.activityTitle} numberOfLines={1}>{item.title}</Text>
                      <Text style={styles.activitySubtitle}>{item.subtitle}</Text>
                    </View>
                    <View style={styles.activityRight}>
                      <Text style={[styles.activityDetail, {
                        color: item.type === 'violation' ? COLORS.error :
                               item.type === 'user_approved' ? COLORS.success : COLORS.warning
                      }]}>
                        {item.detail}
                      </Text>
                      <Text style={styles.activityTime}>{formatTimeAgo(item.time)}</Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </Animated.View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <LogOut size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  adminBadgeText: {
    color: COLORS.surface,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: COLORS.surface,
    fontSize: 20,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
  },
  nameText: {
    color: COLORS.surface,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 2,
  },
  emailText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    color: COLORS.surface,
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },

  // Today's Snapshot
  snapshotContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  snapshotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  snapshotTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  snapshotRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  snapshotItem: {
    flex: 1,
    alignItems: 'center',
  },
  snapshotIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  snapshotValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
  },
  snapshotLabel: {
    fontSize: 10,
    color: COLORS.muted,
    fontWeight: '600',
    marginTop: 2,
  },
  snapshotDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e2e8f0',
  },

  // Alert Banner
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  alertIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  alertSubtitle: {
    color: COLORS.secondary,
    fontSize: 13,
    marginTop: 2,
  },

  // Section Header
  sectionHeader: {
    marginBottom: 16,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
  },

  // Menu Items
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  menuSubtitle: {
    fontSize: 13,
    color: COLORS.secondary,
    marginTop: 2,
  },
  menuBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  menuBadgeText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: '700',
  },

  // Activity Feed
  activityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  activityRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  activitySubtitle: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 1,
  },
  activityRight: {
    alignItems: 'flex-end',
  },
  activityDetail: {
    fontSize: 12,
    fontWeight: '700',
  },
  activityTime: {
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 2,
  },
  emptyActivity: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.muted,
  },

  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 14,
    padding: 16,
    marginTop: 24,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.15)',
  },
  logoutText: {
    color: COLORS.error,
    fontSize: 15,
    fontWeight: '600',
  },
};

export default AdminDashboardScreen;
