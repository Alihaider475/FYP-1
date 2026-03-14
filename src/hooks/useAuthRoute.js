import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../auth/supabase';
import { USER_ROLES, mapDbRole } from '../utils/userRoles';

export default function useAuthRoute() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const resetAuthState = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName('');
    setUserEmail('');
    setUserId(null);
    setIsResettingPassword(false);
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && !isResettingPassword) {
          await loadUserProfile(session.user);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);

        if (event === 'SIGNED_OUT') {
          resetAuthState();
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [isResettingPassword]);

  const loadUserProfile = async (user) => {
    try {
      const email = user.email || '';

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, name, is_suspended')
        .eq('id', user.id)
        .single();

      // Check if user is suspended (Kill Switch)
      if (profile?.is_suspended) {
        await supabase.auth.signOut();
        Alert.alert(
          'Account Suspended',
          'Your account has been suspended by the administrator. Contact your admin for assistance.'
        );
        resetAuthState();
        return;
      }

      const role = mapDbRole(profile?.role);

      if (!role) {
        await supabase.auth.signOut();
        Alert.alert(
          'Access Denied',
          'Your account has no assigned role. Contact your administrator.'
        );
        resetAuthState();
        return;
      }

      const name = profile?.name || email.split('@')[0] || 'User';

      setUserId(user.id);
      setUserEmail(email);
      setUserRole(role);
      setUserName(name);
      setIsAuthenticated(true);

      console.log(`Session restored: ${email} with role: ${role}`);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleLoginSuccess = (userData) => {
    const email = userData?.email || '';
    const role = userData?.role || null;
    const name = userData?.name || email.split('@')[0] || 'User';

    if (!role) {
      supabase.auth.signOut();
      Alert.alert(
        'Access Denied',
        'Your account has no assigned role. Contact your administrator.'
      );
      resetAuthState();
      return;
    }

    setUserId(userData?.id || null);
    setUserEmail(email);
    setUserRole(role);
    setUserName(name);
    setIsAuthenticated(true);

    console.log(`User logged in: ${email} with role: ${role}`);
  };

  const handleLogout = async () => {
    console.log('Logout triggered');
    try {
      await supabase.auth.signOut();
      console.log('Supabase sign-out successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
    resetAuthState();
  };

  const enterResetFlow = () => setIsResettingPassword(true);
  const exitResetFlow = () => setIsResettingPassword(false);

  return {
    isLoading,
    isAuthenticated,
    userRole,
    userName,
    userEmail,
    userId,
    isResettingPassword,
    handleLoginSuccess,
    handleLogout,
    enterResetFlow,
    exitResetFlow,
  };
}
