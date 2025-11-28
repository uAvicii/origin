import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import './Login.css';

export const Login = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useStore();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 默认账号密码
  const validUsers = [
    { username: 'admin', password: '123456', name: '管理员', role: 'admin' as const },
    { username: 'warehouse', password: '123456', name: '仓库主管', role: 'warehouse' as const },
    { username: 'picker', password: '123456', name: '采摘队长', role: 'picker' as const },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 模拟登录延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = validUsers.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      setCurrentUser({
        id: user.username,
        name: user.name,
        role: user.role,
      });
      navigate('/');
    } else {
      setError('账号或密码错误');
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      {/* 背景图 */}
      <div className="login-bg">
        <img 
          src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&h=1080&fit=crop" 
          alt="果园背景"
        />
        <div className="login-bg-overlay"></div>
      </div>

      {/* 登录卡片 */}
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">🍊</div>
            <h1 className="login-title">橙芯智慧农业</h1>
            <p className="login-subtitle">果园数字化管理平台</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">账号</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  className="form-input"
                  placeholder="请输入账号"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">密码</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  className="form-input"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="login-error">
                <span>⚠️</span> {error}
              </div>
            )}

            <button 
              type="submit" 
              className={`login-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? '登录中...' : '登 录'}
            </button>
          </form>

          <div className="login-footer">
            <div className="demo-accounts">
              <p className="demo-title">演示账号</p>
              <div className="demo-list">
                <div className="demo-item">
                  <span className="demo-role">管理员</span>
                  <span className="demo-info">admin / 123456</span>
                </div>
                <div className="demo-item">
                  <span className="demo-role">仓库主管</span>
                  <span className="demo-info">warehouse / 123456</span>
                </div>
                <div className="demo-item">
                  <span className="demo-role">采摘队长</span>
                  <span className="demo-info">picker / 123456</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="login-copyright">
          © 2025 橙芯智慧农业 · 赣南脐橙数字化管理系统
        </div>
      </div>
    </div>
  );
};
