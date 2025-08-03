import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Employee, Sale } from '../types/sales';
import { formatCurrency } from '../utils/salesCalculations';

interface SalesModalProps {
  employee: Employee;
  sales: Sale[];
  isOpen: boolean;
  onClose: () => void;
  onAddSale: (sale: Omit<Sale, 'id'>) => void;
  onEditSale: (sale: Sale) => void;
}

export function SalesModal({ 
  employee, 
  sales, 
  isOpen, 
  onClose, 
  onAddSale, 
  onEditSale 
}: SalesModalProps) {
  const [newSaleAmount, setNewSaleAmount] = useState('');
  const [newSaleDescription, setNewSaleDescription] = useState('');
  const [editingSale, setEditingSale] = useState<Sale | null>(null);

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];
  const employeeSales = sales.filter(
    sale => sale.employeeId === employee.id && sale.date === today
  );

  const handleAddSale = () => {
    if (!newSaleAmount) return;
    
    onAddSale({
      employeeId: employee.id,
      amount: parseFloat(newSaleAmount),
      date: today,
      description: newSaleDescription || undefined
    });
    
    setNewSaleAmount('');
    setNewSaleDescription('');
  };

  const handleEditSale = () => {
    if (!editingSale) return;
    
    onEditSale(editingSale);
    setEditingSale(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Vendas - {employee.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              Meta diária: {formatCurrency(employee.dailyGoal)} | 
              Supermeta: {formatCurrency(employee.superGoal)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Adicionar nova venda */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nova Venda
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="number"
                placeholder="Valor"
                value={newSaleAmount}
                onChange={(e) => setNewSaleAmount(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                step="0.01"
              />
              <input
                type="text"
                placeholder="Descrição (opcional)"
                value={newSaleDescription}
                onChange={(e) => setNewSaleDescription(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground md:col-span-2"
              />
            </div>
            <button
              onClick={handleAddSale}
              disabled={!newSaleAmount}
              className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Adicionar Venda
            </button>
          </div>

          {/* Lista de vendas */}
          <div>
            <h3 className="font-semibold mb-3">Vendas de Hoje</h3>
            {employeeSales.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma venda registrada hoje
              </p>
            ) : (
              <div className="space-y-2">
                {employeeSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
                  >
                    {editingSale?.id === sale.id ? (
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="number"
                          value={editingSale.amount}
                          onChange={(e) => setEditingSale({
                            ...editingSale,
                            amount: parseFloat(e.target.value) || 0
                          })}
                          className="px-2 py-1 border border-border rounded text-sm w-24"
                          step="0.01"
                        />
                        <input
                          type="text"
                          value={editingSale.description || ''}
                          onChange={(e) => setEditingSale({
                            ...editingSale,
                            description: e.target.value
                          })}
                          className="px-2 py-1 border border-border rounded text-sm flex-1"
                          placeholder="Descrição"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleEditSale}
                            className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={() => setEditingSale(null)}
                            className="px-3 py-1 bg-muted text-muted-foreground rounded text-sm hover:bg-muted/80"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1">
                          <span className="font-semibold text-primary">
                            {formatCurrency(sale.amount)}
                          </span>
                          {sale.description && (
                            <p className="text-sm text-muted-foreground">
                              {sale.description}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => setEditingSale(sale)}
                          className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Editar
                        </button>
                      </>
                    )}
                  </div>
                ))}
                
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total do dia:</span>
                    <span className="text-primary">
                      {formatCurrency(
                        employeeSales.reduce((sum, sale) => sum + sale.amount, 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}