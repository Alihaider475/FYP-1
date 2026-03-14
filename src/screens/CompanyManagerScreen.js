import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
  Alert,
} from 'react-native';
import { Text } from 'react-native-paper';
import {
  ArrowLeft,
  Building2,
  Plus,
  Copy,
  ToggleLeft,
  ToggleRight,
  Trash2,
  MapPin,
  Hash,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import useCompanyManager from '../hooks/useCompanyManager';

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

const CompanyManagerScreen = ({ navigation, onBack }) => {
  const {
    companies,
    isLoading,
    isCreating,
    fetchCompanies,
    createCompany,
    toggleActive,
    deleteCompany,
  } = useCompanyManager();

  const [siteName, setSiteName] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async () => {
    const success = await createCompany(siteName);
    if (success) {
      setSiteName('');
      setShowForm(false);
    }
  };

  const handleCopyCode = async (code) => {
    try {
      await Clipboard.setStringAsync(code);
      Alert.alert('Copied', `Code "${code}" copied to clipboard.`);
    } catch {
      Alert.alert('Error', 'Failed to copy code.');
    }
  };

  const handleDelete = (company) => {
    Alert.alert(
      'Delete Company',
      `Are you sure you want to delete "${company.site_name || company.company_code}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteCompany(company.id),
        },
      ]
    );
  };

  const activeCount = companies.filter((c) => c.is_active).length;
  const inactiveCount = companies.filter((c) => !c.is_active).length;

  const renderCompanyCard = ({ item }) => (
    <View style={styles.companyCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <View style={[styles.statusDot, { backgroundColor: item.is_active ? COLORS.success : COLORS.error }]} />
          <View>
            <Text style={styles.siteName}>{item.site_name || 'Unnamed Site'}</Text>
            <View style={styles.codeRow}>
              <Hash size={13} color={COLORS.muted} />
              <Text style={styles.codeText}>{item.company_code}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.is_active ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
          <Text style={[styles.statusText, { color: item.is_active ? COLORS.success : COLORS.error }]}>
            {item.is_active ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleCopyCode(item.company_code)}>
          <Copy size={16} color={COLORS.accent} />
          <Text style={[styles.actionText, { color: COLORS.accent }]}>Copy Code</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => toggleActive(item.id, item.is_active)}
        >
          {item.is_active ? (
            <ToggleRight size={16} color={COLORS.success} />
          ) : (
            <ToggleLeft size={16} color={COLORS.muted} />
          )}
          <Text style={[styles.actionText, { color: item.is_active ? COLORS.success : COLORS.muted }]}>
            {item.is_active ? 'Deactivate' : 'Activate'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item)}>
          <Trash2 size={16} color={COLORS.error} />
          <Text style={[styles.actionText, { color: COLORS.error }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.gradient1} />

      {/* Header */}
      <LinearGradient colors={[COLORS.gradient1, COLORS.gradient2]} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack || (() => navigation.goBack())}>
            <ArrowLeft size={22} color={COLORS.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Company Manager</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Building2 size={20} color="#3b82f6" />
            <Text style={styles.statNumber}>{companies.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <MapPin size={20} color="#22c55e" />
            <Text style={styles.statNumber}>{activeCount}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <MapPin size={20} color="#ef4444" />
            <Text style={styles.statNumber}>{inactiveCount}</Text>
            <Text style={styles.statLabel}>Inactive</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        {/* Add New Button / Form */}
        {!showForm ? (
          <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)} activeOpacity={0.8}>
            <Plus size={20} color={COLORS.surface} />
            <Text style={styles.addButtonText}>Add New Site</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Create New Site</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter site name (e.g., Downtown HQ)"
              placeholderTextColor={COLORS.muted}
              value={siteName}
              onChangeText={setSiteName}
              autoFocus
            />
            <Text style={styles.formHint}>A unique company code (SAFE-XXXX) will be auto-generated.</Text>
            <View style={styles.formActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setShowForm(false);
                  setSiteName('');
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.createBtn, isCreating && { opacity: 0.6 }]}
                onPress={handleCreate}
                disabled={isCreating}
              >
                {isCreating ? (
                  <ActivityIndicator size="small" color={COLORS.surface} />
                ) : (
                  <Text style={styles.createText}>Generate & Create</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Company List */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.accent} />
            <Text style={styles.loadingText}>Loading companies...</Text>
          </View>
        ) : companies.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Building2 size={48} color={COLORS.muted} />
            <Text style={styles.emptyTitle}>No Companies Yet</Text>
            <Text style={styles.emptySubtitle}>Tap "Add New Site" to create your first company code.</Text>
          </View>
        ) : (
          <FlatList
            data={companies}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCompanyCard}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={fetchCompanies} colors={[COLORS.accent]} />
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    padding: 16,
    gap: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: COLORS.surface,
    fontSize: 15,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: COLORS.primary,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8,
  },
  formHint: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 16,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  cancelText: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  createBtn: {
    flex: 2,
    padding: 14,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
  },
  createText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  companyCard: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  siteName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  codeText: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  actionText: {
    fontSize: 11,
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

export default CompanyManagerScreen;
