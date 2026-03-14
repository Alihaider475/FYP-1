import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../auth/supabase';

export default function useManagerControl() {
  const [managers, setManagers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchManagers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, name, role, designation, is_suspended')
        .eq('role', 'manager');

      if (error) throw error;
      setManagers(data || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch managers: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchManagers();
  }, [fetchManagers]);

  const toggleSuspend = async (managerId, currentStatus) => {
    const action = currentStatus ? 'reactivate' : 'suspend';

    return new Promise((resolve) => {
      Alert.alert(
        currentStatus ? 'Reactivate Manager' : 'Suspend Manager',
        currentStatus
          ? 'This manager will regain access to the app.'
          : 'This manager will be immediately signed out and blocked from the app.',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
          {
            text: currentStatus ? 'Reactivate' : 'Suspend',
            style: currentStatus ? 'default' : 'destructive',
            onPress: async () => {
              try {
                const { error } = await supabase
                  .from('profiles')
                  .update({ is_suspended: !currentStatus })
                  .eq('id', managerId);

                if (error) throw error;

                setManagers((prev) =>
                  prev.map((m) =>
                    m.id === managerId ? { ...m, is_suspended: !currentStatus } : m
                  )
                );

                Alert.alert(
                  'Success',
                  `Manager has been ${!currentStatus ? 'suspended' : 'reactivated'}.`
                );
                resolve(true);
              } catch (error) {
                Alert.alert('Error', 'Failed to update manager: ' + error.message);
                resolve(false);
              }
            },
          },
        ]
      );
    });
  };

  const activeCount = managers.filter((m) => !m.is_suspended).length;
  const suspendedCount = managers.filter((m) => m.is_suspended).length;

  return {
    managers,
    isLoading,
    activeCount,
    suspendedCount,
    fetchManagers,
    toggleSuspend,
  };
}
