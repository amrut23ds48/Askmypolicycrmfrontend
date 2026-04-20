import { supabase } from '../supabase';

export interface Policy {
  id: string;
  client_id: string;
  advisor_id: string;
  company_id: string | null;
  policy_type: string | null;
  premium_amount: number | null;
  start_date: string | null;
  end_date: string | null;
  status: string | null;
  policy_number: string | null;
  // Joined fields
  client_name?: string;
  company_name?: string;
}

export interface CreatePolicyData {
  client_id: string;
  advisor_id: string;
  company_id?: string;
  policy_type?: string;
  premium_amount?: number;
  start_date?: string;
  end_date?: string;
  status?: string;
  policy_number?: string;
}

export interface PolicyFilters {
  policy_type?: string;
  status?: string;
  search?: string;
}

export async function getPolicies(advisorId: string, filters?: PolicyFilters) {
  let query = supabase
    .from('policies')
    .select(`
      *,
      clients!policies_client_id_fkey(full_name),
      insurance_companies!policies_company_id_fkey(company_name)
    `)
    .eq('advisor_id', advisorId)
    .order('start_date', { ascending: false });

  if (filters?.policy_type && filters.policy_type !== 'all') {
    query = query.eq('policy_type', filters.policy_type);
  }

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;
  if (error) throw error;

  // Flatten joined data
  return (data || []).map((p: any) => ({
    ...p,
    client_name: p.clients?.full_name || 'Unknown',
    company_name: p.insurance_companies?.company_name || 'Unknown',
  })) as Policy[];
}

export async function getPoliciesByClient(clientId: string) {
  const { data, error } = await supabase
    .from('policies')
    .select(`
      *,
      insurance_companies!policies_company_id_fkey(company_name)
    `)
    .eq('client_id', clientId)
    .order('start_date', { ascending: false });

  if (error) throw error;

  return (data || []).map((p: any) => ({
    ...p,
    company_name: p.insurance_companies?.company_name || 'Unknown',
  })) as Policy[];
}

export async function createPolicy(policyData: CreatePolicyData) {
  const { data, error } = await supabase
    .from('policies')
    .insert(policyData)
    .select()
    .single();

  if (error) throw error;
  return data as Policy;
}

export async function updatePolicy(policyId: string, updates: Partial<CreatePolicyData>) {
  const { data, error } = await supabase
    .from('policies')
    .update(updates)
    .eq('id', policyId)
    .select()
    .single();

  if (error) throw error;
  return data as Policy;
}

export async function deletePolicy(policyId: string) {
  const { error } = await supabase
    .from('policies')
    .delete()
    .eq('id', policyId);

  if (error) throw error;
}

export async function getPolicyStats(advisorId: string) {
  const { data, error } = await supabase
    .from('policies')
    .select('id, status, policy_type')
    .eq('advisor_id', advisorId);

  if (error) throw error;

  const policies = data || [];
  const total = policies.length;
  const active = policies.filter(p => p.status === 'active').length;
  const expired = policies.filter(p => p.status === 'expired').length;

  // Check for expiring soon (end_date within 30 days)
  const now = new Date();
  const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  // We need end_date for this, fetch separately
  const { data: expiringData } = await supabase
    .from('policies')
    .select('id')
    .eq('advisor_id', advisorId)
    .eq('status', 'active')
    .lte('end_date', thirtyDaysLater.toISOString().split('T')[0])
    .gte('end_date', now.toISOString().split('T')[0]);

  const expiringSoon = expiringData?.length || 0;

  // Policy type distribution
  const typeDistribution: Record<string, number> = {};
  policies.forEach(p => {
    const type = p.policy_type || 'Other';
    typeDistribution[type] = (typeDistribution[type] || 0) + 1;
  });

  return { total, active, expired, expiringSoon, typeDistribution };
}
