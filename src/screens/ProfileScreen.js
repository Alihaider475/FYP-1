import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Card,
  Text,
  Surface,
  TextInput,
  Button,
  Avatar,
  Divider,
  Modal,
  Portal,
} from 'react-native-paper';
import {
  ArrowLeft,
  User,
  Mail,
  BadgeCheck,
  Shield,
  Lock,
  Trash2,
  Camera,
  Save,
  AlertTriangle,
  Eye,
  EyeOff,
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

const ProfileScreen = ({ navigation, userName = 'Site Manager' }) => {
  // Profile State
  const [fullName, setFullName] = useState('John Anderson');
  const [employeeId, setEmployeeId] = useState('EMP-2024-0142');
  const [contactEmail, setContactEmail] = useState('john.anderson@company.com');
  const [saving, setSaving] = useState(false);

  // Password Modal State
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const handleBack = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Full name is required');
      return;
    }
    if (!contactEmail.trim()) {
      Alert.alert('Error', 'Contact email is required');
      return;
    }

    setSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSaving(false);

    Alert.alert(
      'Profile Updated',
      'Your profile information has been saved successfully.',
      [{ text: 'OK' }]
    );
  };

  const handleChangePassword = async () => {
    if (!currentPassword.trim()) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }
    if (!newPassword.trim()) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    setChangingPassword(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setChangingPassword(false);
    setPasswordModalVisible(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');

    Alert.alert(
      'Password Changed',
      'Your password has been updated successfully.',
      [{ text: 'OK' }]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Account Deleted',
              'Your account has been scheduled for deletion. You will receive a confirmation email.',
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
            <Text style={styles.headerTitle}>Profile</Text>
            <Text style={styles.headerSubtitle}>Manage your account</Text>
          </View>
          <View style={styles.headerRight} />
        </View>
      </Surface>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Avatar.Text
                size={100}
                label={getInitials(fullName)}
                style={styles.avatar}
                labelStyle={styles.avatarLabel}
              />
              <TouchableOpacity style={styles.cameraButton}>
                <Camera size={18} color={COLORS.surface} />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{fullName}</Text>
            <View style={styles.roleContainer}>
              <BadgeCheck size={16} color={COLORS.success} />
              <Text style={styles.roleText}>Site Manager</Text>
            </View>
          </View>

          {/* Profile Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <User size={20} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Profile Information</Text>
            </View>
            <Card style={styles.card} mode="elevated">
              <Card.Content style={styles.cardContent}>
                <TextInput
                  label="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                  mode="outlined"
                  style={styles.input}
                  outlineColor={COLORS.secondary}
                  activeOutlineColor={COLORS.primary}
                  outlineStyle={styles.inputOutline}
                  left={
                    <TextInput.Icon
                      icon={() => <User size={20} color={COLORS.secondary} />}
                    />
                  }
                />

                <TextInput
                  label="Employee ID"
                  value={employeeId}
                  onChangeText={setEmployeeId}
                  mode="outlined"
                  style={styles.input}
                  outlineColor={COLORS.secondary}
                  activeOutlineColor={COLORS.primary}
                  outlineStyle={styles.inputOutline}
                  editable={false}
                  left={
                    <TextInput.Icon
                      icon={() => (
                        <BadgeCheck size={20} color={COLORS.secondary} />
                      )}
                    />
                  }
                />

                <TextInput
                  label="Contact Email"
                  value={contactEmail}
                  onChangeText={setContactEmail}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  outlineColor={COLORS.secondary}
                  activeOutlineColor={COLORS.primary}
                  outlineStyle={styles.inputOutline}
                  left={
                    <TextInput.Icon
                      icon={() => <Mail size={20} color={COLORS.secondary} />}
                    />
                  }
                />

                <Button
                  mode="contained"
                  onPress={handleSaveProfile}
                  loading={saving}
                  disabled={saving}
                  style={styles.saveButton}
                  contentStyle={styles.saveButtonContent}
                  labelStyle={styles.saveButtonLabel}
                  buttonColor={COLORS.primary}
                  icon={() => <Save size={18} color={COLORS.surface} />}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Card.Content>
            </Card>
          </View>

          {/* Security Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Shield size={20} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Security</Text>
            </View>
            <Card style={styles.card} mode="elevated">
              <Card.Content style={styles.securityContent}>
                <View style={styles.securityRow}>
                  <View style={styles.securityLeft}>
                    <Surface style={styles.securityIconSurface} elevation={0}>
                      <Lock size={20} color={COLORS.primary} />
                    </Surface>
                    <View style={styles.securityTextContainer}>
                      <Text style={styles.securityTitle}>Password</Text>
                      <Text style={styles.securitySubtitle}>
                        Last changed 30 days ago
                      </Text>
                    </View>
                  </View>
                  <Button
                    mode="outlined"
                    onPress={() => setPasswordModalVisible(true)}
                    style={styles.changePasswordButton}
                    labelStyle={styles.changePasswordLabel}
                    textColor={COLORS.primary}
                  >
                    Change
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </View>

          {/* Danger Zone Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AlertTriangle size={20} color={COLORS.error} />
              <Text style={[styles.sectionTitle, { color: COLORS.error }]}>
                Danger Zone
              </Text>
            </View>
            <Card
              style={[styles.card, styles.dangerCard]}
              mode="elevated"
            >
              <Card.Content style={styles.dangerContent}>
                <Text style={styles.dangerText}>
                  Once you delete your account, there is no going back. Please
                  be certain.
                </Text>
                <Button
                  mode="outlined"
                  onPress={handleDeleteAccount}
                  style={styles.deleteButton}
                  contentStyle={styles.deleteButtonContent}
                  labelStyle={styles.deleteButtonLabel}
                  textColor={COLORS.error}
                  icon={() => <Trash2 size={18} color={COLORS.error} />}
                >
                  Delete Account
                </Button>
              </Card.Content>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Change Password Modal */}
      <Portal>
        <Modal
          visible={passwordModalVisible}
          onDismiss={() => setPasswordModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <Lock size={24} color={COLORS.primary} />
            <Text style={styles.modalTitle}>Change Password</Text>
          </View>
          <Divider style={styles.modalDivider} />

          <TextInput
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            mode="outlined"
            secureTextEntry={!showCurrentPassword}
            style={styles.modalInput}
            outlineColor={COLORS.secondary}
            activeOutlineColor={COLORS.primary}
            outlineStyle={styles.inputOutline}
            right={
              <TextInput.Icon
                icon={() => (
                  <TouchableOpacity
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={20} color={COLORS.secondary} />
                    ) : (
                      <Eye size={20} color={COLORS.secondary} />
                    )}
                  </TouchableOpacity>
                )}
              />
            }
          />

          <TextInput
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            mode="outlined"
            secureTextEntry={!showNewPassword}
            style={styles.modalInput}
            outlineColor={COLORS.secondary}
            activeOutlineColor={COLORS.primary}
            outlineStyle={styles.inputOutline}
            right={
              <TextInput.Icon
                icon={() => (
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff size={20} color={COLORS.secondary} />
                    ) : (
                      <Eye size={20} color={COLORS.secondary} />
                    )}
                  </TouchableOpacity>
                )}
              />
            }
          />

          <TextInput
            label="Confirm New Password"
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            mode="outlined"
            secureTextEntry={!showNewPassword}
            style={styles.modalInput}
            outlineColor={COLORS.secondary}
            activeOutlineColor={COLORS.primary}
            outlineStyle={styles.inputOutline}
          />

          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setPasswordModalVisible(false)}
              style={styles.modalCancelButton}
              labelStyle={styles.modalCancelLabel}
              textColor={COLORS.secondary}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleChangePassword}
              loading={changingPassword}
              disabled={changingPassword}
              style={styles.modalConfirmButton}
              labelStyle={styles.modalConfirmLabel}
              buttonColor={COLORS.primary}
            >
              {changingPassword ? 'Updating...' : 'Update Password'}
            </Button>
          </View>
        </Modal>
      </Portal>
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
  headerRight: {
    width: 40,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: COLORS.primary,
  },
  avatarLabel: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.success}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  roleText: {
    fontSize: 14,
    color: COLORS.success,
    fontWeight: '500',
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
    padding: 16,
  },
  input: {
    backgroundColor: COLORS.surface,
    marginBottom: 12,
  },
  inputOutline: {
    borderRadius: 12,
  },
  saveButton: {
    marginTop: 8,
    borderRadius: 12,
  },
  saveButtonContent: {
    paddingVertical: 6,
  },
  saveButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  securityContent: {
    padding: 16,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  securityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  securityIconSurface: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  securityTextContainer: {
    marginLeft: 12,
  },
  securityTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.primary,
  },
  securitySubtitle: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 2,
  },
  changePasswordButton: {
    borderRadius: 8,
    borderColor: COLORS.primary,
  },
  changePasswordLabel: {
    fontSize: 13,
  },
  dangerCard: {
    borderWidth: 1,
    borderColor: `${COLORS.error}30`,
  },
  dangerContent: {
    padding: 16,
  },
  dangerText: {
    fontSize: 13,
    color: COLORS.secondary,
    marginBottom: 16,
    lineHeight: 18,
  },
  deleteButton: {
    borderRadius: 12,
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },
  deleteButtonContent: {
    paddingVertical: 6,
  },
  deleteButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  modalDivider: {
    marginBottom: 20,
    backgroundColor: COLORS.background,
  },
  modalInput: {
    backgroundColor: COLORS.surface,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 12,
  },
  modalCancelButton: {
    borderRadius: 8,
    borderColor: COLORS.secondary,
  },
  modalCancelLabel: {
    fontSize: 14,
  },
  modalConfirmButton: {
    borderRadius: 8,
  },
  modalConfirmLabel: {
    fontSize: 14,
  },
});

export default ProfileScreen;
