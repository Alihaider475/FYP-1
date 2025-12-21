import React, { useState } from 'react';
import {
  View,
  StyleSheet,
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
  SegmentedButtons,
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
  Mail,
  Gauge,
  Save,
  RotateCcw,
} from 'lucide-react-native';

const COLORS = {
  primary: '#0f172a',
  secondary: '#64748b',
  background: '#f8fafc',
  surface: '#ffffff',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
};

const SiteSettingsScreen = ({ navigation }) => {
  // AI Models State
  const [helmetDetection, setHelmetDetection] = useState(true);
  const [vestDetection, setVestDetection] = useState(true);
  const [phoneDetection, setPhoneDetection] = useState(false);

  // Alert Preferences State
  const [audibleSiren, setAudibleSiren] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Sensitivity State
  const [sensitivity, setSensitivity] = useState('medium');

  const [saving, setSaving] = useState(false);

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
            setEmailNotifications(true);
            setSensitivity('medium');
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
              <Divider style={styles.divider} />
              <SettingRow
                icon={Mail}
                title="Email Notifications"
                subtitle="Send email alerts to supervisors"
                value={emailNotifications}
                onValueChange={setEmailNotifications}
              />
            </Card.Content>
          </Card>
        </View>

        {/* Sensitivity Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Gauge size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Detection Sensitivity</Text>
          </View>
          <Card style={styles.card} mode="elevated">
            <Card.Content style={styles.sensitivityContent}>
              <Text style={styles.sensitivityLabel}>
                Adjust the AI detection sensitivity level
              </Text>
              <SegmentedButtons
                value={sensitivity}
                onValueChange={setSensitivity}
                buttons={[
                  {
                    value: 'low',
                    label: 'Low',
                    style:
                      sensitivity === 'low'
                        ? styles.segmentActive
                        : styles.segment,
                    labelStyle:
                      sensitivity === 'low'
                        ? styles.segmentLabelActive
                        : styles.segmentLabel,
                  },
                  {
                    value: 'medium',
                    label: 'Medium',
                    style:
                      sensitivity === 'medium'
                        ? styles.segmentActive
                        : styles.segment,
                    labelStyle:
                      sensitivity === 'medium'
                        ? styles.segmentLabelActive
                        : styles.segmentLabel,
                  },
                  {
                    value: 'high',
                    label: 'High',
                    style:
                      sensitivity === 'high'
                        ? styles.segmentActive
                        : styles.segment,
                    labelStyle:
                      sensitivity === 'high'
                        ? styles.segmentLabelActive
                        : styles.segmentLabel,
                  },
                ]}
                style={styles.segmentedButtons}
              />
              <View style={styles.sensitivityInfo}>
                <Text style={styles.sensitivityInfoText}>
                  {sensitivity === 'low' &&
                    'Fewer false positives, may miss some violations'}
                  {sensitivity === 'medium' &&
                    'Balanced detection accuracy (Recommended)'}
                  {sensitivity === 'high' &&
                    'Maximum detection, may have more false positives'}
                </Text>
              </View>
            </Card.Content>
          </Card>
        </View>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
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
  headerCenter: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  resetButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
  },
  cardContent: {
    padding: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconSurface: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.primary,
  },
  settingSubtitle: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 2,
  },
  divider: {
    marginHorizontal: 8,
    backgroundColor: COLORS.background,
  },
  sensitivityContent: {
    padding: 16,
  },
  sensitivityLabel: {
    fontSize: 14,
    color: COLORS.secondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  segmentedButtons: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
  },
  segment: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.background,
  },
  segmentActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  segmentLabel: {
    color: COLORS.secondary,
  },
  segmentLabelActive: {
    color: COLORS.surface,
  },
  sensitivityInfo: {
    marginTop: 16,
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  sensitivityInfoText: {
    fontSize: 12,
    color: COLORS.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  saveContainer: {
    marginBottom: 16,
  },
  saveButton: {
    borderRadius: 12,
  },
  saveButtonContent: {
    paddingVertical: 8,
  },
  saveButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.secondary,
    lineHeight: 18,
  },
});

export default SiteSettingsScreen;
