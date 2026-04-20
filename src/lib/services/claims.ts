import { supabase } from '../supabase';

export interface Claim {
  id: string;
  policy_id: string | null;
  client_id: string | null;
  advisor_id: string | null;
  claim_amount: number | null;
  status: string | null;
  submitted_at: string | null;
  note: string | null;
  // Joined fields
  client_name?: string;
  policy_number?: string;
  policy_type?: string;
}

export interface CreateClaimData {
  policy_id: string;
  client_id: string;
  advisor_id: string;
  claim_amount?: number;
  status?: string;
  submitted_at?: string;
  note?: string;
}

export interface ClaimFilters {
  status?: string;
  search?: string;
}

export async function getClaims(advisorId: string, filters?: ClaimFilters) {
  let query = supabase
    .from('claims')
    .select(`
      *,
      clients!claims_client_id_fkey(full_name),
      policies!claims_policy_id_fkey(policy_number, policy_type)
    `)
    .eq('advisor_id', advisorId)
    .order('submitted_at', { ascending: false });

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map((c: any) => ({
    ...c,
    client_name: c.clients?.full_name || 'Unknown',
    policy_number: c.policies?.policy_number || 'N/A',
    policy_type: c.policies?.policy_type || 'N/A',
  })) as Claim[];
}

export async function getClaimsByClient(clientId: string) {
  const { data, error } = await supabase
    .from('claims')
    .select(`
      *,
      policies!claims_policy_id_fkey(policy_number, policy_type)
    `)
    .eq('client_id', clientId)
    .order('submitted_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((c: any) => ({
    ...c,
    policy_number: c.policies?.policy_number || 'N/A',
    policy_type: c.policies?.policy_type || 'N/A',
  })) as Claim[];
}

export async function createClaim(claimData: CreateClaimData) {
  const { data, error } = await supabase
    .from('claims')
    .insert({
      ...claimData,
      submitted_at: claimData.submitted_at || new Date().toISOString(),
      status: claimData.status || 'submitted',
    })
    .select()
    .single();

  if (error) throw error;
  return data as Claim;
}

export async function updateClaim(claimId: string, updates: Partial<CreateClaimData>) {
  const { data, error } = await supabase
    .from('claims')
    .update(updates)
    .eq('id', claimId)
    .select()
    .single();

  if (error) throw error;
  return data as Claim;
}

export async function getClaimStats(advisorId: string) {
  const { data, error } = await supabase
    .from('claims')
    .select('id, status')
    .eq('advisor_id', advisorId);

  if (error) throw error;

  const claims = data || [];
  const total = claims.length;
  const submitted = claims.filter(c => c.status === 'submitted').length;
  const inReview = claims.filter(c => c.status === 'in_review' || c.status === 'under_review').length;
  const pending = claims.filter(c => c.status === 'pending' || c.status === 'pending_documents').length;
  const approved = claims.filter(c => c.status === 'approved' || c.status === 'completed').length;
  const rejected = claims.filter(c => c.status === 'rejected').length;

  return { total, submitted, inReview, pending, approved, rejected };
}
