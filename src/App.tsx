import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Orchard } from './pages/Orchard';
import { OrchardMap } from './pages/OrchardMap';
import { IotMonitor } from './pages/IotMonitor';
import { VideoMonitor } from './pages/VideoMonitor';
import { FarmingCalendar } from './pages/FarmingCalendar';
import { FarmingTasks } from './pages/FarmingTasks';
import { PestAI } from './pages/PestAI';
import { PestRecords } from './pages/PestRecords';
import { YieldEstimate } from './pages/YieldEstimate';
import { HarvestBatch } from './pages/HarvestBatch';
import { TraceQRCode } from './pages/TraceQRCode';
import { ColdStorage } from './pages/ColdStorage';
import { Inventory } from './pages/Inventory';
import { Logistics } from './pages/Logistics';
import { Order } from './pages/Order';
import { CRM } from './pages/CRM';
import { SalesAnalytics } from './pages/SalesAnalytics';
import { Finance } from './pages/Finance';
import { Settings } from './pages/Settings';
import { useStore } from './store/useStore';
import './App.css';

// 路由保护组件
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useStore();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 登录页 */}
        <Route path="/login" element={<Login />} />
        
        {/* 受保护的路由 */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/orchard" element={<ProtectedRoute><Orchard /></ProtectedRoute>} />
        <Route path="/orchard/map" element={<ProtectedRoute><OrchardMap /></ProtectedRoute>} />
        <Route path="/orchard/iot" element={<ProtectedRoute><IotMonitor /></ProtectedRoute>} />
        <Route path="/orchard/video" element={<ProtectedRoute><VideoMonitor /></ProtectedRoute>} />
        <Route path="/farming/calendar" element={<ProtectedRoute><FarmingCalendar /></ProtectedRoute>} />
        <Route path="/farming/tasks" element={<ProtectedRoute><FarmingTasks /></ProtectedRoute>} />
        <Route path="/farming/materials" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
        <Route path="/pest/ai" element={<ProtectedRoute><PestAI /></ProtectedRoute>} />
        <Route path="/pest/records" element={<ProtectedRoute><PestRecords /></ProtectedRoute>} />
        <Route path="/harvest/estimate" element={<ProtectedRoute><YieldEstimate /></ProtectedRoute>} />
        <Route path="/harvest/batch" element={<ProtectedRoute><HarvestBatch /></ProtectedRoute>} />
        <Route path="/harvest/trace" element={<ProtectedRoute><TraceQRCode /></ProtectedRoute>} />
        <Route path="/warehouse/cold" element={<ProtectedRoute><ColdStorage /></ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
        <Route path="/warehouse/logistics" element={<ProtectedRoute><Logistics /></ProtectedRoute>} />
        <Route path="/order" element={<ProtectedRoute><Order /></ProtectedRoute>} />
        <Route path="/crm" element={<ProtectedRoute><CRM /></ProtectedRoute>} />
        <Route path="/analytics/sales" element={<ProtectedRoute><SalesAnalytics /></ProtectedRoute>} />
        <Route path="/finance" element={<ProtectedRoute><Finance /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        
        {/* 默认重定向 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
