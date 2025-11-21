import { injectable } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';
import { INotificationService, EmailNotification } from '../../application/ports/INotificationService';
import { logger } from '../../config/logger';

@injectable()
export class EmailNotificationService implements INotificationService {
  private transporter: Transporter;
  private readonly from: string;
  private readonly enabled: boolean;

  constructor() {
    this.from = process.env.SMTP_FROM || 'noreply@hospidesk.com';
    this.enabled = process.env.SMTP_HOST !== undefined;

    if (this.enabled) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      logger.info('Email notification service initialized');
    } else {
      logger.warn('Email notifications disabled - SMTP not configured');
      // Create test account for development
      nodemailer.createTestAccount().then((testAccount) => {
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        logger.info('Using Ethereal test email account for development');
      });
    }
  }

  async sendEmail(notification: EmailNotification): Promise<void> {
    if (!this.transporter) {
      logger.warn('Email transporter not initialized, skipping email');
      return;
    }

    try {
      const info = await this.transporter.sendMail({
        from: this.from,
        to: notification.to,
        subject: notification.subject,
        html: notification.body,
      });

      if (!this.enabled) {
        logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }

      logger.info(`Email sent to ${notification.to}: ${notification.subject}`);
    } catch (error) {
      logger.error('Failed to send email:', error);
      throw new Error('Failed to send email notification');
    }
  }

  async notifyTicketCreated(ticketId: string, userEmail: string): Promise<void> {
    await this.sendEmail({
      to: userEmail,
      subject: 'New Ticket Created',
      body: `
        <h2>Ticket Created Successfully</h2>
        <p>Your ticket <strong>#${ticketId}</strong> has been created and assigned to the appropriate team.</p>
        <p>You will receive updates as the ticket progresses.</p>
        <p>Thank you for using Hospi-Desk!</p>
      `,
    });
  }

  async notifyTicketAssigned(ticketId: string, userEmail: string): Promise<void> {
    await this.sendEmail({
      to: userEmail,
      subject: `Ticket #${ticketId} Assigned to You`,
      body: `
        <h2>New Ticket Assignment</h2>
        <p>Ticket <strong>#${ticketId}</strong> has been assigned to you.</p>
        <p>Please review and respond as soon as possible.</p>
        <p>Log in to Hospi-Desk to view details.</p>
      `,
    });
  }

  async notifyTicketStatusChanged(
    ticketId: string,
    userEmail: string,
    newStatus: string
  ): Promise<void> {
    await this.sendEmail({
      to: userEmail,
      subject: `Ticket #${ticketId} Status Updated`,
      body: `
        <h2>Ticket Status Changed</h2>
        <p>The status of ticket <strong>#${ticketId}</strong> has been updated to: <strong>${newStatus}</strong></p>
        <p>Log in to Hospi-Desk to view full details.</p>
      `,
    });
  }

  async notifySLABreach(ticketId: string, userEmail: string): Promise<void> {
    await this.sendEmail({
      to: userEmail,
      subject: `⚠️ SLA Breach Alert - Ticket #${ticketId}`,
      body: `
        <h2 style="color: #d32f2f;">SLA Breach Alert</h2>
        <p>Ticket <strong>#${ticketId}</strong> has breached its SLA agreement.</p>
        <p><strong>Immediate attention required!</strong></p>
        <p>Please escalate or resolve this ticket as soon as possible.</p>
      `,
    });
  }
}
