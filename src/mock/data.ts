import type { ProductGrade, Orchard, PickingRecord, InventoryBatch, Customer, Order, User } from '../types';

// Mock 产品等级
export const mockGrades: ProductGrade[] = [
  { id: '1', name: '85mm+精品果', code: '85+' },
  { id: '2', name: '80-85mm', code: '80-85' },
  { id: '3', name: '75-80mm', code: '75-80' },
  { id: '4', name: '70-75mm', code: '70-75' },
  { id: '5', name: '次果', code: 'C' },
];

// Mock 地块
export const mockOrchards: Orchard[] = [
  { id: '1', name: '东山', description: '东山坡地' },
  { id: '2', name: 'A区', description: 'A区平地' },
  { id: '3', name: 'B区', description: 'B区山地' },
  { id: '4', name: '西坡', description: '西坡地' },
];

// Mock 客户
export const mockCustomers: Customer[] = [
  { id: '1', name: '张三', phone: '13800138001', address: '北京市朝阳区' },
  { id: '2', name: '李四', phone: '13800138002', address: '上海市浦东新区' },
  { id: '3', name: '王五', phone: '13800138003', address: '广州市天河区' },
  { id: '4', name: '赵六', phone: '13800138004', address: '深圳市南山区' },
];

// Mock 用户
export const mockUsers: User[] = [
  { id: '1', name: '老板', role: 'admin', phone: '13800000001' },
  { id: '2', name: '仓库主管', role: 'warehouse', phone: '13800000002' },
  { id: '3', name: '采摘队长', role: 'picker', phone: '13800000003' },
];

// 生成日期字符串（N天前）
const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

// Mock 采摘记录
export const mockPickingRecords: PickingRecord[] = [
  {
    id: 'p1',
    orchardId: '1',
    orchardName: '东山',
    quantity: 5000,
    unit: 'jin',
    date: daysAgo(10),
    status: 'processed',
  },
  {
    id: 'p2',
    orchardId: '2',
    orchardName: 'A区',
    quantity: 3000,
    unit: 'jin',
    date: daysAgo(8),
    status: 'processed',
  },
  {
    id: 'p3',
    orchardId: '1',
    orchardName: '东山',
    quantity: 4000,
    unit: 'jin',
    date: daysAgo(5),
    status: 'processed',
  },
  {
    id: 'p4',
    orchardId: '3',
    orchardName: 'B区',
    quantity: 2000,
    unit: 'jin',
    date: daysAgo(2),
    status: 'pending',
  },
];

// Mock 库存批次
export const mockInventoryBatches: InventoryBatch[] = [
  {
    id: 'b1',
    batchNo: 'BATCH-2024-11-01-001',
    gradeId: '2',
    gradeName: '80-85mm',
    quantity: 2000,
    inStockDate: daysAgo(10),
    daysInStock: 10,
    pickingRecordId: 'p1',
  },
  {
    id: 'b2',
    batchNo: 'BATCH-2024-11-01-002',
    gradeId: '3',
    gradeName: '75-80mm',
    quantity: 1800,
    inStockDate: daysAgo(10),
    daysInStock: 10,
    pickingRecordId: 'p1',
  },
  {
    id: 'b3',
    batchNo: 'BATCH-2024-11-03-001',
    gradeId: '2',
    gradeName: '80-85mm',
    quantity: 1500,
    inStockDate: daysAgo(8),
    daysInStock: 8,
    pickingRecordId: 'p2',
  },
  {
    id: 'b4',
    batchNo: 'BATCH-2024-11-05-001',
    gradeId: '1',
    gradeName: '85mm+精品果',
    quantity: 1000,
    inStockDate: daysAgo(5),
    daysInStock: 5,
    pickingRecordId: 'p3',
  },
  {
    id: 'b5',
    batchNo: 'BATCH-2024-11-05-002',
    gradeId: '2',
    gradeName: '80-85mm',
    quantity: 2000,
    inStockDate: daysAgo(5),
    daysInStock: 5,
    pickingRecordId: 'p3',
  },
];

// Mock 订单
export const mockOrders: Order[] = [
  {
    id: 'o1',
    orderNo: 'ORD-2024-11-08-001',
    customerId: '1',
    customerName: '张三',
    items: [
      {
        id: 'oi1',
        gradeId: '2',
        gradeName: '80-85mm',
        quantity: 1000,
        unitPrice: 5.5,
        batchId: 'b1',
      },
    ],
    totalAmount: 5500,
    status: 'completed',
    paymentStatus: 'paid',
    paidAmount: 5500,
    cost: 200,
    profit: 5300,
    createdAt: daysAgo(8),
    shippedAt: daysAgo(7),
    completedAt: daysAgo(6),
  },
  {
    id: 'o2',
    orderNo: 'ORD-2024-11-09-001',
    customerId: '2',
    customerName: '李四',
    items: [
      {
        id: 'oi2',
        gradeId: '2',
        gradeName: '80-85mm',
        quantity: 1500,
        unitPrice: 5.8,
        batchId: 'b3',
      },
    ],
    totalAmount: 8700,
    status: 'shipped',
    paymentStatus: 'partial',
    paidAmount: 5000,
    cost: 300,
    profit: 8400,
    createdAt: daysAgo(6),
    shippedAt: daysAgo(5),
  },
  {
    id: 'o3',
    orderNo: 'ORD-2024-11-10-001',
    customerId: '3',
    customerName: '王五',
    items: [
      {
        id: 'oi3',
        gradeId: '1',
        gradeName: '85mm+精品果',
        quantity: 800,
        unitPrice: 7.0,
      },
    ],
    totalAmount: 5600,
    status: 'confirmed',
    paymentStatus: 'unpaid',
    paidAmount: 0,
    cost: 0,
    profit: 0,
    createdAt: daysAgo(3),
  },
];

