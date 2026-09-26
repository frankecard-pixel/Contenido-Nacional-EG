import { supabase } from './supabaseClient';
import { User, AuditActionType } from '../types';

export interface AuditLogEntry {
  id: string;
  user_id: string;
  user_name: string;
  user_role: string;
  action: AuditActionType | string;
  module: string;
  entity_id?: string;
  previous_state?: string;
  new_state?: string;
  details?: string;
  timestamp: string;
}

const MEMORY_AUDIT_LOGS: AuditLogEntry[] = [];

/**
 * Log a structured audit event
 */
export const logAuditEvent = async (params: {
  user: User | null;
  action: AuditActionType | string;
  module: string;
  entityId?: string;
  previousState?: string;
  newState?: string;
  details?: string;
}): Promise<AuditLogEntry> => {
  const entry: AuditLogEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    user_id: params.user?.id || 'system',
    user_name: params.user?.name || params.user?.email || 'Sistema / Invitado',
    user_role: params.user?.role || 'externo',
    action: params.action,
    module: params.module,
    entity_id: params.entityId || '',
    previous_state: params.previousState || '',
    new_state: params.newState || '',
    details: params.details || '',
    timestamp: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { error } = await supabase.from('audit_logs').insert([{
        user_id: entry.user_id !== 'system' ? entry.user_id : null,
        user_name: entry.user_name,
        user_role: entry.user_role,
        action: entry.action,
        entity_id: entry.entity_id,
        status: 'success',
        timestamp: entry.timestamp
      }]);

      if (error) {
        console.warn('Supabase audit_logs insert warning:', error.message);
      }
    } catch (e) {
      console.warn('Database audit logger fallback:', e);
    }
  }

  MEMORY_AUDIT_LOGS.unshift(entry);
  return entry;
};

/**
 * Retrieve audit logs filtered by module, entity or user
 */
export const getAuditLogs = async (options?: {
  module?: string;
  entityId?: string;
  userId?: string;
  limit?: number;
}): Promise<AuditLogEntry[]> => {
  const limit = options?.limit || 50;

  if (supabase) {
    try {
      let query = supabase.from('audit_logs').select('*');
      if (options?.entityId) {
        query = query.eq('entity_id', options.entityId);
      }
      if (options?.userId) {
        query = query.eq('user_id', options.userId);
      }
      const { data, error } = await query.order('timestamp', { ascending: false }).limit(limit);

      if (!error && data) {
        return data.map(item => ({
          id: item.id,
          user_id: item.user_id || 'system',
          user_name: item.user_name || 'Desconocido',
          user_role: item.user_role || 'externo',
          action: item.action || 'ACTION',
          module: options?.module || 'system',
          entity_id: item.entity_id || '',
          timestamp: item.timestamp || new Date().toISOString()
        }));
      }
    } catch (e) {
      console.warn('Error querying audit logs from DB:', e);
    }
  }

  let filtered = [...MEMORY_AUDIT_LOGS];
  if (options?.module) filtered = filtered.filter(l => l.module === options.module);
  if (options?.entityId) filtered = filtered.filter(l => l.entity_id === options.entityId);
  if (options?.userId) filtered = filtered.filter(l => l.user_id === options.userId);

  return filtered.slice(0, limit);
};
