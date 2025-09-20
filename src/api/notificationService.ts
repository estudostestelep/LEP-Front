import api from "./api";

export interface NotificationConfig {
  id?: string;
  event_type: string;
  enabled: boolean;
  channels: string[];
  delay_minutes?: number;
  project_id: string;
}

export interface NotificationTemplate {
  id?: string;
  channel: "sms" | "whatsapp" | "email";
  event_type: string;
  subject?: string;
  body: string;
  project_id: string;
}

export interface NotificationLog {
  id?: string;
  event_type: string;
  channel: string;
  recipient: string;
  status: "sent" | "delivered" | "failed" | "pending";
  external_id?: string;
  error_message?: string;
  created_at?: string;
  delivered_at?: string;
}

export interface NotificationSend {
  event_type: string;
  entity_type: string;
  entity_id: string;
  recipient: string;
  channel: "sms" | "whatsapp" | "email";
  variables?: Record<string, string>;
}

export const notificationService = {
  // Configurações
  createConfig: (data: NotificationConfig) => api.post<NotificationConfig>("/notification/config", data),
  updateConfig: (data: NotificationConfig) => api.put<NotificationConfig>("/notification/config", data),

  // Templates
  getTemplates: (orgId: string, projectId: string) =>
    api.get<NotificationTemplate[]>(`/notification/templates/${orgId}/${projectId}`),
  createTemplate: (data: NotificationTemplate) =>
    api.post<NotificationTemplate>("/notification/template", data),
  updateTemplate: (data: NotificationTemplate) =>
    api.put<NotificationTemplate>("/notification/template", data),

  // Envio manual
  sendNotification: (data: NotificationSend) =>
    api.post("/notification/send", data),

  // Processar evento
  processEvent: (data: Record<string, unknown>) =>
    api.post("/notification/event", data),

  // Logs
  getLogs: (orgId: string, projectId: string, params?: { limit?: number; offset?: number }) =>
    api.get<{ logs: NotificationLog[]; total: number }>(`/notification/logs/${orgId}/${projectId}`, { params }),
};