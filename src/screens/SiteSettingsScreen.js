import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Card,
  Text,
  Surface,
  Switch,
  Button,
  Divider,
} from 'react-native-paper';
import {
  ArrowLeft,
  Settings,
  Brain,
  HardHat,
  Shirt,
  Smartphone,
  Bell,
  Volume2,
  Save,
  RotateCcw,
  Camera,
  ShieldCheck,
  Users,
  ChevronRight,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { styles, COLORS } from './styles/SiteSettingsScreenStyles';
import { USER_ROLES, isAdmin } from '../utils/userRoles';

const SiteSettingsScreen = ({ navigation, userRole, onRevokeCameraPermission }) => {
  // Check if current user is an admin
  const userIsAdmin = isAdmin(userRole);
  // Camera Permission State
  const [cameraPermission, setCameraPermission] = useState(true);

  // AI Models State
  const [helmetDetection, setHelmetDetection] = useState(true);
  const [vestDetection, setVestDetection] = useState(true);
  const [phoneDetection, setPhoneDetection] = useState(false);

  // Alert Preferences State
  const [audibleSiren, setAudibleSiren] = useState(true);

  const [saving, setSaving] = useState(false);

  // Check actual camera permission status on mount
  useEffect(() => {
    const checkCameraStatus = async () => {
      try {
        const { status } = await ImagePicker.getCameraPermissionsAsync();
        setCameraPermission(status === 'granted');
      } catch (error) {
        console.error('Error checking camera permission:', error);
      }
    };

    checkCameraStatus();
  }, []);

  // Handle camera permission toggle
  const handleCameraPermissionToggle = (value) => {
    if (!value) {
      // User wants to disable camera permission
      Alert.alert(
        'Disable Camera Access',
        'Disabling camera access will redirect you to the permission screen. You will need to grant camera permission again to use the app.\n\nAre you sure you want to continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: () => {
              setCameraPermission(false);
              // Redirect to camera permission screen
              if (onRevokeCameraPermission) {
                onRevokeCameraPermission();
              }
            },
          },
        ]
      );
    } else {
      // User wants to enable - this shouldn't happen normally since they need permission
      setCameraPermission(true);
    }
  };

  const handleBack = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const handleSaveConfiguration = async () => {
    setSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSaving(false);

    Alert.alert(
      'Configuration Saved',
      'Your site settings have been updated successfully.',
      [{ text: 'OK' }]
    );
  };

  const handleResetDefaults = () => {
    Alert.alert(
      'Reset to Defaults',
      'Are you sure you want to reset all settings to their default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setHelmetDetection(true);
            setVestDetection(true);
            setPhoneDetection(false);
            setAudibleSiren(true);
          },
        },
      ]
    );
  };

  const SettingRow = ({ icon: Icon, title, subtitle, value, onValueChange }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <Surface style={styles.settingIconSurface} elevation={0}>
          <Icon size={20} color={COLORS.primary} />
        </Surface>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        color={COLORS.success}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <Surface style={styles.header} elevation={4}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color={COLORS.surface} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Site Settings</Text>
            <Text style={styles.headerSubtitle}>Configure AI & Alerts</Text>
          </View>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetDefaults}
          >
            <RotateCcw size={20} color={COLORS.surface} />
          </TouchableOpacity>
        </View>
      </Surface>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Camera Permission Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Camera size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Camera Permission</Text>
          </View>
          <Card style={styles.card} mode="elevated">
            <Card.Content style={styles.cardContent}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Surface style={[styles.settingIconSurface, cameraPermission && styles.settingIconActive]} elevation={0}>
                    <Camera size={20} color={cameraPermission ? COLORS.surface : COLORS.primary} />
                  </Surface>
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Camera Access</Text>
                    <Text style={[styles.settingSubtitle, cameraPermission ? styles.statusGranted : styles.statusDenied]}>
                      {cameraPermission ? 'Permission granted' : 'Permission required'}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={cameraPermission}
                  onValueChange={handleCameraPermissionToggle}
                  color={COLORS.success}
                />
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* AI Models Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Brain size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Active AI Models</Text>
          </View>
          <Card style={styles.card} mode="elevated">
            <Card.Content style={styles.cardContent}>
              <SettingRow
                icon={HardHat}
                title="Helmet Detection"
                subtitle="Detect missing safety helmets"
                value={helmetDetection}
                onValueChange={setHelmetDetection}
              />
              <Divider style={styles.divider} />
              <SettingRow
                icon={Shirt}
                title="Safety Vest Detection"
                subtitle="Detect missing high-visibility vests"
                value={vestDetection}
                onValueChange={setVestDetection}
              />
              <Divider style={styles.divider} />
              <SettingRow
                icon={Smartphone}
                title="Mobile Phone Usage"
                subtitle="Detect unauthorized phone usage"
                value={phoneDetection}
                onValueChange={setPhoneDetection}
              />
            </Card.Content>
          </Card>
        </View>

        {/* Alert Preferences Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bell size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Alert Preferences</Text>
          </View>
          <Card style={styles.card} mode="elevated">
            <Card.Content style={styles.cardContent}>
              <SettingRow
                icon={Volume2}
                title="Audible Siren"
                subtitle="Play alarm sound on violation"
                value={audibleSiren}
                onValueChange={setAudibleSiren}
              />
            </Card.Content>
          </Card>
        </View>

        {/* Admin Panel Section - Only visible to ADMIN role */}
        {userIsAdmin && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ShieldCheck size={20} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Administration</Text>
            </View>
            <Card style={styles.card} mode="elevated">
              <Card.Content style={styles.cardContent}>
                <TouchableOpacity
                  style={styles.adminPanelButton}
                  onPress={() => navigation.navigate('AdminApproval')}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingLeft}>
                    <Surface style={[styles.settingIconSurface, styles.adminIconSurface]} elevation={0}>
                      <Users size={20} color={COLORS.surface} />
                    </Surface>
                    <View style={styles.settingTextContainer}>
                      <Text style={styles.settingTitle}>User Approval Panel</Text>
                      <Text style={styles.settingSubtitle}>Review registration requests</Text>
                    </View>
                  </View>
                  <ChevronRight size={22} color={COLORS.secondary} />
                </TouchableOpacity>
              </Card.Content>
            </Card>
          </View>
        )}

        {/* Save Button */}
        <View style={styles.saveContainer}>
          <Button
            mode="contained"
            onPress={handleSaveConfiguration}
            loading={saving}
            disabled={saving}
            style={styles.saveButton}
            contentStyle={styles.saveButtonContent}
            labelStyle={styles.saveButtonLabel}
            buttonColor={COLORS.primary}
            icon={() => <Save size={20} color={COLORS.surface} />}
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </View>

        {/* Info Card */}
        <Card style={styles.infoCard} mode="elevated">
          <Card.Content style={styles.infoCardContent}>
            <Settings size={20} color={COLORS.secondary} />
            <Text style={styles.infoText}>
              Changes will apply to all active cameras on this site. Some
              settings may require a system restart to take effect.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

export default SiteSettingsScreen;
