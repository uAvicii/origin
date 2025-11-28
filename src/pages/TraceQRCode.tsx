import { useState } from 'react';
import { Link } from 'react-router-dom';
import './TraceQRCode.css';

interface QRCodeBatch {
  id: string;
  batchNo: string;
  harvestDate: string;
  zone: string;
  quantity: number;
  qrGenerated: boolean;
  printCount: number;
  scanCount: number;
}

export const TraceQRCode = () => {
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);

  const batches: QRCodeBatch[] = [
    { id: '1', batchNo: 'H20231128-A1', harvestDate: '2023-11-28', zone: 'A1区', quantity: 5200, qrGenerated: true, printCount: 500, scanCount: 1250 },
    { id: '2', batchNo: 'H20231127-A2', harvestDate: '2023-11-27', zone: 'A2区', quantity: 4800, qrGenerated: true, printCount: 480, scanCount: 890 },
    { id: '3', batchNo: 'H20231125-B1', harvestDate: '2023-11-25', zone: 'B1区', quantity: 3500, qrGenerated: true, printCount: 350, scanCount: 560 },
    { id: '4', batchNo: 'H20231123-C1', harvestDate: '2023-11-23', zone: 'C区', quantity: 6000, qrGenerated: false, printCount: 0, scanCount: 0 },
    { id: '5', batchNo: 'H20231120-A3', harvestDate: '2023-11-20', zone: 'A3区', quantity: 4200, qrGenerated: true, printCount: 420, scanCount: 2100 },
  ];

  const toggleBatch = (id: string) => {
    setSelectedBatches(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const totalScans = batches.reduce((sum, b) => sum + b.scanCount, 0);
  const generatedCount = batches.filter(b => b.qrGenerated).length;

  return (
    <div className="trace-qrcode">
      {/* 面包屑导航 */}
      <div className="breadcrumb">
        <Link to="/">首页</Link>
        <span className="separator">/</span>
        <Link to="/harvest">采摘与溯源</Link>
        <span className="separator">/</span>
        <span className="current">溯源二维码</span>
      </div>

      {/* 顶部统计 */}
      <div className="qr-stats">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <span className="stat-value">{batches.length}</span>
            <span className="stat-label">总批次数</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔗</div>
          <div className="stat-content">
            <span className="stat-value">{generatedCount}</span>
            <span className="stat-label">已生成二维码</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📱</div>
          <div className="stat-content">
            <span className="stat-value">{totalScans.toLocaleString()}</span>
            <span className="stat-label">累计扫码次数</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🖨️</div>
          <div className="stat-content">
            <span className="stat-value">{batches.reduce((sum, b) => sum + b.printCount, 0)}</span>
            <span className="stat-label">已打印标签</span>
          </div>
        </div>
      </div>

      <div className="qr-layout">
        {/* 左侧：批次列表 */}
        <div className="batch-list-section">
          <div className="section-header">
            <h3>📋 采摘批次列表</h3>
            <div className="header-actions">
              {selectedBatches.length > 0 && (
                <button className="batch-action-btn">
                  🔗 批量生成 ({selectedBatches.length})
                </button>
              )}
            </div>
          </div>

          <div className="batch-table">
            <div className="table-header">
              <div className="col-check"></div>
              <div className="col-batch">批次号</div>
              <div className="col-date">采摘日期</div>
              <div className="col-zone">地块</div>
              <div className="col-qty">数量(kg)</div>
              <div className="col-status">状态</div>
              <div className="col-stats">扫码统计</div>
              <div className="col-actions">操作</div>
            </div>
            
            {batches.map(batch => (
              <div key={batch.id} className={`table-row ${batch.qrGenerated ? '' : 'pending'}`}>
                <div className="col-check">
                  <input 
                    type="checkbox" 
                    checked={selectedBatches.includes(batch.id)}
                    onChange={() => toggleBatch(batch.id)}
                  />
                </div>
                <div className="col-batch">
                  <span className="batch-no">{batch.batchNo}</span>
                </div>
                <div className="col-date">{batch.harvestDate}</div>
                <div className="col-zone">{batch.zone}</div>
                <div className="col-qty">{batch.quantity.toLocaleString()}</div>
                <div className="col-status">
                  <span className={`status-badge ${batch.qrGenerated ? 'generated' : 'pending'}`}>
                    {batch.qrGenerated ? '✅ 已生成' : '⏳ 待生成'}
                  </span>
                </div>
                <div className="col-stats">
                  {batch.qrGenerated ? (
                    <div className="scan-stats">
                      <span>🖨️ {batch.printCount}</span>
                      <span>📱 {batch.scanCount}</span>
                    </div>
                  ) : (
                    <span className="no-stats">-</span>
                  )}
                </div>
                <div className="col-actions">
                  {batch.qrGenerated ? (
                    <>
                      <button className="action-btn">预览</button>
                      <button className="action-btn">打印</button>
                    </>
                  ) : (
                    <button className="action-btn primary">生成</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧：二维码预览 */}
        <div className="qr-preview-section">
          <div className="section-header">
            <h3>📱 溯源页面预览</h3>
          </div>

          <div className="phone-preview">
            <div className="phone-frame">
              <div className="phone-notch"></div>
              <div className="phone-screen">
                <div className="preview-hero">
                  <img 
                    src="https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400&h=200&fit=crop" 
                    alt="果园"
                    className="hero-bg"
                  />
                  <div className="hero-content">
                    <h2>赣南脐橙</h2>
                    <p>批次: H20231128-A1</p>
                  </div>
                </div>
                
                <div className="preview-info">
                  <div className="info-item">
                    <span className="info-icon">🌱</span>
                    <div className="info-text">
                      <span className="info-label">产地</span>
                      <span className="info-value">江西省赣州市</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">📅</span>
                    <div className="info-text">
                      <span className="info-label">采摘日期</span>
                      <span className="info-value">2023-11-28</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">✅</span>
                    <div className="info-text">
                      <span className="info-label">质检结果</span>
                      <span className="info-value">农残检测合格</span>
                    </div>
                  </div>
                </div>

                <div className="preview-cta">
                  <button className="cta-btn">查看完整溯源档案</button>
                </div>
              </div>
            </div>
          </div>

          <div className="qr-code-display">
            <div className="qr-placeholder">
              <span className="qr-icon">📱</span>
              <span>扫码预览</span>
            </div>
            <p className="qr-hint">选择批次后可预览二维码</p>
          </div>

          <div className="qr-actions">
            <button className="qr-btn primary">📥 下载二维码</button>
            <button className="qr-btn">🖨️ 批量打印标签</button>
          </div>
        </div>
      </div>
    </div>
  );
};
