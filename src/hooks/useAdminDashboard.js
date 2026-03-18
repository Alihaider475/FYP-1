import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../auth/supabase';

export default function useAdminDashboard() {
  const [stats, setStats] = useState({
    pendingCount: 0,
    approvedCount: 0,
    totalUsers: 0,
    todayViolations: 0,
    todayFines: 0,
    activeWorkers: 0,
    activeSites: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    try {
      // Today's start timestamp
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayISO = todayStart.toISOString();

      const [
        pendingResult,
        approvedResult,
        totalUsersResult,
        todayViolationsResult,
        workersResult,
        activeSitesResult,
        recentViolationsResult,
        recentUsersResult,
      ] = await Promise.all([
        // Pending approvals (users not yet approved)
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('is_approved', false),
        // Approved users
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('is_approved', true),
        // Total users
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true }),
        // Today's violations with fines
        supabase
          .from('violation_logs')
          .select('fine_amount, violation_type')
          .gte('detected_at', todayISO),
        // Active workers
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'worker')
          .eq('is_suspended', false),
        // Active sites
        supabase
          .from('companies')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', true),
        // Recent violations (for activity feed)
        supabase
          .from('violation_logs')
          .select('id, violation_type, fine_amount, site_name, detected_at')
          .order('detected_at', { ascending: false })
          .limit(5),
        // Recent user registrations (for activity feed)
        supabase
          .from('profiles')
          .select('id, name, email, role, created_at, is_approved')
          .order('created_at', { ascending: false })
          .limit(3),
      ]);

      // Calculate today's fines
      let todayFines = 0;
      let todayViolations = 0;
      if (todayViolationsResult.data) {
        todayViolations = todayViolationsResult.data.length;
        todayFines = todayViolationsResult.data.reduce(
          (sum, row) => sum + (row.fine_amount || 0),
          0
        );
      }

      setStats({
        pendingCount: pendingResult.count || 0,
        approvedCount: approvedResult.count || 0,
        totalUsers: totalUsersResult.count || 0,
        todayViolations,
        todayFines,
        activeWorkers: workersResult.count || 0,
        activeSites: activeSitesResult.count || 0,
      });

      // Build activity feed — merge violations and user events, sort by time
      const activities = [];

      if (recentViolationsResult.data) {
        recentViolationsResult.data.forEach((v) => {
          activities.push({
            id: `v-${v.id}`,
            type: 'violation',
            title: v.violation_type,
            subtitle: v.site_name || 'Unknown site',
            detail: `PKR ${v.fine_amount}`,
            time: v.detected_at,
          });
        });
      }

      if (recentUsersResult.data) {
        recentUsersResult.data.forEach((u) => {
          activities.push({
            id: `u-${u.id}`,
            type: u.is_approved ? 'user_approved' : 'user_pending',
            title: u.name || u.email,
            subtitle: u.role || 'user',
            detail: u.is_approved ? 'Approved' : 'Pending',
            time: u.created_at,
          });
        });
      }

      // Sort by most recent first, take top 5
      activities.sort((a, b) => new Date(b.time) - new Date(a.time));
      setRecentActivity(activities.slice(0, 5));
    } catch (error) {
      Alert.alert('Error', 'Failed to load dashboard: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-refresh on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchDashboard();
    }, [fetchDashboard])
  );

  return {
    stats,
    recentActivity,
    isLoading,
    fetchDashboard,
  };
}
