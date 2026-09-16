import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar, Space, Typography, Tag } from 'antd';
import { 
  LogoutOutlined, 
  UserOutlined, 
  FileTextOutlined, 
  AuditOutlined, 
  SafetyCertificateFilled,
  CrownOutlined
} from '@ant-design/icons';
import useAuthStore from '../../store/useAuthStore.js';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { 
      key: '/admin/users', 
      icon: <UserOutlined style={{ fontSize: 16 }} />, 
      label: 'Quản lý người dùng' 
    },
    { 
      key: '/admin/reports', 
      icon: <FileTextOutlined style={{ fontSize: 16 }} />, 
      label: 'Quản lý báo cáo' 
    },
    { 
      key: '/admin/audits', 
      icon: <AuditOutlined style={{ fontSize: 16 }} />, 
      label: 'Nhật ký kiểm toán' 
    },
    { 
      key: '/admin/rules', 
      icon: <AuditOutlined style={{ fontSize: 16 }} />, 
      label: 'Các rule kiểm tra vi phạm' 
    },
  ];

  const getSelectedKey = () => {
    const current = menuItems.find(item => location.pathname.startsWith(item.key));
    return current ? [current.key] : ['/admin/users'];
  };

  const userMenuItems = [
    {
      key: 'admin-info',
      label: (
        <div style={{ padding: '6px 4px' }}>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>{user?.sub || user?.name || 'Administrator'}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>{user?.email || 'admin@DetectDanger.vn'}</div>
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined style={{ color: '#ef4444' }} />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
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
            background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
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
              <Tag color="red" style={{ fontSize: 10, lineHeight: '16px', padding: '0 6px', margin: 0, border: 'none' }}>
                ADMIN CONSOLE
              </Tag>
            </div>
          )}
        </div>

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

      <Layout>
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
          <Space size="middle">
            <Text style={{ fontSize: 16, fontWeight: 600, color: '#0f172a' }}>
              Quản trị viên: <span style={{ color: '#ef4444' }}>{user?.name || user?.sub || 'Admin'}</span>
            </Text>
            <Tag icon={<CrownOutlined />} color="red">Toàn quyền hệ thống</Tag>
          </Space>

          <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar style={{ backgroundColor: '#ef4444' }} icon={<UserOutlined />} />
              <Text strong style={{ color: '#0f172a' }}>{user?.email || 'admin@DetectDanger.vn'}</Text>
            </Space>
          </Dropdown>
        </Header>

        <Content style={{ margin: '24px 28px', minHeight: 'calc(100vh - 120px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;