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
          grid grid-cols-[300px_80px_100px_80px_100px_repeat(10,50px)_80px_50px] 
          border-b border-border text-xs
          ${row.isGroup ? 'bg-slate-50 font-semibold' : 'bg-white'}
          ${index % 2 === 0 ? '' : 'bg-slate-25'}
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
          <div className="border-r border-border bg-slate-100">
            <EditableCell
              value={row.metaMes || 0}
              onSave={(value) => onUpdateMeta(row.id, 'metaMes', value)}
              colorClass="bg-slate-100 text-gray-800 font-semibold"
            />
          </div>

          {/* Super Meta Mês */}
          <div className="border-r border-border bg-slate-100">
            <EditableCell
              value={row.superMetaMes || 0}
              onSave={(value) => onUpdateMeta(row.id, 'superMetaMes', value)}
              colorClass="bg-slate-100 text-gray-800 font-semibold"
            />
          </div>

          {/* Meta Dia */}
          <div className="border-r border-border bg-slate-200">
            <EditableCell
              value={row.metaDia || 0}
              onSave={(value) => onUpdateMeta(row.id, 'metaDia', value)}
              colorClass="bg-slate-200 text-gray-800 font-semibold"
            />
          </div>

          {/* Super Meta Dia */}
          <div className="border-r border-border bg-slate-200">
            <EditableCell
              value={row.superMetaDia || 0}
              onSave={(value) => onUpdateMeta(row.id, 'superMetaDia', value)}
              colorClass="bg-slate-200 text-gray-800 font-semibold"
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
          <div className="p-3 text-center bg-blue-500 text-white font-bold border-r border-border">
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
      <div className="grid grid-cols-[300px_80px_100px_80px_100px_repeat(10,50px)_80px_50px] bg-slate-700 text-white text-xs font-semibold">
        <div className="p-3 border-r border-slate-600">
          {getHeaderTitle()}
        </div>
        <div className="p-3 text-center border-r border-slate-600">META MÊS</div>
        <div className="p-3 text-center border-r border-slate-600">SUPER META MÊS</div>
        <div className="p-3 text-center border-r border-slate-600">META DIA</div>
        <div className="p-3 text-center border-r border-slate-600">SUPER META DIA</div>
        {currentDays.map(day => (
          <div key={day} className="p-2 text-center border-r border-slate-600">{day}</div>
        ))}
        <div className="p-3 text-center border-r border-slate-600">TOTAL</div>
        <div className="p-2 text-center">AÇÕES</div>
      </div>

      {/* Subheader com categorias */}
      <div className="grid grid-cols-[300px_80px_100px_80px_100px_repeat(10,50px)_80px_50px] bg-slate-600 text-white text-xs">
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
        <div className="p-2 text-center border-r border-slate-500">TOTAL</div>
        <div className="p-2 text-center"></div>
      </div>

      {/* Linhas de dados */}
      <div>
        {data.map((row, index) => renderRow(row, index))}
      </div>
    </div>
  );
}