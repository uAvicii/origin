import { create } from 'zustand';
import type {
  ProductGrade,
  Orchard,
  PickingRecord,
  InventoryBatch,
  Customer,
  Order,
  InventorySummary,
  InventoryAlert,
  User,
} from '../types';
import {
  mockGrades,
  mockOrchards,
  mockCustomers,
  mockOrders,
  mockInventoryBatches,
  mockPickingRecords,
  mockUsers,
} from '../mock/data';

interface AppState {
  // 基础数据
  grades: ProductGrade[];
  orchards: Orchard[];
  customers: Customer[];
  users: User[];
  currentUser: User | null;

  // 业务数据
  pickingRecords: PickingRecord[];
  inventoryBatches: InventoryBatch[];
  orders: Order[];

  // 计算属性
  getInventorySummary: () => InventorySummary[];
  getInventoryAlerts: () => InventoryAlert[];
  getPendingPickingQuantity: () => number;
  getTodaySales: () => number;
  getPendingShipmentCount: () => number;

  // 操作方法
  addGrade: (grade: Omit<ProductGrade, 'id'>) => void;
  updateGrade: (id: string, grade: Partial<ProductGrade>) => void;
  deleteGrade: (id: string) => void;

  addOrchard: (orchard: Omit<Orchard, 'id'>) => void;
  updateOrchard: (id: string, orchard: Partial<Orchard>) => void;
  deleteOrchard: (id: string) => void;

  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  addPickingRecord: (record: Omit<PickingRecord, 'id'>) => string;
  processPickingRecord: (id: string) => void;

  addInventoryBatch: (batch: Omit<InventoryBatch, 'id' | 'batchNo' | 'daysInStock'>) => void;
  updateInventoryBatch: (id: string, batch: Partial<InventoryBatch>) => void;
  reduceInventoryBatch: (id: string, quantity: number) => void;

  createOrder: (order: Omit<Order, 'id' | 'orderNo' | 'createdAt' | 'profit'>) => string;
  updateOrder: (id: string, order: Partial<Order>) => void;
  shipOrder: (orderId: string, batchMapping: Record<string, string>) => void;
  completeOrder: (orderId: string) => void;

  setCurrentUser: (user: User | null) => void;

  // 库龄预警阈值（天）
  ageAlertThreshold: number;
  setAgeAlertThreshold: (days: number) => void;
}

// 生成ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// 生成批次号
const generateBatchNo = (): string => {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `BATCH-${dateStr}-${random}`;
};

// 生成订单号
const generateOrderNo = (): string => {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `ORD-${dateStr}-${random}`;
};

