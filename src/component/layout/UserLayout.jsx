import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Dropdown, Avatar, Space, Typography, Tag, Tooltip } from 'antd';
import { 
  LogoutOutlined, 
  UserOutlined, 
  FileTextOutlined, 
  PlusCircleOutlined, 
  DashboardOutlined,
  SafetyCertificateFilled,
  RadarChartOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import useAuthStore from '../../store/useAuthStore';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const UserLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { user, reputationScore, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { 
      key: '/user/dashboard', 
      icon: <DashboardOutlined style={{ fontSize: 16 }} />, 
      label: 'Bảng điều khiển' 
    },
    { 
      key: '/user/scan/history', 
      icon: <RadarChartOutlined style={{ fontSize: 16 }} />, 
      label: 'Lịch sử quét rủi ro' 
    },
    { 
      key: '/user/create-report', 
      icon: <PlusCircleOutlined style={{ fontSize: 16 }} />, 
      label: 'Tạo báo cáo vi phạm' 
    },
    { 
      key: '/user/history', 
      icon: <FileTextOutlined style={{ fontSize: 16 }} />, 
      label: 'Lịch sử báo cáo' 
    },
  ];

  // Map current location to active menu key
  const getSelectedKey = () => {
    const current = menuItems.find(item => location.pathname.startsWith(item.key));
    return current ? [current.key] : ['/user/dashboard'];
  };

  const userMenuItems = [
    {
      key: 'user-info',
      label: (
        <div style={{ padding: '6px 4px' }}>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>{user?.sub || 'Người dùng'}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>{user?.email || 'user@example.com'}</div>
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: 'Đăng xuất tài khoản',
      icon: <LogoutOutlined style={{ color: '#ef4444' }} />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sleek Sider */}
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(val) => setCollapsed(val)}
        width={250}
        style={{
          background: '#0f172a',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)',
          zIndex: 10,
        }}
      >
        {/* Brand in Sidebar */}
        <div style={{
          height: 68,
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          gap: 12,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <SafetyCertificateFilled style={{ fontSize: 20, color: '#fff' }} />
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: 16 }}>DetectDanger</div>
              <div style={{ color: '#64748b', fontSize: 11 }}>Cổng bảo vệ người dùng</div>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <div style={{ padding: '16px 0' }}>
          <Menu 
            theme="dark" 
            mode="inline" 
            selectedKeys={getSelectedKey()}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ background: 'transparent' }}
          />
        </div>
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Top Header */}
        <Header 
          style={{ 
            background: '#ffffff', 
            padding: '0 28px', 
            height: 68,
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
          }}
        >
          {/* Header Left: Greeting & Reputation */}
          <Space size="middle">
            <Text style={{ fontSize: 16, fontWeight: 600, color: '#0f172a' }}>
              Xin chào, <span style={{ color: '#1677ff' }}>{user?.sub || 'User'}</span>
            </Text>
            <Tooltip title="Điểm uy tín của tài khoản trong hệ thống">
              <Tag 
                icon={<TrophyOutlined style={{ color: '#f59e0b' }} />} 
                color="gold" 
                style={{ 
                  borderRadius: 20, 
                  padding: '2px 10px', 
                  fontSize: 13, 
                  fontWeight: 600 
                }}
              >
                Uy tín: {reputationScore ?? 100}
              </Tag>
            </Tooltip>
          </Space>

          {/* Header Right: Quick Create & User Profile */}
          <Space size="large">
            <Button 
              type="primary" 
              icon={<PlusCircleOutlined />}
              onClick={() => navigate('/user/create-report')}
              style={{ borderRadius: 8, height: 38 }}
            >
              Báo cáo vi phạm
            </Button>

            <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar 
                  style={{ 
                    backgroundColor: '#1677ff', 
                    boxShadow: '0 2px 6px rgba(22, 119, 255, 0.3)' 
                  }} 
                  icon={<UserOutlined />} 
                />
                <div style={{ display: 'none', md: { display: 'block' } }}>
                  <Text strong style={{ color: '#0f172a' }}>{user?.sub}</Text>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* Content Body */}
        <Content style={{ margin: '24px 28px', minHeight: 'calc(100vh - 120px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserLayout;