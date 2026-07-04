import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  private getTransporter(): nodemailer.Transporter | null {
    if (this.transporter) return this.transporter;
    if (!process.env.SMTP_HOST) return null;

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
    return this.transporter;
  }

  async sendPasswordReset(email: string, resetUrl: string) {
    const transporter = this.getTransporter();

    if (!transporter) {
      this.logger.warn(
        `SMTP não configurado (defina SMTP_HOST no .env). Link de redefinição de senha para ${email}: ${resetUrl}`,
      );
      return;
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? 'coins@no-reply.local',
      to: email,
      subject: 'Redefinição de senha - Coins',
      html: `<p>Você solicitou a redefinição de senha.</p><p><a href="${resetUrl}">Clique aqui para criar uma nova senha</a>. O link expira em 1 hora.</p><p>Se você não solicitou isso, ignore este e-mail.</p>`,
    });
  }
}
