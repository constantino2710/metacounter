import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../utils/salesCalculations';

interface SalesTableRow {
  id: string;
  name: string;
  type: 'filial' | 'funcionario' | 'grupo';
  level: number;
  metaMes?: number;
  superMetaMes?: number;
  metaDia?: number;
  superMetaDia?: number;
  dailySales: { [day: string]: number };
  total: number;
  isGroup?: boolean;
  isExpanded?: boolean;
  children?: SalesTableRow[];
}

interface SalesTableProps {
  data: SalesTableRow[];
  viewType: 'filial' | 'funcionario';
}

export function SalesTable({ data, viewType }: SalesTableProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  
  // Dias do mês atual
  const currentDays = Array.from({ length: 10 }, (_, i) => (22 + i).toString());
  
  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const getPerformanceColor = (value: number, meta?: number, superMeta?: number): string => {
    if (!meta) return 'bg-gray-100 text-gray-600';
    
    if (value >= (superMeta || meta * 1.3)) {
      return 'bg-blue-500 text-white'; // Azul - supermeta
    } else if (value >= meta) {
      return 'bg-green-500 text-white'; // Verde - meta atingida
    } else if (value > 0) {
      return 'bg-red-500 text-white'; // Vermelho - abaixo da meta
    } else {
      return 'bg-gray-100 text-gray-600'; // Sem vendas
    }
  };

  const renderRow = (row: SalesTableRow, index: number) => {
    const isExpanded = expandedGroups.has(row.id);
    const hasChildren = row.children && row.children.length > 0;
    
    return (
      <div key={row.id}>
        {/* Linha principal */}
        <div className={`
          grid grid-cols-[300px_80px_100px_80px_100px_repeat(10,50px)_80px] 
          border-b border-border text-xs
          ${row.isGroup ? 'bg-slate-50 font-semibold' : 'bg-white'}
          ${index % 2 === 0 ? '' : 'bg-slate-25'}
        `}>
          {/* Nome da filial/funcionário */}
          <div className={`p-3 flex items-center gap-2 border-r border-border`} style={{ paddingLeft: `${row.level * 20 + 12}px` }}>
            {hasChildren && (
              <button 
                onClick={() => toggleGroup(row.id)}
                className="text-slate-400 hover:text-slate-600"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            )}
            <span className="truncate">{row.name}</span>
          </div>

          {/* Meta do Mês */}
          <div className="p-3 text-center border-r border-border bg-slate-100 font-semibold">
            {row.metaMes ? formatCurrency(row.metaMes).replace('R$', '').trim() : '-'}
          </div>

          {/* Super Meta Mês */}
          <div className="p-3 text-center border-r border-border bg-slate-100 font-semibold">
            {row.superMetaMes ? formatCurrency(row.superMetaMes).replace('R$', '').trim() : '-'}
          </div>

          {/* Meta Dia */}
          <div className="p-3 text-center border-r border-border bg-slate-200 font-semibold">
            {row.metaDia ? formatCurrency(row.metaDia).replace('R$', '').trim() : '-'}
          </div>

          {/* Super Meta Dia */}
          <div className="p-3 text-center border-r border-border bg-slate-200 font-semibold">
            {row.superMetaDia ? formatCurrency(row.superMetaDia).replace('R$', '').trim() : '-'}
          </div>

          {/* Vendas por dia */}
          {currentDays.map(day => {
            const dayValue = row.dailySales[day] || 0;
            const colorClass = getPerformanceColor(dayValue, row.metaDia, row.superMetaDia);
            
            return (
              <div 
                key={day} 
                className={`p-2 text-center border-r border-border font-bold text-xs ${colorClass}`}
              >
                {dayValue > 0 ? Math.round(dayValue).toString() : dayValue === 0 ? '0' : 'F'}
              </div>
            );
          })}

          {/* Total */}
          <div className="p-3 text-center bg-blue-500 text-white font-bold">
            {Math.round(row.total)}
          </div>
        </div>

        {/* Linhas filhas (se expandido) */}
        {hasChildren && isExpanded && row.children?.map((child, childIndex) => 
          renderRow(child, childIndex)
        )}
      </div>
    );
  };

  return (
    <div className="bg-white overflow-x-auto">
      {/* Cabeçalho da tabela */}
      <div className="grid grid-cols-[300px_80px_100px_80px_100px_repeat(10,50px)_80px] bg-slate-700 text-white text-xs font-semibold">
        <div className="p-3 border-r border-slate-600">
          {viewType === 'filial' ? 'FILIAL' : 'FUNCIONÁRIOS'}
        </div>
        <div className="p-3 text-center border-r border-slate-600">META MÊS</div>
        <div className="p-3 text-center border-r border-slate-600">SUPER META MÊS</div>
        <div className="p-3 text-center border-r border-slate-600">META DIA</div>
        <div className="p-3 text-center border-r border-slate-600">SUPER META DIA</div>
        {currentDays.map(day => (
          <div key={day} className="p-2 text-center border-r border-slate-600">{day}</div>
        ))}
        <div className="p-3 text-center">TOTAL</div>
      </div>

      {/* Subheader com categorias */}
      <div className="grid grid-cols-[300px_80px_100px_80px_100px_repeat(10,50px)_80px] bg-slate-600 text-white text-xs">
        <div className="p-2 border-r border-slate-500">PRODUTOS</div>
        <div className="p-2 text-center border-r border-slate-500">EDITAR</div>
        <div className="p-2 text-center border-r border-slate-500">EDITAR</div>
        <div className="p-2 text-center border-r border-slate-500">TER</div>
        <div className="p-2 text-center border-r border-slate-500">QUA</div>
        <div className="p-2 text-center border-r border-slate-500">QUI</div>
        <div className="p-2 text-center border-r border-slate-500">SEX</div>
        <div className="p-2 text-center border-r border-slate-500">SÁB</div>
        <div className="p-2 text-center border-r border-slate-500">DOM</div>
        <div className="p-2 text-center border-r border-slate-500">SEG</div>
        <div className="p-2 text-center border-r border-slate-500">TER</div>
        <div className="p-2 text-center border-r border-slate-500">QUA</div>
        <div className="p-2 text-center border-r border-slate-500">QUI</div>
        <div className="p-2 text-center border-r border-slate-500">PROJ.</div>
        <div className="p-2 text-center">TOTAL</div>
      </div>

      {/* Linhas de dados */}
      <div>
        {data.map((row, index) => renderRow(row, index))}
      </div>

      {/* Linha de total */}
      <div className="grid grid-cols-[300px_80px_100px_80px_100px_repeat(10,50px)_80px] bg-slate-200 font-bold text-sm border-t-2 border-slate-400">
        <div className="p-3 border-r border-slate-300">Total</div>
        <div className="p-3 text-center border-r border-slate-300">4.085</div>
        <div className="p-3 text-center border-r border-slate-300">5.540</div>
        <div className="p-3 text-center border-r border-slate-300">141</div>
        <div className="p-3 text-center border-r border-slate-300">190</div>
        <div className="p-2 text-center border-r border-slate-300 bg-blue-500 text-white font-bold">132</div>
        <div className="p-2 text-center border-r border-slate-300 bg-blue-500 text-white font-bold">264</div>
        <div className="p-2 text-center border-r border-slate-300 bg-blue-500 text-white font-bold">250</div>
        <div className="p-2 text-center border-r border-slate-300 bg-blue-500 text-white font-bold">241</div>
        <div className="p-2 text-center border-r border-slate-300 bg-green-500 text-white font-bold">147</div>
        <div className="p-2 text-center border-r border-slate-300 bg-red-500 text-white font-bold">91</div>
        <div className="p-2 text-center border-r border-slate-300 bg-green-500 text-white font-bold">123</div>
        <div className="p-2 text-center border-r border-slate-300 bg-green-500 text-white font-bold">178</div>
        <div className="p-2 text-center border-r border-slate-300 bg-green-500 text-white font-bold">190</div>
        <div className="p-2 text-center border-r border-slate-300 bg-blue-500 text-white font-bold">227</div>
        <div className="p-3 text-center bg-blue-500 text-white font-bold">5.086</div>
      </div>
    </div>
  );
}