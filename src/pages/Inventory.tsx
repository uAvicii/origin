import { useState } from 'react';
import { useStore } from '../store/useStore';
import './Inventory.css';

export const Inventory = () => {
  const {
    grades,
    inventoryBatches,
    pickingRecords,
    getInventorySummary,
    getInventoryAlerts,
    addInventoryBatch,
    processPickingRecord,
    ageAlertThreshold,
  } = useStore();

  const [showSortingModal, setShowSortingModal] = useState(false);
  const [selectedPickingRecord, setSelectedPickingRecord] = useState('');
  const [consumedQuantity, setConsumedQuantity] = useState('');
  const [gradeItems, setGradeItems] = useState<Array<{ gradeId: string; quantity: number }>>([]);

  const inventorySummary = getInventorySummary();
  const alerts = getInventoryAlerts();
  const pendingPickingRecords = pickingRecords.filter((r) => r.status === 'pending');

  const handleAddGradeItem = () => {
    setGradeItems([...gradeItems, { gradeId: '', quantity: 0 }]);
  };

  const handleUpdateGradeItem = (index: number, field: 'gradeId' | 'quantity', value: string | number) => {
    const updated = [...gradeItems];
    updated[index] = { ...updated[index], [field]: value };
    setGradeItems(updated);
  };

  const handleRemoveGradeItem = (index: number) => {
    setGradeItems(gradeItems.filter((_, i) => i !== index));
  };

  const handleSubmitSorting = () => {
    if (!selectedPickingRecord || !consumedQuantity) {
      alert('请填写完整信息');
      return;
    }

    const totalGradeQuantity = gradeItems.reduce((sum, item) => sum + item.quantity, 0);
    if (totalGradeQuantity === 0) {
      alert('请至少添加一个等级品');
      return;
    }

    const consumed = parseFloat(consumedQuantity);
    const record = pendingPickingRecords.find((r) => r.id === selectedPickingRecord);
    if (!record) {
      alert('采摘记录不存在');
      return;
    }

    if (consumed > record.quantity) {
      alert('消耗数量不能大于待分拣数量');
      return;
    }

    // 创建批次
    const today = new Date().toISOString().split('T')[0];
    gradeItems.forEach((item) => {
      if (item.gradeId && item.quantity > 0) {
        const grade = grades.find((g) => g.id === item.gradeId);
        addInventoryBatch({
          gradeId: item.gradeId,
          gradeName: grade?.name || '',
          quantity: item.quantity,
          inStockDate: today,
          pickingRecordId: selectedPickingRecord,
        });
      }
    });

    // 如果全部消耗，标记为已处理
    if (consumed >= record.quantity) {
      processPickingRecord(selectedPickingRecord);
    }

    alert('分拣入库成功！');
    setShowSortingModal(false);
    setSelectedPickingRecord('');
    setConsumedQuantity('');
    setGradeItems([]);
  };

  const handleViewBatches = (gradeId: string) => {
    const batches = inventoryBatches.filter(
      (b) => b.gradeId === gradeId && b.quantity > 0
    );
    // 这里可以展开显示批次详情
    console.log('批次列表:', batches);
  };

  return (
    <div className="inventory">
      <div className="inventory-header">
        <h2 className="inventory-title">库存管理</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowSortingModal(true)}
        >
          📦 分拣入库
        </button>
      </div>

      {/* 库存预警 */}
      {alerts.length > 0 && (
        <div className="inventory-alerts">
          <h3 className="section-title">⚠️ 库存预警 ({alerts.length} 条)</h3>
          <div className="alert-list">
            {alerts.map((alert) => (
              <div key={alert.id} className="alert-item">
                <div className="alert-message">{alert.message}</div>
                <div className="alert-meta">
                  批次: {alert.batchNo} | 库龄: {alert.daysInStock} 天
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 库存汇总 */}
      <div className="inventory-summary">
        <h3 className="section-title">实时库存列表</h3>
        <div className="summary-grid">
          {inventorySummary.map((summary) => {
            const isAlert = summary.batches.some((b) => b.daysInStock >= ageAlertThreshold);
            return (
              <div
                key={summary.gradeId}
                className={`summary-card ${isAlert ? 'alert' : ''}`}
              >
                <div className="summary-header">
                  <div className="summary-grade">{summary.gradeName}</div>
                  <div className="summary-quantity">
                    {(summary.totalQuantity / 1000).toFixed(1)} 吨
                  </div>
                </div>
                <div className="summary-batches">
                  <div className="batch-count">共 {summary.batches.length} 个批次</div>
                  <button
                    className="btn-link"
                    onClick={() => handleViewBatches(summary.gradeId)}
                  >
                    查看批次
                  </button>
                </div>
                {isAlert && (
                  <div className="summary-alert">
                    ⚠️ 有批次超过 {ageAlertThreshold} 天
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 批次详情 */}
      <div className="inventory-batches">
        <h3 className="section-title">批次详情</h3>
        <div className="batch-table">
          <table>
            <thead>
              <tr>
                <th>批次号</th>
                <th>等级</th>
                <th>数量(斤)</th>
                <th>入库日期</th>
                <th>库龄(天)</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              {inventoryBatches
                .filter((b) => b.quantity > 0)
                .sort((a, b) => a.daysInStock - b.daysInStock)
                .map((batch) => {
                  const isAlert = batch.daysInStock >= ageAlertThreshold;
                  return (
                    <tr key={batch.id} className={isAlert ? 'alert-row' : ''}>
                      <td>{batch.batchNo}</td>
                      <td>{batch.gradeName}</td>
                      <td>{batch.quantity.toLocaleString()}</td>
                      <td>{batch.inStockDate}</td>
                      <td>
                        <span className={isAlert ? 'age-alert' : ''}>
                          {batch.daysInStock}
                        </span>
                      </td>
                      <td>
                        {isAlert ? (
                          <span className="status-badge alert">预警</span>
                        ) : (
                          <span className="status-badge normal">正常</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 分拣入库对话框 */}
      {showSortingModal && (
        <div className="modal-overlay" onClick={() => setShowSortingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">分拣入库</h3>

            <div className="form-group">
              <label>选择待分拣批次 *</label>
              <select
                value={selectedPickingRecord}
                onChange={(e) => setSelectedPickingRecord(e.target.value)}
                className="form-input"
              >
                <option value="">请选择</option>
                {pendingPickingRecords.map((record) => (
                  <option key={record.id} value={record.id}>
                    {record.orchardName} - {record.quantity} 斤 ({record.date})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>消耗数量(斤) *</label>
              <input
                type="number"
                value={consumedQuantity}
                onChange={(e) => setConsumedQuantity(e.target.value)}
                placeholder="请输入消耗数量"
                className="form-input"
                min="0"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label>分拣出的等级品 *</label>
              {gradeItems.map((item, index) => (
                <div key={index} className="grade-item-row">
                  <select
                    value={item.gradeId}
                    onChange={(e) =>
                      handleUpdateGradeItem(index, 'gradeId', e.target.value)
                    }
                    className="form-input"
                  >
                    <option value="">选择等级</option>
                    {grades.map((grade) => (
                      <option key={grade.id} value={grade.id}>
                        {grade.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={item.quantity || ''}
                    onChange={(e) =>
                      handleUpdateGradeItem(
                        index,
                        'quantity',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="数量(斤)"
                    className="form-input"
                    min="0"
                    step="0.1"
                  />
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRemoveGradeItem(index)}
                  >
                    删除
                  </button>
                </div>
              ))}
              <button className="btn btn-secondary" onClick={handleAddGradeItem}>
                ➕ 添加等级
              </button>
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowSortingModal(false)}
              >
                取消
              </button>
              <button className="btn btn-primary" onClick={handleSubmitSorting}>
                提交
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

