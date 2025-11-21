export interface EmailNotification {
  to: string;
  subject: string;
  body: string;
}

export interface INotificationService {
  sendEmail(notification: EmailNotification): Promise<void>;
  notifyTicketCreated(ticketId: string, userEmail: string): Promise<void>;
  notifyTicketAssigned(ticketId: string, userEmail: string): Promise<void>;
  notifyTicketStatusChanged(ticketId: string, userEmail: string, newStatus: string): Promise<void>;
  notifySLABreach(ticketId: string, userEmail: string): Promise<void>;
}
