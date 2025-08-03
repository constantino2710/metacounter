import { useState, useCallback } from 'react';
import { TableHeader } from './TableHeader';
import { EditableSalesTable, EditableSalesTableRow } from './EditableSalesTable';
import { AddRowButton } from './AddRowButton';
import { getClientsWithHierarchy, mockClients, mockStores, mockEmployees } from '../data/mockData';
import { useToast } from '@/hooks/use-toast';

interface NavigationState {
  level: 'clients' | 'stores' | 'employees';
  clientId?: string;
  storeId?: string;
  clientName?: string;
  storeName?: string;
}

const ITEMS_PER_PAGE = 10;

export function HierarchicalPlatform() {
  const [navigation, setNavigation] = useState<NavigationState>({ level: 'clients' });
  const [currentPage, setCurrentPage] = useState(1);
  const [salesData, setSalesData] = useState<{ [key: string]: { [day: string]: number } }>({});
  const [metaData, setMetaData] = useState<{ [key: string]: any }>({});
  const { toast } = useToast();

  // Converte dados hierárquicos para formato da tabela
  const convertToTableFormat = useCallback((level: 'clients' | 'stores' | 'employees'): EditableSalesTableRow[] => {
    const days = Array.from({ length: 10 }, (_, i) => (22 + i).toString());
    
    switch (level) {
      case 'clients':
        return mockClients.map(client => {
          const clientSales = salesData[client.id] || {};
          const total = days.reduce((sum, day) => sum + (clientSales[day] || 0), 0);
          
          return {
            id: client.id,
            name: client.name,
            type: 'cliente' as const,
            level: 0,
            metaMes: metaData[client.id]?.metaMes || 50000,
            superMetaMes: metaData[client.id]?.superMetaMes || 65000,
            metaDia: metaData[client.id]?.metaDia || 1667,
            superMetaDia: metaData[client.id]?.superMetaDia || 2167,
            dailySales: clientSales,
            total
          };
        });

      case 'stores':
        const clientStores = mockStores.filter(store => store.clientId === navigation.clientId);
        return clientStores.map(store => {
          const storeSales = salesData[store.id] || {};
          const total = days.reduce((sum, day) => sum + (storeSales[day] || 0), 0);
          
          return {
            id: store.id,
            name: store.name,
            type: 'filial' as const,
            level: 0,
            metaMes: metaData[store.id]?.metaMes || store.dailyGoal * 30,
            superMetaMes: metaData[store.id]?.superMetaMes || store.superGoal * 30,
            metaDia: metaData[store.id]?.metaDia || store.dailyGoal,
            superMetaDia: metaData[store.id]?.superMetaDia || store.superGoal,
            dailySales: storeSales,
            total
          };
        });

      case 'employees':
        const storeEmployees = mockEmployees.filter(emp => emp.storeId === navigation.storeId);
        return storeEmployees.map(employee => {
          const empSales = salesData[employee.id] || {};
          const total = days.reduce((sum, day) => sum + (empSales[day] || 0), 0);
          
          return {
            id: employee.id,
            name: employee.name,
            type: 'funcionario' as const,
            level: 0,
            metaMes: metaData[employee.id]?.metaMes || employee.dailyGoal * 30,
            superMetaMes: metaData[employee.id]?.superMetaMes || employee.superGoal * 30,
            metaDia: metaData[employee.id]?.metaDia || employee.dailyGoal,
            superMetaDia: metaData[employee.id]?.superMetaDia || employee.superGoal,
            dailySales: empSales,
            total
          };
        });

      default:
        return [];
    }
  }, [navigation, salesData, metaData]);

  const currentData = convertToTableFormat(navigation.level);
  const totalPages = Math.ceil(currentData.length / ITEMS_PER_PAGE);
  const paginatedData = currentData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleUpdateCell = useCallback((rowId: string, day: string, value: number) => {
    setSalesData(prev => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [day]: value
      }
    }));
    toast({
      title: "Venda atualizada",
      description: `Valor do dia ${day} atualizado para ${value}`,
    });
  }, [toast]);

  const handleUpdateMeta = useCallback((rowId: string, field: string, value: number) => {
    setMetaData(prev => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [field]: value
      }
    }));
    toast({
      title: "Meta atualizada",
      description: `${field} atualizada para ${value}`,
    });
  }, [toast]);

  const handleDeleteRow = useCallback((rowId: string) => {
    // Em uma implementação real, aqui você faria a exclusão no banco de dados
    toast({
      title: "Item excluído",
      description: "Item removido com sucesso",
      variant: "destructive"
    });
  }, [toast]);

  const handleNavigate = useCallback((rowId: string, rowType: string) => {
    if (rowType === 'cliente') {
      const client = mockClients.find(c => c.id === rowId);
      setNavigation({
        level: 'stores',
        clientId: rowId,
        clientName: client?.name
      });
    } else if (rowType === 'filial') {
      const store = mockStores.find(s => s.id === rowId);
      setNavigation({
        ...navigation,
        level: 'employees',
        storeId: rowId,
        storeName: store?.name
      });
    }
    setCurrentPage(1);
  }, [navigation]);

  const handleBack = useCallback(() => {
    if (navigation.level === 'employees') {
      setNavigation({
        level: 'stores',
        clientId: navigation.clientId,
        clientName: navigation.clientName
      });
    } else if (navigation.level === 'stores') {
      setNavigation({ level: 'clients' });
    }
    setCurrentPage(1);
  }, [navigation]);

  const handleAddRow = useCallback(() => {
    // Em uma implementação real, aqui você abriria um modal para adicionar novo item
    toast({
      title: "Adicionar item",
      description: "Funcionalidade de adicionar será implementada",
    });
  }, [toast]);

  const getTitle = () => {
    switch (navigation.level) {
      case 'clients':
        return 'Acompanhamento de Vendas por Cliente';
      case 'stores':
        return `${navigation.clientName} - Acompanhamento de Vendas por Filial`;
      case 'employees':
        return `${navigation.storeName} - Acompanhamento de Vendas por Funcionário`;
    }
  };

  const getSubtitle = () => {
    const parts = [];
    if (navigation.clientName) parts.push(navigation.clientName);
    if (navigation.storeName) parts.push(navigation.storeName);
    parts.push('Acompanhamento de Vendas');
    return parts.join(' > ');
  };

  const getViewType = (): 'cliente' | 'filial' | 'funcionario' => {
    switch (navigation.level) {
      case 'clients':
        return 'cliente';
      case 'stores':
        return 'filial';
      case 'employees':
        return 'funcionario';
      default:
        return 'cliente';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TableHeader 
        title={getTitle()}
        subtitle={getSubtitle()}
        onFilter={() => console.log('Filtrar')}
        onExport={() => console.log('Exportar')}
      />
      
      <div className="p-6">
        {/* Navegação e controles */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-2">
            {navigation.level !== 'clients' && (
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
              >
                ← Voltar
              </button>
            )}
          </div>
          
          <AddRowButton
            onClick={handleAddRow}
            type={getViewType()}
          />
        </div>

        {/* Tabela principal */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <EditableSalesTable 
            data={paginatedData}
            viewType={getViewType()}
            onUpdateCell={handleUpdateCell}
            onUpdateMeta={handleUpdateMeta}
            onDeleteRow={handleDeleteRow}
            onNavigate={handleNavigate}
          />
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
            </button>
            
            <span className="px-4 py-1 text-sm">
              Página {currentPage} de {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Próxima
            </button>
          </div>
        )}

        {/* Legendas */}
        <div className="mt-6 flex flex-wrap gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Não atingiu Meta</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Atingiu Meta</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Atingiu SuperMeta</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
            <span>Sem vendas</span>
          </div>
        </div>
      </div>
    </div>
  );
}