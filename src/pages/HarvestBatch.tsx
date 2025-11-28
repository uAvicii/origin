import { useState } from 'react';
import { Link } from 'react-router-dom';
import './HarvestBatch.css';

interface HarvestBatch {
  id: string;
  batchNo: string;
  harvestDate: string;
  zone: string;
  zoneDetail: string;
  assignee: string;
  totalWeight: number;
  weather: string;
  avgSugar: number;
  gradeDistribution: {
    premium: number;
    first: number;
    second: number;
  };
}

export const HarvestBatch = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [zoneFilter, setZoneFilter] = useState('all');
  const [showNewBatchModal, setShowNewBatchModal] = useState(false);
  const [showTraceModal, setShowTraceModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<HarvestBatch | null>(null);

  // 模拟批次数据
  const batches: HarvestBatch[] = [
    {
      id: '1',
      batchNo: 'H20231101-A2',
      harvestDate: '2023-11-01',
      zone: 'A2区',
      zoneDetail: '向阳坡',
      assignee: '赵六',
      totalWeight: 5200,
      weather: '晴',
      avgSugar: 13.5,
      gradeDistribution: { premium: 30, first: 50, second: 20 },
    },
    {
      id: '2',
      batchNo: 'H20231029-B1',
      harvestDate: '2023-10-29',
      zone: 'B1区',
      zoneDetail: '北坡',
      assignee: '张三',
      totalWeight: 3800,
      weather: '多云',
      avgSugar: 12.8,
      gradeDistribution: { premium: 25, first: 45, second: 30 },
    },
    {
      id: '3',
      batchNo: 'H20231025-A1',
      harvestDate: '2023-10-25',
      zone: 'A1区',
      zoneDetail: '入口处',
      assignee: '李四',
      totalWeight: 4500,
      weather: '晴',
      avgSugar: 14.2,
      gradeDistribution: { premium: 40, first: 45, second: 15 },
    },
  ];

  const zones = ['A1区', 'A2区', 'A3区', 'B1区', 'B2区', 'C区'];

  const handleShowTrace = (batch: HarvestBatch) => {
    setSelectedBatch(batch);
    setShowTraceModal(true);
  };

  return (
    <div className="harvest-batch">
      {/* 面包屑导航 */}
      <div className="breadcrumb">
        <Link to="/">首页</Link>
        <span className="separator">/</span>
        <Link to="/harvest">采摘与溯源</Link>
        <span className="separator">/</span>
        <span className="current">采摘批次管理</span>
      </div>

      {/* 顶部工具栏 */}
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="date-range">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="date-input"
            />
            <span className="date-separator">至</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="date-input"
            />
          </div>

          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="zone-select"
          >
            <option value="all">全部地块</option>
            {zones.map((zone) => (
              <option key={zone} value={zone}>{zone}</option>
            ))}
          </select>
        </div>

        <button className="new-batch-btn" onClick={() => setShowNewBatchModal(true)}>
          ➕ 录入新采摘批次
        </button>
      </div>

      {/* 批次详情卡片流 */}
      <div className="batch-list">
        {batches.map((batch) => (
          <div key={batch.id} className="batch-card">
            <div className="batch-header">
              <span className="batch-no">批次号 {batch.batchNo}</span>
              <span className="batch-date">{batch.harvestDate}</span>
            </div>

            <div className="batch-content">
              {/* 左侧：基本信息 */}
              <div className="batch-section basic-info">
                <h4 className="section-label">基本信息</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">采摘日期</span>
                    <span className="info-value">{batch.harvestDate}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">来源地块</span>
                    <span className="info-value">{batch.zone} ({batch.zoneDetail})</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">采摘负责人</span>
                    <span className="info-value">{batch.assignee}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">总重量</span>
                    <span className="info-value highlight">{(batch.totalWeight / 1000).toFixed(1)} 吨</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">天气状况</span>
                    <span className="info-value">{batch.weather === '晴' ? '☀️' : '⛅'} {batch.weather}</span>
                  </div>
                </div>
              </div>

              {/* 中间：质检与分级 */}
              <div className="batch-section quality-info">
                <h4 className="section-label">质检与分级</h4>
                <div className="quality-main">
                  <div className="sugar-display">
                    <span className="sugar-label">平均糖度</span>
                    <span className="sugar-value">{batch.avgSugar}</span>
                    <span className="sugar-unit">Brix</span>
                  </div>
                </div>
                <div className="grade-distribution">
                  <span className="grade-title">果径分布</span>
                  <div className="grade-bars">
                    <div className="grade-item">
                      <div className="grade-bar-container">
                        <div 
                          className="grade-bar premium" 
                          style={{ width: `${batch.gradeDistribution.premium}%` }}
                        ></div>
                      </div>
                      <span className="grade-label">特级果 (80mm+): {batch.gradeDistribution.premium}%</span>
                    </div>
                    <div className="grade-item">
                      <div className="grade-bar-container">
                        <div 
                          className="grade-bar first" 
                          style={{ width: `${batch.gradeDistribution.first}%` }}
                        ></div>
                      </div>
                      <span className="grade-label">一级果 (70-80mm): {batch.gradeDistribution.first}%</span>
                    </div>
                    <div className="grade-item">
                      <div className="grade-bar-container">
                        <div 
                          className="grade-bar second" 
                          style={{ width: `${batch.gradeDistribution.second}%` }}
                        ></div>
                      </div>
                      <span className="grade-label">二级果: {batch.gradeDistribution.second}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右侧：溯源操作 */}
              <div className="batch-section trace-actions">
                <h4 className="section-label">溯源操作</h4>
                <div className="action-buttons">
                  <button 
                    className="trace-btn qrcode"
                    onClick={() => handleShowTrace(batch)}
                  >
                    <span className="btn-icon">🔗</span>
                    <span>生成溯源二维码</span>
                  </button>
                  <button className="trace-btn print">
                    <span className="btn-icon">🖨️</span>
                    <span>打印批次标签</span>
                  </button>
                  <button className="trace-btn logistics">
                    <span className="btn-icon">🚚</span>
                    <span>关联物流信息</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 新建批次弹窗 */}
      {showNewBatchModal && (
        <div className="modal-overlay" onClick={() => setShowNewBatchModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">录入新采摘批次</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>采摘日期 *</label>
                <input type="date" className="form-input" />
              </div>
              <div className="form-group">
                <label>来源地块 *</label>
                <select className="form-input">
                  <option value="">请选择地块</option>
                  {zones.map((zone) => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>采摘负责人 *</label>
                <input type="text" className="form-input" placeholder="请输入负责人姓名" />
              </div>
              <div className="form-group">
                <label>总重量 (kg) *</label>
                <input type="number" className="form-input" placeholder="请输入总重量" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>天气状况</label>
                <select className="form-input">
                  <option value="sunny">晴</option>
                  <option value="cloudy">多云</option>
                  <option value="rainy">雨</option>
                </select>
              </div>
              <div className="form-group">
                <label>平均糖度 (Brix)</label>
                <input type="number" step="0.1" className="form-input" placeholder="请输入糖度" />
              </div>
            </div>

            <div className="form-group">
              <label>备注</label>
              <textarea className="form-input textarea" placeholder="请输入备注信息..." rows={2}></textarea>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowNewBatchModal(false)}>
                取消
              </button>
              <button className="btn btn-primary">
                保存批次
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 溯源信息预览弹窗 */}
      {showTraceModal && selectedBatch && (
        <div className="modal-overlay" onClick={() => setShowTraceModal(false)}>
          <div className="trace-modal" onClick={(e) => e.stopPropagation()}>
            <div className="trace-preview">
              <div className="phone-frame">
                <div className="phone-header">
                  <span className="phone-time">9:41</span>
                  <span className="phone-icons">📶 🔋</span>
                </div>
                
                <div className="trace-content">
                  <div className="trace-hero">
                    <img 
                      src="https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400&h=200&fit=crop" 
                      alt="果园实景"
                      className="hero-image"
                    />
                    <div className="hero-overlay">
                      <h2 className="trace-title">赣南脐橙</h2>
                      <p className="trace-subtitle">您的橙子溯源档案</p>
                    </div>
                  </div>

                  <div className="trace-section">
                    <div className="trace-item">
                      <span className="trace-icon">🌱</span>
                      <div className="trace-info">
                        <span className="trace-label">生长档案</span>
                        <span className="trace-value">施肥3次，人工除草，未使用禁用农药</span>
                      </div>
                    </div>

                    <div className="trace-item">
                      <span className="trace-icon">☀️</span>
                      <div className="trace-info">
                        <span className="trace-label">环境数据</span>
                        <span className="trace-value">累计光照1500小时，生长季平均气温23℃</span>
                      </div>
                    </div>

                    <div className="trace-item">
                      <span className="trace-icon">🚜</span>
                      <div className="trace-info">
                        <span className="trace-label">采摘信息</span>
                        <span className="trace-value">{selectedBatch.harvestDate}采摘，负责人{selectedBatch.assignee}</span>
                      </div>
                    </div>

                    <div className="trace-item">
                      <span className="trace-icon">✅</span>
                      <div className="trace-info">
                        <span className="trace-label">质检报告</span>
                        <span className="trace-value">糖度{selectedBatch.avgSugar}，农残检测合格</span>
                        <button className="trace-link">查看报告 →</button>
                      </div>
                    </div>
                  </div>

                  <div className="trace-footer">
                    <button className="buy-btn">立即购买</button>
                  </div>
                </div>
              </div>

              <div className="qrcode-section">
                <div className="qrcode-placeholder">
                  <span className="qrcode-icon">📱</span>
                  <span>扫码预览</span>
                </div>
                <p className="qrcode-hint">批次号: {selectedBatch.batchNo}</p>
                <div className="qrcode-actions">
                  <button className="btn btn-primary">下载二维码</button>
                  <button className="btn btn-secondary" onClick={() => setShowTraceModal(false)}>关闭</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
