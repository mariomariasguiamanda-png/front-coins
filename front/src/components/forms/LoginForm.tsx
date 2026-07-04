"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema, LoginFormData } from "../../utils/validation/schemas";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<boolean>;
  isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [submitError, setSubmitError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const handleFormSubmit = async (data: LoginFormData) => {
    setSubmitError("");

    try {
      const success = await onSubmit(data);
      if (!success) {
        setSubmitError("Email ou senha incorretos");
      }
    } catch (error) {
      setSubmitError("Erro ao fazer login. Tente novamente.");
    }
  };

  return (
    <Card title="Entrar" subtitle="Acesse sua conta">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
          Entrar
        </Button>
      </form>
    </Card>
  );
};
