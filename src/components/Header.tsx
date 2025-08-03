import { ChevronLeft, TrendingUp } from 'lucide-react';
import { HierarchyLevel } from '../types/sales';

interface HeaderProps {
  currentLevel: HierarchyLevel;
  onNavigateBack: () => void;
}

export function Header({ currentLevel, onNavigateBack }: HeaderProps) {
  const canGoBack = currentLevel.type !== 'clients';
  
  return (
    <header className="bg-white border-b border-border shadow-sm px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          {canGoBack && (
            <button
              onClick={onNavigateBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Voltar
            </button>
          )}
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Plataforma de Vendas
              </h1>
              <p className="text-sm text-muted-foreground">
                {currentLevel.parentName 
                  ? `${currentLevel.parentName} - ${getCurrentLevelName(currentLevel.type)}`
                  : getCurrentLevelName(currentLevel.type)
                }
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Hoje</p>
          <p className="font-semibold">
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            })}
          </p>
        </div>
      </div>
    </header>
  );
}

function getCurrentLevelName(type: HierarchyLevel['type']): string {
  switch (type) {
    case 'clients': return 'Clientes';
    case 'stores': return 'Lojas';
    case 'employees': return 'Funcionários';
  }
}