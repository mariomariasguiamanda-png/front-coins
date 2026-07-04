"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  registerSchema,
  RegisterFormData,
} from "../../utils/validation/schemas";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface RegisterFormProps {
  onSubmit: (
    data: Omit<RegisterFormData, "confirmPassword">
  ) => Promise<boolean>;
  isLoading?: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [submitError, setSubmitError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const handleFormSubmit = async (data: RegisterFormData) => {
    setSubmitError("");

    try {
      const { confirmPassword, ...submitData } = data;
      const success = await onSubmit(submitData);
      if (!success) {
        setSubmitError("Erro ao criar conta. Tente novamente.");
      }
    } catch (error) {
      setSubmitError("Erro ao criar conta. Tente novamente.");
    }
  };

  return (
    <Card title="Criar Conta" subtitle="Preencha os dados para se cadastrar">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Nome completo"
          {...register("name")}
          error={errors.name?.message}
          placeholder="Seu nome completo"
        />

        <Input
          label="Email"
          type="email"
          {...register("email")}
          error={errors.email?.message}
          placeholder="seu@email.com"
        />

        <Input
          label="Senha"
          type="password"
          {...register("password")}
          error={errors.password?.message}
          placeholder="••••••••"
          helperText="Mínimo de 6 caracteres"
        />

        <Input
          label="Confirmar senha"
          type="password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
          placeholder="••••••••"
        />

        {submitError && (
          <div className="text-red-500 text-sm text-center">{submitError}</div>
        )}

        <Button
          type="submit"
          className="w-full"
          isLoading={isSubmitting || isLoading}
          disabled={isSubmitting || isLoading}
        >
          Criar conta
        </Button>
      </form>
    </Card>
  );
};
