export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatPhone = (phone: string): string => {
  // Remove tudo que não é dígito
  const onlyNumbers = phone.replace(/\D/g, "");

  // Aplica a máscara (11) 99999-9999
  if (onlyNumbers.length === 11) {
    return onlyNumbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  // Aplica a máscara (11) 9999-9999 para números com 10 dígitos
  if (onlyNumbers.length === 10) {
    return onlyNumbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  return phone;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Garante formatação numérica consistente entre SSR e CSR
export const formatNumber = (
  value: number,
  options: Intl.NumberFormatOptions = {}
): string => {
  const formatter = new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 0,
    ...options,
  });
  return formatter.format(value);
};
