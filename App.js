import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

// Import Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import DetectionScreen from './src/screens/DetectionScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SiteSettingsScreen from './src/screens/SiteSettingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

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

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('Site Manager');

  const handleGetStarted = () => {
    setShowWelcome(false);
  };

  const handleLoginSuccess = (userData) => {
    setUserName(userData?.email?.split('@')[0] || 'Site Manager');
    setIsAuthenticated(true);
  };

  const handleRegisterSuccess = (userData) => {
    setUserName(userData?.fullName || 'Site Manager');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName('Site Manager');
  };

  // Show Welcome Screen first
  if (showWelcome) {
    return (
      <PaperProvider theme={theme}>
        <StatusBar style="light" />
        <WelcomeScreen onGetStarted={handleGetStarted} />
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          {!isAuthenticated ? (
            // Auth Screens
            <>
              <Stack.Screen name="Login">
                {(props) => (
                  <LoginScreen
                    {...props}
                    onLoginSuccess={handleLoginSuccess}
                    onNavigateToRegister={() => props.navigation.navigate('Register')}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="Register">
                {(props) => (
                  <RegisterScreen
                    {...props}
                    onRegisterSuccess={handleRegisterSuccess}
                    onBackToLogin={() => props.navigation.navigate('Login')}
                  />
                )}
              </Stack.Screen>
            </>
          ) : (
            // Main App Screens
            <>
              <Stack.Screen name="Dashboard">
                {(props) => (
                  <DashboardScreen
                    {...props}
                    userName={userName}
                    onLogout={handleLogout}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="Detection" component={DetectionScreen} />
              <Stack.Screen name="History" component={HistoryScreen} />
              <Stack.Screen name="Settings" component={SiteSettingsScreen} />
              <Stack.Screen name="Profile">
                {(props) => (
                  <ProfileScreen
                    {...props}
                    userName={userName}
                  />
                )}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
