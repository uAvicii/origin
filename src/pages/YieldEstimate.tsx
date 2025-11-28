import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './YieldEstimate.css';

interface ZoneEstimate {
  id: string;
  name: string;
  area: number;
  trees: number;
  estimatedYield: number;
  harvestedYield: number;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  image: string;
}

export const YieldEstimate = () => {
  const zones: ZoneEstimate[] = [
    {
      id: 'A1',
      name: 'A1区-示范基地入口',
      area: 25,
      trees: 600,
      estimatedYield: 45,
      harvestedYield: 38,
      progress: 84,
      status: 'in_progress',
      image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=300&h=200&fit=crop',
    },
    {
      id: 'A2',
      name: 'A2区-向阳坡',
      area: 25,
      trees: 600,
      estimatedYield: 48,
      harvestedYield: 48,
      progress: 100,
      status: 'completed',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=200&fit=crop',
    },
    {
      id: 'A3',
      name: 'A3区-山脚',
      area: 20,
      trees: 480,
      estimatedYield: 35,
      harvestedYield: 0,
      progress: 0,
      status: 'not_started',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=200&fit=crop',
    },
    {
      id: 'B1',
      name: 'B1区-幼苗区北',
      area: 15,
      trees: 400,
      estimatedYield: 18,
      harvestedYield: 12,
      progress: 67,
      status: 'in_progress',
      image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=300&h=200&fit=crop',
    },
    {
      id: 'C1',
      name: 'C区-山地区',
      area: 40,
      trees: 800,
      estimatedYield: 55,
      harvestedYield: 0,
      progress: 0,
      status: 'not_started',
      image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=300&h=200&fit=crop',
    },
  ];

  const totalEstimated = zones.reduce((sum, z) => sum + z.estimatedYield, 0);
  const totalHarvested = zones.reduce((sum, z) => sum + z.harvestedYield, 0);
  const overallProgress = Math.round((totalHarvested / totalEstimated) * 100);

  // 月度产量趋势
  const monthlyData = [
    { month: '9月', estimated: 20, actual: 18 },
    { month: '10月', estimated: 80, actual: 75 },
    { month: '11月', estimated: 150, actual: 98 },
    { month: '12月', estimated: 50, actual: 0 },
  ];

  // 等级分布预估
  const gradeDistribution = [
    { name: '特级果', value: 30, color: '#FFD700' },
    { name: '一级果', value: 45, color: '#FF7F50' },
    { name: '二级果', value: 20, color: '#4CAF50' },
    { name: '次果', value: 5, color: '#9E9E9E' },
  ];

  const getStatusText = (status: ZoneEstimate['status']) => {
    switch (status) {
      case 'not_started': return '未开始';
      case 'in_progress': return '采摘中';
      case 'completed': return '已完成';
    }
  };

  return (
    <div className="yield-estimate">
      {/* 面包屑导航 */}
      <div className="breadcrumb">
        <Link to="/">首页</Link>
        <span className="separator">/</span>
        <Link to="/harvest">采摘与溯源</Link>
        <span className="separator">/</span>
        <span className="current">产量预估</span>
      </div>

      {/* 顶部统计卡片 */}
      <div className="estimate-stats">
        <div className="stat-card primary">
          <div className="stat-icon">🍊</div>
          <div className="stat-content">
            <span className="stat-label">本季预估总产量</span>
            <span className="stat-value">{totalEstimated} <small>吨</small></span>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <span className="stat-label">已采摘产量</span>
            <span className="stat-value">{totalHarvested} <small>吨</small></span>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-label">采摘进度</span>
            <span className="stat-value">{overallProgress}%</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${overallProgress}%` }}></div>
            </div>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <span className="stat-label">剩余待采</span>
            <span className="stat-value">{totalEstimated - totalHarvested} <small>吨</small></span>
          </div>
        </div>
      </div>

      <div className="estimate-content">
        {/* 左侧：分区产量列表 */}
        <div className="zone-list-section">
          <div className="section-header">
            <h3>📍 分区产量预估</h3>
          </div>
          <div className="zone-list">
            {zones.map(zone => (
              <div key={zone.id} className={`zone-card ${zone.status}`}>
                <div className="zone-image">
                  <img src={zone.image} alt={zone.name} />
                  <span className={`zone-status ${zone.status}`}>
                    {getStatusText(zone.status)}
                  </span>
                </div>
                <div className="zone-content">
                  <h4 className="zone-name">{zone.name}</h4>
                  <div className="zone-stats">
                    <div className="zone-stat">
                      <span className="stat-label">面积</span>
                      <span className="stat-value">{zone.area}亩</span>
                    </div>
                    <div className="zone-stat">
                      <span className="stat-label">果树</span>
                      <span className="stat-value">{zone.trees}棵</span>
                    </div>
                    <div className="zone-stat">
                      <span className="stat-label">预估</span>
                      <span className="stat-value">{zone.estimatedYield}吨</span>
                    </div>
                    <div className="zone-stat">
                      <span className="stat-label">已采</span>
                      <span className="stat-value">{zone.harvestedYield}吨</span>
                    </div>
                  </div>
                  <div className="zone-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${zone.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{zone.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧：图表区域 */}
        <div className="charts-section">
          {/* 月度产量趋势 */}
          <div className="chart-card">
            <h3 className="chart-title">📈 月度产量趋势</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="estimated" fill="#FF7F50" name="预估产量" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" fill="#4CAF50" name="实际产量" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 等级分布预估 */}
          <div className="chart-card">
            <h3 className="chart-title">🏆 等级分布预估</h3>
            <div className="pie-chart-container">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grade-legend">
              {gradeDistribution.map(grade => (
                <div key={grade.name} className="legend-item">
                  <span className="legend-dot" style={{ background: grade.color }}></span>
                  <span>{grade.name}</span>
                  <span className="legend-value">{grade.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI预测说明 */}
          <div className="ai-note">
            <div className="note-icon">🤖</div>
            <div className="note-content">
              <h4>AI产量预测</h4>
              <p>基于历史数据、气象条件、果树生长状态等因素，AI模型预测本季总产量约为 <strong>{totalEstimated}吨</strong>，准确率约 <strong>92%</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
