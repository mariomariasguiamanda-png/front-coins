import { supabase } from '@/lib/supabaseClient'

export type Papel = 'aluno' | 'professor' | 'admin'

export function getDashboardPath(papel: Papel) {
  switch (papel) {
    case 'admin': return '/adm/dashboard'
    case 'professor': return '/prof/dashboard'
    case 'aluno':
    default: return '/aluno/dashboard'
  }
}

export async function fetchUserPapel(): Promise<Papel | null> {
  const { data: auth } = await supabase.auth.getUser()
  const user = auth?.user
  if (!user) return null

  // lê na tabela `usuarios` o tipo_usuario do usuário logado
  const { data, error } = await supabase
    .from('usuarios')
    .select('tipo_usuario')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (error) {
    console.error('[fetchUserPapel] erro:', error.message)
    return null
  }
  return (data?.tipo_usuario ?? 'aluno') as Papel
}
