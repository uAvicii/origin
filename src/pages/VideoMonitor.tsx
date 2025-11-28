import { useState } from 'react';
import { Link } from 'react-router-dom';
import './VideoMonitor.css';

interface Camera {
  id: string;
  name: string;
  location: string;
  zone: string;
  online: boolean;
  thumbnail: string;
  hasAlert: boolean;
}

export const VideoMonitor = () => {
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [zoneFilter, setZoneFilter] = useState('all');

  const cameras: Camera[] = [
    {
      id: 'cam-a1',
      name: '摄像头A1',
      location: 'A区入口',
      zone: 'A区',
      online: true,
      thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop',
      hasAlert: false,
    },
    {
      id: 'cam-a2',
      name: '摄像头A2',
      location: 'A区中心',
      zone: 'A区',
      online: true,
      thumbnail: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=300&fit=crop',
      hasAlert: false,
    },
    {
      id: 'cam-a3',
      name: '摄像头A3',
      location: 'A区山脚',
      zone: 'A区',
      online: true,
      thumbnail: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400&h=300&fit=crop',
      hasAlert: true,
    },
    {
      id: 'cam-b1',
      name: '摄像头B1',
      location: 'B区入口',
      zone: 'B区',
      online: false,
      thumbnail: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=300&fit=crop',
      hasAlert: false,
    },
    {
      id: 'cam-b2',
      name: '摄像头B2',
      location: 'B区苗圃',
      zone: 'B区',
      online: true,
      thumbnail: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop',
      hasAlert: false,
    },
    {
      id: 'cam-c1',
      name: '摄像头C1',
      location: 'C区山地',
      zone: 'C区',
      online: true,
      thumbnail: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=400&h=300&fit=crop',
      hasAlert: false,
    },
    {
      id: 'cam-warehouse',
      name: '仓库摄像头',
      location: '冷库入口',
      zone: '仓库',
      online: true,
      thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop',
      hasAlert: false,
    },
    {
      id: 'cam-gate',
      name: '大门摄像头',
      location: '果园大门',
      zone: '公共',
      online: true,
      thumbnail: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
      hasAlert: false,
    },
  ];

  const zones = ['all', 'A区', 'B区', 'C区', '仓库', '公共'];

  const filteredCameras = zoneFilter === 'all' 
    ? cameras 
    : cameras.filter(c => c.zone === zoneFilter);

  const onlineCount = cameras.filter(c => c.online).length;
  const alertCount = cameras.filter(c => c.hasAlert).length;

  return (
    <div className="video-monitor">
      {/* 面包屑导航 */}
      <div className="breadcrumb">
        <Link to="/">首页</Link>
        <span className="separator">/</span>
        <Link to="/orchard">果园数字孪生</Link>
        <span className="separator">/</span>
        <span className="current">视频监控中心</span>
      </div>

      {/* 顶部状态栏 */}
      <div className="monitor-header">
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-icon">📹</span>
            <span className="stat-text">
              <strong>{onlineCount}</strong>/{cameras.length} 在线
            </span>
          </div>
          {alertCount > 0 && (
            <div className="stat-item alert">
              <span className="stat-icon">⚠️</span>
              <span className="stat-text">
                <strong>{alertCount}</strong> 个告警
              </span>
            </div>
          )}
        </div>

        <div className="header-filters">
          {zones.map(zone => (
            <button
              key={zone}
              className={`filter-btn ${zoneFilter === zone ? 'active' : ''}`}
              onClick={() => setZoneFilter(zone)}
            >
              {zone === 'all' ? '全部' : zone}
            </button>
          ))}
        </div>
      </div>

      <div className="monitor-layout">
        {/* 主视频区域 */}
        <div className="main-video">
          {selectedCamera ? (
            <>
              <div className="video-player">
                <img 
                  src={selectedCamera.thumbnail} 
                  alt={selectedCamera.name}
                  className="video-feed"
                />
                <div className="video-overlay">
                  <div className="video-info">
                    <span className="camera-name">{selectedCamera.name}</span>
                    <span className="camera-location">{selectedCamera.location}</span>
                  </div>
                  <div className="video-time">
                    <span className="live-badge">● LIVE</span>
                    <span>{new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
                <div className="video-controls">
                  <button className="control-btn">⏸️ 暂停</button>
                  <button className="control-btn">📷 截图</button>
                  <button className="control-btn">🔊 声音</button>
                  <button className="control-btn">⛶ 全屏</button>
                </div>
              </div>
              
              {/* 云台控制 */}
              <div className="ptz-control">
                <h4>云台控制</h4>
                <div className="ptz-buttons">
                  <button className="ptz-btn">↑</button>
                  <div className="ptz-row">
                    <button className="ptz-btn">←</button>
                    <button className="ptz-btn center">●</button>
                    <button className="ptz-btn">→</button>
                  </div>
                  <button className="ptz-btn">↓</button>
                </div>
                <div className="zoom-control">
                  <button className="zoom-btn">➖</button>
                  <span>变焦</span>
                  <button className="zoom-btn">➕</button>
                </div>
              </div>
            </>
          ) : (
            <div className="video-placeholder">
              <span className="placeholder-icon">📹</span>
              <p>请选择一个摄像头查看实时画面</p>
            </div>
          )}
        </div>

        {/* 摄像头列表 */}
        <div className="camera-list">
          <h3 className="list-title">摄像头列表</h3>
          <div className="camera-grid">
            {filteredCameras.map(camera => (
              <div
                key={camera.id}
                className={`camera-card ${!camera.online ? 'offline' : ''} ${selectedCamera?.id === camera.id ? 'selected' : ''} ${camera.hasAlert ? 'has-alert' : ''}`}
                onClick={() => camera.online && setSelectedCamera(camera)}
              >
                <div className="camera-thumbnail">
                  {camera.online ? (
                    <img src={camera.thumbnail} alt={camera.name} />
                  ) : (
                    <div className="offline-placeholder">
                      <span>📵</span>
                      <span>离线</span>
                    </div>
                  )}
                  {camera.hasAlert && (
                    <div className="alert-badge">⚠️</div>
                  )}
                  {camera.online && (
                    <div className="live-indicator">● LIVE</div>
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
  );
};
