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

  async sendWelcomePassword(email: string, nome: string, senhaTemp: string) {
    const transporter = this.getTransporter();

    if (!transporter) {
      this.logger.warn(
        `SMTP não configurado. E-mail de boas-vindas não enviado para ${email}. Senha gerada: ${senhaTemp}`,
      );
      return;
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background-color: #7c3aed; padding: 32px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Bem-vindo(a) ao Coins!</h1>
        </div>
        <div style="padding: 32px 20px; background-color: white;">
          <p style="color: #334155; font-size: 16px; margin-top: 0;">Olá <strong>${nome}</strong>,</p>
          <p style="color: #475569; font-size: 16px; line-height: 1.5;">
            Sua conta foi criada com sucesso pelo administrador do sistema.
          </p>
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 24px 0; text-align: center;">
            <p style="color: #64748b; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase; font-weight: bold;">Sua Senha Provisória</p>
            <p style="color: #0f172a; font-size: 24px; margin: 0; font-family: monospace; letter-spacing: 2px;"><strong>${senhaTemp}</strong></p>
          </div>
          <p style="color: #475569; font-size: 15px; line-height: 1.5;">
            Recomendamos que você altere essa senha assim que fizer o seu primeiro login. Você pode fazer isso acessando a seção <strong>Meu Perfil</strong>.
          </p>
          <p style="color: #475569; font-size: 15px; line-height: 1.5;">
            Caso prefira, você também pode usar a opção "Esqueci minha senha" na tela de login a qualquer momento.
          </p>
        </div>
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            Se você tiver alguma dúvida, entre em contato com o suporte.
          </p>
        </div>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM ?? 'coins@no-reply.local',
        to: email,
        subject: 'Bem-vindo(a)! Sua conta foi criada',
        html,
      });
      this.logger.log(`E-mail de boas-vindas enviado com sucesso para ${email}`);
    } catch (error) {
      this.logger.error(`Erro ao enviar e-mail de boas-vindas para ${email}:`, error);
    }
  }
}
