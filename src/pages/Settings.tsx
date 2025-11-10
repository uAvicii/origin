import { useState } from 'react';
import { useStore } from '../store/useStore';
import './Settings.css';

export const Settings = () => {
  const {
    grades,
    orchards,
    customers,
    users,
    currentUser,
    ageAlertThreshold,
    addGrade,
    updateGrade,
    deleteGrade,
    addOrchard,
    updateOrchard,
    deleteOrchard,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    setCurrentUser,
    setAgeAlertThreshold,
  } = useStore();

  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showOrchardModal, setShowOrchardModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [editingGrade, setEditingGrade] = useState<{ id: string; name: string; code: string } | null>(null);
  const [editingOrchard, setEditingOrchard] = useState<{ id: string; name: string; description?: string } | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<{ id: string; name: string; phone?: string; address?: string } | null>(null);

  const [newGradeName, setNewGradeName] = useState('');
  const [newGradeCode, setNewGradeCode] = useState('');
  const [newOrchardName, setNewOrchardName] = useState('');
  const [newOrchardDesc, setNewOrchardDesc] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerAddress, setNewCustomerAddress] = useState('');

  const handleSaveGrade = () => {
    if (!newGradeName.trim() || !newGradeCode.trim()) {
      alert('请填写完整信息');
      return;
    }

    if (editingGrade) {
      updateGrade(editingGrade.id, { name: newGradeName.trim(), code: newGradeCode.trim() });
    } else {
      addGrade({ name: newGradeName.trim(), code: newGradeCode.trim() });
    }

    setShowGradeModal(false);
    setEditingGrade(null);
    setNewGradeName('');
    setNewGradeCode('');
  };

  const handleEditGrade = (grade: typeof grades[0]) => {
    setEditingGrade(grade);
    setNewGradeName(grade.name);
    setNewGradeCode(grade.code);
    setShowGradeModal(true);
  };

  const handleSaveOrchard = () => {
    if (!newOrchardName.trim()) {
      alert('请填写地块名称');
      return;
    }

    if (editingOrchard) {
      updateOrchard(editingOrchard.id, {
        name: newOrchardName.trim(),
        description: newOrchardDesc.trim() || undefined,
      });
    } else {
      addOrchard({
        name: newOrchardName.trim(),
        description: newOrchardDesc.trim() || undefined,
      });
    }

    setShowOrchardModal(false);
    setEditingOrchard(null);
    setNewOrchardName('');
    setNewOrchardDesc('');
  };

  const handleEditOrchard = (orchard: typeof orchards[0]) => {
    setEditingOrchard(orchard);
    setNewOrchardName(orchard.name);
    setNewOrchardDesc(orchard.description || '');
    setShowOrchardModal(true);
  };

  const handleSaveCustomer = () => {
    if (!newCustomerName.trim()) {
      alert('请填写客户名称');
      return;
    }

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, {
        name: newCustomerName.trim(),
        phone: newCustomerPhone.trim() || undefined,
        address: newCustomerAddress.trim() || undefined,
      });
    } else {
      addCustomer({
        name: newCustomerName.trim(),
        phone: newCustomerPhone.trim() || undefined,
        address: newCustomerAddress.trim() || undefined,
      });
    }

    setShowCustomerModal(false);
    setEditingCustomer(null);
    setNewCustomerName('');
    setNewCustomerPhone('');
    setNewCustomerAddress('');
  };

  const handleEditCustomer = (customer: typeof customers[0]) => {
    setEditingCustomer(customer);
    setNewCustomerName(customer.name);
    setNewCustomerPhone(customer.phone || '');
    setNewCustomerAddress(customer.address || '');
    setShowCustomerModal(true);
  };

  return (
    <div className="settings">
      <h2 className="settings-title">基础设置</h2>

      {/* 产品等级管理 */}
      <div className="settings-section">
        <div className="section-header">
          <h3 className="section-title">产品等级管理</h3>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingGrade(null);
              setNewGradeName('');
              setNewGradeCode('');
              setShowGradeModal(true);
            }}
          >
            ➕ 添加等级
          </button>
        </div>
        <div className="settings-list">
          {grades.map((grade) => (
            <div key={grade.id} className="settings-item">
              <div className="item-info">
                <div className="item-name">{grade.name}</div>
                <div className="item-code">代码: {grade.code}</div>
              </div>
              <div className="item-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEditGrade(grade)}
                >
                  编辑
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    if (confirm(`确定要删除等级 "${grade.name}" 吗？`)) {
                      deleteGrade(grade.id);
                    }
                  }}
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 地块管理 */}
      <div className="settings-section">
        <div className="section-header">
          <h3 className="section-title">地块管理</h3>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingOrchard(null);
              setNewOrchardName('');
              setNewOrchardDesc('');
              setShowOrchardModal(true);
            }}
          >
            ➕ 添加地块
          </button>
        </div>
        <div className="settings-list">
          {orchards.map((orchard) => (
            <div key={orchard.id} className="settings-item">
              <div className="item-info">
                <div className="item-name">{orchard.name}</div>
                {orchard.description && (
                  <div className="item-desc">{orchard.description}</div>
                )}
              </div>
              <div className="item-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEditOrchard(orchard)}
                >
                  编辑
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    if (confirm(`确定要删除地块 "${orchard.name}" 吗？`)) {
                      deleteOrchard(orchard.id);
                    }
                  }}
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 客户管理 */}
      <div className="settings-section">
        <div className="section-header">
          <h3 className="section-title">客户管理</h3>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingCustomer(null);
              setNewCustomerName('');
              setNewCustomerPhone('');
              setNewCustomerAddress('');
              setShowCustomerModal(true);
            }}
          >
            ➕ 添加客户
          </button>
        </div>
        <div className="settings-list">
          {customers.map((customer) => (
            <div key={customer.id} className="settings-item">
              <div className="item-info">
                <div className="item-name">{customer.name}</div>
                {customer.phone && <div className="item-desc">电话: {customer.phone}</div>}
                {customer.address && <div className="item-desc">地址: {customer.address}</div>}
              </div>
              <div className="item-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEditCustomer(customer)}
                >
                  编辑
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    if (confirm(`确定要删除客户 "${customer.name}" 吗？`)) {
                      deleteCustomer(customer.id);
                    }
                  }}
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 系统设置 */}
      <div className="settings-section">
        <h3 className="section-title">系统设置</h3>
        <div className="settings-item">
          <div className="item-info">
            <div className="item-name">库龄预警阈值</div>
            <div className="item-desc">当库存存放超过设定天数时，系统会发出预警</div>
          </div>
          <div className="item-actions">
            <input
              type="number"
              value={ageAlertThreshold}
              onChange={(e) => setAgeAlertThreshold(parseInt(e.target.value) || 7)}
              className="form-input"
              min="1"
            />
            <span style={{ marginLeft: '0.5rem' }}>天</span>
          </div>
        </div>
      </div>

      {/* 用户切换 */}
      <div className="settings-section">
        <h3 className="section-title">用户切换</h3>
        <div className="settings-list">
          {users.map((user) => (
            <div
              key={user.id}
              className={`settings-item ${currentUser?.id === user.id ? 'active' : ''}`}
              onClick={() => setCurrentUser(user)}
              style={{ cursor: 'pointer' }}
            >
              <div className="item-info">
                <div className="item-name">{user.name}</div>
                <div className="item-desc">
                  {user.role === 'admin' ? '管理员' :
                   user.role === 'warehouse' ? '仓库主管' : '采摘队长'}
                </div>
              </div>
              {currentUser?.id === user.id && (
                <div className="item-badge">当前用户</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 产品等级对话框 */}
      {showGradeModal && (
        <div className="modal-overlay" onClick={() => setShowGradeModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">
              {editingGrade ? '编辑等级' : '添加等级'}
            </h3>
            <div className="form-group">
              <label>等级名称 *</label>
              <input
                type="text"
                value={newGradeName}
                onChange={(e) => setNewGradeName(e.target.value)}
                placeholder="如：80-85mm"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>等级代码 *</label>
              <input
                type="text"
                value={newGradeCode}
                onChange={(e) => setNewGradeCode(e.target.value)}
                placeholder="如：80-85"
                className="form-input"
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowGradeModal(false)}
              >
                取消
              </button>
              <button className="btn btn-primary" onClick={handleSaveGrade}>
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 地块对话框 */}
      {showOrchardModal && (
        <div className="modal-overlay" onClick={() => setShowOrchardModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">
              {editingOrchard ? '编辑地块' : '添加地块'}
            </h3>
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
              <button
                className="btn btn-secondary"
                onClick={() => setShowOrchardModal(false)}
              >
                取消
              </button>
              <button className="btn btn-primary" onClick={handleSaveOrchard}>
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 客户对话框 */}
      {showCustomerModal && (
        <div className="modal-overlay" onClick={() => setShowCustomerModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">
              {editingCustomer ? '编辑客户' : '添加客户'}
            </h3>
            <div className="form-group">
              <label>客户名称 *</label>
              <input
                type="text"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                placeholder="请输入客户名称"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>联系电话</label>
              <input
                type="text"
                value={newCustomerPhone}
                onChange={(e) => setNewCustomerPhone(e.target.value)}
                placeholder="请输入联系电话"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>地址</label>
              <input
                type="text"
                value={newCustomerAddress}
                onChange={(e) => setNewCustomerAddress(e.target.value)}
                placeholder="请输入地址"
                className="form-input"
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowCustomerModal(false)}
              >
                取消
              </button>
              <button className="btn btn-primary" onClick={handleSaveCustomer}>
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

