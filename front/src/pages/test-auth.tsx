import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import { fetchUserPapel, getDashboardPath } from '@/lib/authRole'

export default function TestAuth() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState<'aluno'|'professor'|'admin'>('aluno')
  const [log, setLog] = useState<any>(null)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const afterAuthRedirect = async () => {
    const papel = await fetchUserPapel()
    if (!papel) { setErr('Não foi possível determinar seu papel.'); return }
    const path = getDashboardPath(papel)
    router.push(path)
  }

  const signUp = async () => {
    setErr(null); setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome, tipo_usuario: tipo } },
    })
    setLoading(false)
    setLog(error ?? data)

    // Se "Confirm email" estiver DESATIVADO, você já terá sessão e pode redirecionar:
    const { data: sess } = await supabase.auth.getSession()
    if (sess.session) await afterAuthRedirect()
    else alert('Cadastro criado! Verifique seu e-mail (se confirmação estiver ativa) e faça login.')
  }

  const signIn = async () => {
    setErr(null); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setErr(error.message); return }
    await afterAuthRedirect()
  }

  return (
    <div style={{ padding: 32 }}>
      <h1>Teste Auth Supabase</h1>
      <input placeholder="Nome (signup)" value={nome} onChange={e=>setNome(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Senha" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <select value={tipo} onChange={e=>setTipo(e.target.value as any)}>
        <option value="aluno">Aluno</option>
        <option value="professor">Professor</option>
        <option value="admin">Admin</option>
      </select>
      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button disabled={loading} onClick={signUp}>Sign Up</button>
        <button disabled={loading} onClick={signIn}>Sign In</button>
      </div>
      {err && <p style={{ color: 'red' }}>{err}</p>}
      <pre>{JSON.stringify(log, null, 2)}</pre>
    </div>
  )
}
