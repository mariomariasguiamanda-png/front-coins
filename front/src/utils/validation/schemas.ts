import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Digite um email válido")
    .required("Email é obrigatório"),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .required("Senha é obrigatória"),
  role: yup
    .string()
    .required("Perfil é obrigatório")
    .oneOf(["student", "teacher", "admin"], "Selecione um perfil válido"),
});

export const registerSchema = yup.object({
  name: yup
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .required("Nome é obrigatório"),
  email: yup
    .string()
    .email("Digite um email válido")
    .required("Email é obrigatório"),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .required("Senha é obrigatória"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "As senhas devem ser iguais")
    .required("Confirmação de senha é obrigatória"),
});

export const profileSchema = yup.object({
  name: yup
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .required("Nome é obrigatório"),
  email: yup
    .string()
    .email("Digite um email válido")
    .required("Email é obrigatório"),
  phone: yup
    .string()
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Formato inválido: (11) 99999-9999")
    .optional(),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
export type RegisterFormData = yup.InferType<typeof registerSchema>;
export type ProfileFormData = yup.InferType<typeof profileSchema>;
