import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  TextInput,
  Text,
  Card,
  IconButton,
  Snackbar,
  Divider,
  Badge,
} from 'react-native-paper';
import {
  Shield,
  UserPlus,
  Trash2,
  Mail,
  Users,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  Search,
} from 'lucide-react-native';
import { styles, COLORS } from './styles/WhitelistManagerScreenStyles';

// Initial authorized emails (simulated database)
const INITIAL_AUTHORIZED_EMAILS = [
  'manager1@site.com',
  'manager2@site.com',
  'admin@site.com',
  'supervisor@site.com',
  'safety.officer@site.com',
];

const WhitelistManagerScreen = ({ onBack }) => {
  const [authorizedEmails, setAuthorizedEmails] = useState(INITIAL_AUTHORIZED_EMAILS);
  const [newEmail, setNewEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [emailError, setEmailError] = useState('');

  // Snackbar states
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Show snackbar notification
  const showSnackbar = (message, type = 'success') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  // Add new email to the whitelist
  const handleAddEmail = () => {
    const trimmedEmail = newEmail.toLowerCase().trim();

    // Validate empty
    if (!trimmedEmail) {
      setEmailError('Please enter an email address');
      return;
    }

    // Validate format
    if (!validateEmail(trimmedEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Check for duplicates
    if (authorizedEmails.some((email) => email.toLowerCase() === trimmedEmail)) {
      setEmailError('This email is already in the whitelist');
      showSnackbar('Email already exists in the whitelist', 'error');
      return;
    }

    // Add email
    setAuthorizedEmails((prev) => [trimmedEmail, ...prev]);
    setNewEmail('');
    setEmailError('');
    showSnackbar(`${trimmedEmail} has been authorized`, 'success');
  };

  // Delete email from whitelist
  const handleDeleteEmail = (emailToDelete) => {
    Alert.alert(
      'Revoke Access',
      `Are you sure you want to remove "${emailToDelete}" from the authorized list? This user will no longer be able to register.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setAuthorizedEmails((prev) =>
              prev.filter((email) => email.toLowerCase() !== emailToDelete.toLowerCase())
            );
            showSnackbar(`${emailToDelete} access has been revoked`, 'success');
          },
        },
      ]
    );
  };

  // Filter emails based on search query
  const filteredEmails = authorizedEmails.filter((email) =>
    email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle back navigation
  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Design */}
      <View style={styles.backgroundTop}>
        <View style={styles.circleOne} />
        <View style={styles.circleTwo} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <ArrowLeft size={22} color={COLORS.surface} />
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <ShieldCheck size={32} color={COLORS.accent} strokeWidth={2} />
              </View>
              <Text style={styles.welcomeText}>Whitelist Manager</Text>
              <Text style={styles.subtitleText}>
                Manage authorized user registrations
              </Text>
            </View>

            {/* Stats Card */}
            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <Users size={24} color={COLORS.accent} />
                <Text style={styles.statNumber}>{authorizedEmails.length}</Text>
                <Text style={styles.statLabel}>Authorized Users</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Shield size={24} color={COLORS.success} />
                <Text style={[styles.statNumber, { color: COLORS.success }]}>Active</Text>
                <Text style={styles.statLabel}>Protection Status</Text>
              </View>
            </View>

            {/* Add Email Card */}
            <Card style={styles.addEmailCard}>
              <Card.Content>
                <View style={styles.addEmailHeader}>
                  <UserPlus size={20} color={COLORS.primary} />
                  <Text style={styles.addEmailTitle}>Add New Authorized Email</Text>
                </View>

                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <Mail size={20} color={emailError ? COLORS.error : COLORS.secondary} />
                  </View>
                  <TextInput
                    value={newEmail}
                    onChangeText={(text) => {
                      setNewEmail(text);
                      setEmailError('');
                    }}
                    mode="flat"
                    placeholder="Enter email address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.input}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    textColor={COLORS.primary}
                    placeholderTextColor={COLORS.secondary}
                    error={!!emailError}
                  />
                </View>
                {emailError ? (
                  <View style={styles.errorContainer}>
                    <AlertCircle size={14} color={COLORS.error} />
                    <Text style={styles.errorText}>{emailError}</Text>
                  </View>
                ) : null}

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddEmail}
                  activeOpacity={0.8}
                >
                  <UserPlus size={18} color={COLORS.surface} />
                  <Text style={styles.addButtonText}>Add to Whitelist</Text>
                </TouchableOpacity>
              </Card.Content>
            </Card>

            {/* Search & Email List Card */}
            <Card style={styles.listCard}>
              <Card.Content>
                <View style={styles.listHeader}>
                  <View style={styles.listTitleRow}>
                    <Users size={20} color={COLORS.primary} />
                    <Text style={styles.listTitle}>Authorized Emails</Text>
                    <Badge style={styles.countBadge}>{authorizedEmails.length}</Badge>
                  </View>
                </View>

                {/* Search Input */}
                <View style={styles.searchWrapper}>
                  <View style={styles.searchIcon}>
                    <Search size={18} color={COLORS.secondary} />
                  </View>
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    mode="flat"
                    placeholder="Search emails..."
                    style={styles.searchInput}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    textColor={COLORS.primary}
                    placeholderTextColor={COLORS.secondary}
                  />
                </View>

                <Divider style={styles.divider} />

                {/* Email List */}
                {filteredEmails.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Mail size={40} color={COLORS.muted} />
                    <Text style={styles.emptyStateText}>
                      {searchQuery ? 'No emails match your search' : 'No authorized emails yet'}
                    </Text>
                  </View>
                ) : (
                  filteredEmails.map((email, index) => (
                    <View key={email}>
                      <View style={styles.emailItem}>
                        <View style={styles.emailInfo}>
                          <View style={styles.emailIconContainer}>
                            <Mail size={16} color={COLORS.accent} />
                          </View>
                          <View style={styles.emailTextContainer}>
                            <Text style={styles.emailText}>{email}</Text>
                            <Text style={styles.emailStatus}>Authorized</Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeleteEmail(email)}
                          activeOpacity={0.7}
                        >
                          <Trash2 size={18} color={COLORS.error} />
                        </TouchableOpacity>
                      </View>
                      {index < filteredEmails.length - 1 && (
                        <Divider style={styles.emailDivider} />
                      )}
                    </View>
                  ))
                )}
              </Card.Content>
            </Card>

            {/* Info Footer */}
            <View style={styles.footer}>
              <Shield size={16} color={COLORS.secondary} />
              <Text style={styles.footerText}>
                Only whitelisted emails can register for SafeSite AI
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{
          backgroundColor: snackbarType === 'success' ? COLORS.success : COLORS.error,
          marginBottom: 20,
          marginHorizontal: 16,
          borderRadius: 12,
        }}
        action={{
          label: 'Dismiss',
          textColor: COLORS.surface,
          onPress: () => setSnackbarVisible(false),
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {snackbarType === 'success' ? (
            <CheckCircle size={18} color={COLORS.surface} />
          ) : (
            <AlertCircle size={18} color={COLORS.surface} />
          )}
          <Text style={{ color: COLORS.surface, flex: 1, fontSize: 13 }}>
            {snackbarMessage}
          </Text>
        </View>
      </Snackbar>
    </View>
  );
};

export default WhitelistManagerScreen;
