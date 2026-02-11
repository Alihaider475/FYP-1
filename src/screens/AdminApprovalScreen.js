import React, { useState, useRef, useEffect } from 'react';
import {View,ScrollView,TouchableOpacity,Animated,Alert,RefreshControl,StatusBar} from 'react-native';
import {Text,Surface,Snackbar} from 'react-native-paper';
import {Shield,UserCheck,Mail,Users,ArrowLeft,ShieldCheck,Clock,CheckCircle,XCircle,Briefcase,
Calendar,UserPlus,AlertTriangle,ChevronRight,RefreshCw,} from 'lucide-react-native';
import { styles, COLORS } from './styles/AdminApprovalScreenStyles';
import {getPendingRequests,removePendingRequest,addToApproved,getApprovedEmails,addRegisteredUser,getRegisteredUsers,
} from './RegisterScreen';

const AdminApprovalScreen = ({ onBack }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [approvedCount, setApprovedCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');

  // Snackbar states
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Load pending requests
  const loadRequests = () => {
    const pending = getPendingRequests();
    const registered = getRegisteredUsers();
    const approved = getApprovedEmails();
    
    setPendingRequests([...pending]);
    setRegisteredUsers([...registered]);
    setApprovedCount(approved.length);
  };

  useEffect(() => {
    loadRequests();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadRequests();
    setTimeout(() => setRefreshing(false), 500);
  };

  // Show snackbar notification
  const showSnackbar = (message, type = 'success') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  // Format date
  const formatDate = () => '2 hours ago';

  // Handle approve request
  const handleApprove = (request) => {
    Alert.alert(
      'Approve User',
      `Grant access to ${request.fullName}?\n\nThey will be able to register and use SafeSite AI.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: () => {
            addToApproved(request.email);
            addRegisteredUser({
              id: request.id,
              fullName: request.fullName,
              email: request.email,
              jobTitle: request.jobTitle,
              status: 'approved',
            });
            removePendingRequest(request.email);
            
            setTimeout(() => {
              loadRequests();
              setActiveTab('allUsers');
              showSnackbar(`${request.fullName} approved successfully!`, 'success');
            }, 100);
          },
        },
      ]
    );
  };

  const handleBack = () => {
    if (onBack) onBack();
  };

  // Get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get avatar color based on name
  const getAvatarColor = (name) => {
    const colors = ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <Surface style={styles.header} elevation={0}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={22} color={COLORS.surface} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <View style={styles.adminBadge}>
              <ShieldCheck size={12} color={COLORS.surface} />
              <Text style={styles.adminBadgeText}>ADMIN</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <RefreshCw size={20} color={COLORS.surface} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>User Management</Text>
        <Text style={styles.headerSubtitle}>Review access requests</Text>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={[styles.statCard, activeTab === 'pending' && styles.statCardActive]}
            onPress={() => setActiveTab('pending')}
          >
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(251, 191, 36, 0.2)' }]}>
              <Clock size={20} color="#fbbf24" />
            </View>
            <Text style={styles.statNumber}>{pendingRequests.length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statCard, activeTab === 'approved' && styles.statCardActive]}
            onPress={() => setActiveTab('approved')}
          >
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(34, 197, 94, 0.2)' }]}>
              <UserCheck size={20} color="#22c55e" />
            </View>
            <Text style={styles.statNumber}>{approvedCount}</Text>
            <Text style={styles.statLabel}>Approved</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statCard, activeTab === 'allUsers' && styles.statCardActive]}
            onPress={() => setActiveTab('allUsers')}
          >
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
              <Users size={20} color="#3b82f6" />
            </View>
            <Text style={styles.statNumber}>{registeredUsers.length}</Text>
            <Text style={styles.statLabel}>All Users</Text>
          </TouchableOpacity>
        </View>
      </Surface>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.accent]}
            tintColor={COLORS.accent}
          />
        }
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* PENDING REQUESTS TAB */}
          {activeTab === 'pending' && (
            <>
              {/* Section Header */}
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Clock size={18} color={COLORS.warning} />
                  <Text style={styles.sectionTitle}>Pending Requests</Text>
                </View>
                {pendingRequests.length > 0 && (
                  <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{pendingRequests.length}</Text>
                  </View>
                )}
              </View>

              {/* Empty State */}
              {pendingRequests.length === 0 ? (
                <View style={styles.emptyState}>
                  <View style={styles.emptyIconContainer}>
                    <CheckCircle size={48} color={COLORS.success} />
                  </View>
                  <Text style={styles.emptyTitle}>No Pending Requests</Text>
                  <Text style={styles.emptySubtitle}>
                    All user registration requests have been processed
                  </Text>
                </View>
              ) : (
                <>
                  {/* Request Cards */}
                  {pendingRequests.map((request, index) => (
                    <View key={request.id} style={styles.requestCard}>
                    {/* Card Header */}
                    <View style={styles.cardHeader}>
                      <View
                        style={[
                          styles.avatar,
                          { backgroundColor: getAvatarColor(request.fullName) },
                        ]}
                      >
                        <Text style={styles.avatarText}>{getInitials(request.fullName)}</Text>
                      </View>
                      <View style={styles.userInfo}>
                        <Text style={styles.userName}>{request.fullName}</Text>
                        <Text style={styles.userEmail}>{request.email}</Text>
                      </View>
                      <View style={styles.timeBadge}>
                        <Clock size={10} color={COLORS.secondary} />
                        <Text style={styles.timeText}>{formatDate(request.requestedAt)}</Text>
                      </View>
                    </View>

                    {/* Card Details */}
                    <View style={styles.cardDetails}>
                      <View style={styles.detailItem}>
                        <View style={styles.detailIcon}>
                          <Briefcase size={14} color={COLORS.accent} />
                        </View>
                        <View>
                          <Text style={styles.detailLabel}>Role</Text>
                          <Text style={styles.detailValue}>{request.jobTitle}</Text>
                        </View>
                      </View>
                      <View style={styles.detailDivider} />
                      <View style={styles.detailItem}>
                        <View style={styles.detailIcon}>
                          <Calendar size={14} color={COLORS.accent} />
                        </View>
                        <View>
                          <Text style={styles.detailLabel}>Requested</Text>
                          <Text style={styles.detailValue}>
                            {new Date(request.requestedAt).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.cardActions}>
                      <TouchableOpacity
                        style={styles.approveButton}
                        onPress={() => handleApprove(request)}
                        activeOpacity={0.7}
                      >
                        <CheckCircle size={18} color={COLORS.surface} />
                        <Text style={styles.approveButtonText}>Approve</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                </>
              )}

              {/* Footer Info */}
              <View style={styles.footerInfo}>
                <Shield size={14} color={COLORS.muted} />
                <Text style={styles.footerText}>
                  Approved users can create accounts in SafeSite AI
                </Text>
              </View>
            </>
          )}

          {/* ALL USERS TAB */}
          {activeTab === 'allUsers' && (
            <>
              {/* Section Header */}
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Users size={18} color={COLORS.accent} />
                  <Text style={styles.sectionTitle}>Registered Users</Text>
                </View>
                {registeredUsers.length > 0 && (
                  <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{registeredUsers.length}</Text>
                  </View>
                )}
              </View>

              {/* Empty State */}
              {registeredUsers.length === 0 ? (
                <View style={styles.emptyState}>
                  <View style={styles.emptyIconContainer}>
                    <UserPlus size={48} color={COLORS.accent} />
                  </View>
                  <Text style={styles.emptyTitle}>No Registered Users</Text>
                  <Text style={styles.emptySubtitle}>
                    Users will appear here when they successfully register
                  </Text>
                </View>
              ) : (
                <>
                  {/* User Cards */}
                  {registeredUsers.map((user, index) => (
                    <View key={user.id || index} style={styles.requestCard}>
                    {/* Card Header */}
                    <View style={styles.cardHeader}>
                      <View
                        style={[
                          styles.avatar,
                          { backgroundColor: getAvatarColor(user.fullName) },
                        ]}
                      >
                        <Text style={styles.avatarText}>{getInitials(user.fullName)}</Text>
                      </View>
                      <View style={styles.userInfo}>
                        <Text style={styles.userName}>{user.fullName}</Text>
                        <Text style={styles.userEmail}>{user.email}</Text>
                      </View>
                      <View style={styles.timeBadge}>
                        <CheckCircle size={10} color={COLORS.success} />
                        <Text style={styles.timeText}>{formatDate(user.registeredAt)}</Text>
                      </View>
                    </View>

                    {/* Card Details */}
                    <View style={styles.cardDetails}>
                      <View style={styles.detailItem}>
                        <View style={styles.detailIcon}>
                          <Briefcase size={14} color={COLORS.accent} />
                        </View>
                        <View>
                          <Text style={styles.detailLabel}>Role</Text>
                          <Text style={styles.detailValue}>{user.jobTitle}</Text>
                        </View>
                      </View>
                      <View style={styles.detailDivider} />
                      <View style={styles.detailItem}>
                        <View style={styles.detailIcon}>
                          <Calendar size={14} color={COLORS.accent} />
                        </View>
                        <View>
                          <Text style={styles.detailLabel}>Registered</Text>
                          <Text style={styles.detailValue}>
                            {new Date(user.registeredAt).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Status Badge */}
                    <View style={styles.statusBadgeContainer}>
                      <View style={[styles.statusBadge, { backgroundColor: 'rgba(34, 197, 94, 0.2)' }]}>
                        <CheckCircle size={14} color={COLORS.success} />
                        <Text style={[styles.statusBadgeText, { color: COLORS.success }]}>Active User</Text>
                      </View>
                    </View>
                  </View>
                ))}
                </>
              )}

              {/* Footer Info */}
              <View style={styles.footerInfo}>
                <UserCheck size={14} color={COLORS.muted} />
                <Text style={styles.footerText}>
                  These users have successfully registered in SafeSite AI
                </Text>
              </View>
            </>
          )}
        </Animated.View>
      </ScrollView>

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={[
          styles.snackbar,
          { backgroundColor: snackbarType === 'success' ? COLORS.success : COLORS.error },
        ]}
      >
        <View style={styles.snackbarContent}>
          {snackbarType === 'success' ? (
            <CheckCircle size={18} color={COLORS.surface} />
          ) : (
            <XCircle size={18} color={COLORS.surface} />
          )}
          <Text style={styles.snackbarText}>{snackbarMessage}</Text>
        </View>
      </Snackbar>
    </View>
  );
};

export default AdminApprovalScreen;
