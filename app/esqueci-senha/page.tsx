"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import { Button } from "../../src/components/ui/Button";
import { Card, CardContent, CardHeader } from "../../src/components/ui/Card";
import { Input } from "../../src/components/ui/Input";
import { Label } from "../../src/components/ui/Label";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  function handleSubmit() {
    if (!email) {
      setMessage("Digite seu e-mail.");
      return;
    }

    setLoading(true);
    setMessage("");

    // Simular envio de email
    setTimeout(() => {
      setLoading(false);
      setMessage(
        "Se o e-mail existir, você receberá as instruções para redefinir sua senha."
      );
    }, 1000);
  }

  return (
    <>
      <Head>
        <title>Esqueci minha senha • Coins for Study</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <h1 className="text-2xl font-bold text-primary-600 mb-2">
              Esqueci minha senha
            </h1>
            <p className="text-secondary-600">
              Digite seu e-mail para receber as instruções
            </p>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>E-mail</Label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {message && (
                <p
                  className={`text-sm ${
                    message.includes("receberá")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {message}
                </p>
              )}

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full"
                isLoading={loading}
              >
                Enviar instruções
              </Button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-primary-600 hover:text-primary-700 text-sm"
                >
                  Voltar para o login
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
