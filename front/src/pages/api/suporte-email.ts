// src/pages/api/suporte-email.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { assunto, mensagem, nome, email, anexos } = req.body as {
      assunto?: string;
      mensagem: string;
      nome?: string;
      email?: string;
      anexos?: string[];
    };

    const supportEmail = process.env.SUPPORT_EMAIL;
    if (!supportEmail) {
      return res
        .status(500)
        .json({ ok: false, error: "SUPPORT_EMAIL não configurado" });
    }

    const subject = `[Suporte] ${assunto || "Novo pedido de suporte"}`;

    const html = `
      <div style="
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background-color: #f5f3ff;
        padding: 24px;
      ">
        <div style="
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(15, 23, 42, 0.15);
          overflow: hidden;
          border: 1px solid #e4e4ff;
        ">
          <!-- Cabeçalho -->
          <div style="
            background: linear-gradient(135deg, #7c3aed, #a855f7);
            color: #ffffff;
            padding: 20px 24px;
            display: flex;
            align-items: center;
            gap: 12px;
          ">
            <div style="
              width: 40px;
              height: 40px;
              border-radius: 999px;
              background: rgba(255,255,255,0.15);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 20px;
            ">
              🪙
            </div>
            <div>
              <div style="font-size: 18px; font-weight: 700;">
                Coins for Study
              </div>
              <div style="font-size: 13px; opacity: 0.9;">
                Central de suporte ao aluno
              </div>
            </div>
          </div>

          <!-- Corpo -->
          <div style="padding: 24px 24px 16px 24px; color: #0f172a;">
            <h1 style="
              font-size: 20px;
              margin: 0 0 12px 0;
              color: #1f2933;
            ">
              Novo pedido de suporte
            </h1>

            <p style="margin: 0 0 16px 0; font-size: 14px; color: #4b5563;">
              Você recebeu um novo contato de suporte enviado pela área de <strong>Ajuda do aluno</strong>
              na plataforma <strong>Coins for Study</strong>.
            </p>

            <div style="
              background-color: #f9fafb;
              border-radius: 12px;
              padding: 16px 16px 10px 16px;
              border: 1px solid #e5e7eb;
              font-size: 14px;
              line-height: 1.5;
            ">
              <p style="margin: 0 0 6px 0;">
                <strong>Nome:</strong> ${nome || "Não informado"}
              </p>
              <p style="margin: 0 0 6px 0;">
                <strong>E-mail do aluno:</strong> ${email || "Não informado"}
              </p>
              <p style="margin: 0 0 6px 0;">
                <strong>Assunto:</strong> ${assunto || "Sem assunto"}
              </p>
            </div>

            <h2 style="
              font-size: 15px;
              margin: 18px 0 6px 0;
              color: #111827;
            ">
              Mensagem
            </h2>
            <div style="
              font-size: 14px;
              color: #374151;
              background-color: #f9fafb;
              border-radius: 12px;
              padding: 14px 16px;
              border: 1px solid #e5e7eb;
              white-space: pre-wrap;
            ">
              ${(mensagem || "").replace(/\n/g, "<br />")}
            </div>

            <h2 style="
              font-size: 15px;
              margin: 18px 0 6px 0;
              color: #111827;
            ">
              Anexos
            </h2>

            ${
              anexos && anexos.length
                ? `
                  <ul style="padding-left: 18px; margin: 0 0 8px 0; font-size: 14px; color: #4338ca;">
                    ${anexos
                      .map(
                        (url) => `
                          <li style="margin-bottom: 4px;">
                            <a href="${url}" style="color: #4c1d95; text-decoration: underline;">
                              ${url}
                            </a>
                          </li>
                        `
                      )
                      .join("")}
                  </ul>
                `
                : `<p style="font-size: 14px; color: #6b7280; margin: 0 0 8px 0;">Nenhum anexo enviado.</p>`
            }

            <p style="font-size: 12px; color: #9ca3af; margin-top: 18px;">
              Este e-mail foi gerado automaticamente pela plataforma Coins for Study.
            </p>
          </div>

          <!-- Rodapé -->
          <div style="
            padding: 12px 18px 16px 18px;
            border-top: 1px solid #e5e7eb;
            background-color: #f9fafb;
            text-align: right;
          ">
            <span style="font-size: 11px; color: #9ca3af;">
              Coins for Study • Sistema gamificado de aprendizagem
            </span>
          </div>
        </div>
      </div>
    `;

    const result = await resend.emails.send({
      from: "Coins for Study Suporte <onboarding@resend.dev>",
      to: [supportEmail],
      subject,
      reply_to: email || undefined,
      html,
    });

    console.log("Email enviado:", result);

    return res.status(200).json({ ok: true });
  } catch (error: any) {
    console.error("Erro ao enviar e-mail de suporte:", error);
    return res
      .status(500)
      .json({ ok: false, error: error?.message || "Erro interno" });
  }
}
