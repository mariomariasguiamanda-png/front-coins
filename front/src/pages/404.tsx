export default function Custom404() {
  return (
    <div className="min-h-dvh grid place-items-center bg-white text-black">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">404</h1>
        <p>Página não encontrada.</p>
        <a href="/login" className="text-blue-600 underline">
          Voltar para o login
        </a>
      </div>
    </div>
  );
}
