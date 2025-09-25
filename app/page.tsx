'use client'

export default function RootPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center">
      <div className="max-w-md w-full px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">Coins</h1>
          <p className="text-secondary-600">Sistema de Gestão Educacional</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-center mb-6">Bem-vindo!</h2>
          
          <div className="space-y-4">
            <a
              href="/login"
              className="block w-full text-center bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
            >
              Fazer Login
            </a>
            
            <a
              href="/cadastro"
              className="block w-full text-center bg-secondary-100 hover:bg-secondary-200 text-secondary-900 font-medium py-3 px-4 rounded-lg transition duration-200"
            >
              Criar Conta
            </a>
            
            <a
              href="/homepage"
              className="block w-full text-center border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white font-medium py-3 px-4 rounded-lg transition duration-200"
            >
              Visitar Homepage
            </a>
          </div>
          
          <div className="mt-6 pt-6 border-t border-secondary-200">
            <p className="text-sm text-secondary-600 text-center">
              Dados de teste:
            </p>
            <p className="text-xs text-secondary-500 text-center mt-1">
              Admin: admin@test.com / 123456<br/>
              Usuário: user@test.com / 123456
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}