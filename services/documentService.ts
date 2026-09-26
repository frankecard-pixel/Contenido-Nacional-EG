import { supabase } from './supabaseClient';
import { User } from '../types';
import { logAuditEvent } from './auditService';

export interface GenericDocument {
  id: string;
  entity_id: string;
  entity_type: string;
  name: string;
  category: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'expired';
  upload_date: string;
  expiry_date?: string;
  size?: string;
  format?: string;
  feedback?: string;
  file_url: string;
  version?: number;
  uploaded_by?: string;
  uploaded_by_name?: string;
}

const MEMORY_DOCUMENTS: GenericDocument[] = [];

/**
 * Upload or register a document associated with any entity
 */
export const registerDocument = async (params: {
  entityId: string;
  entityType: string;
  name: string;
  category: string;
  fileUrl: string;
  user: User;
  format?: string;
  size?: string;
  expiryDate?: string;
}): Promise<GenericDocument> => {
  const doc: GenericDocument = {
    id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    entity_id: params.entityId,
    entity_type: params.entityType,
    name: params.name,
    category: params.category,
    status: 'pending',
    upload_date: new Date().toISOString(),
    expiry_date: params.expiryDate,
    size: params.size || '1.2 MB',
    format: params.format || 'pdf',
    file_url: params.fileUrl,
    version: 1,
    uploaded_by: params.user.id,
    uploaded_by_name: params.user.name || params.user.email
  };

  await logAuditEvent({
    user: params.user,
    action: 'UPLOAD',
    module: 'documents',
    entityId: doc.id,
    details: `Documento '${params.name}' subido para ${params.entityType} (ID: ${params.entityId})`
  });

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert([{
          entity_id: params.entityId,
          entity_type: params.entityType,
          name: params.name,
          category: params.category,
          status: 'pending',
          file_url: params.fileUrl,
          size: doc.size,
          format: doc.format,
          upload_date: doc.upload_date,
          expiry_date: doc.expiry_date
        }])
        .select()
        .single();

      if (!error && data) {
        return {
          ...doc,
          id: data.id
        };
      }
    } catch (e) {
      console.warn('Database registerDocument error, using fallback memory store:', e);
    }
  }

  MEMORY_DOCUMENTS.push(doc);
  return doc;
};

/**
 * Get all documents for a specific entity
 */
export const getEntityDocuments = async (entityId: string, entityType?: string): Promise<GenericDocument[]> => {
  if (supabase) {
    try {
      let query = supabase.from('documents').select('*').eq('entity_id', entityId);
      if (entityType) {
        query = query.eq('entity_type', entityType);
      }
      const { data, error } = await query.order('created_at', { ascending: false });

      if (!error && data) {
        return data as GenericDocument[];
      }
    } catch (e) {
      console.warn('Error fetching entity documents from DB:', e);
    }
  }

  return MEMORY_DOCUMENTS.filter(
    d => d.entity_id === entityId && (!entityType || d.entity_type === entityType)
  );
};
