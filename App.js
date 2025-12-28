import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { View, ActivityIndicator } from 'react-native';

// Import Supabase client
import { supabase } from './src/auth/supabase';

// Import Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import VerifyCodeScreen from './src/screens/VerifyCodeScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import CameraPermissionScreen from './src/screens/CameraPermissionScreen';

// User Screens (Normal Users Only)
import DashboardScreen from './src/screens/DashboardScreen';
import DetectionScreen from './src/screens/DetectionScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ViolationDetailScreen from './src/screens/ViolationDetailScreen';
import SiteSettingsScreen from './src/screens/SiteSettingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Admin Screens (Admin Only)
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import AdminApprovalScreen from './src/screens/AdminApprovalScreen';
import AdminSettingsScreen from './src/screens/AdminSettingsScreen';

// Import User Roles utilities
import { USER_ROLES, getUserRole, isAdmin } from './src/utils/userRoles';

const Stack = createNativeStackNavigator();

// Custom theme matching the design system
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0f172a',
    secondary: '#64748b',
    background: '#f8fafc',
    surface: '#ffffff',
    error: '#ef4444',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onBackground: '#0f172a',
    onSurface: '#0f172a',
    outline: '#64748b',
  },
  roundness: 12,
};

// Auth Stack - for unauthenticated users
const AuthStack = ({ onLoginSuccess, onRegisterSuccess }) => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen name="Login">
      {(props) => (
        <LoginScreen
          {...props}
          onLoginSuccess={onLoginSuccess}
          onNavigateToRegister={() => props.navigation.navigate('Register')}
          onNavigateToForgotPassword={() => props.navigation.navigate('ForgotPassword')}
        />
      )}
    </Stack.Screen>
    <Stack.Screen name="Register">
      {(props) => (
        <RegisterScreen
          {...props}
          onRegisterSuccess={onRegisterSuccess}
          onBackToLogin={() => props.navigation.navigate('Login')}
        />
      )}
    </Stack.Screen>
    <Stack.Screen name="ForgotPassword">
      {(props) => (
        <ForgotPasswordScreen
          {...props}
          onNavigateToVerify={(data) => props.navigation.navigate('VerifyCode', data)}
          onBackToLogin={() => props.navigation.navigate('Login')}
        />
      )}
    </Stack.Screen>
    <Stack.Screen name="VerifyCode">
      {(props) => (
        <VerifyCodeScreen
          {...props}
          email={props.route.params?.email}
          expectedCode={props.route.params?.code}
          onNavigateToReset={(data) => props.navigation.navigate('ResetPassword', data)}
          onBackToForgotPassword={() => props.navigation.navigate('ForgotPassword')}
        />
      )}
    </Stack.Screen>
    <Stack.Screen name="ResetPassword">
      {(props) => (
        <ResetPasswordScreen
          {...props}
          email={props.route.params?.email}
          onPasswordReset={() => props.navigation.navigate('Login')}
          onBackToLogin={() => props.navigation.navigate('Login')}
        />
      )}
    </Stack.Screen>
  </Stack.Navigator>
);

// Admin Stack - ONLY for admin users
const AdminStack = ({ userName, userEmail, onLogout }) => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen name="AdminDashboard">
      {(props) => (
        <AdminDashboardScreen
          {...props}
          userName={userName}
          userEmail={userEmail}
          onLogout={onLogout}
        />
      )}
    </Stack.Screen>
    <Stack.Screen name="AdminApproval">
      {(props) => (
        <AdminApprovalScreen
          {...props}
          onBack={() => props.navigation.goBack()}
        />
      )}
    </Stack.Screen>
    <Stack.Screen name="AdminSettings" component={AdminSettingsScreen} />
  </Stack.Navigator>
);

