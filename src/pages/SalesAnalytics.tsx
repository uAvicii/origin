import { Link } from 'react-router-dom';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './SalesAnalytics.css';

export const SalesAnalytics = () => {
  // 月度产销数据
  const monthlyData = [
    { month: '1月', production: 0, sales: 0 },
    { month: '2月', production: 0, sales: 0 },
    { month: '3月', production: 0, sales: 0 },
    { month: '4月', production: 0, sales: 0 },
    { month: '5月', production: 0, sales: 0 },
    { month: '6月', production: 0, sales: 0 },
    { month: '7月', production: 0, sales: 0 },
    { month: '8月', production: 0, sales: 0 },
    { month: '9月', production: 20, sales: 18 },
    { month: '10月', production: 80, sales: 75 },
    { month: '11月', production: 150, sales: 142 },
    { month: '12月', production: 50, sales: 45 },
  ];

  // 销售渠道分布
  const channelData = [
    { name: '企业直销', value: 45, color: '#FF7F50' },
    { name: '经销商', value: 30, color: '#4CAF50' },
    { name: '电商平台', value: 15, color: '#2196F3' },
    { name: '零售门店', value: 10, color: '#9C27B0' },
  ];

  // 地区销售分布
  const regionData = [
    { region: '华东', sales: 120 },
    { region: '华南', sales: 85 },
    { region: '华北', sales: 65 },
    { region: '华中', sales: 45 },
    { region: '西南', sales: 30 },
    { region: '其他', sales: 15 },
  ];

  // 等级销售占比
  const gradeData = [
    { name: '特级果', value: 35, color: '#FFD700' },
    { name: '一级果', value: 40, color: '#FF7F50' },
    { name: '二级果', value: 20, color: '#4CAF50' },
    { name: '次果', value: 5, color: '#9E9E9E' },
  ];

  const totalProduction = monthlyData.reduce((sum, d) => sum + d.production, 0);
  const totalSales = monthlyData.reduce((sum, d) => sum + d.sales, 0);
  const avgPrice = 8.5; // 平均单价
  const totalRevenue = totalSales * 1000 * avgPrice;

  return (
    <div className="sales-analytics">
      {/* 面包屑导航 */}
      <div className="breadcrumb">
        <Link to="/">首页</Link>
        <span className="separator">/</span>
        <Link to="/analytics">数据中心</Link>
        <span className="separator">/</span>
        <span className="current">产销分析报告</span>
      </div>

      {/* 顶部统计 */}
      <div className="analytics-stats">
        <div className="stat-card">
          <div className="stat-icon">🍊</div>
          <div className="stat-content">
            <span className="stat-value">{totalProduction}</span>
            <span className="stat-label">年度总产量 (吨)</span>
          </div>
          <div className="stat-trend up">↑ 15%</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <span className="stat-value">{totalSales}</span>
            <span className="stat-label">年度销售量 (吨)</span>
          </div>
          <div className="stat-trend up">↑ 12%</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <span className="stat-value">¥{(totalRevenue / 10000).toFixed(0)}万</span>
            <span className="stat-label">年度销售额</span>
          </div>
          <div className="stat-trend up">↑ 18%</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-value">{((totalSales / totalProduction) * 100).toFixed(1)}%</span>
            <span className="stat-label">产销率</span>
          </div>
          <div className="stat-trend">-</div>
        </div>
      </div>

      {/* 主图表区域 */}
      <div className="charts-grid">
        {/* 产销趋势图 */}
        <div className="chart-card large">
          <div className="chart-header">
            <h3>📈 年度产销趋势</h3>
            <div className="chart-legend">
              <span className="legend-item"><span className="dot" style={{ background: '#FF7F50' }}></span> 产量</span>
              <span className="legend-item"><span className="dot" style={{ background: '#4CAF50' }}></span> 销量</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="production" stroke="#FF7F50" fill="#FF7F50" fillOpacity={0.3} name="产量(吨)" />
              <Area type="monotone" dataKey="sales" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.3} name="销量(吨)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 销售渠道分布 */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>🏪 销售渠道分布</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={channelData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                label={({ value }) => `${value}%`}
              >
                {channelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-legend">
            {channelData.map(item => (
              <div key={item.name} className="legend-item">
                <span className="legend-dot" style={{ background: item.color }}></span>
                <span className="legend-name">{item.name}</span>
                <span className="legend-value">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 地区销售分布 */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>🗺️ 地区销售分布</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={regionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="region" type="category" tick={{ fontSize: 11 }} width={50} />
              <Tooltip />
              <Bar dataKey="sales" fill="#FF7F50" radius={[0, 4, 4, 0]} name="销量(吨)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 等级销售占比 */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>🏆 等级销售占比</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={gradeData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                label={({ value }) => `${value}%`}
              >
                {gradeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-legend">
            {gradeData.map(item => (
              <div key={item.name} className="legend-item">
                <span className="legend-dot" style={{ background: item.color }}></span>
                <span className="legend-name">{item.name}</span>
                <span className="legend-value">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 数据洞察 */}
      <div className="insights-section">
        <h3>💡 数据洞察</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">📈</div>
            <div className="insight-content">
              <h4>产量增长</h4>
              <p>本年度产量较去年增长15%，主要得益于A区示范基地的高产表现和新种植区的投产。</p>
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">🎯</div>
            <div className="insight-content">
              <h4>销售建议</h4>
              <p>华东地区销售占比最高，建议继续深耕该市场；西南地区有较大增长空间，可加大推广力度。</p>
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">⚠️</div>
            <div className="insight-content">
              <h4>库存预警</h4>
              <p>当前库存约8吨，预计可支撑5天销售，建议关注12月采摘进度，确保供应充足。</p>
            </div>
          </div>
        </div>
      </div>

      {/* 导出按钮 */}
      <div className="export-section">
        <button className="export-btn">📥 导出PDF报告</button>
        <button className="export-btn secondary">📊 导出Excel数据</button>
      </div>
    </div>
  );
};
