import { useState } from 'react';
import { Link } from 'react-router-dom';
import './OrchardMap.css';

interface Zone {
  id: string;
  name: string;
  area: number;
  trees: number;
  status: 'normal' | 'warning' | 'alert';
  variety: string;
  plantYear: number;
  soilMoisture: number;
  lastIrrigation: string;
  image: string;
}

export const OrchardMap = () => {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  const zones: Zone[] = [
    {
      id: 'A1',
      name: 'A1区-示范基地入口',
      area: 25,
      trees: 600,
      status: 'normal',
      variety: '纽荷尔脐橙',
      plantYear: 2018,
      soilMoisture: 65,
      lastIrrigation: '2023-11-01',
      image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400&h=300&fit=crop',
    },
    {
      id: 'A2',
      name: 'A2区-向阳坡',
      area: 25,
      trees: 600,
      status: 'normal',
      variety: '纽荷尔脐橙',
      plantYear: 2018,
      soilMoisture: 58,
      lastIrrigation: '2023-10-30',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop',
    },
    {
      id: 'A3',
      name: 'A3区-山脚',
      area: 20,
      trees: 480,
      status: 'alert',
      variety: '纽荷尔脐橙',
      plantYear: 2019,
      soilMoisture: 28,
      lastIrrigation: '2023-10-25',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop',
    },
    {
      id: 'B1',
      name: 'B1区-幼苗区北',
      area: 15,
      trees: 400,
      status: 'warning',
      variety: '赣南脐橙',
      plantYear: 2022,
      soilMoisture: 45,
      lastIrrigation: '2023-10-28',
      image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400&h=300&fit=crop',
    },
    {
      id: 'B2',
      name: 'B2区-幼苗区南',
      area: 15,
      trees: 400,
      status: 'warning',
      variety: '赣南脐橙',
      plantYear: 2022,
      soilMoisture: 52,
      lastIrrigation: '2023-10-29',
      image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&h=300&fit=crop',
    },
    {
      id: 'C1',
      name: 'C区-山地区',
      area: 40,
      trees: 800,
      status: 'normal',
      variety: '血橙',
      plantYear: 2017,
      soilMoisture: 62,
      lastIrrigation: '2023-11-01',
      image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop',
    },
  ];

  const getStatusColor = (status: Zone['status']) => {
    switch (status) {
      case 'normal': return '#4CAF50';
      case 'warning': return '#FF9500';
      case 'alert': return '#FF3B30';
    }
  };

  const getStatusText = (status: Zone['status']) => {
    switch (status) {
      case 'normal': return '正常';
      case 'warning': return '需关注';
      case 'alert': return '告警';
    }
  };

  const totalArea = zones.reduce((sum, z) => sum + z.area, 0);
  const totalTrees = zones.reduce((sum, z) => sum + z.trees, 0);

  return (
    <div className="orchard-map">
      {/* 面包屑导航 */}
      <div className="breadcrumb">
        <Link to="/">首页</Link>
        <span className="separator">/</span>
        <Link to="/orchard">果园数字孪生</Link>
        <span className="separator">/</span>
        <span className="current">地块GIS地图</span>
      </div>

      {/* 顶部统计 */}
      <div className="map-stats">
        <div className="stat-item">
          <span className="stat-label">总面积</span>
          <span className="stat-value">{totalArea} <small>亩</small></span>
        </div>
        <div className="stat-item">
          <span className="stat-label">果树总数</span>
          <span className="stat-value">{totalTrees} <small>棵</small></span>
        </div>
        <div className="stat-item">
          <span className="stat-label">地块数量</span>
          <span className="stat-value">{zones.length} <small>个</small></span>
        </div>
        <div className="stat-item status-summary">
          <span className="status-dot normal"></span>
          <span>{zones.filter(z => z.status === 'normal').length} 正常</span>
          <span className="status-dot warning"></span>
          <span>{zones.filter(z => z.status === 'warning').length} 关注</span>
          <span className="status-dot alert"></span>
          <span>{zones.filter(z => z.status === 'alert').length} 告警</span>
        </div>
      </div>

      <div className="map-container">
        {/* 地图区域 */}
        <div className="map-view">
          <div className="map-header">
            <h3>🗺️ 果园地块分布图</h3>
            <div className="map-controls">
              <button className="map-btn">🔍 放大</button>
              <button className="map-btn">🔍 缩小</button>
              <button className="map-btn">📍 定位</button>
            </div>
          </div>
          
          {/* 模拟地图 - 使用卫星图作为背景 */}
          <div className="map-canvas">
            <img 
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=600&fit=crop" 
              alt="果园卫星图"
              className="map-bg"
            />
            <div className="map-overlay">
              {zones.map((zone, index) => (
                <div
                  key={zone.id}
                  className={`zone-marker ${zone.status} ${selectedZone?.id === zone.id ? 'selected' : ''}`}
                  style={{
                    left: `${15 + (index % 3) * 30}%`,
                    top: `${20 + Math.floor(index / 3) * 35}%`,
                  }}
                  onClick={() => setSelectedZone(zone)}
                >
                  <div className="marker-icon" style={{ borderColor: getStatusColor(zone.status) }}>
                    🌳
                  </div>
                  <div className="marker-label">{zone.id}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 图例 */}
          <div className="map-legend">
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#4CAF50' }}></span>
              <span>正常</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#FF9500' }}></span>
              <span>需关注</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#FF3B30' }}></span>
              <span>告警</span>
            </div>
          </div>
        </div>

        {/* 地块详情面板 */}
        <div className="zone-detail-panel">
          {selectedZone ? (
            <>
              <div className="panel-header">
                <h3>{selectedZone.name}</h3>
                <span className={`status-badge ${selectedZone.status}`}>
                  {getStatusText(selectedZone.status)}
                </span>
              </div>
              
              <div className="zone-image">
                <img src={selectedZone.image} alt={selectedZone.name} />
              </div>

              <div className="zone-info-grid">
                <div className="info-row">
                  <span className="info-label">📐 面积</span>
                  <span className="info-value">{selectedZone.area} 亩</span>
                </div>
                <div className="info-row">
                  <span className="info-label">🌳 果树数量</span>
                  <span className="info-value">{selectedZone.trees} 棵</span>
                </div>
                <div className="info-row">
                  <span className="info-label">🍊 品种</span>
                  <span className="info-value">{selectedZone.variety}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">📅 种植年份</span>
                  <span className="info-value">{selectedZone.plantYear} 年</span>
                </div>
                <div className="info-row">
                  <span className="info-label">💧 土壤湿度</span>
                  <span className={`info-value ${selectedZone.soilMoisture < 35 ? 'alert' : ''}`}>
                    {selectedZone.soilMoisture}%
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">🚿 上次灌溉</span>
                  <span className="info-value">{selectedZone.lastIrrigation}</span>
                </div>
              </div>

              <div className="panel-actions">
                <Link to="/orchard/iot" className="panel-btn primary">
                  📡 查看传感器
                </Link>
                <Link to="/orchard/video" className="panel-btn">
                  📹 实时监控
                </Link>
              </div>
            </>
          ) : (
            <div className="panel-empty">
              <span className="empty-icon">👆</span>
              <p>点击地图上的地块标记查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
