import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

export const Dashboard = () => {
  const {
    getInventorySummary,
    getInventoryAlerts,
    getPendingPickingQuantity,
    getTodaySales,
    getPendingShipmentCount,
  } = useStore();

  const inventorySummary = getInventorySummary();
  const alerts = getInventoryAlerts();
  const pendingPicking = getPendingPickingQuantity();
  const todaySales = getTodaySales();
  const pendingShipment = getPendingShipmentCount();

  // 计算已分拣库存
  const sortedQuantity = inventorySummary.reduce((sum, item) => sum + item.totalQuantity, 0);
  const totalQuantity = sortedQuantity + pendingPicking;

  // 准备库存等级图表数据
  const gradeChartData = inventorySummary.map((item) => ({
    name: item.gradeName,
    value: item.totalQuantity,
  }));

  // 准备库龄分布数据
  const getAgeDistribution = () => {
    const ageGroups = { '1-3天': 0, '4-6天': 0, '7-10天': 0, '10天+': 0 };
    
    inventorySummary.forEach((summary) => {
      summary.batches.forEach((batch) => {
        if (batch.quantity > 0) {
          if (batch.daysInStock <= 3) ageGroups['1-3天'] += batch.quantity;
          else if (batch.daysInStock <= 6) ageGroups['4-6天'] += batch.quantity;
          else if (batch.daysInStock <= 10) ageGroups['7-10天'] += batch.quantity;
          else ageGroups['10天+'] += batch.quantity;
        }
      });
    });

    return Object.entries(ageGroups).map(([name, value]) => ({ name, value }));
  };

  const ageDistributionData = getAgeDistribution();
  const totalForAgeDistribution = ageDistributionData.reduce((sum, item) => sum + item.value, 0);

  // 计算百分比
  const ageDistributionWithPercent = ageDistributionData.map((item) => ({
    ...item,
    percent: totalForAgeDistribution > 0 ? ((item.value / totalForAgeDistribution) * 100).toFixed(1) : '0',
  }));

  const COLORS = ['#ff6b35', '#f7931e', '#ffcc02', '#8bc34a', '#4caf50'];

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">数据看板</h2>

      {/* 核心指标卡 */}
      <div className="dashboard-metrics">
        <div className="metric-card">
          <div className="metric-label">实时总库存</div>
          <div className="metric-value">{totalQuantity.toFixed(1)} 吨</div>
          <div className="metric-detail">
            <span>待分拣: {(pendingPicking / 1000).toFixed(1)} 吨</span>
            <span>已分拣: {(sortedQuantity / 1000).toFixed(1)} 吨</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">今日销售额</div>
          <div className="metric-value">{todaySales.toFixed(2)} 元</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">待发货订单</div>
          <div className="metric-value">{pendingShipment} 笔</div>
        </div>

        <div className="metric-card alert">
          <div className="metric-label">库存预警</div>
          <div className="metric-value">{alerts.length} 条</div>
          {alerts.length > 0 && (
            <div className="metric-detail alert-text">
              有 {alerts.length} 个批次需要关注
            </div>
          )}
        </div>
      </div>

      {/* 快捷入口 */}
      <div className="dashboard-actions">
        <Link to="/order/new" className="action-button primary">
          ➕ 创建订单
        </Link>
        <Link to="/inventory/check" className="action-button">
          📋 库存盘点
        </Link>
        <Link to="/finance/receivables" className="action-button">
          💰 查看应收账款
        </Link>
      </div>

      {/* 库存结构图表 */}
      <div className="dashboard-charts">
        <div className="chart-card">
          <h3 className="chart-title">按等级库存分布</h3>
          {gradeChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gradeChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${(value / 1000).toFixed(1)} 吨`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-empty">暂无库存数据</div>
          )}
        </div>

        <div className="chart-card">
          <h3 className="chart-title">按库龄库存分布</h3>
          {ageDistributionWithPercent.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageDistributionWithPercent}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => `${(value / 1000).toFixed(1)} 吨`} />
                <Legend />
                <Bar dataKey="value" fill="#ff6b35" name="库存量(斤)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-empty">暂无库存数据</div>
          )}
        </div>
      </div>

      {/* 库存预警列表 */}
      {alerts.length > 0 && (
        <div className="dashboard-alerts">
          <h3 className="alert-title">⚠️ 库存预警</h3>
          <div className="alert-list">
            {alerts.map((alert) => (
              <div key={alert.id} className="alert-item">
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

