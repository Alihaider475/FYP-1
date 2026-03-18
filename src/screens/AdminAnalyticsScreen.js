import React, { useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
  Animated,
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
  TrendingDown,
  Shield,
  Award,
  RefreshCw,
  Clock,
  MapPin,
  Minus,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, G } from 'react-native-svg';
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

const VIOLATION_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#22c55e', '#ec4899'];

const DATE_RANGES = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'all', label: 'All Time' },
];

const TREND_LABELS = {
  today: 'vs yesterday',
  week: 'vs last week',
  month: 'vs last month',
  all: '',
};

// ─── Animated Counter Component ───
const AnimatedCounter = ({ value, style, prefix = '', suffix = '' }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = React.useState(0);

  useEffect(() => {
    animatedValue.setValue(0);
    const listener = animatedValue.addListener(({ value: v }) => {
      setDisplayValue(Math.round(v));
    });

    Animated.timing(animatedValue, {
      toValue: value,
      duration: 1200,
      useNativeDriver: false,
    }).start();

    return () => animatedValue.removeListener(listener);
  }, [value]);

  return (
    <Text style={style}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </Text>
  );
};

// ─── Trend Badge Component ───
const TrendBadge = ({ value, label }) => {
  if (value === 0 && label === '') return null;

  const isPositive = value > 0;
  const isNeutral = value === 0;
  const color = isNeutral ? COLORS.muted : isPositive ? COLORS.error : COLORS.success;
  const bgColor = isNeutral
    ? 'rgba(148, 163, 184, 0.1)'
    : isPositive
    ? 'rgba(239, 68, 68, 0.08)'
    : 'rgba(34, 197, 94, 0.08)';

  return (
    <View style={[trendStyles.badge, { backgroundColor: bgColor }]}>
      {isNeutral ? (
        <Minus size={10} color={color} />
      ) : isPositive ? (
        <TrendingUp size={10} color={color} />
      ) : (
        <TrendingDown size={10} color={color} />
      )}
      <Text style={[trendStyles.text, { color }]}>
        {isNeutral ? '0%' : `${isPositive ? '+' : ''}${value}%`}
      </Text>
    </View>
  );
};

const trendStyles = {
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
  },
};

