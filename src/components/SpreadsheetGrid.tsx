import { ReactNode } from 'react';

interface SpreadsheetGridProps {
  children: ReactNode;
  columns?: number;
}

export function SpreadsheetGrid({ children, columns = 4 }: SpreadsheetGridProps) {
  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div 
        className={`
          grid gap-4 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-${Math.min(columns, 4)}
          xl:grid-cols-${columns}
        `}
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`
        }}
      >
        {children}
      </div>
    </div>
  );
}