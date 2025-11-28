import { useState } from 'react';
import { Link } from 'react-router-dom';
import './CRM.css';

interface Customer {
  id: string;
  name: string;
  type: 'enterprise' | 'dealer' | 'retail';
  contact: string;
  phone: string;
  region: string;
  totalOrders: number;
  totalAmount: number;
  lastOrderDate: string;
  level: 'vip' | 'gold' | 'silver' | 'normal';
  avatar: string;
}

export const CRM = () => {
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const customers: Customer[] = [
    {
      id: '1',
      name: '上海鲜果超市连锁',
      type: 'enterprise',
      contact: '王经理',
      phone: '138****1234',
      region: '上海市',
      totalOrders: 156,
      totalAmount: 892000,
      lastOrderDate: '2023-11-28',
      level: 'vip',
      avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
    },
    {
      id: '2',
      name: '广州水果批发市场',
      type: 'dealer',
      contact: '李老板',
      phone: '139****5678',
      region: '广州市',
      totalOrders: 89,
      totalAmount: 456000,
      lastOrderDate: '2023-11-27',
      level: 'gold',
      avatar: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=100&h=100&fit=crop',
    },
    {
      id: '3',
      name: '北京果品有限公司',
      type: 'enterprise',
      contact: '张总',
      phone: '137****9012',
      region: '北京市',
      totalOrders: 67,
      totalAmount: 345000,
      lastOrderDate: '2023-11-25',
      level: 'gold',
      avatar: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop',
    },
    {
      id: '4',
      name: '深圳生鲜配送中心',
      type: 'dealer',
      contact: '陈经理',
      phone: '136****3456',
      region: '深圳市',
      totalOrders: 45,
      totalAmount: 234000,
      lastOrderDate: '2023-11-26',
      level: 'silver',
      avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop',
    },
    {
      id: '5',
      name: '杭州果园直供店',
      type: 'retail',
      contact: '周店长',
      phone: '135****7890',
      region: '杭州市',
      totalOrders: 23,
      totalAmount: 89000,
      lastOrderDate: '2023-11-20',
      level: 'normal',
      avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop',
    },
  ];

  const getTypeText = (type: Customer['type']) => {
    switch (type) {
      case 'enterprise': return '企业客户';
      case 'dealer': return '经销商';
      case 'retail': return '零售商';
    }
  };

  const getLevelText = (level: Customer['level']) => {
    switch (level) {
      case 'vip': return 'VIP';
      case 'gold': return '金牌';
      case 'silver': return '银牌';
      case 'normal': return '普通';
    }
  };

  const filteredCustomers = customers.filter(c => {
    if (typeFilter !== 'all' && c.type !== typeFilter) return false;
    if (searchQuery && !c.name.includes(searchQuery) && !c.contact.includes(searchQuery)) return false;
    return true;
  });

  const stats = {
    total: customers.length,
    enterprise: customers.filter(c => c.type === 'enterprise').length,
    dealer: customers.filter(c => c.type === 'dealer').length,
    retail: customers.filter(c => c.type === 'retail').length,
    totalAmount: customers.reduce((sum, c) => sum + c.totalAmount, 0),
  };

  return (
    <div className="crm">
      {/* 面包屑导航 */}
      <div className="breadcrumb">
        <Link to="/">首页</Link>
        <span className="separator">/</span>
        <Link to="/order">销售与订单</Link>
        <span className="separator">/</span>
        <span className="current">客户关系管理</span>
      </div>

      {/* 统计卡片 */}
      <div className="crm-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">客户总数</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-content">
            <span className="stat-value">{stats.enterprise}</span>
            <span className="stat-label">企业客户</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏪</div>
          <div className="stat-content">
            <span className="stat-value">{stats.dealer}</span>
            <span className="stat-label">经销商</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <span className="stat-value">¥{(stats.totalAmount / 10000).toFixed(1)}万</span>
            <span className="stat-label">累计销售额</span>
          </div>
        </div>
      </div>

      {/* 工具栏 */}
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="filter-tabs">
            {['all', 'enterprise', 'dealer', 'retail'].map(type => (
              <button
                key={type}
                className={`filter-tab ${typeFilter === type ? 'active' : ''}`}
                onClick={() => setTypeFilter(type)}
              >
                {type === 'all' ? '全部' : getTypeText(type as Customer['type'])}
              </button>
            ))}
          </div>
        </div>
        <div className="toolbar-right">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="搜索客户..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="add-btn">➕ 新增客户</button>
        </div>
      </div>

      {/* 客户列表 */}
      <div className="customer-list">
        {filteredCustomers.map(customer => (
          <div key={customer.id} className="customer-card">
            <div className="customer-avatar">
              <img src={customer.avatar} alt={customer.name} />
              <span className={`level-badge ${customer.level}`}>
                {getLevelText(customer.level)}
              </span>
            </div>

            <div className="customer-info">
              <div className="customer-header">
                <h3 className="customer-name">{customer.name}</h3>
                <span className={`type-badge ${customer.type}`}>
                  {getTypeText(customer.type)}
                </span>
              </div>
              <div className="customer-contact">
                <span>👤 {customer.contact}</span>
                <span>📱 {customer.phone}</span>
                <span>📍 {customer.region}</span>
              </div>
            </div>

            <div className="customer-stats">
              <div className="stat-item">
                <span className="stat-value">{customer.totalOrders}</span>
                <span className="stat-label">订单数</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">¥{(customer.totalAmount / 10000).toFixed(1)}万</span>
                <span className="stat-label">累计金额</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{customer.lastOrderDate}</span>
                <span className="stat-label">最近下单</span>
              </div>
            </div>

            <div className="customer-actions">
              <button className="action-btn">查看详情</button>
              <button className="action-btn primary">创建订单</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
