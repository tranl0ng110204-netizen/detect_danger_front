import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Button, Space, Typography, Badge } from 'antd';
import { 
  SafetyCertificateFilled, 
  LoginOutlined, 
  UserAddOutlined, 
  DashboardOutlined
} from '@ant-design/icons';
import useAuthStore from '../../store/useAuthStore';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const PublicLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const getDashboardPath = () => {
    let role = user?.role;
    if (Array.isArray(role) && role.length > 0) {
      role = role[0]?.authority || role[0];
    }
    if (role === 'ROLE_ADMIN' || role === 'ADMIN') return '/admin/users';
    if (role === 'ROLE_MODERATOR' || role === 'MODERATOR') return '/moderator/reports';
    return '/user/dashboard';
  };

  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Header 
        className="glass-header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          height: 68,
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(22, 119, 255, 0.3)'
          }}>
            <SafetyCertificateFilled style={{ fontSize: 22, color: '#fff' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', lineHeight: 1.2, letterSpacing: '-0.3px' }}>
              Detect<span style={{ color: '#1677ff' }}>Danger</span>
            </span>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>Hệ thống Đánh giá Rủi ro Số</span>
          </div>
        </Link>

        {/* Action Buttons */}
        <Space size="middle">
          {isAuthenticated ? (
            <Button 
              type="primary" 
              icon={<DashboardOutlined />}
              onClick={() => navigate(getDashboardPath())}
              style={{ borderRadius: 8, height: 38, fontWeight: 600 }}
            >
              Vào Không gian làm việc
            </Button>
          ) : (
            <>
              {location.pathname !== '/login' && (
                <Button 
                  type="text" 
                  icon={<LoginOutlined />}
                  onClick={() => navigate('/login')}
                  style={{ fontWeight: 600, color: '#334155' }}
                >
                  Đăng nhập
                </Button>
              )}
              {location.pathname !== '/register' && (
                <Button 
                  type="primary" 
                  icon={<UserAddOutlined />}
                  onClick={() => navigate('/register')}
                  style={{ borderRadius: 8, height: 38, fontWeight: 600 }}
                >
                  Đăng ký ngay
                </Button>
              )}
            </>
          )}
        </Space>
      </Header>

      {/* Main Content Area */}
      <Content style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </Content>

      {/* Modern Footer */}
      <Footer style={{ 
        background: '#ffffff', 
        borderTop: '1px solid #e2e8f0', 
        padding: '32px 48px',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SafetyCertificateFilled style={{ fontSize: 20, color: '#1677ff' }} />
            <Text strong style={{ color: '#0f172a' }}>DetectDanger Platform</Text>
            <Text type="secondary">© {new Date().getFullYear()} Bảo vệ an toàn không gian số</Text>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Badge status="processing" color="#10b981" />
            <Text style={{ fontSize: 13, color: '#475569' }}>
              Hệ thống phòng vệ đang trực tuyến 24/7
            </Text>
          </div>
        </div>
      </Footer>
    </Layout>
  );
};

export default PublicLayout;