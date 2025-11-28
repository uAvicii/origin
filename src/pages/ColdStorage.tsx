import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './ColdStorage.css';

interface StorageRoom {
  id: string;
  name: string;
  capacity: number;
  currentStock: number;
  temperature: number;
  humidity: number;
  status: 'normal' | 'warning' | 'alert';
  lastUpdate: string;
}

export const ColdStorage = () => {
  const [selectedRoom, setSelectedRoom] = useState<string>('room1');

  const rooms: StorageRoom[] = [
    { id: 'room1', name: '1号冷库', capacity: 50, currentStock: 35, temperature: 4.2, humidity: 85, status: 'normal', lastUpdate: '14:35:22' },
    { id: 'room2', name: '2号冷库', capacity: 50, currentStock: 42, temperature: 4.5, humidity: 82, status: 'normal', lastUpdate: '14:35:20' },
    { id: 'room3', name: '3号冷库', capacity: 30, currentStock: 28, temperature: 6.8, humidity: 78, status: 'warning', lastUpdate: '14:35:18' },
    { id: 'room4', name: '预冷间', capacity: 20, currentStock: 8, temperature: 8.5, humidity: 75, status: 'normal', lastUpdate: '14:35:15' },
  ];

  // 温度历史数据
  const tempHistory = [
    { time: '00:00', temp: 4.0, humidity: 85 },
    { time: '04:00', temp: 4.1, humidity: 84 },
    { time: '08:00', temp: 4.3, humidity: 83 },
    { time: '12:00', temp: 4.5, humidity: 82 },
    { time: '14:00', temp: 4.2, humidity: 85 },
  ];

  const currentRoom = rooms.find(r => r.id === selectedRoom) || rooms[0];
  const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);
  const totalStock = rooms.reduce((sum, r) => sum + r.currentStock, 0);

  return (
    <div className="cold-storage">
      {/* 面包屑导航 */}
      <div className="breadcrumb">
        <Link to="/">首页</Link>
        <span className="separator">/</span>
        <Link to="/warehouse">仓储物流</Link>
        <span className="separator">/</span>
        <span className="current">冷库环境监控</span>
      </div>

      {/* 顶部统计 */}
      <div className="storage-stats">
        <div className="stat-card">
          <div className="stat-icon">🏭</div>
          <div className="stat-content">
            <span className="stat-value">{rooms.length}</span>
            <span className="stat-label">冷库数量</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <span className="stat-value">{totalStock} <small>/ {totalCapacity}吨</small></span>
            <span className="stat-label">库存容量</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🌡️</div>
          <div className="stat-content">
            <span className="stat-value">{currentRoom.temperature}°C</span>
            <span className="stat-label">当前温度</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💧</div>
          <div className="stat-content">
            <span className="stat-value">{currentRoom.humidity}%</span>
            <span className="stat-label">当前湿度</span>
          </div>
        </div>
      </div>

      <div className="storage-layout">
        {/* 左侧：冷库列表 */}
        <div className="room-list">
          <h3 className="section-title">❄️ 冷库列表</h3>
          <div className="rooms">
            {rooms.map(room => (
              <div 
                key={room.id}
                className={`room-card ${room.status} ${selectedRoom === room.id ? 'selected' : ''}`}
                onClick={() => setSelectedRoom(room.id)}
              >
                <div className="room-header">
                  <span className="room-name">{room.name}</span>
                  <span className={`room-status ${room.status}`}>
                    {room.status === 'normal' ? '正常' : room.status === 'warning' ? '注意' : '告警'}
                  </span>
                </div>
                <div className="room-metrics">
                  <div className="metric">
                    <span className="metric-icon">🌡️</span>
                    <span className={`metric-value ${room.temperature > 6 ? 'warning' : ''}`}>
                      {room.temperature}°C
                    </span>
                  </div>
                  <div className="metric">
                    <span className="metric-icon">💧</span>
                    <span className="metric-value">{room.humidity}%</span>
                  </div>
                </div>
                <div className="room-capacity">
                  <div className="capacity-bar">
                    <div 
                      className="capacity-fill"
                      style={{ width: `${(room.currentStock / room.capacity) * 100}%` }}
                    ></div>
                  </div>
                  <span className="capacity-text">{room.currentStock}/{room.capacity}吨</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 中间：详细监控 */}
        <div className="room-detail">
          <div className="detail-header">
            <h3>{currentRoom.name} 实时监控</h3>
            <span className="update-time">更新于 {currentRoom.lastUpdate}</span>
          </div>

          {/* 大数字显示 */}
          <div className="big-metrics">
            <div className="big-metric temp">
              <div className="metric-label">温度</div>
              <div className="metric-value">
                <span className="value">{currentRoom.temperature}</span>
                <span className="unit">°C</span>
              </div>
              <div className="metric-range">设定范围: 3-5°C</div>
            </div>
            <div className="big-metric humidity">
              <div className="metric-label">湿度</div>
              <div className="metric-value">
                <span className="value">{currentRoom.humidity}</span>
                <span className="unit">%</span>
              </div>
              <div className="metric-range">设定范围: 80-90%</div>
            </div>
          </div>

          {/* 趋势图 */}
          <div className="trend-chart">
            <h4>24小时温湿度趋势</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={tempHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="temp" tick={{ fontSize: 11 }} domain={[0, 10]} />
                <YAxis yAxisId="humidity" orientation="right" tick={{ fontSize: 11 }} domain={[70, 100]} />
                <Tooltip />
                <Line yAxisId="temp" type="monotone" dataKey="temp" stroke="#FF7F50" strokeWidth={2} name="温度°C" />
                <Line yAxisId="humidity" type="monotone" dataKey="humidity" stroke="#4CAF50" strokeWidth={2} name="湿度%" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 控制面板 */}
          <div className="control-panel">
            <h4>设备控制</h4>
            <div className="controls">
              <div className="control-item">
                <span className="control-label">制冷机组</span>
                <span className="control-status on">运行中</span>
                <button className="control-btn">调节</button>
              </div>
              <div className="control-item">
                <span className="control-label">加湿系统</span>
                <span className="control-status on">运行中</span>
                <button className="control-btn">调节</button>
              </div>
              <div className="control-item">
                <span className="control-label">通风系统</span>
                <span className="control-status off">已关闭</span>
                <button className="control-btn">开启</button>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：告警与日志 */}
        <div className="alerts-panel">
          <h3 className="section-title">⚠️ 告警信息</h3>
          <div className="alert-list">
            <div className="alert-item warning">
              <span className="alert-icon">🌡️</span>
              <div className="alert-content">
                <div className="alert-message">3号冷库温度偏高</div>
                <div className="alert-time">14:30:15</div>
              </div>
            </div>
            <div className="alert-item info">
              <span className="alert-icon">🔧</span>
              <div className="alert-content">
                <div className="alert-message">1号冷库除霜完成</div>
                <div className="alert-time">12:00:00</div>
              </div>
            </div>
            <div className="alert-item info">
              <span className="alert-icon">📦</span>
              <div className="alert-content">
                <div className="alert-message">2号冷库入库5吨</div>
                <div className="alert-time">10:30:22</div>
              </div>
            </div>
          </div>

          <h3 className="section-title" style={{ marginTop: '1.5rem' }}>📋 操作日志</h3>
          <div className="log-list">
            <div className="log-item">
              <span className="log-time">14:35</span>
              <span className="log-text">系统自动采集数据</span>
            </div>
            <div className="log-item">
              <span className="log-time">14:00</span>
              <span className="log-text">张三 调整1号冷库温度设定</span>
            </div>
            <div className="log-item">
              <span className="log-time">12:00</span>
              <span className="log-text">1号冷库自动除霜</span>
            </div>
            <div className="log-item">
              <span className="log-time">10:30</span>
              <span className="log-text">李四 录入入库记录</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
