import { Client, Store, Employee, Sale } from '../types/sales';

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'TechCorp Brasil',
    stores: []
  },
  {
    id: '2', 
    name: 'Varejo Plus',
    stores: []
  },
  {
    id: '3',
    name: 'Fashion Store',
    stores: []
  }
];

export const mockStores: Store[] = [
  {
    id: '1',
    name: 'TechCorp - São Paulo',
    clientId: '1',
    employees: [],
    dailyGoal: 15000,
    superGoal: 19500
  },
  {
    id: '2',
    name: 'TechCorp - Rio de Janeiro', 
    clientId: '1',
    employees: [],
    dailyGoal: 12000,
    superGoal: 15600
  },
  {
    id: '3',
    name: 'Varejo Plus - Centro',
    clientId: '2',
    employees: [],
    dailyGoal: 8000,
    superGoal: 10400
  },
  {
    id: '4',
    name: 'Fashion Store - Shopping',
    clientId: '3',
    employees: [],
    dailyGoal: 10000,
    superGoal: 13000
  }
];

export const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    storeId: '1',
    dailyGoal: 3000,
    superGoal: 3900
  },
  {
    id: '2',
    name: 'Ana Costa',
    storeId: '1', 
    dailyGoal: 3000,
    superGoal: 3900
  },
  {
    id: '3',
    name: 'Pedro Santos',
    storeId: '1',
    dailyGoal: 2500,
    superGoal: 3250
  },
  {
    id: '4',
    name: 'Maria Oliveira',
    storeId: '2',
    dailyGoal: 2800,
    superGoal: 3640
  },
  {
    id: '5',
    name: 'João Ferreira',
    storeId: '2',
    dailyGoal: 2800,
    superGoal: 3640
  },
  {
    id: '6',
    name: 'Lucia Rocha',
    storeId: '3',
    dailyGoal: 2000,
    superGoal: 2600
  },
  {
    id: '7',
    name: 'Rafael Lima',
    storeId: '4',
    dailyGoal: 2500,
    superGoal: 3250
  }
];

export const mockSales: Sale[] = [
  // Vendas de hoje para diferentes performance
  { id: '1', employeeId: '1', amount: 4200, date: '2025-01-03', description: 'Venda produtos premium' },
  { id: '2', employeeId: '1', amount: 800, date: '2025-01-03', description: 'Venda acessórios' },
  
  { id: '3', employeeId: '2', amount: 2100, date: '2025-01-03', description: 'Venda eletrônicos' },
  
  { id: '4', employeeId: '3', amount: 1800, date: '2025-01-03', description: 'Venda básica' },
  
  { id: '5', employeeId: '4', amount: 3200, date: '2025-01-03', description: 'Venda grande' },
  { id: '6', employeeId: '4', amount: 900, date: '2025-01-03', description: 'Venda pequena' },
  
  { id: '7', employeeId: '5', amount: 2900, date: '2025-01-03', description: 'Venda média' },
  
  { id: '8', employeeId: '6', amount: 2800, date: '2025-01-03', description: 'Venda excelente' },
  
  { id: '9', employeeId: '7', amount: 3800, date: '2025-01-03', description: 'Venda supermeta' }
];

// Função para calcular dados com hierarquia
export function getClientsWithHierarchy(): Client[] {
  return mockClients.map(client => ({
    ...client,
    stores: mockStores
      .filter(store => store.clientId === client.id)
      .map(store => ({
        ...store,
        employees: mockEmployees.filter(emp => emp.storeId === store.id)
      }))
  }));
}