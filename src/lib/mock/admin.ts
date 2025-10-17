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