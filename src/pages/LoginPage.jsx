import { useEffect } from 'react';
import { Form, Input, Button, message, Typography, Divider } from 'antd';
import { MailOutlined, LockOutlined, SafetyCertificateFilled, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const { isAuthenticated, user } = useAuthStore();
  const [form] = Form.useForm();

  // Điều hướng sau khi đăng nhập thành công
  useEffect(() => {
    if (isAuthenticated && user) {
      let role = user.role;
      if (Array.isArray(role) && role.length > 0) {
        role = role[0]?.authority || role[0];
      }
      if (role === 'ROLE_ADMIN' || role === 'ADMIN') navigate('/admin/users');
      else if (role === 'ROLE_MODERATOR' || role === 'MODERATOR') navigate('/moderator/reports');
      else navigate('/user/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const onFinish = async (values) => {
    const result = await login(values.email, values.password);
    if (!result.success) {
      message.error(result.error || 'Sai email hoặc mật khẩu');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ padding: '36px 32px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 16px rgba(22, 119, 255, 0.35)',
            marginBottom: 12
          }}>
            <SafetyCertificateFilled style={{ fontSize: 26, color: '#fff' }} />
          </div>
          <Title level={3} style={{ fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>
            Đăng nhập DetectDanger
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Cổng thẩm định & phân tích rủi ro an toàn số
          </Text>
        </div>

        {/* Login Form */}
        <Form form={form} onFinish={onFinish} layout="vertical" size="large">
          <Form.Item 
            name="email" 
            rules={[
              { required: true, message: 'Vui lòng nhập địa chỉ email' },
              { type: 'email', message: 'Email không đúng định dạng' }
            ]}
          >
            <Input 
              prefix={<MailOutlined style={{ color: '#94a3b8', marginRight: 6 }} />} 
              placeholder="Địa chỉ email của bạn" 
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item 
            name="password" 
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: '#94a3b8', marginRight: 6 }} />} 
              placeholder="Mật khẩu" 
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 24, marginBottom: 16 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
              icon={<ArrowRightOutlined />}
              style={{ 
                height: 44, 
                borderRadius: 8, 
                fontWeight: 700,
                fontSize: 15,
                background: '#1677ff',
                boxShadow: '0 4px 12px rgba(22, 119, 255, 0.3)'
              }}
            >
              Đăng nhập hệ thống
            </Button>
          </Form.Item>

          <Divider style={{ margin: '20px 0', borderColor: '#f1f5f9' }} />

          <div style={{ textAlign: 'center', fontSize: 14, color: '#64748b' }}>
            Chưa có tài khoản?{' '}
            <Link to="/register" style={{ fontWeight: 600, color: '#1677ff' }}>
              Đăng ký miễn phí
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;