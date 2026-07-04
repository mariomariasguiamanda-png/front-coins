"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/Label";
import { supabase } from "@/lib/supabaseClient";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

// ==================== DADOS FAQ ====================
const faqData = [
  {
    question: "Como ganho moedas?",
    answer:
      "Você ganha moedas ao completar atividades e participar de desafios. Cada atividade concluída, videoaula assistida e presença em aula te recompensa com moedas.",
  },
  {
    question: "Quando posso comprar pontos?",
    answer:
      "Você pode comprar pontos na seção 'Comprar Pontos' após acumular moedas suficientes. Os pontos podem ser usados para melhorar suas notas em disciplinas específicas.",
  },
  {
    question: "Quem define os preços?",
    answer:
      "Os preços são definidos pelo professor responsável da matéria, com base no desempenho e objetivos dos alunos. Os valores são ajustados para manter o equilíbrio e motivação.",
  },
  {
    question: "Como funciona o sistema de revisão?",
    answer:
      "O sistema utiliza o método de Ebbinghaus com intervalos de 1, 3, 7 e 15 dias para otimizar sua retenção de conhecimento.",
  },
  {
    question: "Minhas notas aparecem quando?",
    answer:
      "Suas notas aparecem assim que seu professor publicar as avaliações no sistema. Você receberá uma notificação quando houver novas notas disponíveis.",
  },
];

export default function Ajuda() {
  // ==================== ESTADOS ====================
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ==================== HANDLERS ====================
  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  }

  async function handleSendSupport() {
    setIsSending(true);
    setSuccess(null);
    setError(null);

    try {
      if (!mensagem || !assunto) {
        setError("Preencha pelo menos o assunto e a mensagem.");
        setIsSending(false);
        return;
      }

      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) {
        console.error(userError);
      }

      const userId = userData?.user?.id ?? null;

      const anexosUrls: string[] = [];

      if (files && files.length > 0) {
        const bucket = "suporte-anexos";
        const filesArray = Array.from(files);

        for (const file of filesArray) {
          const path = `${userId ?? "anon"}/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

          const { data: uploadData, error: uploadError } =
            await supabase.storage.from(bucket).upload(path, file);

          if (uploadError) {
            console.error(uploadError);
            throw new Error("Erro ao enviar anexos. Tente novamente.");
          }

          const { data: publicUrlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(uploadData!.path);

          if (publicUrlData?.publicUrl) {
            anexosUrls.push(publicUrlData.publicUrl);
          }
        }
      }

      const { error: insertError } = await supabase
        .from("suporte_pedidos")
        .insert({
          id_usuario: userId,
          nome: nome || null,
          email: email || null,
          assunto,
          mensagem,
          anexos: anexosUrls,
        });

      if (insertError) {
        console.error(insertError);
        throw new Error("Erro ao salvar pedido de suporte. Tente novamente.");
      }

      const resp = await fetch("/api/suporte-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assunto,
          mensagem,
          nome,
          email,
          anexos: anexosUrls,
        }),
      });

      if (!resp.ok) {
        const data = await resp.json().catch(() => null);
        console.error("Erro na rota /api/suporte-email:", data);
        setError(
          "Seu pedido foi registrado, mas houve um problema ao enviar o e-mail para o suporte."
        );
      } else {
        setSuccess("Sua solicitação de suporte foi enviada com sucesso! 😊");
      }

      setNome("");
      setEmail("");
      setAssunto("");
      setMensagem("");
      setFiles(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao enviar suporte.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="page-enter space-y-6">
      {/* ==================== HEADER ==================== */}
      <header className="flex items-center gap-3 card-bounce">
        <div className="p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl">
          <HelpCircle className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ajuda</h1>
          <p className="text-gray-600">
            Fale com o professor, veja FAQs ou suporte.
          </p>
        </div>
      </header>

      {/* ==================== CARDS PRINCIPAIS ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ==================== FAQ SECTION ==================== */}
        <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg hover-lift card-bounce card-bounce-delay-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-violet-100 rounded-lg">
                <span className="text-2xl">📖</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">FAQ</h2>
                <p className="text-sm text-gray-600">Perguntas frequentes</p>
              </div>
            </div>

            <div className="space-y-3">
              {faqData.map((faq, index) => (
                <div
                  key={index}
                  className={`border rounded-xl smooth-transition ${
                    expandedFaq === index
                      ? "bg-violet-50 border-violet-200"
                      : "bg-gray-50 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 text-left flex items-center justify-between smooth-transition hover:bg-white/50"
                  >
                    <span className="font-semibold text-gray-900">
                      {faq.question}
                    </span>
                    {expandedFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-violet-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>

                  {expandedFaq === index && (
                    <div className="px-4 pb-4 smooth-transition">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ==================== SUPORTE TÉCNICO ==================== */}
        <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg hover-lift card-bounce card-bounce-delay-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <span className="text-2xl">🛠️</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Suporte técnico
                </h2>
                <p className="text-sm text-gray-600">
                  Descreva seu problema e, se quiser, anexe arquivos.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border p-4">
              <div className="font-semibold">Suporte técnico</div>
              <p className="text-sm text-muted-foreground mb-3">
                Descreva o problema e, se quiser, anexe prints ou documentos.
              </p>

              <div className="space-y-2">
                <div>
                  <Label htmlFor="nome">Nome (opcional)</Label>
                  <Input
                    id="nome"
                    className="rounded-2xl mt-1"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <Label htmlFor="email">E-mail para retorno (opcional)</Label>
                  <Input
                    id="email"
                    type="email"
                    className="rounded-2xl mt-1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@exemplo.com"
                  />
                </div>

                <div>
                  <Label htmlFor="assunto">Assunto</Label>
                  <Input
                    id="assunto"
                    className="rounded-2xl mt-1"
                    value={assunto}
                    onChange={(e) => setAssunto(e.target.value)}
                    placeholder="Ex.: Não consigo acessar a atividade de Matemática"
                  />
                </div>

                <div>
                  <Label htmlFor="mensagem">Mensagem</Label>
                  <Textarea
                    id="mensagem"
                    className="rounded-2xl mt-1"
                    rows={4}
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    placeholder="Explique com detalhes o que está acontecendo..."
                  />
                </div>

                <div>
                  <Label htmlFor="anexos">Anexos (imagens / PDFs)</Label>
                  <Input
                    id="anexos"
                    type="file"
                    multiple
                    accept="image/*,application/pdf"
                    className="rounded-2xl mt-1"
                    onChange={handleFileChange}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Você pode anexar prints da tela, PDFs, etc.
                  </p>
                </div>

                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                {success && (
                  <p className="text-sm text-emerald-600 mt-2">{success}</p>
                )}

                <Button
                  className="mt-3 rounded-2xl w-full"
                  onClick={handleSendSupport}
                  disabled={isSending}
                >
                  {isSending ? "Enviando..." : "Enviar para o suporte"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
