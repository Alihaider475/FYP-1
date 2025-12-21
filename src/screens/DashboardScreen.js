import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import {
  Card,
  Text,
  Surface,
  Avatar,
  Button,
} from 'react-native-paper';
import {
  Camera,
  FileText,
  Settings,
  User,
  LogOut,
  Shield,
  AlertTriangle,
  TrendingUp,
  Bell,
  ChevronRight,
  Scan,
  Activity,
  CheckCircle,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#0f172a',
  secondary: '#64748b',
  background: '#f8fafc',
  surface: '#ffffff',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

const DashboardScreen = ({ navigation, onLogout, userName = 'Site Manager' }) => {
  const handleNavigate = (screen) => {
    if (navigation && navigation.navigate) {
      navigation.navigate(screen);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const menuItems = [
    {
      id: 'detection',
      title: 'Start Detection',
      subtitle: 'Scan for violations',
      icon: Scan,
      onPress: () => handleNavigate('Detection'),
      gradient: ['#3b82f6', '#1d4ed8'],
      iconBg: '#3b82f6',
    },
    {
      id: 'history',
      title: 'Violation Logs',
      subtitle: 'View all records',
      icon: FileText,
      onPress: () => handleNavigate('History'),
      gradient: ['#8b5cf6', '#6d28d9'],
      iconBg: '#8b5cf6',
    },
    {
      id: 'settings',
      title: 'Site Settings',
      subtitle: 'Configure AI',
      icon: Settings,
      onPress: () => handleNavigate('Settings'),
      gradient: ['#64748b', '#475569'],
      iconBg: '#64748b',
    },
    {
      id: 'profile',
      title: 'My Profile',
      subtitle: 'Account details',
      icon: User,
      onPress: () => handleNavigate('Profile'),
      gradient: ['#0f172a', '#1e293b'],
      iconBg: '#0f172a',
    },
  ];

  const statsData = [
    {
      id: 'violations',
      label: "Today's Violations",
      value: '3',
      icon: AlertTriangle,
      color: COLORS.error,
      bgColor: `${COLORS.error}15`,
    },
    {
      id: 'compliance',
      label: 'Compliance Rate',
      value: '94%',
      icon: TrendingUp,
      color: COLORS.success,
      bgColor: `${COLORS.success}15`,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <TouchableOpacity style={styles.avatarContainer}>
            <Avatar.Text
              size={50}
              label={getInitials(userName)}
              style={styles.avatar}
              labelStyle={styles.avatarLabel}
            />
            <View style={styles.onlineDot} />
          </TouchableOpacity>
        </View>

        {/* Status Banner */}
        <Surface style={styles.statusBanner} elevation={0}>
          <View style={styles.statusLeft}>
            <View style={styles.statusIconContainer}>
              <Shield size={20} color={COLORS.success} />
            </View>
            <View>
              <Text style={styles.statusTitle}>System Status</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Online & Monitoring</Text>
              </View>
            </View>
          </View>
          <View style={styles.statusRight}>
            <Activity size={18} color={COLORS.success} />
          </View>
        </Surface>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Row */}
        <View style={styles.statsRow}>
          {statsData.map((stat) => (
            <Surface key={stat.id} style={styles.statCard} elevation={2}>
              <View style={[styles.statIconBg, { backgroundColor: stat.bgColor }]}>
                <stat.icon size={20} color={stat.color} />
              </View>
              <Text style={[styles.statValue, { color: stat.color }]}>
                {stat.value}
              </Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Surface>
          ))}
        </View>

        {/* Quick Action - Start Detection */}
        <TouchableOpacity
          style={styles.primaryAction}
          onPress={() => handleNavigate('Detection')}
          activeOpacity={0.9}
        >
          <View style={styles.primaryActionContent}>
            <View style={styles.primaryActionLeft}>
              <View style={styles.primaryActionIcon}>
                <Camera size={28} color={COLORS.surface} />
              </View>
              <View>
                <Text style={styles.primaryActionTitle}>Start AI Detection</Text>
                <Text style={styles.primaryActionSubtitle}>
                  Scan workplace for safety violations
                </Text>
              </View>
            </View>
            <View style={styles.primaryActionArrow}>
              <ChevronRight size={24} color={COLORS.surface} />
            </View>
          </View>
          <View style={styles.primaryActionGlow} />
        </TouchableOpacity>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <Text style={styles.sectionSubtitle}>Manage your site</Text>
        </View>

        {/* Menu Grid */}
        <View style={styles.menuGrid}>
          {menuItems.slice(1).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuCard}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <Surface style={styles.menuCardSurface} elevation={2}>
                <View
                  style={[styles.menuIconContainer, { backgroundColor: `${item.iconBg}15` }]}
                >
                  <item.icon size={22} color={item.iconBg} strokeWidth={2} />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                <View style={styles.menuArrow}>
                  <ChevronRight size={16} color={COLORS.secondary} />
                </View>
              </Surface>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>

        <Surface style={styles.activityCard} elevation={2}>
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: `${COLORS.error}15` }]}>
              <AlertTriangle size={16} color={COLORS.error} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>No Helmet Detected</Text>
              <Text style={styles.activityTime}>Zone A • 10:42 AM</Text>
            </View>
            <View style={styles.activityBadge}>
              <Text style={styles.activityBadgeText}>New</Text>
            </View>
          </View>

          <View style={styles.activityDivider} />

          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: `${COLORS.warning}15` }]}>
              <AlertTriangle size={16} color={COLORS.warning} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>No Vest Detected</Text>
              <Text style={styles.activityTime}>Zone B • 09:15 AM</Text>
            </View>
          </View>

          <View style={styles.activityDivider} />

          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: `${COLORS.success}15` }]}>
              <CheckCircle size={16} color={COLORS.success} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Detection Completed</Text>
              <Text style={styles.activityTime}>Zone C • 08:30 AM</Text>
            </View>
          </View>
        </Surface>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <LogOut size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footerText}>SafeSite AI v1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  avatarLabel: {
    color: COLORS.surface,
    fontWeight: 'bold',
    fontSize: 18,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 14,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  statusText: {
    fontSize: 14,
    color: COLORS.surface,
    fontWeight: '600',
  },
  statusRight: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.secondary,
    marginTop: 4,
    textAlign: 'center',
  },
  primaryAction: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  primaryActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  primaryActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  primaryActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryActionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginBottom: 4,
  },
  primaryActionSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  primaryActionArrow: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryActionGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 2,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  menuCard: {
    width: (width - 52) / 2,
  },
  menuCardSurface: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    position: 'relative',
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 12,
    color: COLORS.secondary,
  },
  menuArrow: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  activityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.secondary,
  },
  activityBadge: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activityBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.surface,
  },
  activityDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginHorizontal: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.error,
    borderRadius: 14,
    padding: 16,
    gap: 10,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.error,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.secondary,
    textAlign: 'center',
  },
});

export default DashboardScreen;
