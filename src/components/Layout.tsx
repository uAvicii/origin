import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

interface MenuItem {
  path?: string;
  label: string;
  icon: string;
  children?: MenuItem[];
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useStore();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['digital-orchard', 'farming', 'harvest']);
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems: MenuItem[] = [
    { path: '/', label: '首页 / 驾驶舱', icon: '🏠' },
    {
      label: '果园数字孪生',
      icon: '🌳',
      children: [
        { path: '/orchard/map', label: '地块GIS地图', icon: '🗺️' },
        { path: '/orchard/iot', label: '物联网监控', icon: '📡' },
        { path: '/orchard/video', label: '视频监控中心', icon: '📹' },
      ],
    },
    {
      label: '农事管理',
      icon: '🚜',
      children: [
        { path: '/farming/calendar', label: '农事计划与日历', icon: '📅' },
        { path: '/farming/tasks', label: '任务工单系统', icon: '📋' },
        { path: '/farming/materials', label: '农资库存管理', icon: '🧪' },
      ],
    },
    {
      label: '病虫害防治',
      icon: '🐛',
      children: [
        { path: '/pest/ai', label: 'AI识别与预警', icon: '🤖' },
        { path: '/pest/records', label: '防治记录', icon: '📝' },
      ],
    },
    {
      label: '采摘与溯源',
      icon: '🍊',
      children: [
        { path: '/harvest/estimate', label: '产量预估', icon: '📊' },
        { path: '/harvest/batch', label: '采摘批次管理', icon: '📦' },
        { path: '/harvest/trace', label: '溯源二维码', icon: '🔗' },
      ],
    },
    {
      label: '仓储物流',
      icon: '🏭',
      children: [
        { path: '/warehouse/cold', label: '冷库环境监控', icon: '❄️' },
        { path: '/inventory', label: '成品库存管理', icon: '📦' },
        { path: '/warehouse/logistics', label: '发货物流追踪', icon: '🚚' },
      ],
    },
    {
      label: '销售与订单',
      icon: '💰',
      children: [
        { path: '/order', label: '订单管理', icon: '📋' },
        { path: '/crm', label: '客户关系管理', icon: '👥' },
      ],
    },
    {
      label: '数据中心',
      icon: '📈',
      children: [
        { path: '/analytics/sales', label: '产销分析报告', icon: '📊' },
        { path: '/finance', label: '成本收益分析', icon: '💹' },
      ],
    },
    { path: '/settings', label: '系统设置', icon: '⚙️' },
  ];

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev =>
      prev.includes(label)
        ? prev.filter(m => m !== label)
        : [...prev, label]
    );
  };

  const isPathActive = (path?: string) => {
    if (!path) return false;
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isMenuActive = (item: MenuItem): boolean => {
    if (item.path) return isPathActive(item.path);
    if (item.children) {
      return item.children.some(child => isPathActive(child.path));
    }
    return false;
  };

  const notifications = [
    { id: 1, type: 'urgent', message: 'A3区土壤湿度低于阈值', time: '10分钟前' },
    { id: 2, type: 'warning', message: 'B2区发现疑似红蜘蛛虫害', time: '今日 09:30' },
    { id: 3, type: 'info', message: '采摘任务已完成', time: '今日 08:00' },
  ];

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="layout-header-content">
          <div className="layout-header-left">
            <h1 className="layout-title">🍊 橙芯智慧农业</h1>
          </div>
          
          <div className="layout-header-center">
            <div className="layout-search">
              <span className="layout-search-icon">🔍</span>
              <input
                type="text"
                placeholder="全局搜索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="layout-search-input"
              />
            </div>
          </div>

          <div className="layout-header-right">
            <div className="layout-notifications">
              <button className="layout-notification-btn">
                🔔
                <span className="notification-badge">{notifications.length}</span>
              </button>
            </div>
            
            {currentUser && (
              <div className="layout-user">
                <div className="layout-user-avatar">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="layout-user-info">
                  <span className="layout-user-name">{currentUser.name}</span>
                  <span className="layout-user-role">
                    {currentUser.role === 'admin' ? '管理员' : 
                     currentUser.role === 'warehouse' ? '仓库主管' : '采摘队长'}
                  </span>
                </div>
                <button 
                  className="layout-logout-btn"
                  onClick={() => {
                    setCurrentUser(null);
                    navigate('/login');
                  }}
                  title="退出登录"
                >
                  🚪
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="layout-body">
        <nav className="layout-nav">
          <div className="layout-nav-scroll">
            {menuItems.map((item, index) => (
              <div key={index} className="layout-nav-group">
                {item.children ? (
                  <>
                    <button
                      className={`layout-nav-item has-children ${isMenuActive(item) ? 'active' : ''}`}
                      onClick={() => toggleMenu(item.label)}
                    >
                      <span className="layout-nav-icon">{item.icon}</span>
                      <span className="layout-nav-label">{item.label}</span>
                      <span className={`layout-nav-arrow ${expandedMenus.includes(item.label) ? 'expanded' : ''}`}>
                        ▸
                      </span>
                    </button>
                    {expandedMenus.includes(item.label) && (
                      <div className="layout-nav-children">
                        {item.children.map((child, childIndex) => (
                          <Link
                            key={childIndex}
                            to={child.path || '/'}
                            className={`layout-nav-item child ${isPathActive(child.path) ? 'active' : ''}`}
                          >
                            <span className="layout-nav-icon">{child.icon}</span>
                            <span className="layout-nav-label">{child.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path || '/'}
                    className={`layout-nav-item ${isPathActive(item.path) ? 'active' : ''}`}
                  >
                    <span className="layout-nav-icon">{item.icon}</span>
                    <span className="layout-nav-label">{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </nav>

        <main className="layout-main">
          {children}
        </main>
      </div>
    </div>
  );
};

