import { supabase } from '../supabase';

export interface DashboardKPIs {
  totalClients: number;
  activePolicies: number;
  expiringSoon: number;
  claimsInProgress: number;
  totalTasks: number;
  pendingTasks: number;
}

export interface PolicyDistribution {
  type: string;
  count: number;
}

export interface ClaimsStatusData {
  status: string;
  count: number;
}

export interface RecentActivity {
  id: string;
  action: string;
  entity_type: string;
  entity_name: string;
  time: string;
}

export async function getDashboardKPIs(advisorId: string): Promise<DashboardKPIs> {
  // Fetch all counts in parallel
  const [clientsRes, policiesRes, claimsRes, tasksRes] = await Promise.all([
    supabase
      .from('clients')
      .select('id', { count: 'exact', head: true })
      .eq('advisor_id', advisorId),
    supabase
      .from('policies')
      .select('id, status, end_date')
      .eq('advisor_id', advisorId),
    supabase
      .from('claims')
      .select('id, status')
      .eq('advisor_id', advisorId),
    supabase
      .from('tasks')
      .select('id, status')
      .eq('advisor_id', advisorId),
  ]);

  const totalClients = clientsRes.count || 0;

  const policies = policiesRes.data || [];
  const activePolicies = policies.filter(p => p.status === 'active').length;

  // Expiring soon: active policies with end_date within 30 days
  const now = new Date();
  const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const expiringSoon = policies.filter(p => {
    if (p.status !== 'active' || !p.end_date) return false;
    const endDate = new Date(p.end_date);
    return endDate >= now && endDate <= thirtyDaysLater;
  }).length;

  const claims = claimsRes.data || [];
  const claimsInProgress = claims.filter(c =>
    c.status && !['approved', 'completed', 'rejected'].includes(c.status)
  ).length;

  const tasks = tasksRes.data || [];
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(t => t.status !== 'completed').length;

  return { totalClients, activePolicies, expiringSoon, claimsInProgress, totalTasks, pendingTasks };
}

export async function getPolicyDistribution(advisorId: string): Promise<PolicyDistribution[]> {
  const { data, error } = await supabase
    .from('policies')
    .select('policy_type')
    .eq('advisor_id', advisorId);

  if (error) throw error;

  const distribution: Record<string, number> = {};
  (data || []).forEach((p: any) => {
    const type = p.policy_type || 'Other';
    distribution[type] = (distribution[type] || 0) + 1;
  });

  return Object.entries(distribution).map(([type, count]) => ({ type, count }));
}

export async function getClaimsStatusDistribution(advisorId: string): Promise<ClaimsStatusData[]> {
  const { data, error } = await supabase
    .from('claims')
    .select('status')
    .eq('advisor_id', advisorId);

  if (error) throw error;

  const statusMap: Record<string, number> = {};
  (data || []).forEach((c: any) => {
    const status = c.status || 'unknown';
    statusMap[status] = (statusMap[status] || 0) + 1;
  });

  return Object.entries(statusMap).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' '),
    count,
  }));
}

export async function getRecentActivities(advisorId: string): Promise<RecentActivity[]> {
  // Get recent alerts as activity feed
  const { data: alerts } = await supabase
    .from('alerts')
    .select('id, alert_type, message, created_at')
    .eq('advisor_id', advisorId)
    .order('created_at', { ascending: false })
    .limit(5);

  // Get recently added clients
  const { data: recentClients } = await supabase
    .from('clients')
    .select('id, full_name, created_at')
    .eq('advisor_id', advisorId)
    .order('created_at', { ascending: false })
    .limit(3);

  const activities: RecentActivity[] = [];

  (alerts || []).forEach(a => {
    activities.push({
      id: a.id,
      action: a.message || 'Alert',
      entity_type: a.alert_type || 'alert',
      entity_name: '',
      time: a.created_at,
    });
  });

  (recentClients || []).forEach(c => {
    activities.push({
      id: c.id,
      action: 'New client added',
      entity_type: 'client',
      entity_name: c.full_name,
      time: c.created_at,
    });
  });

  // Sort by time, most recent first
  activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  return activities.slice(0, 8);
}
