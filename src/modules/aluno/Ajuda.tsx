"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  HelpCircle,
  Wrench,
  ChevronDown,
  ChevronUp,
  Upload,
  FileText,
  Send,
} from "lucide-react";
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
      "Os preços são definidos pela equipe administrativa, com base no desempenho e objetivos dos alunos. Os valores são ajustados para manter o equilíbrio e motivação.",
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
  const [problemaDescricao, setProblemaDescricao] = useState("");
  const [arquivoAnexado, setArquivoAnexado] = useState<File | null>(null);

  // ==================== HANDLERS ====================
  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setArquivoAnexado(file);
    }
  };

  const handleSubmitSupport = () => {
    if (problemaDescricao.trim()) {
      // Aqui você implementaria o envio do ticket
      console.log("Ticket enviado:", {
        descricao: problemaDescricao,
        arquivo: arquivoAnexado?.name,
      });
      alert(
        "Ticket enviado com sucesso! Nossa equipe entrará em contato em breve."
      );
      setProblemaDescricao("");
      setArquivoAnexado(null);
    }
  };

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
                  Suporte Técnico
                </h2>
                <p className="text-sm text-gray-600">Descreva seu problema</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Área de Descrição */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descrição do Problema
                </label>
                <textarea
                  value={problemaDescricao}
                  onChange={(e) => setProblemaDescricao(e.target.value)}
                  rows={5}
                  placeholder="Descreva seu problema em detalhes... (ex: erro ao carregar página, problemas de login, etc.)"
                  className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 smooth-transition resize-none"
                />
              </div>

              {/* Upload de Arquivo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Anexar Arquivo (Opcional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".png,.jpg,.jpeg,.pdf,.txt"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center gap-3 p-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-violet-400 hover:bg-violet-50 smooth-transition cursor-pointer"
                  >
                    <Upload className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {arquivoAnexado
                          ? arquivoAnexado.name
                          : "Upload de arquivo"}
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, PDF até 10MB
                      </p>
                    </div>
                  </label>
                </div>

                {arquivoAnexado && (
                  <div className="mt-2 flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700 font-medium">
                      {arquivoAnexado.name}
                    </span>
                    <button
                      onClick={() => setArquivoAnexado(null)}
                      className="text-green-600 hover:text-green-800 ml-auto"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Botão de Envio */}
              <Button
                onClick={handleSubmitSupport}
                disabled={!problemaDescricao.trim()}
                className="w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg smooth-transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4 mr-2" />
                Solicitar Suporte
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
