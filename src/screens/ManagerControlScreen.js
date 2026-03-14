import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { Text } from 'react-native-paper';
import {
  ArrowLeft,
  Users,
  UserCheck,
  UserX,
  ShieldOff,
  ShieldCheck,
  Mail,
  Briefcase,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import useManagerControl from '../hooks/useManagerControl';

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

const ManagerControlScreen = ({ navigation, onBack }) => {
  const {
    managers,
    isLoading,
    activeCount,
    suspendedCount,
    fetchManagers,
    toggleSuspend,
  } = useManagerControl();

  const getInitials = (name) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderManagerCard = ({ item }) => {
    const isSuspended = item.is_suspended;

    return (
      <View style={[styles.managerCard, isSuspended && styles.suspendedCard]}>
        <View style={styles.cardTop}>
          <View style={styles.cardLeft}>
            <View style={[styles.avatar, { backgroundColor: isSuspended ? COLORS.error : COLORS.accent }]}>
              <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
            </View>
            <View style={styles.info}>
              <View style={styles.nameRow}>
                <Text style={styles.name} numberOfLines={1}>{item.name || 'Unnamed'}</Text>
                {isSuspended && (
                  <View style={styles.suspendedBadge}>
                    <ShieldOff size={10} color={COLORS.error} />
                    <Text style={styles.suspendedBadgeText}>SUSPENDED</Text>
                  </View>
                )}
              </View>
              <View style={styles.detailRow}>
                <Mail size={12} color={COLORS.muted} />
                <Text style={styles.detailText} numberOfLines={1}>{item.email}</Text>
              </View>
              {item.designation && (
                <View style={styles.detailRow}>
                  <Briefcase size={12} color={COLORS.muted} />
                  <Text style={styles.detailText}>{item.designation}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, isSuspended ? styles.reactivateBtn : styles.suspendBtn]}
          onPress={() => toggleSuspend(item.id, item.is_suspended)}
          activeOpacity={0.7}
        >
          {isSuspended ? (
            <>
              <ShieldCheck size={16} color={COLORS.success} />
              <Text style={[styles.actionText, { color: COLORS.success }]}>Reactivate</Text>
            </>
          ) : (
            <>
              <ShieldOff size={16} color={COLORS.error} />
              <Text style={[styles.actionText, { color: COLORS.error }]}>Suspend</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.gradient1} />

      {/* Header */}
      <LinearGradient colors={[COLORS.gradient1, COLORS.gradient2]} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack || (() => navigation.goBack())}>
            <ArrowLeft size={22} color={COLORS.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manager Control</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Users size={20} color="#3b82f6" />
            <Text style={styles.statNumber}>{managers.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <UserCheck size={20} color="#22c55e" />
            <Text style={styles.statNumber}>{activeCount}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <UserX size={20} color="#ef4444" />
            <Text style={styles.statNumber}>{suspendedCount}</Text>
            <Text style={styles.statLabel}>Suspended</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.accent} />
            <Text style={styles.loadingText}>Loading managers...</Text>
          </View>
        ) : managers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Users size={48} color={COLORS.muted} />
            <Text style={styles.emptyTitle}>No Managers Found</Text>
            <Text style={styles.emptySubtitle}>No users with the manager role exist yet.</Text>
          </View>
        ) : (
          <FlatList
            data={managers}
            keyExtractor={(item) => item.id}
            renderItem={renderManagerCard}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={fetchManagers} colors={[COLORS.accent]} />
            }
          />
        )}
      </View>
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
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.surface,
    fontSize: 18,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    color: COLORS.surface,
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  managerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  suspendedCard: {
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    backgroundColor: 'rgba(239, 68, 68, 0.02)',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
    flexShrink: 1,
  },
  suspendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  suspendedBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.error,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  detailText: {
    fontSize: 12,
    color: COLORS.muted,
    flex: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  suspendBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.06)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  reactivateBtn: {
    backgroundColor: 'rgba(34, 197, 94, 0.06)',
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: COLORS.muted,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
};

export default ManagerControlScreen;
