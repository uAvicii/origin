import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Logistics.css';

interface Shipment {
  id: string;
  orderNo: string;
  customer: string;
  destination: string;
  quantity: number;
  carrier: string;
  trackingNo: string;
  status: 'pending' | 'picked' | 'in_transit' | 'delivered';
  estimatedDelivery: string;
  currentLocation?: string;
}

export const Logistics = () => {
  const [statusFilter, setStatusFilter] = useState('all');

  const shipments: Shipment[] = [
    {
      id: '1',
      orderNo: 'ORD20231128001',
      customer: '上海鲜果超市',
      destination: '上海市浦东新区',
      quantity: 500,
      carrier: '顺丰速运',
      trackingNo: 'SF1234567890',
      status: 'in_transit',
      estimatedDelivery: '2023-11-30',
      currentLocation: '南昌转运中心',
    },
    {
      id: '2',
      orderNo: 'ORD20231127002',
      customer: '广州水果批发市场',
      destination: '广州市白云区',
      quantity: 1000,
      carrier: '德邦物流',
      trackingNo: 'DB9876543210',
      status: 'in_transit',
      estimatedDelivery: '2023-11-29',
      currentLocation: '韶关分拨中心',
    },
    {
      id: '3',
      orderNo: 'ORD20231128003',
      customer: '北京果品公司',
      destination: '北京市朝阳区',
      quantity: 800,
      carrier: '京东物流',
      trackingNo: 'JD2468135790',
      status: 'picked',
      estimatedDelivery: '2023-12-01',
    },
    {
      id: '4',
      orderNo: 'ORD20231126001',
      customer: '深圳生鲜配送',
      destination: '深圳市南山区',
      quantity: 600,
      carrier: '顺丰速运',
      trackingNo: 'SF1357924680',
      status: 'delivered',
      estimatedDelivery: '2023-11-28',
    },
    {
      id: '5',
      orderNo: 'ORD20231128004',
      customer: '杭州果园直供',
      destination: '杭州市西湖区',
      quantity: 400,
      carrier: '待分配',
      trackingNo: '-',
      status: 'pending',
      estimatedDelivery: '2023-12-02',
    },
  ];

  const getStatusText = (status: Shipment['status']) => {
    switch (status) {
      case 'pending': return '待发货';
      case 'picked': return '已揽收';
      case 'in_transit': return '运输中';
      case 'delivered': return '已送达';
    }
  };

  const getStatusIcon = (status: Shipment['status']) => {
    switch (status) {
      case 'pending': return '📦';
      case 'picked': return '🚚';
      case 'in_transit': return '🛣️';
      case 'delivered': return '✅';
    }
  };

  const filteredShipments = statusFilter === 'all' 
    ? shipments 
    : shipments.filter(s => s.status === statusFilter);

  const stats = {
    pending: shipments.filter(s => s.status === 'pending').length,
    inTransit: shipments.filter(s => s.status === 'in_transit' || s.status === 'picked').length,
    delivered: shipments.filter(s => s.status === 'delivered').length,
    total: shipments.reduce((sum, s) => sum + s.quantity, 0),
  };

  return (
    <div className="logistics">
      {/* 面包屑导航 */}
      <div className="breadcrumb">
        <Link to="/">首页</Link>
        <span className="separator">/</span>
        <Link to="/warehouse">仓储物流</Link>
        <span className="separator">/</span>
        <span className="current">发货物流追踪</span>
      </div>

      {/* 统计卡片 */}
      <div className="logistics-stats">
        <div className="stat-card pending">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <span className="stat-value">{stats.pending}</span>
            <span className="stat-label">待发货</span>
          </div>
        </div>
        <div className="stat-card transit">
          <div className="stat-icon">🚚</div>
          <div className="stat-content">
            <span className="stat-value">{stats.inTransit}</span>
            <span className="stat-label">运输中</span>
          </div>
        </div>
        <div className="stat-card delivered">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <span className="stat-value">{stats.delivered}</span>
            <span className="stat-label">已送达</span>
          </div>
        </div>
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-value">{stats.total.toLocaleString()} <small>kg</small></span>
            <span className="stat-label">本月发货量</span>
          </div>
        </div>
      </div>

      {/* 筛选工具栏 */}
      <div className="filter-bar">
        <div className="filter-tabs">
          {['all', 'pending', 'picked', 'in_transit', 'delivered'].map(status => (
            <button
              key={status}
              className={`filter-tab ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status === 'all' ? '全部' : getStatusText(status as Shipment['status'])}
            </button>
          ))}
        </div>
        <button className="export-btn">📥 导出报表</button>
      </div>

      {/* 物流列表 */}
      <div className="shipment-list">
        {filteredShipments.map(shipment => (
          <div key={shipment.id} className={`shipment-card ${shipment.status}`}>
            <div className="shipment-header">
              <div className="shipment-order">
                <span className="order-no">{shipment.orderNo}</span>
                <span className={`status-badge ${shipment.status}`}>
                  {getStatusIcon(shipment.status)} {getStatusText(shipment.status)}
                </span>
              </div>
              <div className="shipment-customer">{shipment.customer}</div>
            </div>

            <div className="shipment-body">
              <div className="shipment-route">
                <div className="route-point origin">
                  <span className="point-icon">📍</span>
                  <div className="point-info">
                    <span className="point-label">发货地</span>
                    <span className="point-value">江西省赣州市</span>
                  </div>
                </div>
                <div className="route-line">
                  {shipment.currentLocation && (
                    <div className="current-location">
                      <span className="location-icon">🚚</span>
                      <span className="location-text">{shipment.currentLocation}</span>
                    </div>
                  )}
                </div>
                <div className="route-point destination">
                  <span className="point-icon">🏁</span>
                  <div className="point-info">
                    <span className="point-label">目的地</span>
                    <span className="point-value">{shipment.destination}</span>
                  </div>
                </div>
              </div>

              <div className="shipment-details">
                <div className="detail-item">
                  <span className="detail-label">发货数量</span>
                  <span className="detail-value">{shipment.quantity} kg</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">承运商</span>
                  <span className="detail-value">{shipment.carrier}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">运单号</span>
                  <span className="detail-value tracking">{shipment.trackingNo}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">预计送达</span>
                  <span className="detail-value">{shipment.estimatedDelivery}</span>
                </div>
              </div>
            </div>

            <div className="shipment-actions">
              <button className="action-btn">查看详情</button>
              {shipment.status === 'pending' && (
                <button className="action-btn primary">安排发货</button>
              )}
              {shipment.status === 'in_transit' && (
                <button className="action-btn">刷新物流</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
