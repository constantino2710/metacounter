import { useState } from 'react';
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { EditableCell } from './EditableCell';
import { formatCurrency } from '../utils/salesCalculations';

export interface EditableSalesTableRow {
  id: string;
  name: string;
  type: 'filial' | 'funcionario' | 'grupo' | 'cliente';
  level: number;
  metaMes?: number;
  superMetaMes?: number;
  metaDia?: number;
  superMetaDia?: number;
  dailySales: { [day: string]: number };
  total: number;
  isGroup?: boolean;
  isExpanded?: boolean;
  children?: EditableSalesTableRow[];
}

interface EditableSalesTableProps {
  data: EditableSalesTableRow[];
  viewType: 'cliente' | 'filial' | 'funcionario';
  onUpdateCell: (rowId: string, day: string, value: number) => void;
  onUpdateMeta: (rowId: string, field: 'metaMes' | 'superMetaMes' | 'metaDia' | 'superMetaDia', value: number) => void;
  onDeleteRow: (rowId: string) => void;
  onNavigate?: (rowId: string, rowType: string) => void;
}

export function EditableSalesTable({ 
  data, 
  viewType, 
  onUpdateCell, 
  onUpdateMeta, 
  onDeleteRow,
  onNavigate 
}: EditableSalesTableProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  
  // Dias do mês atual
  const getCurrentMonthDays = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
  };
  
  const currentDays = getCurrentMonthDays();
  
  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const handleRowClick = (row: EditableSalesTableRow) => {
    if (onNavigate && (row.type === 'cliente' || row.type === 'filial')) {
      onNavigate(row.id, row.type);
    }
  };

  const renderRow = (row: EditableSalesTableRow, index: number) => {
    const isExpanded = expandedGroups.has(row.id);
    const hasChildren = row.children && row.children.length > 0;
    const isNavigable = row.type === 'cliente' || row.type === 'filial';
    
    return (
      <div key={row.id}>
        {/* Linha principal */}
        <div className={`
          grid grid-cols-[300px_100px_120px_100px_120px_repeat(${currentDays.length},60px)_100px_60px] 
          border-b border-slate-200 text-sm shadow-sm
          ${row.isGroup ? 'bg-gradient-to-r from-indigo-50 to-purple-50 font-semibold' : 'bg-white hover:bg-slate-50'}
          ${index % 2 === 0 ? '' : 'bg-slate-25'}
          transition-colors duration-200
        `}>
          {/* Nome da filial/funcionário */}
          <div 
            className={`p-3 flex items-center gap-2 border-r border-border ${
              isNavigable ? 'cursor-pointer hover:bg-blue-50' : ''
            }`} 
            style={{ paddingLeft: `${row.level * 20 + 12}px` }}
            onClick={() => handleRowClick(row)}
          >
            {hasChildren && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleGroup(row.id);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            )}
            <span className="truncate">{row.name}</span>
            {isNavigable && (
              <span className="text-blue-500 text-xs">→</span>
            )}
          </div>

          {/* Meta do Mês */}
          <div className="border-r border-slate-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <EditableCell
              value={row.metaMes || 0}
              onSave={(value) => onUpdateMeta(row.id, 'metaMes', value)}
              colorClass="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 font-semibold border-0"
            />
          </div>

          {/* Super Meta Mês */}
          <div className="border-r border-slate-200 bg-gradient-to-br from-purple-50 to-purple-100">
            <EditableCell
              value={row.superMetaMes || 0}
              onSave={(value) => onUpdateMeta(row.id, 'superMetaMes', value)}
              colorClass="bg-gradient-to-br from-purple-50 to-purple-100 text-purple-800 font-semibold border-0"
            />
          </div>

          {/* Meta Dia */}
          <div className="border-r border-slate-200 bg-gradient-to-br from-emerald-50 to-emerald-100">
            <EditableCell
              value={row.metaDia || 0}
              onSave={(value) => onUpdateMeta(row.id, 'metaDia', value)}
              colorClass="bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-800 font-semibold border-0"
            />
          </div>

          {/* Super Meta Dia */}
          <div className="border-r border-slate-200 bg-gradient-to-br from-orange-50 to-orange-100">
            <EditableCell
              value={row.superMetaDia || 0}
              onSave={(value) => onUpdateMeta(row.id, 'superMetaDia', value)}
              colorClass="bg-gradient-to-br from-orange-50 to-orange-100 text-orange-800 font-semibold border-0"
            />
          </div>

          {/* Vendas por dia */}
          {currentDays.map(day => (
            <EditableCell
              key={day}
              value={row.dailySales[day] || 0}
              onSave={(value) => onUpdateCell(row.id, day, value)}
              metaDia={row.metaDia}
              superMetaDia={row.superMetaDia}
            />
          ))}

          {/* Total */}
          <div className="p-3 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold border-r border-slate-200 rounded-sm">
            {Math.round(row.total)}
          </div>

          {/* Botão de exclusão */}
          <div className="p-2 flex items-center justify-center">
            <button
              onClick={() => onDeleteRow(row.id)}
              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Linhas filhas (se expandido) */}
        {hasChildren && isExpanded && row.children?.map((child, childIndex) => 
          renderRow(child, childIndex)
        )}
      </div>
    );
  };

  const getHeaderTitle = () => {
    switch (viewType) {
      case 'cliente':
        return 'CLIENTE';
      case 'filial':
        return 'FILIAL';
      case 'funcionario':
        return 'FUNCIONÁRIOS';
      default:
        return 'ITEM';
    }
  };

  return (
    <div className="bg-white overflow-x-auto">
      {/* Cabeçalho da tabela */}
      <div className={`grid grid-cols-[300px_100px_120px_100px_120px_repeat(${currentDays.length},60px)_100px_60px] bg-gradient-to-r from-slate-700 to-slate-800 text-white text-sm font-semibold shadow-lg`}>
        <div className="p-4 border-r border-slate-600">
          {getHeaderTitle()}
        </div>
        <div className="p-4 text-center border-r border-slate-600">META MÊS</div>
        <div className="p-4 text-center border-r border-slate-600">SUPER META MÊS</div>
        <div className="p-4 text-center border-r border-slate-600">META DIA</div>
        <div className="p-4 text-center border-r border-slate-600">SUPER META DIA</div>
        {currentDays.map(day => (
          <div key={day} className="p-3 text-center border-r border-slate-600 font-bold">{day}</div>
        ))}
        <div className="p-4 text-center border-r border-slate-600">TOTAL</div>
        <div className="p-3 text-center">AÇÕES</div>
      </div>

      {/* Subheader com categorias */}
      <div className={`grid grid-cols-[300px_100px_120px_100px_120px_repeat(${currentDays.length},60px)_100px_60px] bg-gradient-to-r from-slate-600 to-slate-700 text-white text-xs shadow-md`}>
        <div className="p-3 border-r border-slate-500">NOME</div>
        <div className="p-3 text-center border-r border-slate-500">VALOR</div>
        <div className="p-3 text-center border-r border-slate-500">VALOR</div>
        <div className="p-3 text-center border-r border-slate-500">VALOR</div>
        <div className="p-3 text-center border-r border-slate-500">VALOR</div>
        {currentDays.map((day, index) => {
          const dayNames = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
          const date = new Date(new Date().getFullYear(), new Date().getMonth(), parseInt(day));
          const dayName = dayNames[date.getDay()];
          return (
            <div key={day} className="p-2 text-center border-r border-slate-500 text-xs">{dayName}</div>
          );
        })}
        <div className="p-3 text-center border-r border-slate-500">SOMA</div>
        <div className="p-3 text-center"></div>
      </div>

      {/* Linhas de dados */}
      <div>
        {data.map((row, index) => renderRow(row, index))}
      </div>
    </div>
  );
}