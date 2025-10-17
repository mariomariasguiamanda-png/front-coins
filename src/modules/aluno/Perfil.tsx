"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import NotificationCard from "@/components/ui/NotificationCard";
import {
  User,
  Camera,
  Edit,
  Save,
  LogOut,
  CheckCircle,
  AlertCircle,
  Building2,
  UserCircle,
} from "lucide-react";

// ==================== TIPOS E INTERFACES ====================

type FormData = {
  nome: string;
  celular: string;
};

type ValidationErrors = {
  nome?: string;
  celular?: string;
};

// ==================== DADOS ESTÁTICOS ====================

// Dados Institucionais (não editáveis)
const dadosInstitucionais = [
  { label: "Matrícula", value: "123456789" },
  { label: "CPF", value: "123.456.789-00" },
  { label: "E-mail", value: "mario.neto@gmail.com" },
  { label: "Turma", value: "Coins for Study 11" },
];

// Dados iniciais do formulário
const INITIAL_FORM_DATA: FormData = {
  nome: "Mário Laux Neto",
  celular: "+55 49 90000-0000",
};

// ==================== COMPONENTE PRINCIPAL ====================

export default function Perfil() {
  // ==================== ESTADOS ====================
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [originalData, setOriginalData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<
    "success" | "warning" | "info" | "error"
  >("info");

  // ==================== EFFECTS ====================
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const changed =
      formData.nome !== originalData.nome ||
      formData.celular !== originalData.celular;
    setHasChanges(changed);
  }, [formData, originalData]);

  // ==================== EARLY RETURN ====================
  if (!mounted) return null;

  // ==================== FUNÇÕES DE VALIDAÇÃO ====================
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validação do nome
    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = "Nome deve ter pelo menos 2 caracteres";
    }

    // Validação do celular
    const celularRegex = /^\+55\s\d{2}\s\d{4,5}-\d{4}$/;
    if (!formData.celular.trim()) {
      newErrors.celular = "Celular é obrigatório";
    } else if (!celularRegex.test(formData.celular)) {
      newErrors.celular = "Formato inválido. Use: +55 XX XXXXX-XXXX";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==================== HANDLERS ====================
  const handleEdit = () => {
    setIsEditing(true);
    setErrors({});
    setShowSuccess(false);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setErrors({});
    setHasChanges(false);
  };

  const handleSave = () => {
    if (validateForm()) {
      setOriginalData(formData);
      setIsEditing(false);
      setHasChanges(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleInputChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handlePhotoChange = () => {
    setNotificationMessage(
      "Funcionalidade de alterar foto será implementada em breve!"
    );
    setNotificationType("info");
    setShowNotification(true);
  };

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      setNotificationMessage("Logout realizado com sucesso!");
      setNotificationType("success");
      setShowNotification(true);
    }
  };

  // ==================== RENDER ====================
  return (
    <div className="page-enter min-h-screen bg-violet-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ==================== HEADER ==================== */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
              <p className="text-gray-600">
                Gerencie suas informações pessoais e configurações
              </p>
            </div>
          </div>

          {!isEditing && (
            <Button
              onClick={handleEdit}
              className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white shadow-md hover:shadow-lg smooth-transition"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar perfil
            </Button>
          )}
        </header>

        {/* ==================== MENSAGEM DE SUCESSO ==================== */}
        {showSuccess && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 card-bounce shadow-sm">
            <div className="p-1 bg-green-100 rounded-full">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-green-800 font-medium">
              Perfil atualizado com sucesso!
            </span>
          </div>
        )}

        {/* ==================== LAYOUT PRINCIPAL ==================== */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ==================== COLUNA 1 - PERFIL DO USUÁRIO ==================== */}
          <aside className="lg:col-span-1">
            <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl smooth-transition card-bounce card-bounce-delay-1">
              <CardContent className="p-8 text-center">
                <div className="space-y-6">
                  {/* Avatar do Usuário */}
                  <div className="relative inline-block">
                    <div className="w-32 h-32 bg-gradient-to-br from-violet-500 to-violet-700 rounded-full flex items-center justify-center mx-auto shadow-lg ring-4 ring-violet-100">
                      <User className="h-16 w-16 text-white" />
                    </div>
                    <button
                      onClick={handlePhotoChange}
                      className="absolute -bottom-2 -right-2 bg-white border-2 border-violet-300 rounded-full p-2 hover:bg-violet-50 hover:scale-110 smooth-transition shadow-md"
                      title="Alterar foto"
                    >
                      <Camera className="h-4 w-4 text-violet-600" />
                    </button>
                  </div>

                  {/* Informações do Usuário */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {formData.nome}
                    </h3>
                    <p className="text-gray-600 flex items-center justify-center gap-2">
                      <UserCircle className="h-4 w-4" />
                      Estudante
                    </p>
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex gap-3">
                    <Button
                      onClick={handlePhotoChange}
                      variant="outline"
                      size="sm"
                      className="flex-1 flex items-center justify-center border-violet-300 text-violet-600 hover:bg-violet-50 hover:border-violet-400 smooth-transition"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      <span>Alterar foto</span>
                    </Button>

                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      size="sm"
                      className="flex-1 flex items-center justify-center border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 smooth-transition"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Sair</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* ==================== COLUNA 2 - DADOS ==================== */}
          <section className="lg:col-span-2 space-y-6">
            {/* Dados Institucionais */}
            <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl smooth-transition card-bounce card-bounce-delay-2">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  Dados Institucionais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dadosInstitucionais.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {item.label}
                      </label>
                      <input
                        type="text"
                        value={item.value}
                        disabled
                        className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 cursor-not-allowed focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dados Pessoais */}
            <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl smooth-transition card-bounce card-bounce-delay-3">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-violet-100 rounded-lg">
                    <UserCircle className="h-5 w-5 text-violet-600" />
                  </div>
                  Dados Pessoais
                </h3>
                <div className="space-y-6">
                  {/* Nome Completo */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) =>
                        handleInputChange("nome", e.target.value)
                      }
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                        !isEditing
                          ? "bg-gray-100 border-gray-300 text-gray-800 cursor-not-allowed"
                          : errors.nome
                          ? "bg-white border-red-300 text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          : "bg-white border-violet-300 text-gray-900 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      } focus:outline-none`}
                    />
                    {errors.nome && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errors.nome}
                      </div>
                    )}
                  </div>

                  {/* Celular */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Celular
                    </label>
                    <input
                      type="text"
                      value={formData.celular}
                      onChange={(e) =>
                        handleInputChange("celular", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="+55 XX XXXXX-XXXX"
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                        !isEditing
                          ? "bg-gray-100 border-gray-300 text-gray-800 cursor-not-allowed"
                          : errors.celular
                          ? "bg-white border-red-300 text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          : "bg-white border-violet-300 text-gray-900 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      } focus:outline-none`}
                    />
                    {errors.celular && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errors.celular}
                      </div>
                    )}
                  </div>

                  {/* Botões de Ação */}
                  {isEditing && (
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={!hasChanges}
                        className={`${
                          hasChanges
                            ? "bg-violet-600 hover:bg-violet-700 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        } smooth-transition`}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Salvar alterações
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>

      {/* Componente de Notificação */}
      <NotificationCard
        show={showNotification}
        onClose={() => setShowNotification(false)}
        message={notificationMessage}
        type={notificationType}
      />
    </div>
  );
}
