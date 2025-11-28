import { useState } from 'react';
import { Link } from 'react-router-dom';
import './FarmingCalendar.css';

interface CalendarEvent {
  id: string;
  date: string;
  type: 'spray' | 'fertilize' | 'prune' | 'irrigate' | 'harvest' | 'inspect';
  title: string;
  zone: string;
  time?: string;
  status: 'scheduled' | 'completed' | 'in_progress';
}

export const FarmingCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 模拟日历事件
  const events: CalendarEvent[] = [
    { id: '1', date: '2023-11-28', type: 'fertilize', title: '秋季基肥施用', zone: 'A区', time: '08:00', status: 'scheduled' },
    { id: '2', date: '2023-11-29', type: 'spray', title: '红蜘蛛防治喷药', zone: 'B2区', time: '06:30', status: 'scheduled' },
    { id: '3', date: '2023-11-30', type: 'prune', title: '冬季修剪', zone: 'C区', status: 'scheduled' },
    { id: '4', date: '2023-12-01', type: 'irrigate', title: '灌溉作业', zone: 'A3区', time: '07:00', status: 'scheduled' },
    { id: '5', date: '2023-12-02', type: 'inspect', title: '病虫害巡检', zone: '全部', status: 'scheduled' },
    { id: '6', date: '2023-12-03', type: 'harvest', title: '采摘作业', zone: 'A1区', time: '06:00', status: 'scheduled' },
    { id: '7', date: '2023-11-25', type: 'fertilize', title: '叶面肥喷施', zone: 'B区', status: 'completed' },
    { id: '8', date: '2023-11-26', type: 'irrigate', title: '滴灌系统维护', zone: 'A区', status: 'completed' },
  ];

  const getTypeIcon = (type: CalendarEvent['type']) => {
    const icons = {
      spray: '💊',
      fertilize: '🌱',
      prune: '✂️',
      irrigate: '💧',
      harvest: '🍊',
      inspect: '🔍',
    };
    return icons[type];
  };

  // 生成日历天数
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const days = [];

    // 上月填充
    for (let i = 0; i < startPadding; i++) {
      const prevDate = new Date(year, month, -startPadding + i + 1);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // 当月
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    // 下月填充
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }

    return days;
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getEventsForDate = (date: Date) => {
    const dateKey = formatDateKey(date);
    return events.filter(e => e.date === dateKey);
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const selectedEvents = selectedDate 
    ? events.filter(e => e.date === selectedDate)
    : [];

  const upcomingEvents = events
    .filter(e => e.status === 'scheduled')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  return (
    <div className="farming-calendar">
      {/* 面包屑导航 */}
      <div className="breadcrumb">
        <Link to="/">首页</Link>
        <span className="separator">/</span>
        <Link to="/farming">农事管理</Link>
        <span className="separator">/</span>
        <span className="current">农事计划与日历</span>
      </div>

      <div className="calendar-layout">
        {/* 左侧日历 */}
        <div className="calendar-main">
          <div className="calendar-header">
            <button className="nav-btn" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
              ◀
            </button>
            <h2 className="calendar-title">
              {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
            </h2>
            <button className="nav-btn" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
              ▶
            </button>
            <button className="today-btn" onClick={() => setCurrentMonth(new Date())}>
              今天
            </button>
          </div>

          <div className="calendar-grid">
            <div className="calendar-weekdays">
              {weekDays.map(day => (
                <div key={day} className="weekday">{day}</div>
              ))}
            </div>
            <div className="calendar-days">
              {calendarDays.map((day, index) => {
                const dateKey = formatDateKey(day.date);
                const dayEvents = getEventsForDate(day.date);
                const isToday = formatDateKey(new Date()) === dateKey;
                const isSelected = selectedDate === dateKey;

                return (
                  <div
                    key={index}
                    className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${dayEvents.length > 0 ? 'has-events' : ''}`}
                    onClick={() => setSelectedDate(dateKey)}
                  >
                    <span className="day-number">{day.date.getDate()}</span>
                    {dayEvents.length > 0 && (
                      <div className="day-events">
                        {dayEvents.slice(0, 2).map(event => (
                          <div key={event.id} className={`event-dot ${event.type}`} title={event.title}>
                            {getTypeIcon(event.type)}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <span className="more-events">+{dayEvents.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 图例 */}
          <div className="calendar-legend">
            <div className="legend-item"><span className="legend-icon">💊</span> 打药</div>
            <div className="legend-item"><span className="legend-icon">🌱</span> 施肥</div>
            <div className="legend-item"><span className="legend-icon">✂️</span> 修剪</div>
            <div className="legend-item"><span className="legend-icon">💧</span> 灌溉</div>
            <div className="legend-item"><span className="legend-icon">🍊</span> 采摘</div>
            <div className="legend-item"><span className="legend-icon">🔍</span> 巡检</div>
          </div>
        </div>

        {/* 右侧面板 */}
        <div className="calendar-sidebar">
          {/* 选中日期的事件 */}
          {selectedDate && (
            <div className="sidebar-section">
              <h3 className="section-title">📅 {selectedDate} 农事安排</h3>
              {selectedEvents.length > 0 ? (
                <div className="event-list">
                  {selectedEvents.map(event => (
                    <div key={event.id} className={`event-card ${event.status}`}>
                      <div className="event-icon">{getTypeIcon(event.type)}</div>
                      <div className="event-content">
                        <div className="event-title">{event.title}</div>
                        <div className="event-meta">
                          <span>📍 {event.zone}</span>
                          {event.time && <span>🕐 {event.time}</span>}
                        </div>
                      </div>
                      <span className={`event-status ${event.status}`}>
                        {event.status === 'completed' ? '已完成' : event.status === 'in_progress' ? '进行中' : '待执行'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-events">当日暂无农事安排</div>
              )}
            </div>
          )}

          {/* 近期待办 */}
          <div className="sidebar-section">
            <h3 className="section-title">⏰ 近期待办</h3>
            <div className="upcoming-list">
              {upcomingEvents.map(event => (
                <div key={event.id} className="upcoming-item">
                  <div className="upcoming-date">{event.date.slice(5)}</div>
                  <div className="upcoming-content">
                    <span className="upcoming-icon">{getTypeIcon(event.type)}</span>
                    <span className="upcoming-title">{event.title}</span>
                  </div>
                  <span className="upcoming-zone">{event.zone}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 快捷操作 */}
          <div className="sidebar-section">
            <h3 className="section-title">⚡ 快捷操作</h3>
            <div className="quick-actions">
              <Link to="/farming/tasks" className="quick-btn">
                ➕ 新建农事任务
              </Link>
              <button className="quick-btn secondary">
                📥 导入计划
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