// 计算库龄
const calculateDaysInStock = (inStockDate: string): number => {
  const today = new Date();
  const stockDate = new Date(inStockDate);
  const diffTime = today.getTime() - stockDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export const useStore = create<AppState>((set, get) => ({
  // 初始状态
  grades: mockGrades,
  orchards: mockOrchards,
  customers: mockCustomers,
  users: mockUsers,
  currentUser: mockUsers[0], // 默认老板
  pickingRecords: mockPickingRecords,
  inventoryBatches: mockInventoryBatches,
  orders: mockOrders,
  ageAlertThreshold: 7,

  // 计算属性
  getInventorySummary: () => {
    const { inventoryBatches, grades } = get();
    const summaryMap = new Map<string, InventorySummary>();

    grades.forEach((grade) => {
      const batches = inventoryBatches.filter((b) => b.gradeId === grade.id && b.quantity > 0);
      if (batches.length > 0) {
        const totalQuantity = batches.reduce((sum, b) => sum + b.quantity, 0);
        summaryMap.set(grade.id, {
          gradeId: grade.id,
          gradeName: grade.name,
          totalQuantity,
          batches,
        });
      }
    });

    return Array.from(summaryMap.values());
  },

  getInventoryAlerts: () => {
    const { inventoryBatches, ageAlertThreshold } = get();
    const alerts: InventoryAlert[] = [];

    inventoryBatches.forEach((batch) => {
      if (batch.quantity > 0 && batch.daysInStock >= ageAlertThreshold) {
        alerts.push({
          id: `alert-${batch.id}`,
          batchId: batch.id,
          batchNo: batch.batchNo,
          gradeName: batch.gradeName,
          message: `${batch.gradeName} 批次 ${batch.batchNo} 已存放 ${batch.daysInStock} 天，请注意损耗`,
          type: 'age',
          daysInStock: batch.daysInStock,
        });
      }
    });

    return alerts;
  },

  getPendingPickingQuantity: () => {
    const { pickingRecords } = get();
    return pickingRecords
      .filter((r) => r.status === 'pending')
      .reduce((sum, r) => sum + r.quantity, 0);
  },

  getTodaySales: () => {
    const { orders } = get();
    const today = new Date().toISOString().split('T')[0];
    return orders
      .filter((o) => o.createdAt.startsWith(today) && o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);
  },

  getPendingShipmentCount: () => {
    const { orders } = get();
    return orders.filter((o) => o.status === 'confirmed').length;
  },

  // 操作方法
  addGrade: (grade) => {
    set((state) => ({
      grades: [...state.grades, { ...grade, id: generateId() }],
    }));
  },

  updateGrade: (id, grade) => {
    set((state) => ({
      grades: state.grades.map((g) => (g.id === id ? { ...g, ...grade } : g)),
    }));
  },

  deleteGrade: (id) => {
    set((state) => ({
      grades: state.grades.filter((g) => g.id !== id),
    }));
  },

  addOrchard: (orchard) => {
    set((state) => ({
      orchards: [...state.orchards, { ...orchard, id: generateId() }],
    }));
  },

  updateOrchard: (id, orchard) => {
    set((state) => ({
      orchards: state.orchards.map((o) => (o.id === id ? { ...o, ...orchard } : o)),
    }));
  },

  deleteOrchard: (id) => {
    set((state) => ({
      orchards: state.orchards.filter((o) => o.id !== id),
    }));
  },

  addCustomer: (customer) => {
    set((state) => ({
      customers: [...state.customers, { ...customer, id: generateId() }],
    }));
  },

  updateCustomer: (id, customer) => {
    set((state) => ({
      customers: state.customers.map((c) => (c.id === id ? { ...c, ...customer } : c)),
    }));
  },

  deleteCustomer: (id) => {
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
    }));
  },

  addPickingRecord: (record) => {
    const id = generateId();
    set((state) => ({
      pickingRecords: [...state.pickingRecords, { ...record, id }],
    }));
    return id;
  },

  processPickingRecord: (id) => {
    set((state) => ({
      pickingRecords: state.pickingRecords.map((r) =>
        r.id === id ? { ...r, status: 'processed' } : r
      ),
    }));
  },

  addInventoryBatch: (batch) => {
    const id = generateId();
    const batchNo = generateBatchNo();
    const daysInStock = calculateDaysInStock(batch.inStockDate);
    set((state) => ({
      inventoryBatches: [
        ...state.inventoryBatches,
        {
          ...batch,
          id,
          batchNo,
          daysInStock,
        },
      ],
    }));
  },

  updateInventoryBatch: (id, batch) => {
    set((state) => ({
      inventoryBatches: state.inventoryBatches.map((b) =>
        b.id === id ? { ...b, ...batch } : b
      ),
    }));
  },

  reduceInventoryBatch: (id, quantity) => {
    set((state) => {
      const batches = state.inventoryBatches.map((b) => {
        if (b.id === id) {
          const newQuantity = Math.max(0, b.quantity - quantity);
          return { ...b, quantity: newQuantity };
        }
        return b;
      });
      return { inventoryBatches: batches };
    });
  },

  createOrder: (order) => {
    const id = generateId();
    const orderNo = generateOrderNo();
    const createdAt = new Date().toISOString();
    const profit = order.totalAmount - order.cost;
    set((state) => ({
      orders: [
        ...state.orders,
        {
          ...order,
          id,
          orderNo,
          createdAt,
          profit,
        },
      ],
    }));
    return id;
  },

  updateOrder: (id, order) => {
    set((state) => {
      const updatedOrders = state.orders.map((o) => {
        if (o.id === id) {
          const updated = { ...o, ...order };
          // 重新计算毛利
          if (order.cost !== undefined || order.totalAmount !== undefined) {
            updated.profit = updated.totalAmount - updated.cost;
          }
          return updated;
        }
        return o;
      });
      return { orders: updatedOrders };
    });
  },

  shipOrder: (orderId, batchMapping) => {
    const { orders, reduceInventoryBatch } = get();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    // 更新订单项中的批次ID，并扣减库存
    order.items.forEach((item) => {
      const batchId = batchMapping[item.id];
      if (batchId) {
        item.batchId = batchId;
        reduceInventoryBatch(batchId, item.quantity);
      }
    });

    // 更新订单状态
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'shipped',
              shippedAt: new Date().toISOString(),
              items: order.items,
            }
          : o
      ),
    }));
  },

  completeOrder: (orderId) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'completed',
              completedAt: new Date().toISOString(),
            }
          : o
      ),
    }));
  },

  setCurrentUser: (user) => {
    set({ currentUser: user });
  },

  setAgeAlertThreshold: (days) => {
    set({ ageAlertThreshold: days });
  },
}));

