import React from 'react';
import {View,ScrollView,TouchableOpacity,StatusBar,Dimensions,} from 'react-native';
import {Card,Text,Surface,Avatar,Button,} from 'react-native-paper';
import {Camera,FileText,Settings,User,LogOut,Shield,AlertTriangle,TrendingUp,Bell,ChevronRight,Scan,
  Activity,CheckCircle,} from 'lucide-react-native';
import styles from './styles/DashboardScreenStyles';
const { width } = Dimensions.get('window');

// Define all colors used in the dashboard
const COLORS = {
  primary: '#0f172a',        // Dark blue header
  secondary: '#64748b',      // Gray text
  background: '#f8fafc',     // Light gray background
  surface: '#ffffff',        // White cards
  success: '#10b981',        // Green success
  error: '#ef4444',          // Red error/violation
  warning: '#f59e0b',        // Orange warning
  info: '#3b82f6',           // Blue info
};

const DashboardScreen = ({ navigation, onLogout, userName = 'Site Manager' }) => {
  // Navigate to another screen
  const handleNavigate = (screen) => {
    if (navigation && navigation.navigate) {
      navigation.navigate(screen);
    }
  };

  // Handle logout when user clicks sign out
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  // Convert name to initials (e.g., "Ali Haider" -> "AH")
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get time-based greeting message
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Menu items with navigation targets and styling
  const menuItems = [
    {
      id: 'detection',
      title: 'Start AI Detection',
      subtitle: 'Scan workplace for violations',
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

  // Statistics data shown on dashboard (violations and compliance rate)
  const statsData = [
    {
      id: 'violations',
      label: "Today's Violations",
      value: '4',
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

      {/* ====== HEADER SECTION ====== */}
      {/* Shows greeting, username, avatar, and system status */}
      <View style={styles.header}>
        {/* User greeting and name */}
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          {/* User avatar with online indicator */}
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

        {/* System status banner */}
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

      {/* ====== SCROLLABLE CONTENT SECTION ====== */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ====== STATISTICS CARDS ====== */}
        {/* Shows today's violations and compliance rate */}
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

        {/* Large button to start AI detection */}
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

        {/* ====== QUICK ACTIONS SECTION ====== */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <Text style={styles.sectionSubtitle}>Manage your site</Text>
        </View>

        {/* ====== MENU GRID ====== */}
        {/* Grid of navigation cards */}
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

        {/* ====== RECENT ACTIVITY SECTION ====== */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>

        {/* Activity list showing recent violations and events */}
        <Surface style={styles.activityCard} elevation={2}>
          {/* Activity 1: Helmet violation */}
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

          {/* Activity 2: Vest violation */}
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

          {/* Activity 3: Detection completed */}
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

        {/* ====== LOGOUT BUTTON ====== */}
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

export default DashboardScreen;
