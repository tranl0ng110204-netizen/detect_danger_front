import { Form, Input, Button, message, Typography, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, SafetyCertificateFilled, UserAddOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const { Title, Text } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const result = await register(values);
    if (result.success) {
      message.success('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } else {
      message.error(result.error || 'Đăng ký thất bại, vui lòng thử lại');
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
            Tạo tài khoản mới
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Tham gia mạng lưới đánh giá an toàn không gian số
          </Text>
        </div>

        {/* Register Form */}
        <Form form={form} onFinish={onFinish} layout="vertical" size="large">
          <Form.Item 
            name="userName" 
            label={<span style={{ fontWeight: 600 }}>Họ và tên</span>}
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên của bạn' }]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#94a3b8', marginRight: 6 }} />} 
              placeholder="Nguyễn Văn A" 
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item 
            name="email" 
            label={<span style={{ fontWeight: 600 }}>Địa chỉ Email</span>}
            rules={[
              { required: true, message: 'Vui lòng nhập địa chỉ email' },
              { type: 'email', message: 'Email không đúng định dạng' }
            ]}
          >
            <Input 
              prefix={<MailOutlined style={{ color: '#94a3b8', marginRight: 6 }} />} 
              placeholder="example@domain.com" 
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item 
            name="password" 
            label={<span style={{ fontWeight: 600 }}>Mật khẩu</span>}
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu' },
              { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: '#94a3b8', marginRight: 6 }} />} 
              placeholder="Tối thiểu 6 ký tự" 
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 24, marginBottom: 16 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
              icon={<UserAddOutlined />}
              style={{ 
                height: 44, 
                borderRadius: 8, 
                fontWeight: 700,
                fontSize: 15,
                background: '#1677ff',
                boxShadow: '0 4px 12px rgba(22, 119, 255, 0.3)'
              }}
            >
              Đăng ký tài khoản
            </Button>
          </Form.Item>

          <Divider style={{ margin: '20px 0', borderColor: '#f1f5f9' }} />

          <div style={{ textAlign: 'center', fontSize: 14, color: '#64748b' }}>
            Đã có tài khoản?{' '}
            <Link to="/login" style={{ fontWeight: 600, color: '#1677ff' }}>
              Đăng nhập ngay
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;