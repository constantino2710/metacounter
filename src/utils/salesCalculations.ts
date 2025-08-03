import { Sale, Employee, Store, PerformanceData, PerformanceStatus } from '../types/sales';

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function calculateEmployeePerformance(
  employee: Employee, 
  sales: Sale[]
): PerformanceData {
  const today = getTodayString();
  const todaySales = sales.filter(
    sale => sale.employeeId === employee.id && sale.date === today
  );
  
  const totalSales = todaySales.reduce((sum, sale) => sum + sale.amount, 0);
  const percentage = (totalSales / employee.dailyGoal) * 100;
  
  let status: PerformanceStatus = 'neutral';
  if (totalSales >= employee.superGoal) {
    status = 'super';
  } else if (totalSales >= employee.dailyGoal) {
    status = 'met';
  } else if (totalSales > 0) {
    status = 'below';
  }
  
  return {
    totalSales,
    dailyGoal: employee.dailyGoal,
    superGoal: employee.superGoal,
    status,
    percentage
  };
}

export function calculateStorePerformance(
  store: Store,
  employees: Employee[],
  sales: Sale[]
): PerformanceData {
  const storeEmployees = employees.filter(emp => emp.storeId === store.id);
  const totalSales = storeEmployees.reduce((sum, employee) => {
    const empPerf = calculateEmployeePerformance(employee, sales);
    return sum + empPerf.totalSales;
  }, 0);
  
  const percentage = (totalSales / store.dailyGoal) * 100;
  
  let status: PerformanceStatus = 'neutral';
  if (totalSales >= store.superGoal) {
    status = 'super';
  } else if (totalSales >= store.dailyGoal) {
    status = 'met';
  } else if (totalSales > 0) {
    status = 'below';
  }
  
  return {
    totalSales,
    dailyGoal: store.dailyGoal,
    superGoal: store.superGoal,
    status,
    percentage
  };
}

export function calculateClientPerformance(
  stores: Store[],
  employees: Employee[],
  sales: Sale[]
): PerformanceData {
  const totalSales = stores.reduce((sum, store) => {
    const storePerf = calculateStorePerformance(store, employees, sales);
    return sum + storePerf.totalSales;
  }, 0);
  
  const totalGoal = stores.reduce((sum, store) => sum + store.dailyGoal, 0);
  const totalSuperGoal = stores.reduce((sum, store) => sum + store.superGoal, 0);
  const percentage = totalGoal > 0 ? (totalSales / totalGoal) * 100 : 0;
  
  let status: PerformanceStatus = 'neutral';
  if (totalSales >= totalSuperGoal) {
    status = 'super';
  } else if (totalSales >= totalGoal) {
    status = 'met';
  } else if (totalSales > 0) {
    status = 'below';
  }
  
  return {
    totalSales,
    dailyGoal: totalGoal,
    superGoal: totalSuperGoal,
    status,
    percentage
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
}

export function getPerformanceColor(status: PerformanceStatus): string {
  switch (status) {
    case 'below': return 'bg-performance-below text-performance-below-foreground';
    case 'met': return 'bg-performance-met text-performance-met-foreground';
    case 'super': return 'bg-performance-super text-performance-super-foreground';
    default: return 'bg-performance-neutral text-performance-neutral-foreground';
  }
}