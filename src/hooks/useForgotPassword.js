import { useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../auth/supabase';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = email input, 2 = OTP + new password

  const sendResetEmail = async (email) => {
    const trimmed = email?.trim().toLowerCase();
    if (!trimmed || !EMAIL_REGEX.test(trimmed)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return false;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(trimmed);
      if (error) throw error;

      Alert.alert('Code Sent', 'Check your email for an 8-digit OTP code.');
      setStep(2);
      return true;
    } catch (error) {
      const msg = error.message || 'Something went wrong.';
      if (msg.toLowerCase().includes('rate') || msg.toLowerCase().includes('limit')) {
        Alert.alert('Too Many Attempts', 'Please wait a few minutes before trying again.');
      } else {
        Alert.alert('Error', msg);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (email, otp, newPassword) => {
    const trimmed = email?.trim().toLowerCase();
    if (!trimmed || !otp || !newPassword) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return false;
    }

    if (newPassword.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return false;
    }

    setIsLoading(true);
    try {
      const { error: otpError } = await supabase.auth.verifyOtp({
        email: trimmed,
        token: otp,
        type: 'recovery',
      });
      if (otpError) throw otpError;

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) throw updateError;

      await supabase.auth.signOut();

      Alert.alert('Success', 'Password updated successfully.');
      return true;
    } catch (error) {
      const msg = error.message || 'Something went wrong.';
      if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('expired')) {
        Alert.alert('Invalid OTP', 'The code is invalid or has expired. Please request a new one.');
      } else {
        Alert.alert('Error', msg);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, step, sendResetEmail, updatePassword };
};
