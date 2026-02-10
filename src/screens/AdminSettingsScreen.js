import React from 'react';
import { View, TouchableOpacity, StatusBar } from 'react-native';
import { Text } from 'react-native-paper';
import { ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = {
  primary: '#0f172a',
  gradient1: '#1e293b',
  gradient2: '#334155',
  surface: '#ffffff',
  background: '#f1f5f9',
  muted: '#94a3b8',
};

const AdminSettingsScreen = ({ navigation }) => {
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.gradient1} />
      
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
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    color: COLORS.surface,
    fontSize: 22,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 16,
  },
};

export default AdminSettingsScreen;
