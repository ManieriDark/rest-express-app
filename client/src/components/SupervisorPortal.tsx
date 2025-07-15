import React, { useState } from 'react';
import { LogOut, BarChart3, Users, FileText, DollarSign, TrendingUp, CheckCircle, AlertCircle, Eye, Download, Calendar, Filter, Search, Bell, Settings, Target, PieChart, Calculator, MessageSquare, X } from 'lucide-react';
import AbmixLogo from './AbmixLogo';
import ActionButtons from './ActionButtons';
import InternalMessage from './InternalMessage';
import NotificationCenter from './NotificationCenter';
import ProgressBar from './ProgressBar';
import ProposalProgressTracker from './ProposalProgressTracker';
import { showNotification } from '../utils/notifications';

interface SupervisorPortalProps {
  user: any;
  onLogout: () => void;
}

type SupervisorView = 'dashboard' | 'reports' | 'analytics' | 'team' | 'settings';

const SupervisorPortal: React.FC<SupervisorPortalProps> = ({ user, onLogout }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [activeView, setActiveView] = useState<SupervisorView>('dashboard');
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showInternalMessage, setShowInternalMessage] = useState(false);

  // Notificações simuladas
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Nova proposta criada',
      message: 'Ana Caroline criou uma nova proposta para Empresa ABC Ltda',
      type: 'document',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
      read: false,
    },
    {
      id: '2',
      title: 'Meta atingida',
      message: 'Bruna Garcia atingiu 100% da meta mensal de vendas',
      type: 'approval',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
      read: false,
    },
    {
      id: '3',
      title: 'Relatório mensal disponível',
      message: 'O relatório gerencial de Abril/2024 está disponível para análise',
      type: 'document',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia atrás
      read: false,
    },
    {
      id: '4',
      title: 'Alerta de conversão',
      message: 'A taxa de conversão caiu 5% na última semana',
      type: 'alert',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 dias atrás
      read: true,
    },
    {
      id: '5',
      title: 'Nova mensagem',
      message: 'Carlos Silva enviou uma mensagem sobre a equipe de vendas',
      type: 'message',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 dias atrás
      read: true,
    },
  ]);

  const supervisorStats = [
    {
      name: 'Total de Propostas',
      value: '156',
      change: '+12% este mês',
      changeType: 'positive',
      icon: FileText,
      color: 'blue',
    },
    {
      name: 'Taxa de Conversão',
      value: '68%',
      change: '+5% vs mês anterior',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'green',
    },
    {
      name: 'Receita Total',
      value: 'R$ 89.450',
      change: '+18% este mês',
      changeType: 'positive',
      icon: DollarSign,
      color: 'purple',
    },
    {
      name: 'Vendedores Ativos',
      value: '8',
      change: '2 novos este mês',
      changeType: 'positive',
      icon: Users,
      color: 'orange',
    },
  ];

  const vendorPerformance = [
    {
      id: '1',
      name: 'Ana Caroline',
      proposals: 45,
      converted: 32,
      revenue: 'R$ 28.500',
      conversionRate: 71,
      email: 'ana@abmix.com',
      phone: '11999999999',
    },
    {
      id: '2',
      name: 'Bruna Garcia',
      proposals: 38,
      converted: 24,
      revenue: 'R$ 22.100',
      conversionRate: 63,
      email: 'bruna@abmix.com',
      phone: '11888888888',
    },
    {
      id: '3',
      name: 'Carlos Silva',
      proposals: 42,
      converted: 29,
      revenue: 'R$ 25.800',
      conversionRate: 69,
      email: 'carlos@abmix.com',
      phone: '11777777777',
    },
    {
      id: '4',
      name: 'Diana Santos',
      proposals: 31,
      converted: 18,
      revenue: 'R$ 13.050',
      conversionRate: 58,
      email: 'diana@abmix.com',
      phone: '11666666666',
    },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'proposal_created',
      vendor: 'Ana Caroline',
      client: 'Empresa ABC Ltda',
      timestamp: '2 horas atrás',
      status: 'success',
    },
    {
      id: '2',
      type: 'proposal_validated',
      vendor: 'Carlos Silva',
      client: 'Tech Solutions SA',
      timestamp: '4 horas atrás',
      status: 'success',
    },
    {
      id: '3',
      type: 'proposal_rejected',
      vendor: 'Diana Santos',
      client: 'Startup XYZ',
      timestamp: '6 horas atrás',
      status: 'error',
    },
    {
      id: '4',
      type: 'proposal_completed',
      vendor: 'Bruna Garcia',
      client: 'Consultoria ABC',
      timestamp: '8 horas atrás',
      status: 'success',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'proposal_created':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'proposal_validated':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'proposal_rejected':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'proposal_completed':
        return <TrendingUp className="w-4 h-4 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityText = (type: string) => {
    switch (type) {
      case 'proposal_created':
        return 'criou uma proposta para';
      case 'proposal_validated':
        return 'validou a proposta de';
      case 'proposal_rejected':
        return 'rejeitou a proposta de';
      case 'proposal_completed':
        return 'finalizou a proposta de';
      default:
        return 'interagiu com';
    }
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

  const exportReport = () => {
    const reportData = {
      periodo: selectedPeriod,
      stats: supervisorStats,
      vendedores: vendorPerformance,
      atividades: recentActivity,
      dataGeracao: new Date().toLocaleDateString('pt-BR')
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-supervisor-${selectedPeriod}.json`;
    link.click();
    
    showNotification('Relatório exportado com sucesso!', 'success');
  };

  const handleViewVendor = (vendorId: string) => {
    const vendor = vendorPerformance.find(v => v.id === vendorId);
    if (vendor) {
      setSelectedVendor(vendorId);
      showNotification(`Visualizando detalhes de ${vendor.name}`, 'info');
    }
  };

  const renderReportsView = () => (
    <div className="space-y-6">
      {/* Barra de Progresso Independente */}
      <ProposalProgressTracker
        contractData={{
          nomeEmpresa: 'Corporação ABC Ltda',
          cnpj: '11.222.333/0001-44',
          planoContratado: 'Plano Executivo',
          valor: '2.150,00',
          inicioVigencia: '2024-01-15'
        }}
        titulares={[{
          id: '1',
          nomeCompleto: 'Carlos Eduardo Silva',
          cpf: '111.222.333-44',
          rg: '11.222.333-4',
          dataNascimento: '1978-11-05',
          nomeMae: 'Helena Silva',
          sexo: 'masculino',
          estadoCivil: 'casado',
          peso: '82',
          altura: '1.80',
          emailPessoal: 'carlos@email.com',
          telefonePessoal: '(11) 77777-7777',
          emailEmpresa: 'carlos@corporacao.com',
          telefoneEmpresa: '(11) 4444-4444',
          cep: '01310-100',
          enderecoCompleto: 'Rua Augusta, 789 - Consolação - São Paulo/SP',
          dadosReembolso: 'Itaú - Ag: 9999 - Conta: 88888-9'
        }]}
        dependentes={[]}
        attachments={[]}
        className="mb-6"
      />
      
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Relatórios Gerenciais</h1>
        <p className="text-blue-100">Análises detalhadas e relatórios customizados</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-4">Relatório de Vendas</h3>
          </div>
          <p className="text-gray-600 mb-4">Performance de vendas por período e vendedor</p>
          <button 
            onClick={() => showNotification('Gerando relatório de vendas...', 'info')}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Gerar Relatório
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-4">Análise de Conversão</h3>
          </div>
          <p className="text-gray-600 mb-4">Taxa de conversão e funil de vendas</p>
          <button 
            onClick={() => showNotification('Gerando análise de conversão...', 'info')}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Gerar Análise
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-4">Relatório Financeiro</h3>
          </div>
          <p className="text-gray-600 mb-4">Receitas, comissões e análise financeira</p>
          <button 
            onClick={() => showNotification('Gerando relatório financeiro...', 'info')}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Gerar Relatório
          </button>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Analytics Avançado</h1>
        <p className="text-purple-100">Métricas avançadas e insights de negócio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Funil de Conversão</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Propostas Criadas</span>
              <span className="font-semibold">156</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Clientes Preenchendo</span>
              <span className="font-semibold">89</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '57%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Propostas Finalizadas</span>
              <span className="font-semibold">106</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance por Plano</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Planos Empresariais</span>
              <span className="font-semibold text-green-600">R$ 45.200</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Planos Familiares</span>
              <span className="font-semibold text-blue-600">R$ 28.800</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Planos Individuais</span>
              <span className="font-semibold text-purple-600">R$ 15.450</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeamView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Gestão de Equipe</h1>
        <p className="text-green-100">Gerencie vendedores, metas e performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {vendorPerformance.map((vendor) => (
          <div key={vendor.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                <p className="text-sm text-gray-500">{vendor.email}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Propostas:</span>
                <span className="font-medium">{vendor.proposals}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Convertidas:</span>
                <span className="font-medium text-green-600">{vendor.converted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxa:</span>
                <span className="font-medium">{vendor.conversionRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Receita:</span>
                <span className="font-medium text-blue-600">{vendor.revenue}</span>
              </div>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <button 
                onClick={() => handleViewVendor(vendor.id)}
                className="flex-1 bg-orange-600 text-white py-2 px-3 rounded-lg hover:bg-orange-700 transition-colors text-sm"
              >
                Ver Detalhes
              </button>
              <button 
                onClick={() => showNotification(`Definindo meta para ${vendor.name}`, 'info')}
                className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Definir Meta
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettingsView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Configurações do Sistema</h1>
        <p className="text-gray-100">Gerencie configurações e permissões</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações Gerais</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Notificações por Email</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Relatórios Automáticos</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Backup Automático</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissões de Acesso</h3>
          <div className="space-y-4">
            <button 
              onClick={() => showNotification('Gerenciando permissões de vendedores...', 'info')}
              className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium">Vendedores</span>
              <p className="text-sm text-gray-600">Gerenciar acesso dos vendedores</p>
            </button>
            <button 
              onClick={() => showNotification('Gerenciando permissões financeiras...', 'info')}
              className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium">Financeiro</span>
              <p className="text-sm text-gray-600">Controle de acesso financeiro</p>
            </button>
            <button 
              onClick={() => showNotification('Gerenciando permissões de implantação...', 'info')}
              className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium">Implantação</span>
              <p className="text-sm text-gray-600">Acesso à área de implantação</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'reports':
        return renderReportsView();
      case 'analytics':
        return renderAnalyticsView();
      case 'team':
        return renderTeamView();
      case 'settings':
        return renderSettingsView();
      default:
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supervisorStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`p-3 bg-${stat.color}-100 rounded-full`}>
                        <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <span className="text-sm font-medium text-green-600">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <button
                onClick={() => setActiveView('reports')}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left group hover:scale-105 cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Relatórios</h3>
                    <p className="text-sm text-gray-500">Gerar relatórios</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveView('analytics')}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left group hover:scale-105 cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                    <PieChart className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Analytics</h3>
                    <p className="text-sm text-gray-500">Análises avançadas</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveView('team')}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left group hover:scale-105 cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Equipe</h3>
                    <p className="text-sm text-gray-500">Gerenciar vendedores</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveView('settings')}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left group hover:scale-105 cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors">
                    <Settings className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Configurações</h3>
                    <p className="text-sm text-gray-500">Sistema</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Vendor Performance */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Performance dos Vendedores</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vendedor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Propostas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Convertidas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Taxa Conversão
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progresso Médio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Receita
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {vendorPerformance.map((vendor) => (
                      <tr key={vendor.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-orange-600" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                              <div className="text-sm text-gray-500">{vendor.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{vendor.proposals}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{vendor.converted}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-orange-600 h-2 rounded-full" 
                                style={{ width: `${vendor.conversionRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{vendor.conversionRate}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-40">
                            <ProgressBar 
                              proposal={{
                                id: `vendor-${vendor.id}`,
                                status: vendor.conversionRate > 80 ? 'completed' : 
                                       vendor.conversionRate > 50 ? 'processing' : 'pending_validation',
                                progress: vendor.conversionRate
                              }}
                              className="w-full"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{vendor.revenue}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <ActionButtons 
                            onView={() => handleViewVendor(vendor.id)}
                           onCopyLink={() => {
                               navigator.clipboard.writeText(`${window.location.origin}/supervisor/vendedor/${vendor.id}`);
                               showNotification('Link copiado para a área de transferência!', 'success');
                           }}
                            onMessage={() => setShowInternalMessage(true)}
                            onEdit={() => showNotification(`Editando dados de ${vendor.name}`, 'info')}
                            onWhatsApp={() => window.open(`https://wa.me/55${vendor.phone}?text=${encodeURIComponent(`Olá ${vendor.name}! Preciso falar sobre sua performance de vendas.`)}`)}
                            onEmail={() => window.open(`mailto:${vendor.email}?subject=Performance de Vendas`)}
                            onExternalLink={() => window.open(`${window.location.origin}/supervisor/vendedor/${vendor.id}`, '_blank')}
                           onSend={() => showNotification(`Enviando metas para ${vendor.name}...`, 'info')}
                           onShare={() => {
                             navigator.clipboard.writeText(`${window.location.origin}/supervisor/compartilhar/${vendor.id}`);
                             showNotification('Link de compartilhamento copiado!', 'success');
                           }}
                            onDownload={() => showNotification('Baixando relatório de performance...', 'success')}
                            onDelete={() => showNotification('Esta ação requer confirmação adicional', 'error')}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Atividade Recente</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.vendor}</span>
                          {' '}
                          {getActivityText(activity.type)}
                          {' '}
                          <span className="font-medium">{activity.client}</span>
                        </p>
                        <p className="text-sm text-gray-500">{activity.timestamp}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          activity.status === 'success' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {activity.status === 'success' ? 'Sucesso' : 'Erro'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <AbmixLogo size={40} className="mr-3" />
                <div className="flex items-center">
                  <span className="ml-3 text-xl font-bold text-gray-900">Portal Supervisor</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Navigation */}
              {activeView !== 'dashboard' && (
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </button>
              )}
              
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
        {activeView === 'dashboard' && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Supervisor</h1>
                <p className="text-gray-600">Supervisão e relatórios gerenciais da equipe</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="week">Esta Semana</option>
                  <option value="month">Este Mês</option>
                  <option value="quarter">Este Trimestre</option>
                  <option value="year">Este Ano</option>
                </select>
                <button
                  onClick={exportReport}
                  className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Relatório
                </button>
              </div>
            </div>
          </div>
        )}
        
        {renderContent()}
      </main>

      {/* Vendor Detail Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Detalhes do Vendedor
                </h3>
                <button 
                  onClick={() => setSelectedVendor(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {(() => {
                const vendor = vendorPerformance.find(v => v.id === selectedVendor);
                if (!vendor) return null;
                
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Nome:</span>
                        <span className="ml-2">{vendor.name}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Email:</span>
                        <span className="ml-2">{vendor.email}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Telefone:</span>
                        <span className="ml-2">{vendor.phone}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Taxa de Conversão:</span>
                        <span className="ml-2">{vendor.conversionRate}%</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Performance</h4>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{vendor.proposals}</div>
                          <div className="text-sm text-gray-600">Propostas</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">{vendor.converted}</div>
                          <div className="text-sm text-gray-600">Convertidas</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">{vendor.revenue}</div>
                          <div className="text-sm text-gray-600">Receita</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setSelectedVendor(null)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        Fechar
                      </button>
                      <button
                        onClick={() => {
                          showNotification(`Definindo meta para ${vendor.name}`, 'info');
                          setSelectedVendor(null);
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
                      >
                        Definir Meta
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Internal Message Modal */}
      {showInternalMessage && (
        <InternalMessage 
          isOpen={showInternalMessage}
          onClose={() => setShowInternalMessage(false)}
          currentUser={{
            name: user.name,
            role: 'supervisor'
          }}
        />
      )}
    </div>
  );
};

export default SupervisorPortal;