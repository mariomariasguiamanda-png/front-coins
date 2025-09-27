export default function Custom404() {
  return (
    <div className="min-h-dvh grid place-items-center bg-[#121214] text-white">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">404</h1>
        <p>Página não encontrada.</p>
        <a href="/login" className="text-[#996DFF] underline">
          Voltar para o login
        </a>
      </div>
    </div>
  );
}
