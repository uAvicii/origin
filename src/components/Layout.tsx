import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { currentUser } = useStore();

  const menuItems = [
    { path: '/', label: '数据看板', icon: '📊' },
    { path: '/orchard', label: '果园管理', icon: '🌳' },
    { path: '/inventory', label: '库存管理', icon: '📦' },
    { path: '/order', label: '订单管理', icon: '📋' },
    { path: '/finance', label: '简易财务', icon: '💰' },
    { path: '/settings', label: '基础设置', icon: '⚙️' },
  ];

  // 根据角色过滤菜单项
  const getVisibleMenuItems = () => {
    if (!currentUser) return menuItems;
    
    // 管理员可以看到所有菜单
    if (currentUser.role === 'admin') return menuItems;
    
    // 仓库主管看不到财务
    if (currentUser.role === 'warehouse') {
      return menuItems.filter(item => item.path !== '/finance');
    }
    
    // 采摘队长只能看到果园管理
    if (currentUser.role === 'picker') {
      return menuItems.filter(item => item.path === '/orchard');
    }
    
    return menuItems;
  };

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="layout-header-content">
          <h1 className="layout-title">🍊 果易管</h1>
          {currentUser && (
            <div className="layout-user">
              <span className="layout-user-name">{currentUser.name}</span>
              <span className="layout-user-role">
                {currentUser.role === 'admin' ? '管理员' : 
                 currentUser.role === 'warehouse' ? '仓库主管' : '采摘队长'}
              </span>
            </div>
          )}
        </div>
      </header>

      <div className="layout-body">
        <nav className="layout-nav">
          {getVisibleMenuItems().map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`layout-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="layout-nav-icon">{item.icon}</span>
              <span className="layout-nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <main className="layout-main">
          {children}
        </main>
      </div>
    </div>
  );
};

