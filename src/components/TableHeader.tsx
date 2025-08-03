import { ChevronDown, ChevronRight, Filter, FileDown, FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';

interface TableHeaderProps {
  title: string;
  subtitle: string;
  onFilter?: () => void;
  onExport?: () => void;
}

export function TableHeader({ title, subtitle, onFilter, onExport }: TableHeaderProps) {
  return (
    <div className="bg-white border-b border-border">
      {/* Header principal com gradiente */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 px-3 py-1 rounded text-sm font-semibold">
              META MASTER
            </div>
            <div>
              <h1 className="text-xl font-bold">{title}</h1>
              <p className="text-sm opacity-90">{subtitle}</p>
            </div>
          </div>
          <button className="text-white p-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="px-6 py-2 text-sm text-muted-foreground bg-muted/30">
        PETROCAL &gt; {subtitle}
      </div>

      {/* Controles */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onFilter}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded hover:bg-muted/50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            VER FILTROS
            <ChevronDown className="w-4 h-4" />
          </button>
          <p className="text-sm text-muted-foreground">
            Dados de vendas relativos ao mês de Agosto, até o dia 01
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={onExport}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm"
          >
            IMPORTAR RELATÓRIO
          </button>
          <button 
            onClick={onExport}
            className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-sm"
          >
            EXPORTAR EM XLSX
          </button>
        </div>
      </div>
    </div>
  );
}