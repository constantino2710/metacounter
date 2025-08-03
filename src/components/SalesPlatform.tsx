import { useState } from 'react';
import { Header } from './Header';
import { SpreadsheetGrid } from './SpreadsheetGrid';
import { PerformanceCell } from './PerformanceCell';
import { SalesModal } from './SalesModal';
import { 
  getClientsWithHierarchy, 
  mockSales, 
  mockEmployees, 
  mockStores 
} from '../data/mockData';
import {
  calculateClientPerformance,
  calculateStorePerformance,
  calculateEmployeePerformance
} from '../utils/salesCalculations';
import { 
  Client, 
  Store, 
  Employee, 
  Sale, 
  HierarchyLevel 
} from '../types/sales';

export function SalesPlatform() {
  const [clients] = useState<Client[]>(getClientsWithHierarchy());
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [currentLevel, setCurrentLevel] = useState<HierarchyLevel>({
    type: 'clients'
  });
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigateToStores = (client: Client) => {
    setCurrentLevel({
      type: 'stores',
      parentId: client.id,
      parentName: client.name
    });
  };

  const navigateToEmployees = (store: Store) => {
    setCurrentLevel({
      type: 'employees',
      parentId: store.id,
      parentName: store.name
    });
  };

  const navigateBack = () => {
    if (currentLevel.type === 'employees') {
      // Voltar para stores
      const store = mockStores.find(s => s.id === currentLevel.parentId);
      if (store) {
        const client = clients.find(c => c.id === store.clientId);
        setCurrentLevel({
          type: 'stores',
          parentId: client?.id,
          parentName: client?.name
        });
      }
    } else if (currentLevel.type === 'stores') {
      // Voltar para clients
      setCurrentLevel({ type: 'clients' });
    }
  };

  const openEmployeeSales = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleAddSale = (newSale: Omit<Sale, 'id'>) => {
    const sale: Sale = {
      ...newSale,
      id: `sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    setSales(prev => [...prev, sale]);
  };

  const handleEditSale = (updatedSale: Sale) => {
    setSales(prev => prev.map(sale => 
      sale.id === updatedSale.id ? updatedSale : sale
    ));
  };

  const renderClients = () => {
    return clients.map(client => {
      const performance = calculateClientPerformance(
        client.stores, 
        mockEmployees, 
        sales
      );
      
      return (
        <PerformanceCell
          key={client.id}
          data={performance}
          name={client.name}
          onClick={() => navigateToStores(client)}
        />
      );
    });
  };

  const renderStores = () => {
    const client = clients.find(c => c.id === currentLevel.parentId);
    if (!client) return null;

    return client.stores.map(store => {
      const performance = calculateStorePerformance(
        store,
        mockEmployees,
        sales
      );
      
      return (
        <PerformanceCell
          key={store.id}
          data={performance}
          name={store.name}
          onClick={() => navigateToEmployees(store)}
        />
      );
    });
  };

  const renderEmployees = () => {
    const storeEmployees = mockEmployees.filter(
      emp => emp.storeId === currentLevel.parentId
    );

    return storeEmployees.map(employee => {
      const performance = calculateEmployeePerformance(employee, sales);
      
      return (
        <PerformanceCell
          key={employee.id}
          data={performance}
          name={employee.name}
          onClick={() => openEmployeeSales(employee)}
        />
      );
    });
  };

  const renderCurrentLevel = () => {
    switch (currentLevel.type) {
      case 'clients': return renderClients();
      case 'stores': return renderStores();
      case 'employees': return renderEmployees();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentLevel={currentLevel}
        onNavigateBack={navigateBack}
      />
      
      <main className="py-6">
        <SpreadsheetGrid>
          {renderCurrentLevel()}
        </SpreadsheetGrid>
      </main>

      {selectedEmployee && (
        <SalesModal
          employee={selectedEmployee}
          sales={sales}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEmployee(null);
          }}
          onAddSale={handleAddSale}
          onEditSale={handleEditSale}
        />
      )}
    </div>
  );
}