// ─── Donut Chart Component ───
const DonutChart = ({ data, size = 160 }) => {
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const total = data.reduce((sum, item) => sum + item.count, 0);

  if (total === 0) return null;

  let cumulativePercent = 0;

  return (
    <View style={{ alignItems: 'center', marginVertical: 12 }}>
      <View style={{ position: 'relative' }}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${center}, ${center}`}>
            {data.map((item, index) => {
              const percent = item.count / total;
              const strokeDasharray = `${circumference * percent} ${circumference * (1 - percent)}`;
              const strokeDashoffset = -circumference * cumulativePercent;
              cumulativePercent += percent;

              return (
                <Circle
                  key={item.type}
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={VIOLATION_COLORS[index % VIOLATION_COLORS.length]}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              );
            })}
          </G>
        </Svg>
        {/* Center label */}
        <View style={donutStyles.centerLabel}>
          <Text style={donutStyles.centerValue}>{total}</Text>
          <Text style={donutStyles.centerText}>Total</Text>
        </View>
      </View>

      {/* Legend */}
      <View style={donutStyles.legend}>
        {data.map((item, index) => (
          <View key={item.type} style={donutStyles.legendItem}>
            <View
              style={[
                donutStyles.legendDot,
                { backgroundColor: VIOLATION_COLORS[index % VIOLATION_COLORS.length] },
              ]}
            />
            <Text style={donutStyles.legendText}>{item.type}</Text>
            <Text style={donutStyles.legendCount}>
              {item.count} ({Math.round((item.count / total) * 100)}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const donutStyles = {
  centerLabel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerValue: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
  },
  centerText: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: '600',
  },
  legend: {
    marginTop: 16,
    gap: 8,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '500',
  },
  legendCount: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.secondary,
  },
};

// ─── Helpers ───
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' });
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' });
};

// ─── Main Screen ───
const AdminAnalyticsScreen = ({ navigation, onBack }) => {
  const { analytics, isLoading, fetchAnalytics, dateRange, changeDateRange } = useAdminAnalytics();

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

  const trendLabel = TREND_LABELS[dateRange];

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
          <TouchableOpacity style={styles.backBtn} onPress={() => fetchAnalytics()}>
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
            <AnimatedCounter
              value={analytics.totalFines}
              style={styles.heroValue}
              prefix="PKR "
            />
            {dateRange !== 'all' && (
              <TrendBadge value={analytics.trends.fines} label={trendLabel} />
            )}
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={() => fetchAnalytics()} colors={[COLORS.accent]} />
        }
      >
        {/* Date Range Filter */}
        <View style={styles.dateFilterContainer}>
          {DATE_RANGES.map((item) => {
            const isActive = dateRange === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.dateFilterBtn, isActive && styles.dateFilterBtnActive]}
                onPress={() => changeDateRange(item.key)}
              >
                <Text style={[styles.dateFilterText, isActive && styles.dateFilterTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
              <AlertTriangle size={22} color={COLORS.error} />
            </View>
            <AnimatedCounter value={analytics.totalViolations} style={styles.statNumber} />
            <Text style={styles.statLabel}>Total Violations</Text>
            {dateRange !== 'all' && (
              <TrendBadge value={analytics.trends.violations} label={trendLabel} />
            )}
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
              <UserX size={22} color={COLORS.error} />
            </View>
            <AnimatedCounter value={analytics.suspendedUsers} style={styles.statNumber} />
            <Text style={styles.statLabel}>Suspended Users</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
              <Users size={22} color={COLORS.accent} />
            </View>
            <AnimatedCounter value={analytics.totalManagers} style={styles.statNumber} />
            <Text style={styles.statLabel}>Managers</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}>
              <Shield size={22} color={COLORS.success} />
            </View>
            <AnimatedCounter value={analytics.totalWorkers} style={styles.statNumber} />
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

        {/* Donut Chart */}
        {analytics.violationBreakdown.length > 0 && (
          <View style={styles.donutCard}>
            <View style={styles.breakdownHeader}>
              <BarChart3 size={20} color={COLORS.primary} />
              <Text style={styles.breakdownTitle}>Violation Distribution</Text>
            </View>
            <DonutChart data={analytics.violationBreakdown} />
          </View>
        )}

        {/* Violation Breakdown Bars */}
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
                  <Text style={styles.breakdownFine}>PKR {(item.totalFine || 0).toLocaleString()}</Text>
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

        {/* Recent Violations */}
        <View style={styles.recentCard}>
          <View style={styles.breakdownHeader}>
            <Clock size={20} color={COLORS.primary} />
            <Text style={styles.breakdownTitle}>Recent Violations</Text>
          </View>

          {analytics.recentViolations.length === 0 ? (
            <View style={styles.emptyBreakdown}>
              <AlertTriangle size={32} color={COLORS.muted} />
              <Text style={styles.emptyText}>No recent violations</Text>
            </View>
          ) : (
            analytics.recentViolations.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.recentRow,
                  index < analytics.recentViolations.length - 1 && styles.recentRowBorder,
                ]}
              >
                <View style={styles.recentLeft}>
                  <View style={[styles.recentDot, {
                    backgroundColor:
                      item.violation_type === 'No Hard Hat' ? COLORS.error :
                      item.violation_type === 'No Safety Vest' ? COLORS.warning :
                      COLORS.accent,
                  }]} />
                  <View style={styles.recentInfo}>
                    <Text style={styles.recentType}>{item.violation_type}</Text>
                    <View style={styles.recentMeta}>
                      {item.site_name && (
                        <View style={styles.recentMetaItem}>
                          <MapPin size={11} color={COLORS.muted} />
                          <Text style={styles.recentMetaText}>{item.site_name}</Text>
                        </View>
                      )}
                      <View style={styles.recentMetaItem}>
                        <Clock size={11} color={COLORS.muted} />
                        <Text style={styles.recentMetaText}>
                          {formatDate(item.detected_at)} at {formatTime(item.detected_at)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.recentFineBadge}>
                  <Text style={styles.recentFineText}>PKR {item.fine_amount}</Text>
                </View>
              </View>
            ))
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

  // Date Range Filter
  dateFilterContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  dateFilterBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  dateFilterBtnActive: {
    backgroundColor: COLORS.accent,
  },
  dateFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  dateFilterTextActive: {
    color: COLORS.surface,
  },

  // Stats Grid
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

  // Top Violation
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

  // Donut Chart Card
  donutCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  // Breakdown
  breakdownCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
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
  breakdownFine: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.warning,
    marginBottom: 4,
    marginLeft: 16,
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

  // Recent Violations
  recentCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  recentRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  recentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  recentDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  recentInfo: {
    flex: 1,
  },
  recentType: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 3,
  },
  recentMeta: {
    gap: 4,
  },
  recentMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recentMetaText: {
    fontSize: 11,
    color: COLORS.muted,
  },
  recentFineBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  recentFineText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.error,
  },
};

export default AdminAnalyticsScreen;
