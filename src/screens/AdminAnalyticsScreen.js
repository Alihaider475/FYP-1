import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { Text } from 'react-native-paper';
import {
  ArrowLeft,
  BarChart3,
  DollarSign,
  AlertTriangle,
  Users,
  UserX,
  TrendingUp,
  Shield,
  Award,
  RefreshCw,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import useAdminAnalytics from '../hooks/useAdminAnalytics';

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
  purple: '#8b5cf6',
  gradient1: '#1e293b',
  gradient2: '#334155',
};

const formatCurrency = (amount) => {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
  return String(amount);
};

const VIOLATION_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#22c55e', '#ec4899'];

const AdminAnalyticsScreen = ({ navigation, onBack }) => {
  const { analytics, isLoading, fetchAnalytics } = useAdminAnalytics();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={{ color: COLORS.muted, marginTop: 12, fontSize: 14 }}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.gradient1} />

      {/* Header */}
      <LinearGradient colors={[COLORS.gradient1, COLORS.gradient2]} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack || (() => navigation.goBack())}>
            <ArrowLeft size={22} color={COLORS.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>System Analytics</Text>
          <TouchableOpacity style={styles.backBtn} onPress={fetchAnalytics}>
            <RefreshCw size={20} color={COLORS.surface} />
          </TouchableOpacity>
        </View>

        {/* Hero Stat */}
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <DollarSign size={28} color={COLORS.warning} />
          </View>
          <View>
            <Text style={styles.heroLabel}>Total Fines Collected</Text>
            <Text style={styles.heroValue}>PKR {analytics.totalFines.toLocaleString()}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchAnalytics} colors={[COLORS.accent]} />
        }
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
              <AlertTriangle size={22} color={COLORS.error} />
            </View>
            <Text style={styles.statNumber}>{analytics.totalViolations}</Text>
            <Text style={styles.statLabel}>Total Violations</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
              <UserX size={22} color={COLORS.error} />
            </View>
            <Text style={styles.statNumber}>{analytics.suspendedUsers}</Text>
            <Text style={styles.statLabel}>Suspended Users</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
              <Users size={22} color={COLORS.accent} />
            </View>
            <Text style={styles.statNumber}>{analytics.totalManagers}</Text>
            <Text style={styles.statLabel}>Managers</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}>
              <Shield size={22} color={COLORS.success} />
            </View>
            <Text style={styles.statNumber}>{analytics.totalWorkers}</Text>
            <Text style={styles.statLabel}>Workers</Text>
          </View>
        </View>

        {/* Top Violation Card */}
        <View style={styles.topViolationCard}>
          <View style={styles.topViolationHeader}>
            <View style={[styles.topIcon, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
              <Award size={24} color={COLORS.warning} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.topLabel}>Most Common Violation</Text>
              <Text style={styles.topType}>{analytics.topViolationType}</Text>
            </View>
            <View style={styles.topCountBadge}>
              <Text style={styles.topCountText}>{analytics.topViolationCount}x</Text>
            </View>
          </View>
        </View>

        {/* Violation Breakdown */}
        <View style={styles.breakdownCard}>
          <View style={styles.breakdownHeader}>
            <BarChart3 size={20} color={COLORS.primary} />
            <Text style={styles.breakdownTitle}>Violation Breakdown</Text>
          </View>

          {analytics.violationBreakdown.length === 0 ? (
            <View style={styles.emptyBreakdown}>
              <TrendingUp size={32} color={COLORS.muted} />
              <Text style={styles.emptyText}>No violations recorded yet</Text>
            </View>
          ) : (
            analytics.violationBreakdown.map((item, index) => {
              const maxCount = analytics.violationBreakdown[0]?.count || 1;
              const percentage = Math.round((item.count / maxCount) * 100);
              const barColor = VIOLATION_COLORS[index % VIOLATION_COLORS.length];

              return (
                <View key={item.type} style={styles.breakdownRow}>
                  <View style={styles.breakdownInfo}>
                    <View style={[styles.breakdownDot, { backgroundColor: barColor }]} />
                    <Text style={styles.breakdownType} numberOfLines={1}>{item.type}</Text>
                    <Text style={styles.breakdownCount}>{item.count}</Text>
                  </View>
                  <View style={styles.barContainer}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${percentage}%`, backgroundColor: barColor },
                      ]}
                    />
                  </View>
                </View>
              );
            })
          )}
        </View>
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
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.surface,
    fontSize: 18,
    fontWeight: '700',
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 18,
    gap: 14,
  },
  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
  },
  heroValue: {
    color: COLORS.surface,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    width: '47%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 4,
  },
  topViolationCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  topViolationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  topIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topLabel: {
    fontSize: 12,
    color: COLORS.secondary,
  },
  topType: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 2,
  },
  topCountBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  topCountText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.warning,
  },
  breakdownCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 18,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  emptyBreakdown: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.muted,
  },
  breakdownRow: {
    marginBottom: 14,
  },
  breakdownInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  breakdownDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  breakdownType: {
    flex: 1,
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  breakdownCount: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  barContainer: {
    height: 8,
    backgroundColor: COLORS.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
};

export default AdminAnalyticsScreen;
