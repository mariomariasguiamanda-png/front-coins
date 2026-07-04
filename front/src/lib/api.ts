export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Uploads (foto de perfil, anexos de suporte etc.) voltam da API como caminho
// relativo (ex: "/uploads/avatars/x.jpg"); pra exibir como <img src>, precisa
// virar URL absoluta apontando pro backend.
export function resolveMediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path}`;
}

export const api = {
  async get(endpoint: string, options: RequestInit = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },
  async post(endpoint: string, data: any, options: RequestInit = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async put(endpoint: string, data: any, options: RequestInit = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async patch(endpoint: string, data: any, options: RequestInit = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  async delete(endpoint: string, options: RequestInit = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  },

  // Envio de multipart/form-data (upload de foto, anexos etc.) - sem JSON.stringify
  // e sem forçar Content-Type (o browser define o boundary sozinho).
  async upload(endpoint: string, formData: FormData, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('coins_token') : null;

    const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: options.method ?? 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      await handleErrorResponse(response);
    }

    return response.json();
  },

  async request(endpoint: string, options: RequestInit) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('coins_token') : null;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      await handleErrorResponse(response);
    }

    return response.json();
  }
};

async function handleErrorResponse(response: Response): Promise<never> {
  if (response.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('coins_token');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  let errorMsg = 'Erro na requisição';
  try {
    const errorData = await response.json();
    errorMsg = errorData.message || errorMsg;
  } catch (e) {}
  throw new Error(errorMsg);
}
