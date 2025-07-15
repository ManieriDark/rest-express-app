import React, { useState } from 'react';
import { LogOut, Upload, Camera, FileText, Check, User, Phone, Mail, MapPin, Calendar, Plus, Trash2, Info, AlertCircle, CheckCircle2, Clock, Download, MessageCircle, Bot, X, Send, Bell, MessageSquare } from 'lucide-react';
import AbmixLogo from './AbmixLogo';
import ActionButtons from './ActionButtons';
import InternalMessage from './InternalMessage';
import NotificationCenter from './NotificationCenter';
import ClientForm from './ClientForm';
import ProposalForm from './ProposalForm';
import ProgressBar from './ProgressBar';
import ProposalProgressTracker from './ProposalProgressTracker';
import { showNotification as utilShowNotification } from '../utils/notifications';

interface ClientPortalProps {
  user: any;
  onLogout: () => void;
}

interface Proposal {
  id: string;
  status: string;
  date: string;
  plan: string;
  value: string;
  documents: number;
  lastUpdate: string;
}

interface Cotacao {
  id: string;
  operadora: string;
  tipoplano: string;
  numeroVidas: number;
  valor: string;
  validade: string;
  dataEnvio: string;
  arquivos: File[];
}

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ClientPortal: React.FC<ClientPortalProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'cotacoes' | 'profile' | 'complete-proposal'>('cotacoes');
  const [showChat, setShowChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showInternalMessage, setShowInternalMessage] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Olá! Sou o assistente virtual do portal do cliente. Como posso ajudá-lo hoje?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  
  // Notificações simuladas
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Nova Cotação Recebida',
      message: 'Você recebeu uma nova cotação da Amil - R$ 1.250,00',
      type: 'document',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
      read: false,
    },
    {
      id: '2',
      title: 'Cotação Atualizada',
      message: 'A cotação da Bradesco foi atualizada com novas condições',
      type: 'approval',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 horas atrás
      read: false,
    },
  ]);

  // Dados de cotações criadas pelo vendedor (sincronizadas do ProposalGenerator)
  const cotacoes: Cotacao[] = [
    {
      id: '1',
      operadora: 'Amil',
      tipoplano: 'Empresarial',
      numeroVidas: 15,
      valor: '1.250,00',
      validade: '2024-03-15',
      dataEnvio: '2024-01-15',
      arquivos: []
    },
    {
      id: '2',
      operadora: 'Bradesco Saúde',
      tipoplano: 'Familiar',
      numeroVidas: 4,
      valor: '850,00',
      validade: '2024-03-20',
      dataEnvio: '2024-01-18',
      arquivos: []
    },
    {
      id: '3',
      operadora: 'Sulamérica',
      tipoplano: 'Individual',
      numeroVidas: 1,
      valor: '420,00',
      validade: '2024-03-25',
      dataEnvio: '2024-01-20',
      arquivos: []
    },
    {
      id: '4',
      operadora: 'Porto Seguro',
      tipoplano: 'Empresarial',
      numeroVidas: 8,
      valor: '980,00',
      validade: '2024-04-01',
      dataEnvio: '2024-01-22',
      arquivos: []
    },
    {
      id: '5',
      operadora: 'Hapvida',
      tipoplano: 'Adesão',
      numeroVidas: 12,
      valor: '720,00',
      validade: '2024-04-10',
      dataEnvio: '2024-01-25',
      arquivos: []
    }
  ];

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage,
      isBot: false,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const response = getBotResponse(newMessage);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);

    setNewMessage('');
  };

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('cotação') || lowerMessage.includes('cotacao') || lowerMessage.includes('status')) {
      return 'Você pode acompanhar suas cotações na aba "Minhas Cotações". Lá você verá todas as informações detalhadas e poderá compartilhar as cotações recebidas.';
    }
    if (lowerMessage.includes('documento') || lowerMessage.includes('anexo')) {
      return 'Para enviar documentos, acesse a aba "Documentos" ou visualize uma cotação específica para ver os detalhes completos.';
    }
    if (lowerMessage.includes('perfil') || lowerMessage.includes('dados')) {
      return 'Seus dados pessoais podem ser visualizados e editados na aba "Perfil". Mantenha sempre suas informações atualizadas.';
    }
    if (lowerMessage.includes('contato') || lowerMessage.includes('ajuda')) {
      return 'Para falar com um atendente humano, você pode ligar para (11) 99999-9999 ou enviar um email para atendimento@abmix.com.br.';
    }
    
    return 'Estou aqui para ajudar com informações sobre suas propostas, documentos necessários e dados do seu perfil. Como posso auxiliá-lo?';
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium ${
      type === 'success' ? 'bg-green-500' : 
      type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Rejeitado';
      default:
        return 'Desconhecido';
    }
  };

  const renderCotacoesTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Minhas Cotações</h2>
          <p className="text-sm text-gray-600 mt-1">
            Visualize todas as cotações criadas pelo seu vendedor
          </p>
        </div>
        
        {cotacoes.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma cotação disponível</h3>
            <p className="text-gray-600">Aguarde seu vendedor criar suas primeiras cotações.</p>
          </div>
        ) : (
          <div className="space-y-4 p-6">
            {cotacoes.map((cotacao) => (
              <div key={cotacao.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Data de Envio</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(cotacao.dataEnvio).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Operadora</label>
                    <p className="text-sm text-gray-900 mt-1 font-medium">{cotacao.operadora}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo do Plano</label>
                    <p className="text-sm text-gray-900 mt-1">{cotacao.tipoplano}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Número de Vidas</label>
                    <p className="text-sm text-gray-900 mt-1 font-medium">{cotacao.numeroVidas}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Valor</label>
                    <p className="text-lg font-bold text-green-600 mt-1">R$ {cotacao.valor}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Validade da Cotação</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(cotacao.validade).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Arquivos Anexados</label>
                    <p className="text-sm text-gray-900 mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <FileText className="w-3 h-3 mr-1" />
                        {cotacao.arquivos.length} arquivo(s)
                      </span>
                    </p>
                  </div>
                </div>



                {/* Simulação de arquivos anexados para demonstração */}
                {cotacao.id === '1' && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Documentos da Cotação:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-white rounded border">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-700">Cotacao_Amil_Empresarial.pdf</span>
                          <span className="text-xs text-gray-500 ml-2">(245 KB)</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded border">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-700">Tabela_Precos_2024.xlsx</span>
                          <span className="text-xs text-gray-500 ml-2">(89 KB)</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {cotacao.id === '2' && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Documentos da Cotação:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-white rounded border">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-700">Proposta_Bradesco_Familiar.pdf</span>
                          <span className="text-xs text-gray-500 ml-2">(312 KB)</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ações - Mesmos ícones do ActionButtons */}
                <div className="flex justify-end border-t border-gray-200 pt-4">
                  <ActionButtons
                    onView={() => {
                      showNotification('Visualizando detalhes da cotação', 'info');
                    }}
                    onCopyLink={() => {
                      navigator.clipboard.writeText(`Cotação ${cotacao.id} - ${cotacao.operadora} - R$ ${cotacao.valor}`);
                      showNotification('Link da cotação copiado!', 'success');
                    }}
                    onWhatsApp={() => {
                      const mensagem = `Cotação ${cotacao.operadora} - ${cotacao.tipoplano} - R$ ${cotacao.valor}`;
                      const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
                      window.open(url, '_blank');
                      showNotification('Redirecionando para WhatsApp...', 'success');
                    }}
                    onEmail={() => {
                      const assunto = `Cotação ${cotacao.operadora} - ${cotacao.tipoplano}`;
                      const corpo = `Cotação recebida:\n\nOperadora: ${cotacao.operadora}\nTipo: ${cotacao.tipoplano}\nVidas: ${cotacao.numeroVidas}\nValor: R$ ${cotacao.valor}\nValidade: ${new Date(cotacao.validade).toLocaleDateString('pt-BR')}`;
                      const url = `mailto:?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
                      window.location.href = url;
                      showNotification('Abrindo cliente de email...', 'success');
                    }}
                    onDownload={() => {
                      const dadosCotacao = {
                        id: cotacao.id,
                        operadora: cotacao.operadora,
                        tipoplano: cotacao.tipoplano,
                        numeroVidas: cotacao.numeroVidas,
                        valor: cotacao.valor,
                        validade: cotacao.validade,
                        dataEnvio: cotacao.dataEnvio
                      };
                      const dataStr = JSON.stringify(dadosCotacao, null, 2);
                      const dataBlob = new Blob([dataStr], { type: 'application/json' });
                      const url = URL.createObjectURL(dataBlob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `cotacao-${cotacao.id}.json`;
                      link.click();
                      showNotification('Cotação baixada com sucesso!', 'success');
                    }}
                    onExternalLink={() => {
                      showNotification('Funcionalidade de link externo será implementada', 'info');
                    }}
                    onShare={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: `Cotação ${cotacao.operadora}`,
                          text: `Cotação ${cotacao.operadora} - ${cotacao.tipoplano} - R$ ${cotacao.valor}`,
                          url: window.location.href
                        });
                      } else {
                        navigator.clipboard.writeText(`Cotação ${cotacao.operadora} - ${cotacao.tipoplano} - R$ ${cotacao.valor}`);
                        showNotification('Cotação copiada para área de transferência!', 'success');
                      }
                    }}
                    onMessage={() => setShowInternalMessage(true)}
                    userRole="client"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Internal Message Modal */}
        {showInternalMessage && (
          <InternalMessage 
            isOpen={showInternalMessage}
            onClose={() => setShowInternalMessage(false)}
            currentUser={{
              name: user.name,
              role: 'client'
            }}
          />
        )}
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Meu Perfil</h2>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-teal-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{user.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{user.email}</p>
              <button className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                Alterar Foto
              </button>
            </div>
          </div>
          
          <div className="md:w-2/3">
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    type="tel"
                    defaultValue="(11) 99999-9999"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                  <input
                    type="text"
                    defaultValue="123.456.789-00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <input
                  type="text"
                  defaultValue="Rua das Flores, 123 - Centro, São Paulo - SP"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              
              <div className="pt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferências de Notificação</h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Notificações por Email</p>
              <p className="text-sm text-gray-600">Receba atualizações sobre suas propostas</p>
            </div>
            <div className="relative inline-block w-12 h-6">
              <input type="checkbox" id="toggle-email" className="sr-only" defaultChecked />
              <div className="block bg-gray-300 w-12 h-6 rounded-full"></div>
              <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Notificações por WhatsApp</p>
              <p className="text-sm text-gray-600">Receba mensagens sobre status de propostas</p>
            </div>
            <div className="relative inline-block w-12 h-6">
              <input type="checkbox" id="toggle-whatsapp" className="sr-only" defaultChecked />
              <div className="block bg-gray-300 w-12 h-6 rounded-full"></div>
              <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Lembretes de Documentos</p>
              <p className="text-sm text-gray-600">Receba lembretes sobre documentos pendentes</p>
            </div>
            <div className="relative inline-block w-12 h-6">
              <input type="checkbox" id="toggle-reminders" className="sr-only" defaultChecked />
              <div className="block bg-gray-300 w-12 h-6 rounded-full"></div>
              <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <AbmixLogo size={40} className="mr-3" />
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">Portal do Cliente</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <NotificationCenter 
                  notifications={notifications}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                  onClose={() => setShowNotifications(false)}
                />
              )}
              
              <button
                onClick={() => setShowInternalMessage(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
              
              <span className="text-sm text-gray-600">Olá, {user.name}</span>
              
              <button
                onClick={onLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Área do Cliente</h1>
          <p className="text-gray-600">Gerencie suas propostas e documentos</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('cotacoes')}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'cotacoes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Minhas Cotações
              </button>
              
              <button
                onClick={() => setActiveTab('complete-proposal')}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'complete-proposal'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Check className="w-4 h-4 mr-2" />
                Completar Proposta
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <User className="w-4 h-4 mr-2" />
                Perfil
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'cotacoes' && renderCotacoesTab()}
          {activeTab === 'complete-proposal' && (
            <ProposalForm 
              isVendor={false}
              prefilledData={{
                contractData: {
                  nomeEmpresa: 'Tech Solutions Ltda',
                  cnpj: '12.345.678/0001-90',
                  planoContratado: 'Plano Empresarial',
                  valor: '1.250,00',
                  periodoVigencia: { inicio: '2024-02-01', fim: '2025-01-31' },
                  odontoConjugado: true,
                  compulsorio: false,
                  inicioVigencia: '2024-02-01',
                  aproveitamentoCongenere: true,
                },
                attachments: []
              }}
              onSave={(data) => {
                console.log('Dados salvos:', data);
                utilShowNotification('Dados salvos com sucesso!', 'success');
              }}
              onSend={(data) => {
                console.log('Proposta enviada:', data);
                utilShowNotification('Proposta enviada com sucesso!', 'success');
              }}
            />
          )}
          {activeTab === 'profile' && renderProfileTab()}
        </div>
      </main>

      {/* Chatbot */}
      <div className="chatbot-container">
        {showChat ? (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 h-96 flex flex-col">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-bold">Assistente do Cliente</h3>
                  <p className="text-xs text-blue-100">Online agora</p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-xs p-3 rounded-2xl ${
                    message.isBot 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isBot ? 'text-gray-500' : 'text-blue-100'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowChat(true)}
            className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 flex items-center justify-center"
          >
            <MessageCircle className="w-8 h-8" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ClientPortal;