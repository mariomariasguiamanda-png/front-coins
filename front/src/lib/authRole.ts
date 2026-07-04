import { api } from '@/lib/api'

export type Papel = 'aluno' | 'professor' | 'admin'

export function getDashboardPath(papel: Papel) {
  switch (papel) {
    case 'admin': return '/adm/dashboard'
    case 'professor': return '/professor/dashboard'
    case 'aluno':
    default: return '/aluno/inicio'
  }
}

// O papel já vem no retorno do login (`tipo_usuario`) ou de GET /auth/me - não é mais
// necessário consultar o Supabase para descobrir isso.
export async function fetchUserPapel(): Promise<Papel | null> {
  try {
    const data = await api.get('/auth/me')
    return (data?.tipo_usuario ?? null) as Papel | null
  } catch (error) {
    console.error('[fetchUserPapel] erro:', error)
    return null
  }
}
