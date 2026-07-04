const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(response.status, errorText || "Erro na requisição");
  }

  const data = await response.json();
  return data;
};

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return handleResponse<T>(response);
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return handleResponse<T>(response);
  },

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return handleResponse<T>(response);
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return handleResponse<T>(response);
  },
};

// Funções específicas da API
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<ApiResponse<{ user: any; token: string }>>("/auth/login", {
      email,
      password,
    }),

  register: (userData: { name: string; email: string; password: string }) =>
    apiClient.post<ApiResponse<{ user: any; token: string }>>(
      "/auth/register",
      userData
    ),

  logout: () => apiClient.post<ApiResponse<null>>("/auth/logout", {}),

  refreshToken: () =>
    apiClient.post<ApiResponse<{ token: string }>>("/auth/refresh", {}),
};

export const userApi = {
  getProfile: () => apiClient.get<ApiResponse<any>>("/user/profile"),

  updateProfile: (userData: any) =>
    apiClient.put<ApiResponse<any>>("/user/profile", userData),
};