import { supabase } from "@/lib/supabaseClient";

export default function TestSupabase() {
  async function testar() {
    const { data, error } = await supabase.from("usuarios").select("*").limit(1);
    console.log("DATA:", data);
    console.log("ERROR:", error);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Teste Supabase</h1>
      <button onClick={testar}>Testar conexão</button>
    </div>
  );
}
