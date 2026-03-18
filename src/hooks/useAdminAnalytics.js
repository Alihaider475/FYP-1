import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../auth/supabase';

function getDateFrom(range) {
  if (range === 'all') return null;
  const now = new Date();
  if (range === 'today') {
    now.setHours(0, 0, 0, 0);
  } else if (range === 'week') {
    now.setDate(now.getDate() - 7);
  } else if (range === 'month') {
    now.setMonth(now.getMonth() - 1);
  }
  return now.toISOString();
}

function getPreviousPeriodDate(range) {
  if (range === 'all') return null;
  const now = new Date();
  if (range === 'today') {
    now.setDate(now.getDate() - 1);
    now.setHours(0, 0, 0, 0);
  } else if (range === 'week') {
    now.setDate(now.getDate() - 14);
  } else if (range === 'month') {
    now.setMonth(now.getMonth() - 2);
  }
  return now.toISOString();
}

function calcTrend(current, previous) {
  if (previous === 0 && current === 0) return 0;
  if (previous === 0) return 100;
  return Math.round(((current - previous) / previous) * 100);
}

export default function useAdminAnalytics() {
  const [dateRange, setDateRange] = useState('all');
  const [analytics, setAnalytics] = useState({
    totalFines: 0,
    totalViolations: 0,
    suspendedUsers: 0,
    totalWorkers: 0,
    totalManagers: 0,
    topViolationType: 'N/A',
    topViolationCount: 0,
    violationBreakdown: [],
    recentViolations: [],
    trends: {
      violations: 0,
      fines: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = useCallback(async (range) => {
    const activeRange = range || dateRange;
    setIsLoading(true);
    try {
      // Build current period violation query
      let violationQuery = supabase
        .from('violation_logs')
        .select('id, violation_type, fine_amount, site_name, detected_at');

      const dateFrom = getDateFrom(activeRange);
      if (dateFrom) {
        violationQuery = violationQuery.gte('detected_at', dateFrom);
      }

      // Build previous period query for trend calculation
      let prevQuery = null;
      if (activeRange !== 'all') {
        const prevFrom = getPreviousPeriodDate(activeRange);
        prevQuery = supabase
          .from('violation_logs')
          .select('fine_amount')
          .gte('detected_at', prevFrom)
          .lt('detected_at', dateFrom);
      }

      // Recent violations query (always last 10, no date filter)
      const recentQuery = supabase
        .from('violation_logs')
        .select('id, violation_type, fine_amount, site_name, detected_at')
        .order('detected_at', { ascending: false })
        .limit(10);

      const queries = [
        violationQuery,
        recentQuery,
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('is_suspended', true),
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'worker'),
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'manager'),
      ];

      if (prevQuery) queries.push(prevQuery);

      const results = await Promise.all(queries);

      const [
        violationsResult,
        recentResult,
        suspendedResult,
        workersResult,
        managersResult,
      ] = results;

      const prevResult = prevQuery ? results[5] : null;

      // Calculate totals and per-type breakdown
      let totalFines = 0;
      let totalViolations = 0;
      const typeStats = {};

      if (violationsResult.data) {
        totalViolations = violationsResult.data.length;
        violationsResult.data.forEach((row) => {
          const type = row.violation_type || 'Unknown';
          const fine = row.fine_amount || 0;
          totalFines += fine;
          if (!typeStats[type]) {
            typeStats[type] = { count: 0, totalFine: 0 };
          }
          typeStats[type].count += 1;
          typeStats[type].totalFine += fine;
        });
      }

      // Calculate previous period totals for trends
      let prevViolations = 0;
      let prevFines = 0;
      if (prevResult && prevResult.data) {
        prevViolations = prevResult.data.length;
        prevFines = prevResult.data.reduce(
          (sum, row) => sum + (row.fine_amount || 0),
          0
        );
      }

      const violationBreakdown = Object.entries(typeStats)
        .map(([type, stats]) => ({ type, count: stats.count, totalFine: stats.totalFine }))
        .sort((a, b) => b.count - a.count);

      const topViolation = violationBreakdown[0] || { type: 'N/A', count: 0 };

      setAnalytics({
        totalFines,
        totalViolations,
        suspendedUsers: suspendedResult.count || 0,
        totalWorkers: workersResult.count || 0,
        totalManagers: managersResult.count || 0,
        topViolationType: topViolation.type,
        topViolationCount: topViolation.count,
        violationBreakdown,
        recentViolations: recentResult.data || [],
        trends: {
          violations: activeRange !== 'all' ? calcTrend(totalViolations, prevViolations) : 0,
          fines: activeRange !== 'all' ? calcTrend(totalFines, prevFines) : 0,
        },
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load analytics: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  const changeDateRange = useCallback((range) => {
    setDateRange(range);
    fetchAnalytics(range);
  }, [fetchAnalytics]);

  // Auto-refresh data every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchAnalytics();
    }, [fetchAnalytics])
  );

  return {
    analytics,
    isLoading,
    fetchAnalytics,
    dateRange,
    changeDateRange,
  };
}
