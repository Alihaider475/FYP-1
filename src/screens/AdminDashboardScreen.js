import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
  Alert,
} from 'react-native';
import { Text, Surface } from 'react-native-paper';
import {
  Shield,
  ShieldCheck,
  Users,
  UserCheck,
  UserX,
  Clock,
  Settings,
  LogOut,
  Bell,
  Activity,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getPendingRequests, getApprovedEmails } from './RegisterScreen';
import { supabase } from '../auth/supabase';

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

const AdminDashboardScreen = ({
  navigation,
  userName,
  userEmail,
  onLogout
}) => {
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    loadStats();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadStats = () => {
    setPendingCount(getPendingRequests().length);
    setApprovedCount(getApprovedEmails().length);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadStats();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await supabase.auth.signOut();
              if (onLogout) onLogout();
            } catch (error) {
              console.error('Logout error:', error);
              if (onLogout) onLogout();
            }
          },
        },
      ]
    );
  };

  const getInitials = (name) => {
    if (!name) return 'AD';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const menuItems = [
    {
      id: 'approvals',
      title: 'User Approvals',
      subtitle: 'Manage registration requests',
      icon: UserCheck,
      color: '#22c55e',
      bgColor: 'rgba(34, 197, 94, 0.1)',
      badge: pendingCount > 0 ? pendingCount : null,
      onPress: () => navigation.navigate('AdminApproval'),
    },
    {
      id: 'users',
      title: 'All Users',
      subtitle: 'View registered users',
      icon: Users,
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      badge: approvedCount,
      onPress: () => navigation.navigate('AdminApproval'),
    },
    {
      id: 'settings',
      title: 'System Settings',
      subtitle: 'Configure app settings',
      icon: Settings,
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)',
      onPress: () => navigation.navigate('AdminSettings'),
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.gradient1} />

      {/* Header */}
      <LinearGradient
        colors={[COLORS.gradient1, COLORS.gradient2]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.adminBadge}>
            <ShieldCheck size={14} color={COLORS.surface} />
            <Text style={styles.adminBadgeText}>ADMIN PANEL</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={handleRefresh}>
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

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(251, 191, 36, 0.2)' }]}>
              <Clock size={20} color="#fbbf24" />
            </View>
            <Text style={styles.statNumber}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(34, 197, 94, 0.2)' }]}>
              <UserCheck size={20} color="#22c55e" />
            </View>
            <Text style={styles.statNumber}>{approvedCount}</Text>
            <Text style={styles.statLabel}>Approved</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
              <Activity size={20} color="#3b82f6" />
            </View>
            <Text style={styles.statNumber}>{pendingCount + approvedCount}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Alert Banner */}
          {pendingCount > 0 && (
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
                  {pendingCount} Pending Approval{pendingCount > 1 ? 's' : ''}
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

          {/* Menu Items */}
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
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
          ))}

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
          <View style={styles.footer}>
            <Shield size={16} color={COLORS.muted} />
            <Text style={styles.footerText}>SafeSite AI Admin Panel</Text>
          </View>
        </Animated.View>
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
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
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
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primary,
  },
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    gap: 8,
  },
  footerText: {
    color: COLORS.muted,
    fontSize: 13,
  },
};

export default AdminDashboardScreen;
