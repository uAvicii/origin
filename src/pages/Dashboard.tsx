import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

export const Dashboard = () => {
  const { getInventoryAlerts } = useStore();
  const alerts = getInventoryAlerts();

  // 模拟天气数据
  const weatherData = {
    temp: 26,
    humidity: 60,
    condition: '晴',
    icon: '☀️',
  };

  // 模拟果园健康度
  const healthScore = 92;

  // 模拟待处理农事任务
  const pendingTasks = {
    total: 5,
    urgent: 2,
  };

  // 模拟本月预计产量
  const estimatedYield = 150;

  // 模拟告警数据
  const systemAlerts = [
    { id: 1, level: 'urgent', message: 'A3区土壤湿度低于阈值', time: '10分钟前', icon: '💧' },
    { id: 2, level: 'warning', message: 'B2区发现疑似红蜘蛛虫害', time: '今日 09:30', icon: '🐛' },
    { id: 3, level: 'info', message: 'C1区灌溉任务已完成', time: '今日 08:00', icon: '✅' },
  ];

  // 模拟果园分区数据
  const orchardZones = [
    { id: 'A', name: 'A区-示范基地', status: 'normal', trees: 1200, area: 50, image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=200&h=120&fit=crop' },
    { id: 'B', name: 'B区-幼苗区', status: 'warning', trees: 800, area: 30, image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=200&h=120&fit=crop' },
    { id: 'C', name: 'C区-山地区', status: 'normal', trees: 600, area: 40, image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=200&h=120&fit=crop' },
  ];

  // 模拟近30天产销数据
  const productionSalesData = [
    { date: '11/01', production: 12, sales: 10 },
    { date: '11/05', production: 15, sales: 14 },
    { date: '11/10', production: 18, sales: 16 },
    { date: '11/15', production: 22, sales: 20 },
    { date: '11/20', production: 25, sales: 23 },
    { date: '11/25', production: 20, sales: 22 },
    { date: '11/28', production: 18, sales: 17 },
  ];

  // 模拟未来7天农事计划
  const farmingSchedule = [
    { date: '11/29', task: '施肥', zone: 'A区' },
    { date: '11/30', task: '修剪', zone: 'B区' },
    { date: '12/01', task: '灌溉', zone: 'C区' },
    { date: '12/02', task: '病虫害检查', zone: '全部' },
    { date: '12/03', task: '采摘', zone: 'A区' },
  ];

  return (
    <div className="dashboard">
      {/* 顶部四个关键指标卡片 */}
      <div className="dashboard-kpi-row">
        <div className="kpi-card weather">
          <div className="kpi-icon">{weatherData.icon}</div>
          <div className="kpi-content">
            <div className="kpi-label">今日天气</div>
            <div className="kpi-value">{weatherData.temp}°C</div>
            <div className="kpi-detail">湿度 {weatherData.humidity}% · {weatherData.condition}</div>
          </div>
        </div>

        <div className="kpi-card health">
          <div className="kpi-icon">🌳</div>
          <div className="kpi-content">
            <div className="kpi-label">果园综合健康度</div>
            <div className="kpi-value">
              <span className="health-score">{healthScore}</span>
              <span className="health-unit">分</span>
              <span className="health-badge good">优</span>
            </div>
            <div className="kpi-detail">
              <div className="health-bar">
                <div className="health-bar-fill" style={{ width: `${healthScore}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="kpi-card tasks">
          <div className="kpi-icon">📋</div>
          <div className="kpi-content">
            <div className="kpi-label">待处理农事任务</div>
            <div className="kpi-value">
              <span>{pendingTasks.total}</span>
              <span className="kpi-unit">项</span>
            </div>
            <div className="kpi-detail urgent">
              {pendingTasks.urgent} 项紧急
            </div>
          </div>
        </div>

        <div className="kpi-card yield">
          <div className="kpi-icon">🍊</div>
          <div className="kpi-content">
            <div className="kpi-label">本月预计产量</div>
            <div className="kpi-value">
              <span>{estimatedYield}</span>
              <span className="kpi-unit">吨</span>
            </div>
            <div className="kpi-detail positive">↑ 较上月增长 12%</div>
          </div>
        </div>
      </div>

      {/* 中间区域：GIS概览 + 快捷操作 & 告警 */}
      <div className="dashboard-middle-row">
        {/* 左侧：果园GIS概览图 */}
        <div className="dashboard-gis-card">
          <div className="card-header">
            <h3 className="card-title">🗺️ 果园GIS概览</h3>
            <Link to="/orchard/map" className="card-link">查看详情 →</Link>
          </div>
          <div className="gis-map">
            <div className="gis-bg-image">
              <img 
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=400&fit=crop" 
                alt="果园卫星图"
              />
            </div>
            <div className="gis-zones">
              {orchardZones.map((zone) => (
                <div 
                  key={zone.id} 
                  className={`gis-zone ${zone.status}`}
                >
                  <div className="zone-thumb">
                    <img src={zone.image} alt={zone.name} />
                  </div>
                  <div className="zone-content">
                    <div className="zone-header">
                      <span className="zone-name">{zone.name}</span>
                      <span className={`zone-status-badge ${zone.status}`}>
                        {zone.status === 'normal' ? '正常' : zone.status === 'warning' ? '需关注' : '告警'}
                      </span>
                    </div>
                    <div className="zone-info">
                      <span>🌳 {zone.trees} 棵</span>
                      <span>📐 {zone.area} 亩</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="gis-legend">
              <div className="legend-item">
                <span className="legend-dot normal"></span>
                <span>正常</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot warning"></span>
                <span>需关注</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot alert"></span>
                <span>告警</span>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：快捷操作 & 告警列表 */}
        <div className="dashboard-right-panel">
          {/* 快捷操作入口 */}
          <div className="quick-actions-card">
            <h3 className="card-title">⚡ 快捷操作</h3>
            <div className="quick-actions-grid">
              <Link to="/farming/tasks" className="quick-action-btn">
                <span className="action-icon">📝</span>
                <span>发布新任务</span>
              </Link>
              <Link to="/orchard/video" className="quick-action-btn">
                <span className="action-icon">📹</span>
                <span>查看监控</span>
              </Link>
              <Link to="/harvest/batch" className="quick-action-btn">
                <span className="action-icon">🍊</span>
                <span>录入采摘</span>
              </Link>
              <Link to="/order" className="quick-action-btn">
                <span className="action-icon">📦</span>
                <span>新建订单</span>
              </Link>
            </div>
          </div>

          {/* 最新告警列表 */}
          <div className="alerts-card">
            <div className="card-header">
              <h3 className="card-title">🔔 最新告警</h3>
              <span className="alert-count">{systemAlerts.length}</span>
            </div>
            <div className="alerts-list">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className={`alert-item ${alert.level}`}>
                  <span className="alert-icon">{alert.icon}</span>
                  <div className="alert-content">
                    <div className="alert-message">{alert.message}</div>
                    <div className="alert-time">{alert.time}</div>
                  </div>
                  <span className={`alert-level-badge ${alert.level}`}>
                    {alert.level === 'urgent' ? '紧急' : alert.level === 'warning' ? '重要' : '信息'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 底部：趋势图表 */}
      <div className="dashboard-charts-row">
        {/* 近30天产销对比图 */}
        <div className="chart-card">
          <div className="card-header">
            <h3 className="card-title">📊 近30天产销对比</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={productionSalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#666' }} />
              <YAxis tick={{ fontSize: 12, fill: '#666' }} />
              <Tooltip 
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => [`${value} 吨`]}
              />
              <Area 
                type="monotone" 
                dataKey="production" 
                stackId="1"
                stroke="#FF7F50" 
                fill="#FF7F50" 
                fillOpacity={0.3}
                name="产量"
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stackId="2"
                stroke="#4CAF50" 
                fill="#4CAF50" 
                fillOpacity={0.3}
                name="销量"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 未来7天农事计划日历概览 */}
        <div className="chart-card schedule-card">
          <div className="card-header">
            <h3 className="card-title">📅 未来7天农事计划</h3>
            <Link to="/farming/calendar" className="card-link">查看完整日历 →</Link>
          </div>
          <div className="schedule-list">
            {farmingSchedule.map((item, index) => (
              <div key={index} className="schedule-item">
                <div className="schedule-date">{item.date}</div>
                <div className="schedule-task">
                  <span className="task-name">{item.task}</span>
                  <span className="task-zone">{item.zone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 库存预警列表（保留原有功能） */}
      {alerts.length > 0 && (
        <div className="dashboard-inventory-alerts">
          <h3 className="section-title">📦 库存预警</h3>
          <div className="inventory-alert-list">
            {alerts.map((alert) => (
              <div key={alert.id} className="inventory-alert-item">
                <div className="alert-message">{alert.message}</div>
                <div className="alert-meta">
                  批次: {alert.batchNo} | 库龄: {alert.daysInStock} 天
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

