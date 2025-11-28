import { useState } from 'react';
import { Link } from 'react-router-dom';
import './PestRecords.css';

interface PestRecord {
  id: string;
  pestType: string;
  zone: string;
  discoveryDate: string;
  treatmentDate: string;
  method: string;
  pesticide: string;
  dosage: string;
  operator: string;
  status: 'treating' | 'completed' | 'monitoring';
  effectiveness: number;
  notes: string;
}

export const PestRecords = () => {
  const [statusFilter, setStatusFilter] = useState('all');

  const records: PestRecord[] = [
    {
      id: '1',
      pestType: '红蜘蛛',
      zone: 'B2区',
      discoveryDate: '2023-10-28',
      treatmentDate: '2023-10-29',
      method: '喷洒农药',
      pesticide: '阿维菌素',
      dosage: '1500倍液',
      operator: '张三',
      status: 'treating',
      effectiveness: 75,
      notes: '第一次喷洒，需要7天后复查',
    },
    {
      id: '2',
      pestType: '蚜虫',
      zone: 'A3区',
      discoveryDate: '2023-10-20',
      treatmentDate: '2023-10-21',
      method: '喷洒农药',
      pesticide: '吡虫啉',
      dosage: '2000倍液',
      operator: '李四',
      status: 'completed',
      effectiveness: 95,
      notes: '防治效果良好，已完全控制',
    },
    {
      id: '3',
      pestType: '炭疽病',
      zone: 'B1区',
      discoveryDate: '2023-10-15',
      treatmentDate: '2023-10-16',
      method: '喷洒杀菌剂',
      pesticide: '咪鲜胺',
      dosage: '1000倍液',
      operator: '王五',
      status: 'monitoring',
      effectiveness: 85,
      notes: '病情已控制，持续观察中',
    },
    {
      id: '4',
      pestType: '介壳虫',
      zone: 'A1区',
      discoveryDate: '2023-10-10',
      treatmentDate: '2023-10-11',
      method: '人工清除+喷药',
      pesticide: '矿物油乳剂',
      dosage: '100倍液',
      operator: '赵六',
      status: 'completed',
      effectiveness: 100,
      notes: '已完全清除',
    },
  ];

  const getStatusText = (status: PestRecord['status']) => {
    switch (status) {
      case 'treating': return '防治中';
      case 'completed': return '已完成';
      case 'monitoring': return '观察中';
    }
  };

  const filteredRecords = statusFilter === 'all' 
    ? records 
    : records.filter(r => r.status === statusFilter);

  return (
    <div className="pest-records">
      {/* 面包屑导航 */}
      <div className="breadcrumb">
        <Link to="/">首页</Link>
        <span className="separator">/</span>
        <Link to="/pest">病虫害防治</Link>
        <span className="separator">/</span>
        <span className="current">防治记录</span>
      </div>

      {/* 顶部工具栏 */}
      <div className="toolbar">
        <div className="filter-group">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">全部状态</option>
            <option value="treating">防治中</option>
            <option value="monitoring">观察中</option>
            <option value="completed">已完成</option>
          </select>
        </div>
        <button className="add-record-btn">➕ 新增防治记录</button>
      </div>

      {/* 记录列表 */}
      <div className="records-list">
        {filteredRecords.map(record => (
          <div key={record.id} className="record-card">
            <div className="record-header">
              <div className="record-title">
                <span className="pest-icon">🐛</span>
                <h3>{record.pestType}</h3>
                <span className={`status-badge ${record.status}`}>
                  {getStatusText(record.status)}
                </span>
              </div>
              <div className="record-zone">📍 {record.zone}</div>
            </div>

            <div className="record-body">
              <div className="record-timeline">
                <div className="timeline-item">
                  <span className="timeline-icon">🔍</span>
                  <div className="timeline-content">
                    <span className="timeline-label">发现日期</span>
                    <span className="timeline-value">{record.discoveryDate}</span>
                  </div>
                </div>
                <div className="timeline-arrow">→</div>
                <div className="timeline-item">
                  <span className="timeline-icon">💊</span>
                  <div className="timeline-content">
                    <span className="timeline-label">防治日期</span>
                    <span className="timeline-value">{record.treatmentDate}</span>
                  </div>
                </div>
              </div>

              <div className="record-details">
                <div className="detail-row">
                  <span className="detail-label">防治方法</span>
                  <span className="detail-value">{record.method}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">使用药剂</span>
                  <span className="detail-value">{record.pesticide} ({record.dosage})</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">操作人员</span>
                  <span className="detail-value">{record.operator}</span>
                </div>
              </div>

              <div className="record-effectiveness">
                <span className="effectiveness-label">防治效果</span>
                <div className="effectiveness-bar">
                  <div 
                    className="effectiveness-fill"
                    style={{ 
                      width: `${record.effectiveness}%`,
                      background: record.effectiveness >= 90 ? '#4CAF50' : 
                                  record.effectiveness >= 70 ? '#FF9500' : '#FF3B30'
                    }}
                  ></div>
                </div>
                <span className="effectiveness-value">{record.effectiveness}%</span>
              </div>

              {record.notes && (
                <div className="record-notes">
                  <span className="notes-icon">📝</span>
                  <span>{record.notes}</span>
                </div>
              )}
            </div>

            <div className="record-actions">
              <button className="action-btn">查看详情</button>
              {record.status === 'treating' && (
                <button className="action-btn primary">更新进度</button>
              )}
              {record.status === 'monitoring' && (
                <button className="action-btn success">标记完成</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
