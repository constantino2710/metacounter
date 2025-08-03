import { useState } from 'react';
import { TableHeader } from './TableHeader';
import { SalesTable } from './SalesTable';
import { getFiliaisData, getFuncionariosData } from '../data/tableData';

export function MetaMasterPlatform() {
  const [viewType, setViewType] = useState<'filial' | 'funcionario'>('filial');
  const [selectedFilial, setSelectedFilial] = useState<string | null>(null);

  const currentData = viewType === 'filial' ? getFiliaisData() : getFuncionariosData();
  
  const getCurrentTitle = () => {
    if (viewType === 'filial') {
      return 'Acompanhamento de Vendas por Filial';
    } else {
      return selectedFilial 
        ? `001 Imbiribeira - Acompanhamento de Vendas por Funcionário`
        : 'Acompanhamento de Vendas por Funcionário';
    }
  };

  const getCurrentSubtitle = () => {
    return viewType === 'filial' 
      ? 'Acompanhamento de Vendas'
      : selectedFilial ? '001 Imbiribeira > Acompanhamento de Vendas' : 'Acompanhamento de Vendas';
  };

  const handleFilialClick = (filialId: string) => {
    setSelectedFilial(filialId);
    setViewType('funcionario');
  };

  const handleBackToFiliais = () => {
    setSelectedFilial(null);
    setViewType('filial');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TableHeader 
        title={getCurrentTitle()}
        subtitle={getCurrentSubtitle()}
        onFilter={() => console.log('Filtrar')}
        onExport={() => console.log('Exportar')}
      />
      
      <div className="p-6">
        {/* Navegação entre views */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={handleBackToFiliais}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              viewType === 'filial' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Por Filial
          </button>
          <button
            onClick={() => setViewType('funcionario')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              viewType === 'funcionario' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Por Funcionário
          </button>
        </div>

        {/* Tabela principal */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <SalesTable 
            data={currentData}
            viewType={viewType}
          />
        </div>

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
            <span>Melhor do Dia</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span>Transfer Funcionário</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span>Folga/Férias</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-black rounded"></div>
            <span>Faltas</span>
          </div>
        </div>

        {/* Resumos em cards na parte inferior */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">Resultados em %</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>002 Costeiro:</span>
                <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">166,00%</span>
              </div>
              <div className="flex justify-between">
                <span>012 Piedade:</span>
                <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">164,00%</span>
              </div>
              <div className="flex justify-between">
                <span>301 Aeroporto:</span>
                <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">157,14%</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">Resultados em Volume</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>006 Pina:</span>
                <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">952</span>
              </div>
              <div className="flex justify-between">
                <span>012 Piedade:</span>
                <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">492</span>
              </div>
              <div className="flex justify-between">
                <span>014 Olinda:</span>
                <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">481</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">Falta para a SuperMeta</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>302 Piedade:</span>
                <span className="text-green-600 font-semibold">0</span>
              </div>
              <div className="flex justify-between">
                <span>012 Piedade:</span>
                <span className="text-green-600 font-semibold">0</span>
              </div>
              <div className="flex justify-between">
                <span>001 Gordilho:</span>
                <span className="text-green-600 font-semibold">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}