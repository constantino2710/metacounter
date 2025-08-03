import { PerformanceData } from '../types/sales';
import { formatCurrency, getPerformanceColor } from '../utils/salesCalculations';

interface PerformanceCellProps {
  data: PerformanceData;
  name: string;
  onClick?: () => void;
  showDetails?: boolean;
}

export function PerformanceCell({ data, name, onClick, showDetails = true }: PerformanceCellProps) {
  const cellClasses = `
    p-4 rounded-lg border transition-all duration-200 cursor-pointer
    ${getPerformanceColor(data.status)}
    ${onClick ? 'hover:scale-105 hover:shadow-lg' : ''}
    border-border/20
  `;

  return (
    <div className={cellClasses} onClick={onClick}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm truncate flex-1 mr-2">
            {name}
          </h3>
          {data.percentage > 0 && (
            <span className="text-xs font-medium bg-black/10 px-2 py-1 rounded">
              {data.percentage.toFixed(0)}%
            </span>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs opacity-80">Vendas:</span>
            <span className="font-bold text-sm">
              {formatCurrency(data.totalSales)}
            </span>
          </div>
          
          {showDetails && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-xs opacity-80">Meta:</span>
                <span className="text-xs">
                  {formatCurrency(data.dailyGoal)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs opacity-80">Super:</span>
                <span className="text-xs">
                  {formatCurrency(data.superGoal)}
                </span>
              </div>
            </>
          )}
        </div>
        
        {data.status !== 'neutral' && (
          <div className="mt-2 h-2 bg-black/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white/30 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min(data.percentage, 100)}%` 
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}