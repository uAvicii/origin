import { useState } from 'react';
import { Link } from 'react-router-dom';
import './FarmingTasks.css';

interface Task {
  id: string;
  priority: 'high' | 'medium' | 'low';
  type: 'spray' | 'fertilize' | 'prune' | 'irrigate' | 'weed';
  name: string;
  zone: string;
  deadline: string;
  assignee: string;
  status: 'pending' | 'in_progress' | 'overdue' | 'completed';
}

export const FarmingTasks = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  // 模拟任务数据
  const tasks: Task[] = [
    {
      id: '1',
      priority: 'high',
      type: 'spray',
      name: '红蜘蛛防治',
      zone: 'B2区',
      deadline: '2023-11-01',
      assignee: '张三',
      status: 'in_progress',
    },
    {
      id: '2',
      priority: 'medium',
      type: 'fertilize',
      name: '秋季基肥施用',
      zone: 'A区全部',
      deadline: '2023-11-05',
      assignee: '李四',
      status: 'pending',
    },
    {
      id: '3',
      priority: 'low',
      type: 'prune',
      name: '冬季清园修剪',
      zone: 'C区',
      deadline: '2023-11-20',
      assignee: '王五',
      status: 'pending',
    },
    {
      id: '4',
      priority: 'high',
      type: 'irrigate',
      name: 'A3区紧急补水',
      zone: 'A3区',
      deadline: '2023-10-30',
      assignee: '系统',
      status: 'overdue',
    },
    {
      id: '5',
      priority: 'medium',
      type: 'weed',
      name: '果园除草作业',
      zone: 'B区',
      deadline: '2023-11-08',
      assignee: '赵六',
      status: 'completed',
    },
  ];

  const assignees = ['张三', '李四', '王五', '赵六', '系统'];

  const getTypeLabel = (type: Task['type']) => {
    const labels = {
      spray: '打药',
      fertilize: '施肥',
      prune: '修剪',
      irrigate: '灌溉',
      weed: '除草',
    };
    return labels[type];
  };

  const getTypeIcon = (type: Task['type']) => {
    const icons = {
      spray: '💊',
      fertilize: '🌱',
      prune: '✂️',
      irrigate: '💧',
      weed: '🌿',
    };
    return icons[type];
  };

  const getPriorityLabel = (priority: Task['priority']) => {
    const labels = { high: '高', medium: '中', low: '低' };
    return labels[priority];
  };

  const getStatusLabel = (status: Task['status']) => {
    const labels = {
      pending: '待开始',
      in_progress: '进行中',
      overdue: '已逾期',
      completed: '已完成',
    };
    return labels[status];
  };

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    if (typeFilter !== 'all' && task.type !== typeFilter) return false;
    if (assigneeFilter !== 'all' && task.assignee !== assigneeFilter) return false;
    if (searchQuery && !task.name.includes(searchQuery) && !task.zone.includes(searchQuery)) return false;
    return true;
  });

  return (
    <div className="farming-tasks">
      {/* 面包屑导航 */}
      <div className="breadcrumb">
        <Link to="/">首页</Link>
        <span className="separator">/</span>
        <Link to="/farming">农事管理</Link>
        <span className="separator">/</span>
        <span className="current">任务工单系统</span>
      </div>

      {/* 顶部筛选工具栏 */}
      <div className="filter-toolbar">
        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">全部状态</option>
            <option value="pending">待开始</option>
            <option value="in_progress">进行中</option>
            <option value="overdue">已逾期</option>
            <option value="completed">已完成</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">全部类型</option>
            <option value="spray">打药</option>
            <option value="fertilize">施肥</option>
            <option value="prune">修剪</option>
            <option value="irrigate">灌溉</option>
            <option value="weed">除草</option>
          </select>

          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">全部负责人</option>
            {assignees.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div className="filter-right">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="搜索任务..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <button className="new-task-btn" onClick={() => setShowNewTaskModal(true)}>
            ➕ 新建农事任务
          </button>
        </div>
      </div>

      {/* 任务列表表格 */}
      <div className="task-table-container">
        <table className="task-table">
          <thead>
            <tr>
              <th className="col-priority">优先级</th>
              <th className="col-name">任务名称</th>
              <th className="col-zone">关联地块</th>
              <th className="col-deadline">截止时间</th>
              <th className="col-assignee">负责人</th>
              <th className="col-status">状态</th>
              <th className="col-actions">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className={`task-row ${task.status}`}>
                <td className="col-priority">
                  <span className={`priority-badge ${task.priority}`}>
                    {task.priority === 'high' && '🔴'}
                    {task.priority === 'medium' && '🟠'}
                    {task.priority === 'low' && '🟢'}
                    {getPriorityLabel(task.priority)}
                  </span>
                </td>
                <td className="col-name">
                  <div className="task-name">
                    <span className="task-type-badge">
                      {getTypeIcon(task.type)} {getTypeLabel(task.type)}
                    </span>
                    <span className="task-title">{task.name}</span>
                  </div>
                </td>
                <td className="col-zone">{task.zone}</td>
                <td className="col-deadline">{task.deadline}</td>
                <td className="col-assignee">{task.assignee}</td>
                <td className="col-status">
                  <span className={`status-badge ${task.status}`}>
                    {task.status === 'in_progress' && '🟠'}
                    {task.status === 'pending' && '⚪'}
                    {task.status === 'overdue' && '🔴'}
                    {task.status === 'completed' && '✅'}
                    {getStatusLabel(task.status)}
                  </span>
                </td>
                <td className="col-actions">
                  <div className="action-buttons">
                    <button className="action-btn view">查看</button>
                    {task.status === 'in_progress' && (
                      <button className="action-btn complete">完成</button>
                    )}
                    {task.status === 'pending' && (
                      <button className="action-btn assign">指派</button>
                    )}
                    {task.status === 'overdue' && (
                      <button className="action-btn urgent">催办</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页控件 */}
      <div className="pagination">
        <span className="pagination-info">1-{filteredTasks.length} 共 {tasks.length} 条任务</span>
        <div className="pagination-buttons">
          <button className="page-btn" disabled>&lt;</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn">4</button>
          <button className="page-btn">5</button>
          <button className="page-btn">&gt;</button>
        </div>
      </div>

      {/* 新建任务弹窗 */}
      {showNewTaskModal && (
        <div className="modal-overlay" onClick={() => setShowNewTaskModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">新建农事任务</h3>
            
            <div className="form-group">
              <label>任务类型 *</label>
              <select className="form-input">
                <option value="">请选择任务类型</option>
                <option value="spray">打药</option>
                <option value="fertilize">施肥</option>
                <option value="prune">修剪</option>
                <option value="irrigate">灌溉</option>
                <option value="weed">除草</option>
              </select>
            </div>

            <div className="form-group">
              <label>任务名称 *</label>
              <input type="text" className="form-input" placeholder="请输入任务名称" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>关联地块 *</label>
                <select className="form-input">
                  <option value="">请选择地块</option>
                  <option value="A">A区</option>
                  <option value="B">B区</option>
                  <option value="C">C区</option>
                </select>
              </div>

              <div className="form-group">
                <label>优先级 *</label>
                <select className="form-input">
                  <option value="medium">中</option>
                  <option value="high">高</option>
                  <option value="low">低</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>截止时间 *</label>
                <input type="date" className="form-input" />
              </div>

              <div className="form-group">
                <label>负责人</label>
                <select className="form-input">
                  <option value="">请选择负责人</option>
                  {assignees.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>任务描述</label>
              <textarea className="form-input textarea" placeholder="请输入任务详细描述..." rows={3}></textarea>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowNewTaskModal(false)}>
                取消
              </button>
              <button className="btn btn-primary">
                创建任务
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
