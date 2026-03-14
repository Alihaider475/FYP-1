import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../auth/supabase';

const generateCompanyCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'SAFE-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export default function useCompanyManager() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const fetchCompanies = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch companies: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const createCompany = async (siteName) => {
    if (!siteName?.trim()) {
      Alert.alert('Validation Error', 'Please enter a site name.');
      return false;
    }

    setIsCreating(true);
    try {
      let companyCode = generateCompanyCode();

      // Ensure uniqueness
      const { data: existing } = await supabase
        .from('companies')
        .select('company_code')
        .eq('company_code', companyCode)
        .single();

      if (existing) {
        companyCode = generateCompanyCode();
      }

      const { error } = await supabase.from('companies').insert({
        company_code: companyCode,
        site_name: siteName.trim(),
        is_active: true,
      });

      if (error) throw error;

      Alert.alert('Success', `Site created!\nCode: ${companyCode}`);
      await fetchCompanies();
      return true;
    } catch (error) {
      Alert.alert('Error', 'Failed to create company: ' + error.message);
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const toggleActive = async (companyId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({ is_active: !currentStatus })
        .eq('id', companyId);

      if (error) throw error;

      setCompanies((prev) =>
        prev.map((c) =>
          c.id === companyId ? { ...c, is_active: !currentStatus } : c
        )
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update status: ' + error.message);
    }
  };

  const deleteCompany = async (companyId) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId);

      if (error) throw error;

      setCompanies((prev) => prev.filter((c) => c.id !== companyId));
      Alert.alert('Deleted', 'Company has been removed.');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete company: ' + error.message);
    }
  };

  return {
    companies,
    isLoading,
    isCreating,
    fetchCompanies,
    createCompany,
    toggleActive,
    deleteCompany,
  };
}
