"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MainLayout } from "../../src/components/layout/MainLayout";
import { Card } from "../../src/components/ui/Card";
import { Input } from "../../src/components/ui/Input";
import { Button } from "../../src/components/ui/Button";
import { useAuth } from "../../src/services/auth/AuthContext";
import {
  profileSchema,
  ProfileFormData,
} from "../../src/utils/validation/schemas";

export default function PerfilPage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
    },
  });

  if (!user) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card title="Acesso Restrito">
            <p className="text-secondary-600 mb-4">
              Você precisa estar logado para acessar seu perfil.
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

  const handleSave = async (data: any) => {
    setMessage("");

    try {
      // Simulação de salvamento
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage("Perfil atualizado com sucesso!");
      setIsEditing(false);
    } catch (error) {
      setMessage("Erro ao atualizar perfil. Tente novamente.");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Meu Perfil</h1>
          <p className="text-secondary-600 mt-2">
            Gerencie suas informações pessoais
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações do usuário */}
          <div className="lg:col-span-2">
            <Card title="Informações Pessoais">
              <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
                <Input
                  label="Nome completo"
                  {...register("name")}
                  error={errors.name?.message}
                  disabled={!isEditing}
                />

                <Input
                  label="Email"
                  type="email"
                  {...register("email")}
                  error={errors.email?.message}
                  disabled={!isEditing}
                />

                <Input
                  label="Telefone"
                  {...register("phone")}
                  error={errors.phone?.message}
                  placeholder="(11) 99999-9999"
                  disabled={!isEditing}
                />

                {message && (
                  <div
                    className={`text-sm ${
                      message.includes("sucesso")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <div className="flex gap-4">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} type="button">
                      Editar Perfil
                    </Button>
                  ) : (
                    <>
                      <Button type="submit" isLoading={isSubmitting}>
                        Salvar Alterações
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setIsEditing(false);
                          setMessage("");
                        }}
                        type="button"
                      >
                        Cancelar
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </Card>
          </div>

          {/* Sidebar com informações adicionais */}
          <div className="space-y-6">
            <Card title="Informações da Conta">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-secondary-700">
                    Tipo de Conta
                  </label>
                  <p className="text-secondary-900 capitalize">{user.role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-700">
                    ID do Usuário
                  </label>
                  <p className="text-secondary-900 font-mono text-sm">
                    {user.id}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-700">
                    Membro desde
                  </label>
                  <p className="text-secondary-900">Janeiro 2024</p>
                </div>
              </div>
            </Card>

            <Card title="Estatísticas">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Cursos concluídos</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Certificados</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Horas estudadas</span>
                  <span className="font-medium">156h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Pontuação total</span>
                  <span className="font-medium">2,840</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
