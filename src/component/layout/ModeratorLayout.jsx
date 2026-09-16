import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar, Space, Typography, Tag } from 'antd';
import { 
  LogoutOutlined, 
  UserOutlined, 
  FileSearchOutlined, 
  SafetyCertificateFilled,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import useAuthStore from '../../store/useAuthStore';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const ModeratorLayout = () => {
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
      key: '/moderator/reports', 
      icon: <FileSearchOutlined style={{ fontSize: 16 }} />, 
      label: 'Duyệt & Thẩm định báo cáo' 
    },
  ];

  const getSelectedKey = () => {
    const current = menuItems.find(item => location.pathname.startsWith(item.key));
    return current ? [current.key] : ['/moderator/reports'];
  };

  const userMenuItems = [
    {
      key: 'mod-info',
      label: (
        <div style={{ padding: '6px 4px' }}>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>{user?.sub || 'Kiểm duyệt viên'}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>{user?.email || 'moderator@DetectDanger.vn'}</div>
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
            background: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)',
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
              <Tag color="purple" style={{ fontSize: 10, lineHeight: '16px', padding: '0 6px', margin: 0, border: 'none' }}>
                MODERATOR DESK
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
              Kiểm duyệt viên: <span style={{ color: '#722ed1' }}>{user?.sub || 'Moderator'}</span>
            </Text>
            <Tag icon={<SafetyCertificateOutlined />} color="purple">Quyền thẩm định báo cáo</Tag>
          </Space>

          <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar style={{ backgroundColor: '#722ed1' }} icon={<UserOutlined />} />
              <Text strong style={{ color: '#0f172a' }}>{user?.email || 'mod@DetectDanger.vn'}</Text>
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

export default ModeratorLayout;