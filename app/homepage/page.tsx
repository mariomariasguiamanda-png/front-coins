"use client";

import React from "react";
import Link from "next/link";
import { MainLayout } from "../../src/components/layout/MainLayout";
import { Card } from "../../src/components/ui/Card";
import { Button } from "../../src/components/ui/Button";
import { useAuth } from "../../src/services/auth/AuthContext";

export default function HomePage() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">
                {user ? `Bem-vindo, ${user.name}!` : "Bem-vindo ao Coins!"}
              </h1>
              <p className="text-secondary-600 mt-2">
                Sistema de Gestão Educacional
              </p>
            </div>
            {user && (
              <Button variant="outline" onClick={handleLogout}>
                Sair
              </Button>
            )}
          </div>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card title="Dashboard" subtitle="Visão geral das atividades">
            <p className="text-secondary-600 mb-4">
              Acompanhe suas métricas e estatísticas em tempo real.
            </p>
            <Link href="/dashboard">
              <Button size="sm">Acessar Dashboard</Button>
            </Link>
          </Card>

          <Card title="Perfil" subtitle="Gerencie suas informações">
            <p className="text-secondary-600 mb-4">
              Atualize seus dados pessoais e configurações.
            </p>
            <Link href="/perfil">
              <Button size="sm">Ver Perfil</Button>
            </Link>
          </Card>

          <Card title="Ajuda" subtitle="Suporte e documentação">
            <p className="text-secondary-600 mb-4">
              Encontre respostas para suas dúvidas e tutoriais.
            </p>
            <Link href="/ajuda">
              <Button size="sm">Obter Ajuda</Button>
            </Link>
          </Card>
        </div>

        {/* Seção de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-primary-600">150</div>
            <div className="text-secondary-600">Usuários Ativos</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-green-600">85%</div>
            <div className="text-secondary-600">Taxa de Conclusão</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">24</div>
            <div className="text-secondary-600">Cursos Disponíveis</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">4.8</div>
            <div className="text-secondary-600">Avaliação Média</div>
          </div>
        </div>

        {/* Seção de ações rápidas */}
        {!user && (
          <Card title="Comece agora" subtitle="Acesse todas as funcionalidades">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login" className="flex-1">
                <Button className="w-full">Fazer Login</Button>
              </Link>
              <Link href="/cadastro" className="flex-1">
                <Button variant="secondary" className="w-full">
                  Criar Conta
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
