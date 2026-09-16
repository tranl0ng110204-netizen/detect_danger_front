import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicLayout from '../component/layout/PublicLayout';
import UserLayout from '../component/layout/UserLayout';
import ModeratorLayout from '../component/layout/ModeratorLayout';
import AdminLayout from '../component/layout/AdminLayout';

// Public
import Login from '../pages/LoginPage';
import Register from '../pages/RegisterPage';
import Unauthorized from '../pages/UnauthorizedPage';
import HomePage from '../pages/HomePage';


// User
import UserDashboard from '../pages/User/DashBoard';
import CreateReport from '../pages/User/CreateReport';
import ReportHistory from '../pages/User/ReportHistory';
import ScanResult from '../pages/User/ScanResult';
import ScanHistory from '../pages/User/ScanHistory';
import UserReportDetail from '../pages/User/UserReportDetail';

// Moderator
import ReviewReports from '../pages/Moderator/ReviewReports';
import ReportDetail from '../pages/Moderator/ReportDetail';

// Admin
import ManageUsers from '../pages/Admin/ManageUsers';
import ManageReports from '../pages/Admin/ManageReports';
import AuditLogs from '../pages/Admin/AuditLogs';
import ManageRules from '../pages/Admin/ManageRules';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>

        {/* User – cho phép ROLE_USER */}
        <Route element={<ProtectedRoute allowedRoles={['ROLE_USER']} />}>
          <Route element={<UserLayout />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/create-report" element={<CreateReport />} />
            <Route path="/user/history" element={<ReportHistory />} />
            <Route path="/user/scan/result" element={<ScanResult/>}/>
            <Route path="/user/scan/history" element={<ScanHistory/>}/>
            <Route path="/user/report/detail" element={<UserReportDetail/>}/>
          </Route>
        </Route>

        {/* Moderator – cho phép ROLE_MODERATOR */}
        <Route element={<ProtectedRoute allowedRoles={['ROLE_MODERATOR']} />}>
          <Route element={<ModeratorLayout />}>
            <Route path="/moderator/reports" element={<ReviewReports />} />
            <Route path="/moderator/report/:id/review" element={<ReportDetail />} />
          </Route>
        </Route>

        {/* Admin – cho phép ROLE_ADMIN */}
        <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/reports" element={<ManageReports />} />
            <Route path="/admin/audits" element={<AuditLogs />} />
            <Route path="/admin/rules" element={<ManageRules />} />
          </Route>
        </Route>

        {/* Default */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};


export default AppRoutes;