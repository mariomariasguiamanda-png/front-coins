import { useState } from "react";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useRouter } from "next/router";

interface FormData {
  name: string;
  email: string;
  type: "student" | "teacher";
  cpf: string;
  birthDate: string;
  phone: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  registration?: string;
  subject?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  type?: string;
  cpf?: string;
  birthDate?: string;
  phone?: string;
  address?: {
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
}

export default function NovoUsuarioPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    type: "student",
    cpf: "",
    birthDate: "",
    phone: "",
    address: {
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: ""
    }
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "E-mail inválido";
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = "CPF é obrigatório";
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "Data de nascimento é obrigatória";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
    }

    // Validação do endereço
    const addressErrors: FormErrors["address"] = {};
    
    if (!formData.address.street.trim()) {
      addressErrors.street = "Rua é obrigatória";
    }
    if (!formData.address.number.trim()) {
      addressErrors.number = "Número é obrigatório";
    }
    if (!formData.address.neighborhood.trim()) {
      addressErrors.neighborhood = "Bairro é obrigatório";
    }
    if (!formData.address.city.trim()) {
      addressErrors.city = "Cidade é obrigatória";
    }
    if (!formData.address.state.trim()) {
      addressErrors.state = "Estado é obrigatório";
    }
    if (!formData.address.zipCode.trim()) {
      addressErrors.zipCode = "CEP é obrigatório";
    }

    if (Object.keys(addressErrors).length > 0) {
      newErrors.address = addressErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear related error
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setErrors((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: undefined
        }
      }));
    } else if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Placeholder for API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form data:", formData);
      
      setShowSuccess(true);
      // Reset form
      setFormData({
        name: "",
        email: "",
        type: "student",
        cpf: "",
        birthDate: "",
        phone: "",
        address: {
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          city: "",
          state: "",
          zipCode: ""
        }
      });
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Novo Usuário</h1>
            <p className="text-muted-foreground">
              Adicione um novo aluno ou professor ao sistema
            </p>
          </div>
        </header>

        <Card className="max-w-3xl mx-auto rounded-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {showSuccess && (
                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-lg flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  <p>Usuário criado com sucesso!</p>
                </div>
              )}

              <div className="space-y-6">
                {/* Tipo de Usuário e Matrícula/Disciplina */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Usuário*</Label>
                    <Select
                      name="type"
                      value={formData.type}
                      onValueChange={(value) =>
                        handleInputChange({
                          target: { name: "type", value },
                        })
                      }
                    >
                      <SelectTrigger
                        className={cn(
                          "rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200",
                          errors.type && "border-red-500"
                        )}
                      >
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Aluno</SelectItem>
                        <SelectItem value="teacher">Professor</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && (
                      <p className="text-sm text-red-500 mt-1">{errors.type}</p>
                    )}
                  </div>

                  {formData.type === "student" && (
                    <div className="space-y-2">
                      <Label htmlFor="registration">Matrícula/RA*</Label>
                      <Input
                        id="registration"
                        name="registration"
                        className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200"
                        placeholder="Digite o número de matrícula"
                        value={formData.registration || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}

                  {formData.type === "teacher" && (
                    <div className="space-y-2">
                      <Label htmlFor="subject">Disciplina Principal*</Label>
                      <Select
                        name="subject"
                        value={formData.subject}
                        onValueChange={(value) =>
                          handleInputChange({
                            target: { name: "subject", value },
                          })
                        }
                      >
                        <SelectTrigger className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200">
                          <SelectValue placeholder="Selecione a disciplina" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="math">Matemática</SelectItem>
                          <SelectItem value="portuguese">Português</SelectItem>
                          <SelectItem value="science">Ciências</SelectItem>
                          <SelectItem value="history">História</SelectItem>
                          <SelectItem value="geography">Geografia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Dados Pessoais */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">Dados Pessoais</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo*</Label>
                      <Input
                        id="name"
                        name="name"
                        className={cn(
                          "rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200",
                          errors.name && "border-red-500"
                        )}
                        placeholder="Digite o nome completo"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF*</Label>
                      <Input
                        id="cpf"
                        name="cpf"
                        className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200"
                        placeholder="000.000.000-00"
                        value={formData.cpf}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Data de Nascimento*</Label>
                      <Input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone*</Label>
                      <Input
                        id="phone"
                        name="phone"
                        className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200"
                        placeholder="(00) 00000-0000"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail*</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        className={cn(
                          "rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200",
                          errors.email && "border-red-500"
                        )}
                        placeholder="Digite o e-mail institucional"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Endereço */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">Endereço</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="street">Rua*</Label>
                      <Input
                        id="street"
                        name="address.street"
                        className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200"
                        placeholder="Digite o nome da rua"
                        value={formData.address.street}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="number">Número*</Label>
                      <Input
                        id="number"
                        name="address.number"
                        className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200"
                        placeholder="Nº"
                        value={formData.address.number}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="complement">Complemento</Label>
                      <Input
                        id="complement"
                        name="address.complement"
                        className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200"
                        placeholder="Apto, Bloco, etc."
                        value={formData.address.complement}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="neighborhood">Bairro*</Label>
                      <Input
                        id="neighborhood"
                        name="address.neighborhood"
                        className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200"
                        placeholder="Digite o bairro"
                        value={formData.address.neighborhood}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode">CEP*</Label>
                      <Input
                        id="zipCode"
                        name="address.zipCode"
                        className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200"
                        placeholder="00000-000"
                        value={formData.address.zipCode}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade*</Label>
                      <Input
                        id="city"
                        name="address.city"
                        className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200"
                        placeholder="Digite a cidade"
                        value={formData.address.city}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">Estado*</Label>
                      <Select
                        name="address.state"
                        value={formData.address.state}
                        onValueChange={(value) =>
                          handleInputChange({
                            target: { name: "address.state", value },
                          })
                        }
                      >
                        <SelectTrigger className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200">
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SP">São Paulo</SelectItem>
                          <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                          <SelectItem value="MG">Minas Gerais</SelectItem>
                          <SelectItem value="ES">Espírito Santo</SelectItem>
                          <SelectItem value="PR">Paraná</SelectItem>
                          <SelectItem value="SC">Santa Catarina</SelectItem>
                          <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-lg"
                  onClick={() => router.push("/adm/usuarios")}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="rounded-lg bg-violet-600 hover:bg-violet-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}