// User Stack - ONLY for normal users (managers)
const UserStack = ({ userName, userRole, userEmail, onLogout, onRevokeCameraPermission }) => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen name="Dashboard">
      {(props) => (
        <DashboardScreen
          {...props}
          userName={userName}
          userRole={userRole}
          userEmail={userEmail}
          onLogout={onLogout}
        />
      )}
    </Stack.Screen>
    <Stack.Screen name="Detection" component={DetectionScreen} />
    <Stack.Screen name="History" component={HistoryScreen} />
    <Stack.Screen name="ViolationDetail" component={ViolationDetailScreen} />
    <Stack.Screen name="Settings">
      {(props) => (
        <SiteSettingsScreen
          {...props}
          userRole={userRole}
          onRevokeCameraPermission={onRevokeCameraPermission}
        />
      )}
    </Stack.Screen>
    <Stack.Screen name="Profile">
      {(props) => (
        <ProfileScreen
          {...props}
          userName={userName}
          userRole={userRole}
          userEmail={userEmail}
        />
      )}
    </Stack.Screen>
  </Stack.Navigator>
);

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isCheckingPermission, setIsCheckingPermission] = useState(false);
  const [revokedFromSettings, setRevokedFromSettings] = useState(false);
  const [userName, setUserName] = useState('Site Manager');
  const [userRole, setUserRole] = useState(USER_ROLES.MANAGER);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState(null);

  // Listen for Supabase auth state changes
  useEffect(() => {
    // Check current session on app start
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const email = session.user.email || '';
          const role = getUserRole(email);
          const name = session.user.user_metadata?.full_name || email.split('@')[0] || 'User';

          setUserId(session.user.id);
          setUserEmail(email);
          setUserRole(role);
          setUserName(name);
          setIsAuthenticated(true);
          setShowWelcome(false);

          console.log(`Session restored: ${email} with role: ${role}`);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);

        if (event === 'SIGNED_IN' && session?.user) {
          const email = session.user.email || '';
          const role = getUserRole(email);
          const name = session.user.user_metadata?.full_name || email.split('@')[0] || 'User';

          setUserId(session.user.id);
          setUserEmail(email);
          setUserRole(role);
          setUserName(name);
          setIsAuthenticated(true);
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setHasCameraPermission(false);
          setRevokedFromSettings(false);
          setUserName('Site Manager');
          setUserRole(USER_ROLES.MANAGER);
          setUserEmail('');
          setUserId(null);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Check camera permission when user logs in (only for non-admin users)
  useEffect(() => {
    const checkCameraPermission = async () => {
      // Skip camera permission for admin users
      if (isAuthenticated && !isAdmin(userRole) && !hasCameraPermission) {
        setIsCheckingPermission(true);
        try {
          const { status } = await ImagePicker.getCameraPermissionsAsync();
          if (status === 'granted') {
            setHasCameraPermission(true);
          }
        } catch (error) {
          console.error('Error checking camera permission:', error);
        } finally {
          setIsCheckingPermission(false);
        }
      }
    };

    checkCameraPermission();
  }, [isAuthenticated, userRole]);

  const handleGetStarted = () => {
    setShowWelcome(false);
  };

  const handleLoginSuccess = (userData) => {
    const email = userData?.email || '';
    const role = userData?.role || getUserRole(email);
    const name = userData?.email?.split('@')[0] || 'User';

    setUserId(userData?.id || null);
    setUserEmail(email);
    setUserRole(role);
    setUserName(name);
    setIsAuthenticated(true);

    console.log(`User logged in: ${email} with role: ${role}`);
  };

  const handleRegisterSuccess = (userData) => {
    // After registration, go back to login
    // User needs to verify email first
    console.log(`User registered: ${userData?.email}`);
  };

  const handleCameraPermissionGranted = () => {
    setHasCameraPermission(true);
    setRevokedFromSettings(false);
  };

  const handleRevokeCameraPermission = () => {
    setHasCameraPermission(false);
    setRevokedFromSettings(true);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
    // State will be reset by the auth state listener
    setIsAuthenticated(false);
    setHasCameraPermission(false);
    setRevokedFromSettings(false);
    setUserName('Site Manager');
    setUserRole(USER_ROLES.MANAGER);
    setUserEmail('');
    setUserId(null);
  };

  // Show loading screen while checking session
  if (isLoading) {
    return (
      <PaperProvider theme={theme}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      </PaperProvider>
    );
  }

  // Show Welcome Screen first (only if not authenticated)
  if (showWelcome && !isAuthenticated) {
    return (
      <PaperProvider theme={theme}>
        <StatusBar style="light" />
        <WelcomeScreen onGetStarted={handleGetStarted} />
      </PaperProvider>
    );
  }

  // Check if user is admin
  const userIsAdmin = isAdmin(userRole);

  // Show Camera Permission Screen after login but before dashboard
  // ONLY for normal users, NOT for admins
  if (isAuthenticated && !userIsAdmin && !hasCameraPermission && !isCheckingPermission) {
    return (
      <PaperProvider theme={theme}>
        <StatusBar style="light" />
        <CameraPermissionScreen
          onPermissionGranted={handleCameraPermissionGranted}
          revokedFromSettings={revokedFromSettings}
        />
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <StatusBar style="auto" />
      <NavigationContainer>
        {!isAuthenticated ? (
          // Auth Screens - for unauthenticated users
          <AuthStack
            onLoginSuccess={handleLoginSuccess}
            onRegisterSuccess={handleRegisterSuccess}
          />
        ) : userIsAdmin ? (
          // Admin Screens - ONLY for admin users
          <AdminStack
            userName={userName}
            userEmail={userEmail}
            onLogout={handleLogout}
          />
        ) : (
          // User Screens - ONLY for normal users (managers)
          <UserStack
            userName={userName}
            userRole={userRole}
            userEmail={userEmail}
            onLogout={handleLogout}
            onRevokeCameraPermission={handleRevokeCameraPermission}
          />
        )}
      </NavigationContainer>
    </PaperProvider>
  );
}
