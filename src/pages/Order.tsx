import { useState } from 'react';
import { useStore } from '../store/useStore';
import type { OrderItem } from '../types';
import './Order.css';

export const Order = () => {
  const {
    customers,
    orders,
    inventoryBatches,
    getInventorySummary,
    createOrder,
    updateOrder,
    shipOrder,
    completeOrder,
  } = useStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrderCustomerId, setNewOrderCustomerId] = useState('');
  const [newOrderItems, setNewOrderItems] = useState<Array<{ gradeId: string; quantity: number; unitPrice: number }>>([]);

  const inventorySummary = getInventorySummary();

  const handleAddOrderItem = () => {
    setNewOrderItems([...newOrderItems, { gradeId: '', quantity: 0, unitPrice: 0 }]);
  };

  const handleUpdateOrderItem = (index: number, field: 'gradeId' | 'quantity' | 'unitPrice', value: string | number) => {
    const updated = [...newOrderItems];
    updated[index] = { ...updated[index], [field]: value };
    setNewOrderItems(updated);
  };

  const handleRemoveOrderItem = (index: number) => {
    setNewOrderItems(newOrderItems.filter((_, i) => i !== index));
  };

  const handleCreateOrder = () => {
    if (!newOrderCustomerId || newOrderItems.length === 0) {
      alert('请填写完整信息');
      return;
    }

    const customer = customers.find((c) => c.id === newOrderCustomerId);
    if (!customer) {
      alert('客户不存在');
      return;
    }

    // 检查库存
    for (const item of newOrderItems) {
      if (!item.gradeId || item.quantity <= 0) {
        alert('请填写完整的订单项');
        return;
      }

      const inventory = inventorySummary.find((inv) => inv.gradeId === item.gradeId);
      if (!inventory || inventory.totalQuantity < item.quantity) {
        alert(`${inventory?.gradeName || '该等级'} 库存不足`);
        return;
      }
    }

    const totalAmount = newOrderItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    const orderItems: OrderItem[] = newOrderItems.map((item, index) => {
      const grade = inventorySummary.find((inv) => inv.gradeId === item.gradeId);
      return {
        id: `oi-${Date.now()}-${index}`,
        gradeId: item.gradeId,
        gradeName: grade?.gradeName || '',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      };
    });

    createOrder({
      customerId: newOrderCustomerId,
      customerName: customer.name,
      items: orderItems,
      totalAmount,
      status: 'confirmed',
      paymentStatus: 'unpaid',
      paidAmount: 0,
      cost: 0,
    });

    alert('订单创建成功！');
    setShowCreateModal(false);
    setNewOrderCustomerId('');
    setNewOrderItems([]);
  };

  const handleShipOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    // 为每个订单项分配批次（FIFO）
    const batchMapping: Record<string, string> = {};

    order.items.forEach((item) => {
      // 找到该等级的所有批次，按入库日期排序（FIFO）
      const batches = inventoryBatches
        .filter((b) => b.gradeId === item.gradeId && b.quantity >= item.quantity)
        .sort((a, b) => new Date(a.inStockDate).getTime() - new Date(b.inStockDate).getTime());

      if (batches.length > 0) {
        const batch = batches[0];
        batchMapping[item.id] = batch.id;
      }
    });

    if (Object.keys(batchMapping).length === order.items.length) {
      shipOrder(orderId, batchMapping);
      alert('发货成功！');
    } else {
      alert('部分商品库存不足，无法发货');
    }
  };

  const handleUpdatePaymentStatus = (orderId: string, status: 'unpaid' | 'partial' | 'paid', amount?: number) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    let paidAmount = order.paidAmount;
    if (status === 'paid') {
      paidAmount = order.totalAmount;
    } else if (status === 'partial' && amount !== undefined) {
      paidAmount = amount;
    } else if (status === 'unpaid') {
      paidAmount = 0;
    }

    updateOrder(orderId, {
      paymentStatus: status,
      paidAmount,
    });
  };

  const pendingOrders = orders.filter((o) => o.status === 'confirmed');
  const shippedOrders = orders.filter((o) => o.status === 'shipped');
  const completedOrders = orders.filter((o) => o.status === 'completed');

  return (
    <div className="order">
      <div className="order-header">
        <h2 className="order-title">订单管理</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          ➕ 创建订单
        </button>
      </div>

      {/* 待发货订单 */}
      {pendingOrders.length > 0 && (
        <div className="order-section">
          <h3 className="section-title">待发货订单 ({pendingOrders.length})</h3>
          <div className="order-list">
            {pendingOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header-info">
                  <div>
                    <div className="order-no">{order.orderNo}</div>
                    <div className="order-customer">{order.customerName}</div>
                  </div>
                  <div className="order-amount">¥{order.totalAmount.toFixed(2)}</div>
                </div>
                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item.id} className="order-item">
                      {item.gradeName} × {item.quantity} 斤 × ¥{item.unitPrice}
                    </div>
                  ))}
                </div>
                <div className="order-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleShipOrder(order.id)}
                  >
                    发货
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 已发货订单 */}
      {shippedOrders.length > 0 && (
        <div className="order-section">
          <h3 className="section-title">已发货订单 ({shippedOrders.length})</h3>
          <div className="order-list">
            {shippedOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header-info">
                  <div>
                    <div className="order-no">{order.orderNo}</div>
                    <div className="order-customer">{order.customerName}</div>
                  </div>
                  <div className="order-amount">¥{order.totalAmount.toFixed(2)}</div>
                </div>
                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item.id} className="order-item">
                      {item.gradeName} × {item.quantity} 斤 × ¥{item.unitPrice}
                    </div>
                  ))}
                </div>
                <div className="order-payment">
                  <div className="payment-status">
                    收款状态: {
                      order.paymentStatus === 'paid' ? '已结清' :
                      order.paymentStatus === 'partial' ? '部分收款' : '未收款'
                    }
                  </div>
                  <div className="payment-amount">
                    已收款: ¥{order.paidAmount.toFixed(2)} / ¥{order.totalAmount.toFixed(2)}
                  </div>
                </div>
                <div className="order-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleUpdatePaymentStatus(order.id, 'unpaid')}
                  >
                    未收款
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      const amount = prompt('请输入收款金额:', order.totalAmount.toString());
                      if (amount) {
                        handleUpdatePaymentStatus(order.id, 'partial', parseFloat(amount));
                      }
                    }}
                  >
                    部分收款
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleUpdatePaymentStatus(order.id, 'paid')}
                  >
                    已结清
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => completeOrder(order.id)}
                  >
                    完成
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 已完成订单 */}
      {completedOrders.length > 0 && (
        <div className="order-section">
          <h3 className="section-title">已完成订单 ({completedOrders.length})</h3>
          <div className="order-list">
            {completedOrders.slice(0, 10).map((order) => (
              <div key={order.id} className="order-card completed">
                <div className="order-header-info">
                  <div>
                    <div className="order-no">{order.orderNo}</div>
                    <div className="order-customer">{order.customerName}</div>
                  </div>
                  <div className="order-amount">¥{order.totalAmount.toFixed(2)}</div>
                </div>
                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item.id} className="order-item">
                      {item.gradeName} × {item.quantity} 斤 × ¥{item.unitPrice}
                    </div>
                  ))}
                </div>
                <div className="order-profit">
                  毛利: ¥{order.profit.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 创建订单对话框 */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">创建订单</h3>

            <div className="form-group">
              <label>选择客户 *</label>
              <select
                value={newOrderCustomerId}
                onChange={(e) => setNewOrderCustomerId(e.target.value)}
                className="form-input"
              >
                <option value="">请选择客户</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>订单项 *</label>
              {newOrderItems.map((item, index) => {
                const availableInventory = inventorySummary.find((inv) => inv.gradeId === item.gradeId);
                return (
                  <div key={index} className="order-item-row">
                    <select
                      value={item.gradeId}
                      onChange={(e) => handleUpdateOrderItem(index, 'gradeId', e.target.value)}
                      className="form-input"
                    >
                      <option value="">选择等级</option>
                      {inventorySummary.map((inv) => (
                        <option key={inv.gradeId} value={inv.gradeId}>
                          {inv.gradeName} (库存: {(inv.totalQuantity / 1000).toFixed(1)} 吨)
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={item.quantity || ''}
                      onChange={(e) =>
                        handleUpdateOrderItem(index, 'quantity', parseFloat(e.target.value) || 0)
                      }
                      placeholder="数量(斤)"
                      className="form-input"
                      min="0"
                      step="0.1"
                    />
                    <input
                      type="number"
                      value={item.unitPrice || ''}
                      onChange={(e) =>
                        handleUpdateOrderItem(index, 'unitPrice', parseFloat(e.target.value) || 0)
                      }
                      placeholder="单价(元/斤)"
                      className="form-input"
                      min="0"
                      step="0.01"
                    />
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoveOrderItem(index)}
                    >
                      删除
                    </button>
                    {availableInventory && item.quantity > availableInventory.totalQuantity && (
                      <div className="inventory-warning">
                        库存不足！可用: {availableInventory.totalQuantity} 斤
                      </div>
                    )}
                  </div>
                );
              })}
              <button className="btn btn-secondary" onClick={handleAddOrderItem}>
                ➕ 添加商品
              </button>
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowCreateModal(false)}
              >
                取消
              </button>
              <button className="btn btn-primary" onClick={handleCreateOrder}>
                创建订单
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

