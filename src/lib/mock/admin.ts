export type AdminNotificacao = {
  id: string;
  titulo: string;
  mensagem: string;
  dataHora: string;
  lida: boolean;
  icone: string;
  tipo: 'sistema' | 'usuario' | 'relatorio' | 'alerta';
};

export const admin = {
  nome: 'Admin Sistema',
  email: 'admin@coinsfs.com',
  cargo: 'Administrador',
  avatar: null,
};

export const adminNotificacoes: AdminNotificacao[] = [
  {
    id: '1',
    titulo: 'Novo usuário registrado',
    mensagem: 'Um novo professor foi registrado na plataforma e aguarda aprovação.',
    dataHora: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutos atrás
    lida: false,
    icone: '👤',
    tipo: 'usuario'
  },
  {
    id: '2',
    titulo: 'Relatório mensal disponível',
    mensagem: 'O relatório de atividades do mês está disponível para análise.',
    dataHora: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 horas atrás
    lida: false,
    icone: '📊',
    tipo: 'relatorio'
  },
  {
    id: '3',
    titulo: 'Alerta de sistema',
    mensagem: 'Detectado alto consumo de recursos no servidor.',
    dataHora: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 horas atrás
    lida: false,
    icone: '⚠️',
    tipo: 'alerta'
  }
];
// Mock data para área do administrador

export type Notificacao = {
  id: string;
  titulo: string;
  mensagem: string;
  dataHora: string;
  lida: boolean;
  icone: string;
  cor: string;
  tipo?: string;
};

export const admin = {
  nome: "Administrador",
  email: "admin@coinsforastudy.com",
};

export const notificacoes: Notificacao[] = [
  {
    id: "1",
    titulo: "Novo usuário cadastrado",
    mensagem: "Professor João Silva se cadastrou na plataforma",
    dataHora: "2025-10-08T10:30:00",
    lida: false,
    icone: "👤",
    cor: "text-blue-600",
    tipo: "usuario",
  },
  {
    id: "2",
    titulo: "Sistema atualizado",
    mensagem: "Nova versão da plataforma foi implantada com sucesso",
    dataHora: "2025-10-08T09:15:00",
    lida: false,
    icone: "🔄",
    cor: "text-green-600",
    tipo: "sistema",
  },
  {
    id: "3",
    titulo: "Relatório mensal",
    mensagem: "Relatório de atividades do mês de setembro está disponível",
    dataHora: "2025-10-07T14:20:00",
    lida: true,
    icone: "📊",
    cor: "text-purple-600",
    tipo: "relatorio",
  },
  {
    id: "4",
    titulo: "Backup concluído",
    mensagem: "Backup automático dos dados foi realizado com sucesso",
    dataHora: "2025-10-07T02:00:00",
    lida: true,
    icone: "💾",
    cor: "text-gray-600",
    tipo: "backup",
  },
  {
    id: "5",
    titulo: "Manutenção programada",
    mensagem: "Manutenção do sistema programada para este fim de semana",
    dataHora: "2025-10-06T16:45:00",
    lida: true,
    icone: "🔧",
    cor: "text-orange-600",
    tipo: "manutencao",
  },
];
