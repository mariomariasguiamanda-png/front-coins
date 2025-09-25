"use client";

import React, { useState } from "react";
import { MainLayout } from "../../src/components/layout/MainLayout";
import { Card } from "../../src/components/ui/Card";
import { Input } from "../../src/components/ui/Input";
import { Button } from "../../src/components/ui/Button";

export default function AjudaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");

  const faqItems = [
    {
      id: 1,
      category: "conta",
      question: "Como criar uma conta?",
      answer:
        'Para criar uma conta, clique em "Cadastrar" na página inicial e preencha o formulário com seus dados pessoais.',
    },
    {
      id: 2,
      category: "conta",
      question: "Como recuperar minha senha?",
      answer:
        'Na página de login, clique em "Esqueci minha senha" e siga as instruções enviadas para seu email.',
    },
    {
      id: 3,
      category: "cursos",
      question: "Como acessar meus cursos?",
      answer:
        "Após fazer login, acesse o Dashboard para ver todos os seus cursos em progresso e concluídos.",
    },
    {
      id: 4,
      category: "cursos",
      question: "Como obter certificados?",
      answer:
        "Os certificados são gerados automaticamente quando você completa 100% de um curso com nota mínima de 70%.",
    },
    {
      id: 5,
      category: "tecnico",
      question: "O sistema não está carregando",
      answer:
        "Tente atualizar a página, limpar o cache do navegador ou usar outro navegador. Se o problema persistir, entre em contato conosco.",
    },
    {
      id: 6,
      category: "tecnico",
      question: "Como reportar um bug?",
      answer:
        "Use o formulário de contato abaixo ou envie um email para suporte@coins.com com detalhes do problema.",
    },
  ];

  const categories = [
    { value: "todos", label: "Todas as categorias" },
    { value: "conta", label: "Conta e Login" },
    { value: "cursos", label: "Cursos e Certificados" },
    { value: "tecnico", label: "Problemas Técnicos" },
  ];

  const filteredFaq = faqItems.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "todos" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">
            Central de Ajuda
          </h1>
          <p className="text-secondary-600 mt-2">
            Encontre respostas para suas dúvidas ou entre em contato conosco
          </p>
        </div>

        {/* Busca e filtros */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Buscar por palavra-chave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-secondary-900 mb-6">
            Perguntas Frequentes
          </h2>
          <div className="space-y-4">
            {filteredFaq.map((item) => (
              <Card key={item.id}>
                <details className="group">
                  <summary className="cursor-pointer list-none">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-secondary-900 group-open:text-primary-600">
                        {item.question}
                      </h3>
                      <div className="ml-4 transform group-open:rotate-180 transition-transform">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </summary>
                  <div className="mt-4 text-secondary-600">{item.answer}</div>
                </details>
              </Card>
            ))}
          </div>

          {filteredFaq.length === 0 && (
            <Card>
              <p className="text-center text-secondary-600">
                Nenhuma pergunta encontrada para os filtros selecionados.
              </p>
            </Card>
          )}
        </div>

        {/* Formulário de contato */}
        <Card
          title="Ainda precisa de ajuda?"
          subtitle="Entre em contato conosco"
        >
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nome" placeholder="Seu nome completo" />
              <Input label="Email" type="email" placeholder="seu@email.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Categoria
              </label>
              <select className="input-field">
                <option>Problema técnico</option>
                <option>Dúvida sobre curso</option>
                <option>Problema com pagamento</option>
                <option>Sugestão</option>
                <option>Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Mensagem
              </label>
              <textarea
                rows={4}
                className="input-field resize-none"
                placeholder="Descreva seu problema ou dúvida..."
              ></textarea>
            </div>

            <Button type="submit">Enviar Mensagem</Button>
          </form>
        </Card>

        {/* Links úteis */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="📚 Documentação">
            <p className="text-secondary-600 text-sm mb-3">
              Acesse nossa documentação completa
            </p>
            <a
              href="#"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Ver documentação →
            </a>
          </Card>

          <Card title="💬 Chat ao Vivo">
            <p className="text-secondary-600 text-sm mb-3">
              Converse com nossa equipe em tempo real
            </p>
            <a
              href="#"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Iniciar chat →
            </a>
          </Card>

          <Card title="📧 Email">
            <p className="text-secondary-600 text-sm mb-3">
              Envie um email para nossa equipe
            </p>
            <a
              href="mailto:suporte@coins.com"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              suporte@coins.com →
            </a>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
