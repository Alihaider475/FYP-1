import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../auth/supabase';

export const useWorkerSignup = (navigation) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const checkIfBlocked = async () => {
      const blocked = await AsyncStorage.getItem('signup_blocked');
      if (blocked === 'true') setIsBlocked(true);
    };
    checkIfBlocked();
  }, []);

  const handleSignup = async ({ name, email, password, designation, company_code }) => {
    if (isBlocked) {
      Alert.alert('Unauthorized Access', 'Device Blocked.');
      return;
    }

    setIsLoading(true);

    try {
      const { data: companies, error: companyError } = await supabase
        .from('companies')
        .select('id')
        .eq('company_code', company_code)
        .limit(1);

      if (companyError) throw companyError;

      if (companies.length === 0) {
        const attemptsStr = await AsyncStorage.getItem('signup_attempts');
        const attempts = parseInt(attemptsStr ?? '0', 10);
        const newAttempts = attempts + 1;

        if (newAttempts >= 3) {
          await AsyncStorage.setItem('signup_attempts', '3');
          await AsyncStorage.setItem('signup_blocked', 'true');
          setIsBlocked(true);
          Alert.alert('Unauthorized Access', 'Device Blocked.');
        } else {
          await AsyncStorage.setItem('signup_attempts', String(newAttempts));
          Alert.alert('Invalid Code', `Attempts remaining: ${3 - newAttempts}`);
        }
        return;
      }

      await AsyncStorage.setItem('signup_attempts', '0');

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role: 'worker', designation },
        },
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error('Signup succeeded but no user returned.');

      // Sign out immediately so the auto-login from onAuthStateChange
      // doesn't push the user straight to Dashboard. They must log in manually.
      await supabase.auth.signOut();

      Alert.alert('Success', 'Account created. Please log in.');
      navigation.replace('Login');
    } catch (error) {
      const msg = error.message || '';
      if (msg.toLowerCase().includes('rate') || msg.toLowerCase().includes('limit')) {
        Alert.alert('Too Many Attempts', 'Please wait a few minutes before trying again.');
      } else if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already been registered')) {
        Alert.alert('Signup Failed', 'This email is already registered. Please log in instead.');
      } else {
        Alert.alert('Signup Failed', msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignup, isLoading, isBlocked };
};
