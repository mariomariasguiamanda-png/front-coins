"use client";

import React from "react";
import { MainLayout } from "../../src/components/layout/MainLayout";
import { Card } from "../../src/components/ui/Card";
import { useAuth } from "../../src/services/auth/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card title="Acesso Restrito">
            <p className="text-secondary-600 mb-4">
              Você precisa estar logado para acessar o dashboard.
            </p>
            <a
              href="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Fazer login
            </a>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
          <p className="text-secondary-600 mt-2">
            Acompanhe suas atividades e progresso
          </p>
        </div>

        {/* Métricas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 rounded"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-secondary-600">Cursos Concluídos</p>
                <p className="text-2xl font-bold text-secondary-900">12</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="w-6 h-6 bg-green-500 rounded"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-secondary-600">Certificados</p>
                <p className="text-2xl font-bold text-secondary-900">8</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <div className="w-6 h-6 bg-yellow-500 rounded"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-secondary-600">Horas Estudadas</p>
                <p className="text-2xl font-bold text-secondary-900">156</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <div className="w-6 h-6 bg-purple-500 rounded"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-secondary-600">Pontuação</p>
                <p className="text-2xl font-bold text-secondary-900">2,840</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Cursos em progresso */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card title="Cursos em Progresso">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-secondary-900">
                    React Avançado
                  </h4>
                  <p className="text-sm text-secondary-600">Módulo 3 de 5</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-secondary-900">
                    75%
                  </div>
                  <div className="w-16 bg-secondary-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-secondary-900">
                    TypeScript Fundamentals
                  </h4>
                  <p className="text-sm text-secondary-600">Módulo 2 de 4</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-secondary-900">
                    50%
                  </div>
                  <div className="w-16 bg-secondary-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: "50%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Atividades Recentes">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-secondary-900">
                    Completou: "Hooks em React"
                  </p>
                  <p className="text-xs text-secondary-600">Há 2 horas</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-secondary-900">
                    Iniciou: "Context API"
                  </p>
                  <p className="text-xs text-secondary-600">Há 1 dia</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-secondary-900">
                    Obteve certificado: "JavaScript ES6+"
                  </p>
                  <p className="text-xs text-secondary-600">Há 3 dias</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
