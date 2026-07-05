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

  async sendNotificacao(destinatario: string, titulo: string, mensagem: string) {
    const transporter = this.getTransporter();

    if (!transporter) {
      this.logger.warn(
        `SMTP não configurado (defina SMTP_HOST no .env). E-mail de notificação para ${destinatario}: "${titulo}" - ${mensagem}`,
      );
      return;
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? 'coins@no-reply.local',
      to: destinatario,
      subject: titulo,
      html: `<p>${mensagem}</p>`,
    });
  }

  async sendNovoChamadoSuporte(chamado: {
    id_chamado: bigint;
    assunto: string | null;
    mensagem: string | null;
    usuarioNome: string;
    usuarioEmail: string;
    anexos: string[];
  }) {
    const transporter = this.getTransporter();
    const destino = process.env.SUPPORT_EMAIL ?? process.env.SMTP_FROM ?? 'suporte@coins.local';

    const resumo = `Chamado #${Number(chamado.id_chamado)} de ${chamado.usuarioNome} (${chamado.usuarioEmail}): ${chamado.assunto ?? '(sem assunto)'}`;

    if (!transporter) {
      this.logger.warn(`SMTP não configurado. ${resumo} — ${chamado.mensagem}`);
      return;
    }

    const anexosHtml = chamado.anexos.length
      ? `<p>Anexos: ${chamado.anexos.map((a) => `<a href="${a}">${a}</a>`).join(', ')}</p>`
      : '';

    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? 'coins@no-reply.local',
      to: destino,
      subject: `Novo chamado de suporte #${Number(chamado.id_chamado)}`,
      html: `<p><strong>De:</strong> ${chamado.usuarioNome} (${chamado.usuarioEmail})</p><p><strong>Assunto:</strong> ${chamado.assunto ?? '(sem assunto)'}</p><p>${chamado.mensagem}</p>${anexosHtml}`,
    });
  }
}
