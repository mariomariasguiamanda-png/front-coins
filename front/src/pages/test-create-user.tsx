export default function TestCreateUser() {
  async function testar() {
    const resp = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Teste User",
        email: "teste" + Math.floor(Math.random()*9999) + "@exemplo.com",
        phone: "(11) 99999-9999",
        type: "student",
        status: "active",
        password: "123456",
      }),
    });

    const body = await resp.json();
    console.log("STATUS:", resp.status);
    console.log("BODY:", body);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Teste CRIAÇÃO</h1>
      <button onClick={testar}>Criar usuário teste</button>
    </div>
  );
}
