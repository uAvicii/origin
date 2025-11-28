import { useState } from 'react';
import { Link } from 'react-router-dom';
import './PestAI.css';

interface Detection {
  id: string;
  type: string;
  confidence: number;
  zone: string;
  time: string;
  image: string;
  status: 'pending' | 'confirmed' | 'dismissed';
  severity: 'low' | 'medium' | 'high';
}

export const PestAI = () => {
  const [activeTab, setActiveTab] = useState<'realtime' | 'history'>('realtime');

  const realtimeDetections: Detection[] = [
    {
      id: '1',
      type: '红蜘蛛',
      confidence: 92,
      zone: 'B2区',
      time: '10分钟前',
      image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=300&fit=crop',
      status: 'pending',
      severity: 'high',
    },
    {
      id: '2',
      type: '蚜虫',
      confidence: 85,
      zone: 'A3区',
      time: '30分钟前',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
      status: 'pending',
      severity: 'medium',
    },
    {
      id: '3',
      type: '黄龙病疑似',
      confidence: 78,
      zone: 'C区',
      time: '1小时前',
      image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400&h=300&fit=crop',
      status: 'pending',
      severity: 'high',
    },
  ];

  const historyDetections: Detection[] = [
    {
      id: '4',
      type: '介壳虫',
      confidence: 88,
      zone: 'A1区',
      time: '2023-10-28',
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop',
      status: 'confirmed',
      severity: 'medium',
    },
    {
      id: '5',
      type: '炭疽病',
      confidence: 91,
      zone: 'B1区',
      time: '2023-10-25',
      image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=300&fit=crop',
      status: 'confirmed',
      severity: 'high',
    },
    {
      id: '6',
      type: '红蜘蛛',
      confidence: 65,
      zone: 'A2区',
      time: '2023-10-20',
      image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&h=300&fit=crop',
      status: 'dismissed',
      severity: 'low',
    },
  ];

  const getSeverityColor = (severity: Detection['severity']) => {
    switch (severity) {
      case 'high': return 'var(--color-danger)';
      case 'medium': return 'var(--color-warning)';
      case 'low': return 'var(--color-secondary)';
    }
  };

  const getSeverityText = (severity: Detection['severity']) => {
    switch (severity) {
      case 'high': return '高风险';
      case 'medium': return '中风险';
      case 'low': return '低风险';
    }
  };

  const getStatusText = (status: Detection['status']) => {
    switch (status) {
      case 'pending': return '待确认';
      case 'confirmed': return '已确认';
      case 'dismissed': return '已排除';
    }
  };

  const detections = activeTab === 'realtime' ? realtimeDetections : historyDetections;

  return (
    <div className="pest-ai">
      {/* 面包屑导航 */}
      <div className="breadcrumb">
        <Link to="/">首页</Link>
        <span className="separator">/</span>
        <Link to="/pest">病虫害防治</Link>
        <span className="separator">/</span>
        <span className="current">AI识别与预警</span>
      </div>

      {/* 顶部统计 */}
      <div className="ai-stats">
        <div className="stat-card">
          <div className="stat-icon warning">🔍</div>
          <div className="stat-content">
            <span className="stat-value">{realtimeDetections.length}</span>
            <span className="stat-label">待处理预警</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon danger">🐛</div>
          <div className="stat-content">
            <span className="stat-value">{realtimeDetections.filter(d => d.severity === 'high').length}</span>
            <span className="stat-label">高风险</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success">✅</div>
          <div className="stat-content">
            <span className="stat-value">156</span>
            <span className="stat-label">本月已处理</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon info">🤖</div>
          <div className="stat-content">
            <span className="stat-value">94.5%</span>
            <span className="stat-label">识别准确率</span>
          </div>
        </div>
      </div>

      {/* 上传识别区域 */}
      <div className="upload-section">
        <div className="upload-card">
          <div className="upload-icon">📷</div>
          <h3>上传图片识别</h3>
          <p>拍摄或上传病虫害照片，AI将自动识别</p>
          <button className="upload-btn">选择图片上传</button>
        </div>
        <div className="upload-card">
          <div className="upload-icon">📹</div>
          <h3>实时视频识别</h3>
          <p>连接摄像头进行实时病虫害监测</p>
          <Link to="/orchard/video" className="upload-btn secondary">进入监控中心</Link>
        </div>
      </div>

      {/* 检测结果列表 */}
      <div className="detection-section">
        <div className="section-header">
          <div className="tab-buttons">
            <button 
              className={`tab-btn ${activeTab === 'realtime' ? 'active' : ''}`}
              onClick={() => setActiveTab('realtime')}
            >
              实时预警 
              {realtimeDetections.length > 0 && (
                <span className="tab-badge">{realtimeDetections.length}</span>
              )}
            </button>
            <button 
              className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              历史记录
            </button>
          </div>
        </div>

        <div className="detection-grid">
          {detections.map(detection => (
            <div key={detection.id} className="detection-card">
              <div className="detection-image">
                <img src={detection.image} alt={detection.type} />
                <div 
                  className="severity-badge"
                  style={{ background: getSeverityColor(detection.severity) }}
                >
                  {getSeverityText(detection.severity)}
                </div>
                <div className="confidence-badge">
                  AI置信度: {detection.confidence}%
                </div>
              </div>
              
              <div className="detection-content">
                <div className="detection-header">
                  <h4 className="detection-type">{detection.type}</h4>
                  <span className={`status-badge ${detection.status}`}>
                    {getStatusText(detection.status)}
                  </span>
                </div>
                
                <div className="detection-info">
                  <div className="info-item">
                    <span className="info-icon">📍</span>
                    <span>{detection.zone}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">🕐</span>
                    <span>{detection.time}</span>
                  </div>
                </div>

                {detection.status === 'pending' && (
                  <div className="detection-actions">
                    <button className="action-btn confirm">确认并处理</button>
                    <button className="action-btn dismiss">排除误报</button>
                  </div>
                )}

                {detection.status === 'confirmed' && (
                  <Link to="/pest/records" className="view-record-link">
                    查看防治记录 →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
