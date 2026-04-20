import { supabase } from '../supabase';

export interface Task {
  id: string;
  advisor_id: string | null;
  client_id: string | null;
  title: string | null;
  description: string | null;
  priority: string | null;
  status: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  client_name?: string;
}

export interface CreateTaskData {
  advisor_id: string;
  client_id?: string;
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  due_date?: string;
}

export interface TaskFilters {
  priority?: string;
  status?: string;
  search?: string;
}

export async function getTasks(advisorId: string, filters?: TaskFilters) {
  let query = supabase
    .from('tasks')
    .select(`
      *,
      clients!tasks_client_id_fkey(full_name)
    `)
    .eq('advisor_id', advisorId)
    .order('due_date', { ascending: true });

  if (filters?.priority && filters.priority !== 'all') {
    query = query.eq('priority', filters.priority);
  }

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map((t: any) => ({
    ...t,
    client_name: t.clients?.full_name || null,
  })) as Task[];
}

export async function createTask(taskData: CreateTaskData) {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      ...taskData,
      status: taskData.status || 'pending',
      priority: taskData.priority || 'medium',
    })
    .select()
    .single();

  if (error) throw error;
  return data as Task;
}

export async function updateTask(taskId: string, updates: Partial<CreateTaskData>) {
  const { data, error } = await supabase
    .from('tasks')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', taskId)
    .select()
    .single();

  if (error) throw error;
  return data as Task;
}

export async function deleteTask(taskId: string) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) throw error;
}

export async function toggleTaskStatus(taskId: string, currentStatus: string) {
  const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
  return updateTask(taskId, { status: newStatus });
}

export async function getTaskStats(advisorId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('id, status, due_date, priority')
    .eq('advisor_id', advisorId);

  if (error) throw error;

  const tasks = data || [];
  const total = tasks.length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const overdue = tasks.filter(t => {
    if (t.status === 'completed') return false;
    return t.due_date && new Date(t.due_date) < new Date();
  }).length;

  return { total, pending, inProgress, completed, overdue };
}
