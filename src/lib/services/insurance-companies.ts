import { supabase } from '../supabase';

export interface InsuranceCompany {
  id: string;
  company_name: string;
  registration_no: string | null;
  website_url: string | null;
  company_type: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
}

export async function getInsuranceCompanies() {
  const { data, error } = await supabase
    .from('insurance_companies')
    .select('*')
    .order('company_name', { ascending: true });

  if (error) throw error;
  return data as InsuranceCompany[];
}

export async function getInsuranceCompanyById(companyId: string) {
  const { data, error } = await supabase
    .from('insurance_companies')
    .select('*')
    .eq('id', companyId)
    .single();

  if (error) throw error;
  return data as InsuranceCompany;
}
