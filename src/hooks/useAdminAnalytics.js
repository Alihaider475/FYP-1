import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../auth/supabase';

export default function useAdminAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalFines: 0,
    totalViolations: 0,
    suspendedUsers: 0,
    totalWorkers: 0,
    totalManagers: 0,
    topViolationType: 'N/A',
    topViolationCount: 0,
    violationBreakdown: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      // Run all queries in parallel
      const [
        finesResult,
        suspendedResult,
        workersResult,
        managersResult,
        violationsResult,
      ] = await Promise.all([
        // Total fines collected
        supabase
          .from('violation_logs')
          .select('fine_amount'),

        // Suspended users count
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('is_suspended', true),

        // Total workers
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'worker'),

        // Total managers
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'manager'),

        // All violations for breakdown
        supabase
          .from('violation_logs')
          .select('violation_type'),
      ]);

      // Calculate total fines
      let totalFines = 0;
      let totalViolations = 0;
      if (finesResult.data) {
        totalViolations = finesResult.data.length;
        totalFines = finesResult.data.reduce((sum, row) => sum + (row.fine_amount || 0), 0);
      }

      // Calculate violation breakdown
      const typeCounts = {};
      if (violationsResult.data) {
        violationsResult.data.forEach((row) => {
          const type = row.violation_type || 'Unknown';
          typeCounts[type] = (typeCounts[type] || 0) + 1;
        });
      }

      const violationBreakdown = Object.entries(typeCounts)
        .map(([type, count]) => ({ type, count }))
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
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load analytics: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    analytics,
    isLoading,
    fetchAnalytics,
  };
}
