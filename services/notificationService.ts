import { supabase } from './supabaseClient';
import { Notification } from '../types';

export interface CreateNotificationParams {
  userId: string;
  title: string;
  description: string;
  type?: 'critical' | 'opportunity' | 'application' | 'message' | 'system';
  category?: string;
  actionUrl?: string;
  metadata?: any;
}

const MEMORY_NOTIFICATIONS: Notification[] = [];

/**
 * Dispatch notification to user
 */
export const sendNotification = async (params: CreateNotificationParams): Promise<Notification> => {
  const notif: Notification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type: params.type || 'system',
    title: params.title,
    description: params.description,
    timestamp: new Date().toISOString(),
    isRead: false,
    category: params.category || 'General',
    metadata: params.metadata || {}
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          user_id: params.userId,
          title: params.title,
          content: params.description,
          read: false,
          created_at: notif.timestamp
        }])
        .select()
        .single();

      if (!error && data) {
        notif.id = data.id;
      }
    } catch (e) {
      console.warn('Error saving notification in DB, using fallback memory:', e);
    }
  }

  MEMORY_NOTIFICATIONS.unshift(notif);
  return notif;
};

/**
 * Fetch notifications for a user
 */
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map(item => ({
          id: item.id,
          type: 'system',
          title: item.title,
          description: item.content || '',
          timestamp: item.created_at,
          isRead: item.read || false
        }));
      }
    } catch (e) {
      console.warn('Error fetching notifications from DB:', e);
    }
  }

  return MEMORY_NOTIFICATIONS;
};
