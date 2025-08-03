export interface User {
  id: string;
  name: string;
  email: string;
  role: 'master' | 'manager' | 'employee';
}

export interface Client {
  id: string;
  name: string;
  stores: Store[];
}

export interface Store {
  id: string;
  name: string;
  clientId: string;
  employees: Employee[];
  dailyGoal: number;
  superGoal: number;
}

export interface Employee {
  id: string;
  name: string;
  storeId: string;
  dailyGoal: number;
  superGoal: number;
}

export interface Sale {
  id: string;
  employeeId: string;
  amount: number;
  date: string;
  description?: string;
}

export type PerformanceStatus = 'below' | 'met' | 'super' | 'neutral';

export interface PerformanceData {
  totalSales: number;
  dailyGoal: number;
  superGoal: number;
  status: PerformanceStatus;
  percentage: number;
}

export interface HierarchyLevel {
  type: 'clients' | 'stores' | 'employees';
  parentId?: string;
  parentName?: string;
}