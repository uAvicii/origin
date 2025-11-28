import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './IotMonitor.css';

interface SensorData {
  time: string;
  value: number;
}

interface Valve {
  id: string;
  name: string;
  status: 'on' | 'off' | 'error';
  duration?: number;
}

export const IotMonitor = () => {
  const [selectedZone, setSelectedZone] = useState('A');
  const [controlMode, setControlMode] = useState<'auto' | 'manual'>('auto');

  // 模拟区域数据
  const zones = [
    { id: 'all', name: '全部果园' },
    { id: 'A', name: 'A区 (示范)' },
    { id: 'B', name: 'B区 (幼苗)' },
    { id: 'C', name: 'C区 (山地)' },
  ];

  // 模拟传感器数据
  const sensorData = {
    airTemp: 25.5,
    airHumidity: 65,
    soilTemp: 18,
    soilMoisture: 42,
    light: 45000,
    rainfall: 0,
  };

  // 模拟历史数据
  const generateHistoryData = (baseValue: number, variance: number): SensorData[] => {
    return Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      value: baseValue + (Math.random() - 0.5) * variance,
    }));
  };

  const airTempHistory = generateHistoryData(25, 8);
  const soilMoistureHistory = generateHistoryData(42, 15);

  // 模拟电磁阀数据
  const valves: Valve[] = [
    { id: 'v1', name: 'A区1号电磁阀', status: 'on', duration: 15 },
    { id: 'v2', name: 'A区2号电磁阀', status: 'off' },
    { id: 'v3', name: 'A区3号电磁阀', status: 'error' },
  ];

  // 模拟摄像头数据
  const cameras = [
    { id: 'cam1', name: '摄像头A1', location: 'A区入口', online: true },
    { id: 'cam2', name: '摄像头A2', location: 'A区中心', online: true },
    { id: 'cam3', name: '摄像头B1', location: 'B区入口', online: false },
  ];

  const getValveStatusText = (status: Valve['status']) => {
    switch (status) {
      case 'on': return '已开启';
      case 'off': return '已关闭';
      case 'error': return '故障';
    }
  };

  const getValveStatusClass = (status: Valve['status']) => {
    switch (status) {
      case 'on': return 'status-on';
      case 'off': return 'status-off';
      case 'error': return 'status-error';
    }
  };

  const getMoistureStatus = (value: number) => {
    if (value < 30) return { text: '干燥', class: 'status-dry' };
    if (value < 50) return { text: '稍干', class: 'status-low' };
    if (value < 70) return { text: '适宜', class: 'status-normal' };
    return { text: '湿润', class: 'status-wet' };
  };

  const moistureStatus = getMoistureStatus(sensorData.soilMoisture);

  return (
    <div className="iot-monitor">
      {/* 面包屑导航 */}
      <div className="breadcrumb">
        <Link to="/">首页</Link>
        <span className="separator">/</span>
        <Link to="/orchard">果园数字孪生</Link>
        <span className="separator">/</span>
        <span className="current">物联网传感器监控</span>
      </div>

      <div className="iot-layout">
        {/* 左侧：区域选择树 */}
        <div className="zone-selector">
          <h3 className="zone-title">区域选择</h3>
          <div className="zone-list">
            {zones.map((zone) => (
              <button
                key={zone.id}
                className={`zone-item ${selectedZone === zone.id ? 'active' : ''}`}
                onClick={() => setSelectedZone(zone.id)}
              >
                <span className="zone-icon">📍</span>
                <span className="zone-name">{zone.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 主内容区 */}
        <div className="iot-content">
          {/* 顶部状态栏 */}
          <div className="status-bar">
            <div className="status-info">
              <span className="status-label">最后更新时间</span>
              <span className="status-value">14:35:22</span>
            </div>
            <div className="status-info">
              <span className="status-label">设备在线率</span>
              <span className="status-value highlight">98%</span>
            </div>
            <div className="status-info device-status">
              <span className="status-dot online"></span>
              <span>水肥一体机：运行中</span>
            </div>
          </div>

          {/* 主要环境数据面板组 */}
          <div className="sensor-panels">
            {/* 空气温度/湿度 */}
            <div className="sensor-panel">
              <div className="panel-header">
                <h4 className="panel-title">🌡️ 空气温度/湿度</h4>
              </div>
              <div className="panel-values">
                <div className="value-item">
                  <span className="value-number">{sensorData.airTemp}</span>
                  <span className="value-unit">°C</span>
                </div>
                <div className="value-divider">/</div>
                <div className="value-item">
                  <span className="value-icon">💧</span>
                  <span className="value-number">{sensorData.airHumidity}</span>
                  <span className="value-unit">%</span>
                </div>
              </div>
              <div className="panel-chart">
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart data={airTempHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={5} />
                    <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="value" stroke="#FF7F50" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <button className="panel-expand">历史曲线图 ▼</button>
            </div>

            {/* 土壤温度/水分 */}
            <div className="sensor-panel">
              <div className="panel-header">
                <h4 className="panel-title">🌱 土壤温度/水分(20cm层)</h4>
              </div>
              <div className="panel-values">
                <div className="value-item">
                  <span className="value-number">{sensorData.soilTemp}</span>
                  <span className="value-unit">°C</span>
                </div>
                <div className="value-divider">/</div>
                <div className="value-item">
                  <span className="value-icon">💧</span>
                  <span className="value-number">{sensorData.soilMoisture}</span>
                  <span className="value-unit">%</span>
                  <span className={`moisture-badge ${moistureStatus.class}`}>
                    {moistureStatus.text}
                  </span>
                </div>
              </div>
              <div className="panel-chart">
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart data={soilMoistureHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={5} />
                    <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="value" stroke="#4CAF50" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <button className="panel-expand">历史曲线图 ▼</button>
            </div>

            {/* 光照强度/降雨量 */}
            <div className="sensor-panel">
              <div className="panel-header">
                <h4 className="panel-title">☀️ 光照强度/降雨量</h4>
              </div>
              <div className="panel-values">
                <div className="value-item">
                  <span className="value-number">{(sensorData.light / 1000).toFixed(0)}</span>
                  <span className="value-unit">kLux</span>
                </div>
                <div className="value-divider">/</div>
                <div className="value-item">
                  <span className="value-icon">🌧️</span>
                  <span className="value-number">{sensorData.rainfall}</span>
                  <span className="value-unit">mm</span>
                </div>
              </div>
              <div className="panel-placeholder">
                <span>今日无降雨</span>
              </div>
              <button className="panel-expand">历史曲线图 ▼</button>
            </div>
          </div>

          {/* 联动控制区 - 智能灌溉 */}
          <div className="control-section">
            <div className="control-header">
              <h3 className="control-title">💧 联动控制区 - 智能灌溉</h3>
              <div className="control-mode">
                <span className="mode-label">当前策略：</span>
                <span className="mode-value">
                  {controlMode === 'auto' ? '依据土壤墒情自动灌溉' : '手动控制'}
                </span>
                <button 
                  className="mode-switch"
                  onClick={() => setControlMode(controlMode === 'auto' ? 'manual' : 'auto')}
                >
                  切换为{controlMode === 'auto' ? '手动' : '自动'}
                </button>
              </div>
            </div>

            <div className="valve-grid">
              {valves.map((valve) => (
                <div key={valve.id} className={`valve-card ${getValveStatusClass(valve.status)}`}>
                  <div className="valve-header">
                    <span className="valve-name">{valve.name}</span>
                    <span className={`valve-status ${getValveStatusClass(valve.status)}`}>
                      {valve.status === 'on' && '🟢'}
                      {valve.status === 'off' && '⚪'}
                      {valve.status === 'error' && '🔴'}
                      {getValveStatusText(valve.status)}
                      {valve.duration && ` ${valve.duration}min`}
                    </span>
                  </div>
                  <div className="valve-actions">
                    {valve.status === 'on' && (
                      <button className="valve-btn off">关闭</button>
                    )}
                    {valve.status === 'off' && (
                      <button className="valve-btn on">开启</button>
                    )}
                    {valve.status === 'error' && (
                      <button className="valve-btn detail">查看详情</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 实景监控 */}
          <div className="camera-section">
            <div className="camera-header">
              <h3 className="camera-title">📹 实景监控</h3>
              <Link to="/orchard/video" className="camera-link">进入监控中心 →</Link>
            </div>
            <div className="camera-grid">
              {cameras.map((camera) => (
                <div key={camera.id} className={`camera-card ${camera.online ? 'online' : 'offline'}`}>
                  <div className="camera-preview">
                    {camera.online ? (
                      <div className="camera-placeholder">
                        <span className="camera-icon">📷</span>
                        <span>点击查看实时画面</span>
                      </div>
                    ) : (
                      <div className="camera-offline">
                        <span className="offline-icon">⚠️</span>
                        <span>设备离线</span>
                      </div>
                    )}
                  </div>
                  <div className="camera-info">
                    <span className="camera-name">{camera.name}</span>
                    <span className="camera-location">{camera.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
