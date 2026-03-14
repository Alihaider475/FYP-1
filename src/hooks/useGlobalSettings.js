import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../auth/supabase';

export default function useGlobalSettings() {
  const [settings, setSettings] = useState({ max_warnings: 3, penalty_amount: 500 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) throw error;

      if (data) {
        setSettings({
          max_warnings: data.max_warnings ?? 3,
          penalty_amount: data.penalty_amount ?? 500,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load settings: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (newSettings) => {
    const maxWarnings = parseInt(newSettings.max_warnings, 10);
    const penaltyAmount = parseInt(newSettings.penalty_amount, 10);

    if (isNaN(maxWarnings) || maxWarnings < 1 || maxWarnings > 20) {
      Alert.alert('Validation Error', 'Max warnings must be between 1 and 20.');
      return false;
    }

    if (isNaN(penaltyAmount) || penaltyAmount < 0 || penaltyAmount > 100000) {
      Alert.alert('Validation Error', 'Penalty amount must be between 0 and 100,000.');
      return false;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('project_settings')
        .update({
          max_warnings: maxWarnings,
          penalty_amount: penaltyAmount,
        })
        .eq('id', 1);

      if (error) throw error;

      setSettings({ max_warnings: maxWarnings, penalty_amount: penaltyAmount });
      Alert.alert('Success', 'Settings updated successfully.');
      return true;
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings: ' + error.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    settings,
    isLoading,
    isSaving,
    fetchSettings,
    updateSettings,
  };
}
