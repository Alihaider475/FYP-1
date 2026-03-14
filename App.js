import 'react-native-url-polyfill/auto';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { View, ActivityIndicator } from 'react-native';

// Import Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import VerifyCodeScreen from './src/screens/VerifyCodeScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import CameraPermissionScreen from './src/screens/CameraPermissionScreen';

// User Screens
import DashboardScreen from './src/screens/DashboardScreen';
import DetectionScreen from './src/screens/DetectionScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ViolationDetailScreen from './src/screens/ViolationDetailScreen';
import SiteSettingsScreen from './src/screens/SiteSettingsScreen';

// Admin Screens
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import AdminApprovalScreen from './src/screens/AdminApprovalScreen';
import AdminSettingsScreen from './src/screens/AdminSettingsScreen';
import WhitelistManagerScreen from './src/screens/WhitelistManagerScreen';
import CompanyManagerScreen from './src/screens/CompanyManagerScreen';
import GlobalSettingsScreen from './src/screens/GlobalSettingsScreen';
import AdminAnalyticsScreen from './src/screens/AdminAnalyticsScreen';
import ManagerControlScreen from './src/screens/ManagerControlScreen';

// Import User Roles utilities and Auth Hook
import { USER_ROLES, isAdmin, isManager, isWorker } from './src/utils/userRoles';
import useAuthRoute from './src/hooks/useAuthRoute';

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
const AuthStack = ({ onLoginSuccess, onEnterResetFlow, onExitResetFlow }) => (
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
          onBackToLogin={() => props.navigation.navigate('Login')}
        />
      )}
    </Stack.Screen>
    <Stack.Screen name="ForgotPassword">
      {(props) => (
        <ForgotPasswordScreen
          {...props}
          onNavigateToVerify={(data) => {
            onEnterResetFlow();
            props.navigation.navigate('VerifyCode', data);
          }}
          onBackToLogin={() => {
            onExitResetFlow();
            props.navigation.navigate('Login');
          }}
        />
      )}
    </Stack.Screen>
    <Stack.Screen name="VerifyCode">
      {(props) => (
        <VerifyCodeScreen
          {...props}
          email={props.route.params?.email}
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
          onPasswordReset={() => {
            onExitResetFlow();
            props.navigation.navigate('Login');
          }}
          onBackToLogin={() => {
            onExitResetFlow();
            props.navigation.navigate('Login');
          }}
        />
      )}
    </Stack.Screen>
  </Stack.Navigator>
);

// Admin Stack - ONLY for super_admin users
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
    <Stack.Screen name="CompanyManager">
      {(props) => (
        <CompanyManagerScreen
          {...props}
          onBack={() => props.navigation.goBack()}
        />
      )}
    </Stack.Screen>
    <Stack.Screen name="GlobalSettings">
      {(props) => (
        <GlobalSettingsScreen
          {...props}
          onBack={() => props.navigation.goBack()}
        />
      )}
    </Stack.Screen>
    <Stack.Screen name="AdminAnalytics">
      {(props) => (
        <AdminAnalyticsScreen
          {...props}
          onBack={() => props.navigation.goBack()}
        />
      )}
    </Stack.Screen>
    <Stack.Screen name="ManagerControl">
      {(props) => (
        <ManagerControlScreen
          {...props}
          onBack={() => props.navigation.goBack()}
        />
      )}
    </Stack.Screen>
    <Stack.Screen name="WhitelistManager">
      {(props) => (
        <WhitelistManagerScreen
          {...props}
          onBack={() => props.navigation.goBack()}
        />
      )}
    </Stack.Screen>
  </Stack.Navigator>
);

// Manager Stack - ONLY for manager users (full access: Detection, Settings)
const ManagerStack = ({ userName, userRole, userEmail, onLogout, onRevokeCameraPermission }) => (
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
  </Stack.Navigator>
);

// Worker Stack - ONLY for worker users (limited: Dashboard, History, ViolationDetail)
const WorkerStack = ({ userName, userRole, userEmail, onLogout }) => (
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
    <Stack.Screen name="History" component={HistoryScreen} />
    <Stack.Screen name="ViolationDetail" component={ViolationDetailScreen} />
  </Stack.Navigator>
);

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isCheckingPermission, setIsCheckingPermission] = useState(false);
  const [revokedFromSettings, setRevokedFromSettings] = useState(false);

  const {
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
  } = useAuthRoute();

  // Reset camera state on logout
  useEffect(() => {
    if (!isAuthenticated) {
      setHasCameraPermission(false);
      setRevokedFromSettings(false);
    }
  }, [isAuthenticated]);

  // Check camera permission when user logs in (only for manager users)
  useEffect(() => {
    const checkCameraPermission = async () => {
      if (isAuthenticated && isManager(userRole) && !hasCameraPermission && !revokedFromSettings) {
        try {
          const { status } = await ImagePicker.getCameraPermissionsAsync();
          if (status === 'granted') {
            setHasCameraPermission(true);
          }
        } catch (error) {
          console.error('Error checking camera permission:', error);
        }
      }
    };

    checkCameraPermission();
  }, [isAuthenticated, userRole, hasCameraPermission, revokedFromSettings]);

  const handleGetStarted = () => {
    setShowWelcome(false);
  };

  const handleCameraPermissionGranted = () => {
    setHasCameraPermission(true);
    setRevokedFromSettings(false);
  };

  const handleRevokeCameraPermission = () => {
    setHasCameraPermission(false);
    setRevokedFromSettings(true);
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

  // Debug logging
  console.log('App State:', {
    isAuthenticated,
    userRole,
    userName,
    userEmail,
  });

  // Show Camera Permission Screen after login for managers only
  if (isAuthenticated && isManager(userRole) && !hasCameraPermission && !isCheckingPermission) {
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
          <AuthStack
            onLoginSuccess={handleLoginSuccess}
            onEnterResetFlow={enterResetFlow}
            onExitResetFlow={exitResetFlow}
          />
        ) : isAdmin(userRole) ? (
          <AdminStack
            userName={userName}
            userEmail={userEmail}
            onLogout={handleLogout}
          />
        ) : isManager(userRole) ? (
          <ManagerStack
            userName={userName}
            userRole={userRole}
            userEmail={userEmail}
            onLogout={handleLogout}
            onRevokeCameraPermission={handleRevokeCameraPermission}
          />
        ) : (
          <WorkerStack
            userName={userName}
            userRole={userRole}
            userEmail={userEmail}
            onLogout={handleLogout}
          />
        )}
      </NavigationContainer>
    </PaperProvider>
  );
}
