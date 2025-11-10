import { useState } from 'react';
import { useStore } from '../store/useStore';
import './Orchard.css';

export const Orchard = () => {
  const { orchards, pickingRecords, addOrchard, addPickingRecord } = useStore();
  const [showAddOrchard, setShowAddOrchard] = useState(false);
  const [showAddPicking, setShowAddPicking] = useState(false);
  const [newOrchardName, setNewOrchardName] = useState('');
  const [newOrchardDesc, setNewOrchardDesc] = useState('');
  const [selectedOrchardId, setSelectedOrchardId] = useState('');
  const [pickingQuantity, setPickingQuantity] = useState('');
  const [pickingUnit, setPickingUnit] = useState<'jin' | 'basket'>('jin');

  const handleAddOrchard = () => {
    if (newOrchardName.trim()) {
      addOrchard({
        name: newOrchardName.trim(),
        description: newOrchardDesc.trim() || undefined,
      });
      setNewOrchardName('');
      setNewOrchardDesc('');
      setShowAddOrchard(false);
    }
  };

  const handleAddPicking = () => {
    if (selectedOrchardId && pickingQuantity) {
      const quantity = parseFloat(pickingQuantity);
      if (quantity > 0) {
        const orchard = orchards.find((o) => o.id === selectedOrchardId);
        addPickingRecord({
          orchardId: selectedOrchardId,
          orchardName: orchard?.name || '',
          quantity: quantity,
          unit: pickingUnit,
          date: new Date().toISOString().split('T')[0],
          status: 'pending',
        });
        setSelectedOrchardId('');
        setPickingQuantity('');
        setShowAddPicking(false);
        alert('采摘记录已添加！');
      }
    }
  };

  const pendingRecords = pickingRecords.filter((r) => r.status === 'pending');
  const processedRecords = pickingRecords.filter((r) => r.status === 'processed');

  // 按地块统计
  const orchardStats = orchards.map((orchard) => {
    const records = pickingRecords.filter((r) => r.orchardId === orchard.id);
    const totalQuantity = records.reduce((sum, r) => sum + r.quantity, 0);
    const pendingQuantity = records
      .filter((r) => r.status === 'pending')
      .reduce((sum, r) => sum + r.quantity, 0);
    return {
      ...orchard,
      totalQuantity,
      pendingQuantity,
      recordCount: records.length,
    };
  });

  return (
    <div className="orchard">
      <div className="orchard-header">
        <h2 className="orchard-title">果园管理</h2>
        <div className="orchard-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowAddOrchard(true)}
          >
            ➕ 添加地块
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddPicking(true)}
          >
            📝 采摘入账
          </button>
        </div>
      </div>

      {/* 地块统计 */}
      <div className="orchard-stats">
        <h3 className="section-title">地块统计</h3>
        <div className="stats-grid">
          {orchardStats.map((stat) => (
            <div key={stat.id} className="stat-card">
              <div className="stat-name">{stat.name}</div>
              <div className="stat-detail">
                <div>总采摘: {(stat.totalQuantity / 1000).toFixed(1)} 吨</div>
                <div>待分拣: {(stat.pendingQuantity / 1000).toFixed(1)} 吨</div>
                <div>记录数: {stat.recordCount} 条</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 待分拣记录 */}
      {pendingRecords.length > 0 && (
        <div className="orchard-section">
          <h3 className="section-title">待分拣记录</h3>
          <div className="record-list">
            {pendingRecords.map((record) => (
              <div key={record.id} className="record-card pending">
                <div className="record-header">
                  <span className="record-orchard">{record.orchardName}</span>
                  <span className="record-date">{record.date}</span>
                </div>
                <div className="record-quantity">
                  {record.quantity} {record.unit === 'jin' ? '斤' : '筐'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 历史记录 */}
      <div className="orchard-section">
        <h3 className="section-title">历史记录</h3>
        <div className="record-list">
          {processedRecords.slice(0, 20).map((record) => (
            <div key={record.id} className="record-card">
              <div className="record-header">
                <span className="record-orchard">{record.orchardName}</span>
                <span className="record-date">{record.date}</span>
              </div>
              <div className="record-quantity">
                {record.quantity} {record.unit === 'jin' ? '斤' : '筐'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 添加地块对话框 */}
      {showAddOrchard && (
        <div className="modal-overlay" onClick={() => setShowAddOrchard(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">添加地块</h3>
            <div className="form-group">
              <label>地块名称 *</label>
              <input
                type="text"
                value={newOrchardName}
                onChange={(e) => setNewOrchardName(e.target.value)}
                placeholder="如：东山、A区"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>地块描述</label>
              <input
                type="text"
                value={newOrchardDesc}
                onChange={(e) => setNewOrchardDesc(e.target.value)}
                placeholder="如：东山坡地"
                className="form-input"
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowAddOrchard(false)}>
                取消
              </button>
              <button className="btn btn-primary" onClick={handleAddOrchard}>
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 采摘入账对话框 */}
      {showAddPicking && (
        <div className="modal-overlay" onClick={() => setShowAddPicking(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">采摘入账</h3>
            <div className="form-group">
              <label>选择地块 *</label>
              <select
                value={selectedOrchardId}
                onChange={(e) => setSelectedOrchardId(e.target.value)}
                className="form-input"
              >
                <option value="">请选择地块</option>
                {orchards.map((orchard) => (
                  <option key={orchard.id} value={orchard.id}>
                    {orchard.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>数量 *</label>
              <input
                type="number"
                value={pickingQuantity}
                onChange={(e) => setPickingQuantity(e.target.value)}
                placeholder="请输入数量"
                className="form-input"
                min="0"
                step="0.1"
              />
            </div>
            <div className="form-group">
              <label>单位 *</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    value="jin"
                    checked={pickingUnit === 'jin'}
                    onChange={(e) => setPickingUnit(e.target.value as 'jin' | 'basket')}
                  />
                  斤
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    value="basket"
                    checked={pickingUnit === 'basket'}
                    onChange={(e) => setPickingUnit(e.target.value as 'jin' | 'basket')}
                  />
                  筐
                </label>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowAddPicking(false)}>
                取消
              </button>
              <button className="btn btn-primary" onClick={handleAddPicking}>
                提交
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

