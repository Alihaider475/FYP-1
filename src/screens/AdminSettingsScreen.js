import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  Alert,
} from 'react-native';
import { Text, Surface } from 'react-native-paper';
import {
  ArrowLeft,
  Settings,
  Bell,
  Shield,
  Mail,
  Lock,
  Users,
  Database,
  RefreshCw,
  ChevronRight,
  ToggleLeft,
  Moon,
  Globe,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
  gradient1: '#1e293b',
  gradient2: '#334155',
};

const AdminSettingsScreen = ({ navigation }) => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const settingsSections = [
    {
      title: 'Notifications',
      items: [
        {
          id: 'email',
          title: 'Email Notifications',
          subtitle: 'Receive email for new requests',
          icon: Mail,
          color: '#3b82f6',
          type: 'toggle',
          value: emailNotifications,
          onToggle: setEmailNotifications,
        },
        {
          id: 'push',
          title: 'Push Notifications',
          subtitle: 'Receive push notifications',
          icon: Bell,
          color: '#f59e0b',
          type: 'toggle',
          value: pushNotifications,
          onToggle: setPushNotifications,
        },
      ],
    },
    {
      title: 'User Management',
      items: [
        {
          id: 'auto-approve',
          title: 'Auto-Approve Users',
          subtitle: 'Automatically approve new registrations',
          icon: Users,
          color: '#22c55e',
          type: 'toggle',
          value: autoApprove,
          onToggle: (val) => {
            if (val) {
              Alert.alert(
                'Enable Auto-Approve?',
                'All new registration requests will be automatically approved. This may pose security risks.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Enable', onPress: () => setAutoApprove(true) },
                ]
              );
            } else {
              setAutoApprove(false);
            }
          },
        },
        {
          id: 'security',
          title: 'Security Settings',
          subtitle: 'Configure security options',
          icon: Shield,
          color: '#8b5cf6',
          type: 'link',
          onPress: () => Alert.alert('Coming Soon', 'Security settings will be available in a future update.'),
        },
      ],
    },
    {
      title: 'App Settings',
      items: [
        {
          id: 'dark-mode',
          title: 'Dark Mode',
          subtitle: 'Enable dark theme',
          icon: Moon,
          color: '#6366f1',
          type: 'toggle',
          value: darkMode,
          onToggle: setDarkMode,
        },
        {
          id: 'language',
          title: 'Language',
          subtitle: 'English (US)',
          icon: Globe,
          color: '#06b6d4',
          type: 'link',
          onPress: () => Alert.alert('Coming Soon', 'Language settings will be available in a future update.'),
        },
      ],
    },
    {
      title: 'Data',
      items: [
        {
          id: 'backup',
          title: 'Backup Data',
          subtitle: 'Create a backup of all data',
          icon: Database,
          color: '#ec4899',
          type: 'link',
          onPress: () => Alert.alert('Backup', 'Data backup initiated. You will be notified when complete.'),
        },
        {
          id: 'sync',
          title: 'Sync Data',
          subtitle: 'Last synced: Just now',
          icon: RefreshCw,
          color: '#14b8a6',
          type: 'link',
          onPress: () => Alert.alert('Sync', 'Data synchronized successfully.'),
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.gradient1} />

      {/* Header */}
      <LinearGradient
        colors={[COLORS.gradient1, COLORS.gradient2]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={22} color={COLORS.surface} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Admin Settings</Text>
            <Text style={styles.headerSubtitle}>Configure system preferences</Text>
          </View>
          <View style={styles.headerIcon}>
            <Settings size={24} color={COLORS.surface} />
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {settingsSections.map((section, sectionIndex) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.settingItem,
                    itemIndex < section.items.length - 1 && styles.settingItemBorder,
                  ]}
                  onPress={item.type === 'link' ? item.onPress : undefined}
                  activeOpacity={item.type === 'link' ? 0.7 : 1}
                >
                  <View style={[styles.settingIcon, { backgroundColor: `${item.color}15` }]}>
                    <item.icon size={20} color={item.color} />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>{item.title}</Text>
                    <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                  </View>
                  {item.type === 'toggle' ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: '#e2e8f0', true: `${COLORS.accent}50` }}
                      thumbColor={item.value ? COLORS.accent : '#f4f4f5'}
                    />
                  ) : (
                    <ChevronRight size={20} color={COLORS.muted} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>SafeSite AI v1.0.0</Text>
          <Text style={styles.footerSubtext}>Admin Panel</Text>
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
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    marginTop: 2,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  settingSubtitle: {
    fontSize: 13,
    color: COLORS.secondary,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: '500',
  },
  footerSubtext: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 2,
  },
};

export default AdminSettingsScreen;
