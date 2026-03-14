import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Text } from 'react-native-paper';
import {
  ArrowLeft,
  Settings,
  AlertTriangle,
  DollarSign,
  Save,
  RotateCcw,
  Shield,
  Info,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import useGlobalSettings from '../hooks/useGlobalSettings';

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

const GlobalSettingsScreen = ({ navigation, onBack }) => {
  const { settings, isLoading, isSaving, fetchSettings, updateSettings } = useGlobalSettings();

  const [maxWarnings, setMaxWarnings] = useState('');
  const [penaltyAmount, setPenaltyAmount] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setMaxWarnings(String(settings.max_warnings));
    setPenaltyAmount(String(settings.penalty_amount));
    setHasChanges(false);
  }, [settings]);

  const handleWarningsChange = (val) => {
    setMaxWarnings(val.replace(/[^0-9]/g, ''));
    setHasChanges(true);
  };

  const handlePenaltyChange = (val) => {
    setPenaltyAmount(val.replace(/[^0-9]/g, ''));
    setHasChanges(true);
  };

  const handleSave = async () => {
    await updateSettings({
      max_warnings: maxWarnings,
      penalty_amount: penaltyAmount,
    });
    setHasChanges(false);
  };

  const handleReset = () => {
    setMaxWarnings(String(settings.max_warnings));
    setPenaltyAmount(String(settings.penalty_amount));
    setHasChanges(false);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={{ color: COLORS.muted, marginTop: 12, fontSize: 14 }}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.gradient1} />

      {/* Header */}
      <LinearGradient colors={[COLORS.gradient1, COLORS.gradient2]} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack || (() => navigation.goBack())}>
            <ArrowLeft size={22} color={COLORS.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Global Settings</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.headerInfo}>
          <Shield size={18} color="rgba(255,255,255,0.7)" />
          <Text style={styles.headerSubtitle}>
            Configure project-wide rules that apply to all sites
          </Text>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Max Warnings Card */}
        <View style={styles.settingCard}>
          <View style={styles.cardIcon}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
              <AlertTriangle size={24} color={COLORS.warning} />
            </View>
          </View>
          <Text style={styles.cardTitle}>Maximum Warnings</Text>
          <Text style={styles.cardDescription}>
            Number of warnings before a worker gets suspended or fined.
          </Text>
          <View style={styles.inputRow}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => {
                const val = Math.max(1, parseInt(maxWarnings || '0', 10) - 1);
                setMaxWarnings(String(val));
                setHasChanges(true);
              }}
            >
              <Text style={styles.stepBtnText}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.numberInput}
              value={maxWarnings}
              onChangeText={handleWarningsChange}
              keyboardType="numeric"
              maxLength={2}
            />
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => {
                const val = Math.min(20, parseInt(maxWarnings || '0', 10) + 1);
                setMaxWarnings(String(val));
                setHasChanges(true);
              }}
            >
              <Text style={styles.stepBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rangeHint}>
            <Info size={12} color={COLORS.muted} />
            <Text style={styles.rangeText}>Range: 1 – 20 warnings</Text>
          </View>
        </View>

        {/* Penalty Amount Card */}
        <View style={styles.settingCard}>
          <View style={styles.cardIcon}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
              <DollarSign size={24} color={COLORS.error} />
            </View>
          </View>
          <Text style={styles.cardTitle}>Penalty Amount (PKR)</Text>
          <Text style={styles.cardDescription}>
            Fine amount charged per violation after max warnings exceeded.
          </Text>
          <View style={styles.penaltyInputRow}>
            <Text style={styles.currencyLabel}>PKR</Text>
            <TextInput
              style={styles.penaltyInput}
              value={penaltyAmount}
              onChangeText={handlePenaltyChange}
              keyboardType="numeric"
              maxLength={6}
              placeholder="500"
              placeholderTextColor={COLORS.muted}
            />
          </View>
          <View style={styles.quickAmounts}>
            {[200, 500, 1000, 2000, 5000].map((amt) => (
              <TouchableOpacity
                key={amt}
                style={[
                  styles.quickBtn,
                  penaltyAmount === String(amt) && styles.quickBtnActive,
                ]}
                onPress={() => {
                  setPenaltyAmount(String(amt));
                  setHasChanges(true);
                }}
              >
                <Text
                  style={[
                    styles.quickBtnText,
                    penaltyAmount === String(amt) && styles.quickBtnTextActive,
                  ]}
                >
                  {amt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.rangeHint}>
            <Info size={12} color={COLORS.muted} />
            <Text style={styles.rangeText}>Range: 0 – 100,000 PKR</Text>
          </View>
        </View>

        {/* Current Values Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Current Active Rules</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Max Warnings</Text>
            <Text style={styles.summaryValue}>{settings.max_warnings}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Penalty Amount</Text>
            <Text style={styles.summaryValue}>PKR {settings.penalty_amount}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        {hasChanges && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <RotateCcw size={18} color={COLORS.secondary} />
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, isSaving && { opacity: 0.6 }]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={COLORS.surface} />
              ) : (
                <>
                  <Save size={18} color={COLORS.surface} />
                  <Text style={styles.saveText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
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
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    padding: 12,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  settingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardIcon: {
    marginBottom: 14,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    color: COLORS.secondary,
    lineHeight: 18,
    marginBottom: 18,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 10,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  stepBtnText: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
  },
  numberInput: {
    width: 80,
    height: 50,
    backgroundColor: COLORS.background,
    borderRadius: 14,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  rangeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
  },
  rangeText: {
    fontSize: 11,
    color: COLORS.muted,
  },
  penaltyInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  currencyLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.accent,
    marginRight: 10,
  },
  penaltyInput: {
    flex: 1,
    height: 50,
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  quickBtn: {
    flex: 1,
    minWidth: 50,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quickBtnActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  quickBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  quickBtnTextActive: {
    color: COLORS.surface,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 15,
    color: COLORS.secondary,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  resetBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 14,
    backgroundColor: COLORS.accent,
  },
  saveText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.surface,
  },
};

export default GlobalSettingsScreen;
