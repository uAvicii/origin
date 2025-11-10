import { useState } from 'react';
import { useStore } from '../store/useStore';
import './Finance.css';

export const Finance = () => {
  const { orders, updateOrder } = useStore();
  const [showCostModal, setShowCostModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [cost, setCost] = useState('');

  const handleUpdateCost = () => {
    if (!selectedOrderId || !cost) {
      alert('请填写成本');
      return;
    }

    const costValue = parseFloat(cost);
    if (isNaN(costValue) || costValue < 0) {
      alert('请输入有效的成本金额');
      return;
    }

    updateOrder(selectedOrderId, { cost: costValue });
    alert('成本已更新！');
    setShowCostModal(false);
    setSelectedOrderId('');
    setCost('');
  };

  const openCostModal = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrderId(orderId);
      setCost(order.cost.toString());
      setShowCostModal(true);
    }
  };

  // 计算总销售额
  const totalSales = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // 计算总成本
  const totalCost = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.cost, 0);

  // 计算总毛利
  const totalProfit = totalSales - totalCost;

  // 应收账款
  const receivables = orders
    .filter((o) => o.paymentStatus !== 'paid' && o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.totalAmount - o.paidAmount), 0);

  // 已收款
  const received = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.paidAmount, 0);

  // 按客户统计应收账款
  const receivablesByCustomer = orders
    .filter((o) => o.paymentStatus !== 'paid' && o.status !== 'cancelled')
    .reduce((acc, order) => {
      const unpaid = order.totalAmount - order.paidAmount;
      if (unpaid > 0) {
        if (!acc[order.customerId]) {
          acc[order.customerId] = {
            customerId: order.customerId,
            customerName: order.customerName,
            totalUnpaid: 0,
            orders: [],
          };
        }
        acc[order.customerId].totalUnpaid += unpaid;
        acc[order.customerId].orders.push(order);
      }
      return acc;
    }, {} as Record<string, { customerId: string; customerName: string; totalUnpaid: number; orders: typeof orders }>);

  return (
    <div className="finance">
      <h2 className="finance-title">简易财务</h2>

      {/* 财务概览 */}
      <div className="finance-overview">
        <div className="finance-card">
          <div className="finance-label">总销售额</div>
          <div className="finance-value">¥{totalSales.toFixed(2)}</div>
        </div>
        <div className="finance-card">
          <div className="finance-label">总成本</div>
          <div className="finance-value">¥{totalCost.toFixed(2)}</div>
        </div>
        <div className="finance-card profit">
          <div className="finance-label">总毛利</div>
          <div className="finance-value">¥{totalProfit.toFixed(2)}</div>
        </div>
        <div className="finance-card">
          <div className="finance-label">已收款</div>
          <div className="finance-value">¥{received.toFixed(2)}</div>
        </div>
        <div className="finance-card alert">
          <div className="finance-label">应收账款</div>
          <div className="finance-value">¥{receivables.toFixed(2)}</div>
        </div>
      </div>

      {/* 应收账款列表 */}
      <div className="finance-section">
        <h3 className="section-title">应收账款</h3>
        {Object.keys(receivablesByCustomer).length > 0 ? (
          <div className="receivables-list">
            {Object.values(receivablesByCustomer).map((item) => (
              <div key={item.customerId} className="receivable-card">
                <div className="receivable-header">
                  <div className="receivable-customer">{item.customerName}</div>
                  <div className="receivable-amount">¥{item.totalUnpaid.toFixed(2)}</div>
                </div>
                <div className="receivable-orders">
                  {item.orders.map((order) => (
                    <div key={order.id} className="receivable-order">
                      <div className="order-info">
                        <span className="order-no">{order.orderNo}</span>
                        <span className="order-date">{order.createdAt.split('T')[0]}</span>
                      </div>
                      <div className="order-amount-info">
                        <span>订单金额: ¥{order.totalAmount.toFixed(2)}</span>
                        <span>已收款: ¥{order.paidAmount.toFixed(2)}</span>
                        <span className="unpaid">未收款: ¥{(order.totalAmount - order.paidAmount).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">暂无应收账款</div>
        )}
      </div>

      {/* 订单毛利列表 */}
      <div className="finance-section">
        <h3 className="section-title">订单毛利</h3>
        <div className="profit-list">
          {orders
            .filter((o) => o.status !== 'cancelled')
            .slice(0, 20)
            .map((order) => (
              <div key={order.id} className="profit-card">
                <div className="profit-header">
                  <div>
                    <div className="profit-order-no">{order.orderNo}</div>
                    <div className="profit-customer">{order.customerName}</div>
                  </div>
                  <div className="profit-amount">
                    <div>销售额: ¥{order.totalAmount.toFixed(2)}</div>
                    <div className="profit-profit">毛利: ¥{order.profit.toFixed(2)}</div>
                  </div>
                </div>
                <div className="profit-details">
                  <div>成本: ¥{order.cost.toFixed(2)}</div>
                  <button
                    className="btn btn-link"
                    onClick={() => openCostModal(order.id)}
                  >
                    编辑成本
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 成本编辑对话框 */}
      {showCostModal && (
        <div className="modal-overlay" onClick={() => setShowCostModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">编辑订单成本</h3>
            <div className="form-group">
              <label>成本金额(元) *</label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="请输入成本（物流费、包材费等）"
                className="form-input"
                min="0"
                step="0.01"
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowCostModal(false)}
              >
                取消
              </button>
              <button className="btn btn-primary" onClick={handleUpdateCost}>
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

