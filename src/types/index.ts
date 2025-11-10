// 用户角色
export type UserRole = 'admin' | 'warehouse' | 'picker';

// 产品等级
export interface ProductGrade {
  id: string;
  name: string; // 如：80mm、75mm、次果
  code: string; // 如：80、75、C
}

// 地块
export interface Orchard {
  id: string;
  name: string; // 如：东山、A区
  description?: string;
}

// 采摘记录
export interface PickingRecord {
  id: string;
  orchardId: string;
  orchardName: string;
  quantity: number; // 数量（斤）
  unit: 'jin' | 'basket'; // 单位：斤或筐
  date: string; // 日期
  pickerId?: string; // 采摘队长ID
  status: 'pending' | 'processed'; // 待分拣 / 已处理
}

// 库存批次
export interface InventoryBatch {
  id: string;
  batchNo: string; // 批次号
  gradeId: string;
  gradeName: string;
  quantity: number; // 数量（斤）
  inStockDate: string; // 入库日期
  daysInStock: number; // 库龄（天）
  pickingRecordId?: string; // 关联的采摘记录ID
}

// 库存汇总
export interface InventorySummary {
  gradeId: string;
  gradeName: string;
  totalQuantity: number; // 总数量
  batches: InventoryBatch[]; // 批次列表
}

// 客户
export interface Customer {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  note?: string;
}

// 订单状态
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled';

// 收款状态
export type PaymentStatus = 'unpaid' | 'partial' | 'paid';

// 订单项
export interface OrderItem {
  id: string;
  gradeId: string;
  gradeName: string;
  quantity: number;
  unitPrice: number; // 单价（元/斤）
  batchId?: string; // 发货批次ID
}

// 订单
export interface Order {
  id: string;
  orderNo: string; // 订单号
  customerId: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number; // 订单总金额
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paidAmount: number; // 已收款金额
  cost: number; // 成本（物流费、包材费等）
  profit: number; // 毛利
  createdAt: string;
  shippedAt?: string;
  completedAt?: string;
  note?: string;
}

// 库存预警
export interface InventoryAlert {
  id: string;
  batchId: string;
  batchNo: string;
  gradeName: string;
  message: string; // 预警信息
  type: 'age' | 'low_stock'; // 库龄预警 / 低库存预警
  daysInStock: number;
}

// 用户
export interface User {
  id: string;
  name: string;
  role: UserRole;
  phone?: string;
}

