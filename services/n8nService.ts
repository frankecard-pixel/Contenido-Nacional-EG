// n8n Integration Service for WhatsApp & 2FA Notifications

export interface N8nNotificationLog {
  id: string;
  timestamp: string;
  type: 'user_created' | 'two_factor_auth' | 'news_comment' | 'general_alert';
  phone: string;
  recipientName: string;
  payload: any;
  status: 'success' | 'failed' | 'simulated';
  responseMessage?: string;
}

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || '';

/**
 * Triggers an n8n webhook for WhatsApp or 2FA alerts
 */
export const triggerN8nNotification = async (
  type: N8nNotificationLog['type'],
  phone: string,
  recipientName: string,
  extraPayload: Record<string, any> = {}
): Promise<N8nNotificationLog> => {
  const payload = {
    event_type: type,
    phone_number: phone,
    recipient_name: recipientName,
    timestamp: new Date().toISOString(),
    ...extraPayload,
  };

  const logEntry: N8nNotificationLog = {
    id: `n8n-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toISOString(),
    type,
    phone,
    recipientName,
    payload,
    status: 'simulated',
  };

  try {
    if (!WEBHOOK_URL) {
      console.log('n8n Webhook: No VITE_N8N_WEBHOOK_URL set. Simulating WhatsApp notification trigger...', payload);
      logEntry.status = 'simulated';
      logEntry.responseMessage = 'Modo simulación: configure VITE_N8N_WEBHOOK_URL en las variables de entorno para envío real.';
      saveLog(logEntry);
      triggerLocalAlert(logEntry);
      return logEntry;
    }

    console.log(`n8n Webhook: Sending request to ${WEBHOOK_URL}...`, payload);
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      logEntry.status = 'success';
      logEntry.responseMessage = 'Notificación enviada a n8n correctamente.';
    } else {
      logEntry.status = 'failed';
      logEntry.responseMessage = `n8n respondió con error código: ${response.status} ${response.statusText}`;
    }
  } catch (error: any) {
    console.error('n8n Webhook Error:', error);
    logEntry.status = 'failed';
    logEntry.responseMessage = `Error de red al conectar con n8n: ${error.message}`;
  }

  saveLog(logEntry);
  triggerLocalAlert(logEntry);
  return logEntry;
};

/**
 * Generates and triggers a 2-Step Authenticity Verification OTP code via n8n/WhatsApp
 */
export const sendOTPWhatsApp = async (phone: string, name: string): Promise<{ success: boolean; code: string }> => {
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
  
  // Trigger n8n webhook
  await triggerN8nNotification('two_factor_auth', phone, name, {
    verification_code: code,
    message: `Su código de doble autenticación para el Portal de Contenido Nacional de Guinea Ecuatorial es: ${code}. Válido por 10 minutos.`,
  });

  return { success: true, code };
};

// Internal helpers to manage logs and visual alerts in the UI
const saveLog = (entry: N8nNotificationLog) => {
  try {
    const existing = localStorage.getItem('n8n_notification_logs');
    const logs = existing ? JSON.parse(existing) : [];
    logs.unshift(entry);
    // Keep max 100 logs
    localStorage.setItem('n8n_notification_logs', JSON.stringify(logs.slice(0, 100)));
    
    // Also add to global notifications for the user
    const userNotif = {
      id: entry.id,
      title: `WhatsApp: ${entry.type === 'two_factor_auth' ? 'Código 2FA' : 'Notificación'}`,
      content: `Destinatario: ${entry.recipientName} (${entry.phone}). ${entry.type === 'two_factor_auth' ? `Código enviado: ${entry.payload.verification_code}` : 'Aviso enviado con éxito'}`,
      read: false,
      created_at: entry.timestamp
    };
    const notifs = localStorage.getItem('user_notifs_list');
    const notifsList = notifs ? JSON.parse(notifs) : [];
    notifsList.unshift(userNotif);
    localStorage.setItem('user_notifs_list', JSON.stringify(notifsList));
  } catch (err) {
    console.error('Error saving n8n log:', err);
  }
};

const triggerLocalAlert = (entry: N8nNotificationLog) => {
  // Dispatch a custom event so the UI can listen and show a notification toast
  const event = new CustomEvent('n8n-notification-sent', { detail: entry });
  window.dispatchEvent(event);
};

export const getN8nLogs = (): N8nNotificationLog[] => {
  try {
    const logs = localStorage.getItem('n8n_notification_logs');
    return logs ? JSON.parse(logs) : [];
  } catch {
    return [];
  }
};

export const clearN8nLogs = () => {
  localStorage.removeItem('n8n_notification_logs');
};
