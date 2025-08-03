import { getClientsWithHierarchy, mockSales, mockEmployees } from '../data/mockData';

export interface SalesTableRow {
  id: string;
  name: string;
  type: 'filial' | 'funcionario' | 'grupo';
  level: number;
  metaMes?: number;
  superMetaMes?: number;
  metaDia?: number;
  superMetaDia?: number;
  dailySales: { [day: string]: number };
  total: number;
  isGroup?: boolean;
  children?: SalesTableRow[];
}

// Dados mock para filiais (baseado na primeira imagem)
export const mockFilialData: SalesTableRow[] = [
  {
    id: 'imbiribeira',
    name: '001 Imbiribeira',
    type: 'filial',
    level: 0,
    metaMes: 4085,
    superMetaMes: 5540,
    metaDia: 141,
    superMetaDia: 190,
    dailySales: {
      '22': 16, '23': 15, '24': 37, '25': 14, '26': 1, 
      '27': 4, '28': 11, '29': 20, '30': 20, '31': 23
    },
    total: 433
  },
  {
    id: 'boa-viagem',
    name: '002 Boa Viagem',
    type: 'filial',
    level: 0,
    metaMes: 3500,
    superMetaMes: 4500,
    metaDia: 120,
    superMetaDia: 156,
    dailySales: {
      '22': 5, '23': 0, '24': 7, '25': 12, '26': 4, 
      '27': 4, '28': 20, '29': 8, '30': 4, '31': 7
    },
    total: 229
  },
  {
    id: 'casa-caiada',
    name: '003 Casa Caiada',
    type: 'filial',
    level: 0,
    metaMes: 2200,
    superMetaMes: 2800,
    metaDia: 75,
    superMetaDia: 100,
    dailySales: {
      '22': 3, '23': 0, '24': 2, '25': 1, '26': 2, 
      '27': 0, '28': 1, '29': 1, '30': 3, '31': 0
    },
    total: 52
  },
  {
    id: 'torres',
    name: '004 Torres',
    type: 'filial',
    level: 0,
    metaMes: 3800,
    superMetaMes: 4900,
    metaDia: 165,
    superMetaDia: 200,
    dailySales: {
      '22': 2, '23': 7, '24': 7, '25': 8, '26': 10, 
      '27': 1, '28': 5, '29': 5, '30': 1, '31': 1
    },
    total: 112
  },
  {
    id: 'jaboatao',
    name: '005 Jaboatão',
    type: 'filial',
    level: 0,
    metaMes: 4200,
    superMetaMes: 5400,
    metaDia: 200,
    superMetaDia: 300,
    dailySales: {
      '22': 16, '23': 20, '24': 14, '25': 10, '26': 0, 
      '27': 8, '28': 10, '29': 7, '30': 6, '31': 12
    },
    total: 317
  },
  {
    id: 'pina',
    name: '006 Pina',
    type: 'filial',
    level: 0,
    metaMes: 6800,
    superMetaMes: 8500,
    metaDia: 530,
    superMetaDia: 850,
    dailySales: {
      '22': 65, '23': 14, '24': 43, '25': 22, '26': 11, 
      '27': 15, '28': 19, '29': 27, '30': 26, '31': 27
    },
    total: 952
  }
];

// Dados mock para funcionários (baseado na segunda imagem)
export const mockFuncionarioData: SalesTableRow[] = [
  {
    id: 'grupo-conveniencia',
    name: 'Conveniência',
    type: 'grupo',
    level: 0,
    isGroup: true,
    metaMes: 0,
    superMetaMes: 0,
    metaDia: 0,
    superMetaDia: 0,
    dailySales: {
      '22': 1, '23': 31, '24': 2, '25': 4, '26': 4, 
      '27': 5, '28': 2, '29': 12, '30': 11, '31': 0
    },
    total: 180,
    children: [
      {
        id: 'loja-imbiribeira',
        name: 'Loja Imbiribeira',
        type: 'funcionario',
        level: 1,
        metaMes: 0,
        superMetaMes: 0,
        metaDia: 0,
        superMetaDia: 0,
        dailySales: {
          '22': 6, '23': 31, '24': 2, '25': 4, '26': 4, 
          '27': 5, '28': 2, '29': 12, '30': 11, '31': 0
        },
        total: 180
      }
    ]
  },
  {
    id: 'grupo-grv',
    name: 'Grv',
    type: 'grupo',
    level: 0,
    isGroup: true,
    metaMes: 70,
    superMetaMes: 80,
    metaDia: 1,
    superMetaDia: 2,
    dailySales: {
      '22': 1, '23': 0, '24': 0, '25': 0, '26': 0, 
      '27': 0, '28': 0, '29': 0, '30': 0, '31': 0
    },
    total: 0,
    children: [
      {
        id: 'alexandre-barbosa',
        name: 'Alexandre Barbosa',
        type: 'funcionario',
        level: 1,
        metaMes: 15,
        superMetaMes: 20,
        metaDia: 1,
        superMetaDia: 1,
        dailySales: {
          '22': 0, '23': 0, '24': 0, '25': 0, '26': 0, 
          '27': 0, '28': 0, '29': 0, '30': 0, '31': 0
        },
        total: 0
      },
      {
        id: 'jefferson-santos',
        name: 'Jefferson Santos',
        type: 'funcionario',
        level: 1,
        metaMes: 15,
        superMetaMes: 20,
        metaDia: 1,
        superMetaDia: 1,
        dailySales: {
          '22': 0, '23': 0, '24': 0, '25': 0, '26': 0, 
          '27': 0, '28': 0, '29': 0, '30': 0, '31': 0
        },
        total: 0
      }
    ]
  },
  {
    id: 'grupo-trocadores',
    name: 'Trocadores',
    type: 'grupo',
    level: 0,
    isGroup: true,
    metaMes: 830,
    superMetaMes: 1000,
    metaDia: 4,
    superMetaDia: 5,
    dailySales: {
      '22': 1, '23': 0, '24': 4, '25': 0, '26': 0, 
      '27': 2, '28': 16, '29': 4, '30': 4, '31': 0
    },
    total: 113,
    children: [
      {
        id: 'claudio-roberto',
        name: 'Claudio Roberto',
        type: 'funcionario',
        level: 1,
        metaMes: 130,
        superMetaMes: 165,
        metaDia: 2,
        superMetaDia: 3,
        dailySales: {
          '22': 0, '23': 0, '24': 4, '25': 0, '26': 0, 
          '27': 0, '28': 16, '29': 0, '30': 4, '31': 0
        },
        total: 107
      },
      {
        id: 'marcelo-adriano',
        name: 'Marcelo Adriano',
        type: 'funcionario',
        level: 1,
        metaMes: 130,
        superMetaMes: 165,
        metaDia: 2,
        superMetaDia: 3,
        dailySales: {
          '22': 0, '23': 0, '24': 0, '25': 0, '26': 0, 
          '27': 2, '28': 0, '29': 2, '30': 0, '31': 0
        },
        total: 6
      }
    ]
  }
];

export function getFiliaisData(): SalesTableRow[] {
  return mockFilialData;
}

export function getFuncionariosData(): SalesTableRow[] {
  return mockFuncionarioData;
}