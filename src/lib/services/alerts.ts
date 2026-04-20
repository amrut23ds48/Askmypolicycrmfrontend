import { supabase } from '../supabase';

export interface Alert {
  id: string;
  advisor_id: string | null;
  alert_type: string | null;
  message: string | null;
  created_at: string;
  is_read: boolean;
}

export interface CreateAlertData {
  advisor_id: string;
  alert_type: string;
  message: string;
}

export async function getAlerts(advisorId: string, unreadOnly = false) {
  let query = supabase
    .from('alerts')
    .select('*')
    .eq('advisor_id', advisorId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (unreadOnly) {
    query = query.eq('is_read', false);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Alert[];
}

export async function getUnreadCount(advisorId: string) {
  const { count, error } = await supabase
    .from('alerts')
    .select('id', { count: 'exact', head: true })
    .eq('advisor_id', advisorId)
    .eq('is_read', false);

  if (error) throw error;
  return count || 0;
}

export async function markAsRead(alertId: string) {
  const { error } = await supabase
    .from('alerts')
    .update({ is_read: true })
    .eq('id', alertId);

  if (error) throw error;
}

export async function markAllAsRead(advisorId: string) {
  const { error } = await supabase
    .from('alerts')
    .update({ is_read: true })
    .eq('advisor_id', advisorId)
    .eq('is_read', false);

  if (error) throw error;
}

export async function createAlert(alertData: CreateAlertData) {
  const { data, error } = await supabase
    .from('alerts')
    .insert(alertData)
    .select()
    .single();

  if (error) throw error;
  return data as Alert;
}

export async function deleteAlert(alertId: string) {
  const { error } = await supabase
    .from('alerts')
    .delete()
    .eq('id', alertId);

  if (error) throw error;
}
