import { supabase } from './supabaseClient';
import { WorkflowState, WorkflowTransition, User } from '../types';
import { logAuditEvent } from './auditService';

export const WORKFLOW_STATES: Record<string, WorkflowState> = {
  BORRADOR: 'BORRADOR',
  ENVIADO: 'ENVIADO',
  EN_REVISION: 'EN_REVISION',
  PENDIENTE_DOCUMENTACION: 'PENDIENTE_DOCUMENTACION',
  APROBADO: 'APROBADO',
  RECHAZADO: 'RECHAZADO',
  EN_PROCESO: 'EN_PROCESO',
  COMPLETADO: 'COMPLETADO',
  CANCELADO: 'CANCELADO'
};

/**
 * In-memory fallback workflow history if Supabase is offline or table is not created yet
 */
const MEMORY_WORKFLOW_HISTORY: WorkflowTransition[] = [];

/**
 * Record a state transition in workflow history
 */
export const recordWorkflowTransition = async (params: {
  entityId: string;
  entityType: string;
  fromState: WorkflowState | string;
  toState: WorkflowState | string;
  user: User;
  comment?: string;
  attachedDocuments?: string[];
}): Promise<WorkflowTransition> => {
  const transition: WorkflowTransition = {
    id: `wf-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    entity_id: params.entityId,
    entity_type: params.entityType,
    from_state: params.fromState,
    to_state: params.toState,
    user_id: params.user.id,
    user_name: params.user.name || params.user.email,
    user_role: params.user.role,
    comment: params.comment || '',
    attached_documents: params.attachedDocuments || [],
    created_at: new Date().toISOString()
  };

  // Log in Audit Trail as well
  await logAuditEvent({
    user: params.user,
    action: 'STATUS_CHANGE',
    module: params.entityType,
    entityId: params.entityId,
    previousState: params.fromState,
    newState: params.toState,
    details: params.comment || `Transición de estado de ${params.fromState} a ${params.toState}`
  });

  const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(params.user.id);

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('workflow_history')
        .insert([{
          entity_id: String(params.entityId),
          entity_type: params.entityType,
          from_state: String(params.fromState),
          to_state: String(params.toState),
          user_id: isUuid ? params.user.id : null,
          user_name: transition.user_name,
          user_role: transition.user_role,
          comment: transition.comment,
          attached_documents: transition.attached_documents,
          created_at: transition.created_at
        }])
        .select()
        .single();

      if (!error && data) {
        return data as WorkflowTransition;
      }
      if (error) {
        console.warn('workflow_history insert error:', error.message);
      }
    } catch (e) {
      console.warn('workflow_history table unavailable or exception:', e);
    }
  }

  MEMORY_WORKFLOW_HISTORY.push(transition);
  return transition;
};

/**
 * Fetch workflow history for a specific entity
 */
export const getWorkflowHistory = async (entityId: string, entityType?: string): Promise<WorkflowTransition[]> => {
  if (supabase) {
    try {
      let query = supabase.from('workflow_history').select('*').eq('entity_id', entityId);
      if (entityType) {
        query = query.eq('entity_type', entityType);
      }
      const { data, error } = await query.order('created_at', { ascending: false });

      if (!error && data) {
        return data as WorkflowTransition[];
      }
    } catch (e) {
      console.warn('Error fetching workflow history from DB:', e);
    }
  }

  return MEMORY_WORKFLOW_HISTORY.filter(
    t => t.entity_id === entityId && (!entityType || t.entity_type === entityType)
  ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};
