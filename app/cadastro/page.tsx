"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RegisterForm } from "../../src/components/forms/RegisterForm";
import { useAuth } from "../../src/services/auth/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuth();

  const handleRegister = async (data: {
    name: string;
    email: string;
    password: string;
  }): Promise<boolean> => {
    const success = await registerUser(data);
    if (success) {
      router.push("/homepage");
    }
    return success;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center py-12">
      <div className="max-w-md w-full px-6">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            Coins
          </Link>
          <p className="text-secondary-600 mt-2">Crie sua conta</p>
        </div>

        <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />

        <div className="text-center mt-6">
          <p className="text-secondary-600">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
