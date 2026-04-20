import { supabase } from '../supabase';

export interface Client {
  id: string;
  advisor_id: string;
  full_name: string;
  email: string | null;
  mobile_number: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
  occupation: string | null;
  dob: string | null;
  created_at: string;
  status: string;
  note: string | null;
  last_interaction: string | null;
  risk_profile: string | null;
}

export interface CreateClientData {
  advisor_id: string;
  full_name: string;
  email?: string;
  mobile_number?: string;
  city?: string;
  state?: string;
  address?: string;
  occupation?: string;
  dob?: string;
  status?: string;
  note?: string;
  risk_profile?: string;
}

export interface ClientFilters {
  status?: string;
  risk_profile?: string;
  search?: string;
}

export async function getClients(advisorId: string, filters?: ClientFilters) {
  let query = supabase
    .from('clients')
    .select('*')
    .eq('advisor_id', advisorId)
    .order('created_at', { ascending: false });

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  if (filters?.risk_profile && filters.risk_profile !== 'all') {
    query = query.eq('risk_profile', filters.risk_profile);
  }

  if (filters?.search) {
    query = query.or(
      `full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,mobile_number.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Client[];
}

export async function getClientById(clientId: string) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .single();

  if (error) throw error;
  return data as Client;
}

export async function createClient(clientData: CreateClientData) {
  const { data, error } = await supabase
    .from('clients')
    .insert(clientData)
    .select()
    .single();

  if (error) throw error;
  return data as Client;
}

export async function updateClient(clientId: string, updates: Partial<CreateClientData>) {
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', clientId)
    .select()
    .single();

  if (error) throw error;
  return data as Client;
}

export async function deleteClient(clientId: string) {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', clientId);

  if (error) throw error;
}

export async function getClientStats(advisorId: string) {
  const { data: allClients, error } = await supabase
    .from('clients')
    .select('id, status, risk_profile')
    .eq('advisor_id', advisorId);

  if (error) throw error;

  const total = allClients?.length || 0;
  const active = allClients?.filter(c => c.status === 'active').length || 0;
  const inactive = allClients?.filter(c => c.status === 'inactive').length || 0;
  const highRisk = allClients?.filter(c => c.risk_profile === 'high').length || 0;

  return { total, active, inactive, highRisk };
}
