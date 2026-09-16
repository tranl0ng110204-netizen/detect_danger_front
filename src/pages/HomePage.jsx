import { useEffect } from 'react';
import { Typography, Button, Row, Col, Card, Space, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  SafetyCertificateFilled,
  GlobalOutlined,
  UsergroupAddOutlined,
  AuditOutlined,
  ArrowRightOutlined,
  ThunderboltFilled
} from '@ant-design/icons';
import useAuthStore from '../store/useAuthStore';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

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

  const features = [
    {
      icon: <GlobalOutlined style={{ fontSize: 28, color: '#1677ff' }} />,
      bg: 'rgba(22, 119, 255, 0.1)',
      title: 'Quét Rủi ro Đa tầng',
      desc: 'Phân tích tức thì URL, tên miền lừa đảo, số điện thoại spam, email mạo danh và tin nhắn độc hại.',
    },
    {
      icon: <ThunderboltFilled style={{ fontSize: 28, color: '#f59e0b' }} />,
      bg: 'rgba(245, 158, 11, 0.1)',
      title: 'Cảnh báo Tức thời',
      desc: 'Hệ thống đánh giá điểm rủi ro theo thời gian thực giúp bạn chủ động phòng tránh các cạm bẫy trực tuyến.',
    },
    {
      icon: <UsergroupAddOutlined style={{ fontSize: 28, color: '#10b981' }} />,
      bg: 'rgba(16, 185, 129, 0.1)',
      title: 'Kiểm duyệt Chuyên gia',
      desc: 'Đội ngũ Moderator giàu kinh nghiệm kết hợp với thuật toán tự động để thẩm định báo cáo chuẩn xác.',
    },
    {
      icon: <AuditOutlined style={{ fontSize: 28, color: '#8b5cf6' }} />,
      bg: 'rgba(139, 92, 246, 0.1)',
      title: 'Nhật ký Minh bạch',
      desc: 'Mọi thao tác và quyết định thẩm định đều được ghi chép vào Audit Log đảm bảo tính minh bạch và truy xuất.',
    },
  ];

  const stats = [
    { value: '50,000+', label: 'Đối tượng đã quét rủi ro' },
    { value: '99.4%', label: 'Độ chính xác cảnh báo' },
    { value: '< 1s', label: 'Thời gian phân tích trung bình' },
    { value: '24/7', label: 'Giám sát & Bảo vệ cộng đồng' },
  ];

  const steps = [
    {
      step: '01',
      title: 'Nhập nội dung cần kiểm tra',
      desc: 'Dán đường dẫn (URL), số điện thoại hoặc văn bản tin nhắn nghi vấn vào công cụ quét.',
    },
    {
      step: '02',
      title: 'Phân tích & Thẩm định',
      desc: 'Thuật toán kiểm tra danh sách đen (Blacklist), danh tiếng tên miền và Moderator rà soát.',
    },
    {
      step: '03',
      title: 'Nhận kết luận & Khuyến cáo',
      desc: 'Hiển thị điểm rủi ro, mức độ nguy hiểm và hướng dẫn an toàn cho người dùng.',
    },
  ];

  return (
    <div style={{ background: '#f8fafc', paddingBottom: 60 }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        padding: '70px 24px 90px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow effect */}
        <div style={{
          position: 'absolute',
          top: '-30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(22, 119, 255, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: 30,
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            marginBottom: 24
          }}>
            <SafetyCertificateFilled style={{ color: '#1677ff' }} />
            <span style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 500 }}>
              Hệ thống Bảo vệ & Nhận diện Rủi ro Trực tuyến Chuẩn Mới
            </span>
          </div>

          <Title level={1} style={{ color: '#ffffff', fontSize: 46, fontWeight: 800, lineHeight: 1.2, margin: '0 0 20px', letterSpacing: '-0.8px' }}>
            Phát hiện sớm các mối đe dọa, <br />
            <span style={{ 
              background: 'linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}>
              bảo vệ an toàn số của bạn
            </span>
          </Title>

          <Paragraph style={{ color: '#94a3b8', fontSize: 18, maxWidth: 680, margin: '0 auto 36px', lineHeight: 1.6 }}>
            DetectDanger giúp phát hiện nguy cơ lừa đảo từ liên kết độc hại, tin nhắn spam, email giả mạo và số điện thoại bất thường chỉ với một cú nhấp chuột.
          </Paragraph>

          <Space size="middle" wrap style={{ justifyContent: 'center' }}>
            <Button 
              type="primary" 
              size="large" 
              icon={<ArrowRightOutlined />} 
              onClick={() => navigate('/login')}
              style={{
                height: 48,
                padding: '0 28px',
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 600,
                background: '#1677ff',
                boxShadow: '0 4px 14px rgba(22, 119, 255, 0.4)'
              }}
            >
              Bắt đầu kiểm tra ngay
            </Button>
            <Button 
              size="large" 
              onClick={() => navigate('/register')}
              style={{
                height: 48,
                padding: '0 28px',
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 600,
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              Đăng ký tài khoản miễn phí
            </Button>
          </Space>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div style={{ maxWidth: 1100, margin: '-40px auto 60px', padding: '0 20px', position: 'relative', zIndex: 2 }}>
        <Card style={{ borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
          <Row gutter={[24, 24]} justify="center" align="middle">
            {stats.map((item, idx) => (
              <Col xs={12} md={6} key={idx} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#1677ff', letterSpacing: '-0.5px' }}>
                  {item.value}
                </div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{item.label}</div>
              </Col>
            ))}
          </Row>
        </Card>
      </div>

      {/* Features Grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto 80px', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Tag color="blue" style={{ borderRadius: 20, padding: '3px 12px', fontWeight: 600 }}>TÍNH NĂNG NỔI BẬT</Tag>
          <Title level={2} style={{ marginTop: 12, fontWeight: 700, color: '#0f172a' }}>
            Lá chắn số toàn diện cho người dùng
          </Title>
          <Paragraph style={{ color: '#64748b', fontSize: 16 }}>
            Công nghệ phân tích hiện đại kết hợp với cơ chế thẩm định cộng đồng chặt chẽ.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {features.map((item, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card
                hoverable
                style={{
                  height: '100%',
                  borderRadius: 14,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                bodyStyle={{ padding: 24 }}
              >
                <div>
                  <div style={{
                    width: 54,
                    height: 54,
                    borderRadius: 12,
                    background: item.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20
                  }}>
                    {item.icon}
                  </div>
                  <Title level={4} style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>
                    {item.title}
                  </Title>
                  <Paragraph style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
                    {item.desc}
                  </Paragraph>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 3-Step Workflow */}
      <div style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '70px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <Tag color="green" style={{ borderRadius: 20, padding: '3px 12px', fontWeight: 600 }}>QUY TRÌNH HOẠT ĐỘNG</Tag>
            <Title level={2} style={{ marginTop: 12, fontWeight: 700 }}>
              Đơn giản, Nhanh chóng & Hiệu quả
            </Title>
            <Paragraph style={{ color: '#64748b', fontSize: 16 }}>
              Chỉ mất vài giây để biết liệu một liên kết hoặc số điện thoại có an toàn hay không.
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            {steps.map((st, i) => (
              <Col xs={24} md={8} key={i}>
                <div style={{
                  padding: 30,
                  borderRadius: 16,
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  height: '100%',
                  position: 'relative'
                }}>
                  <div style={{
                    fontSize: 36,
                    fontWeight: 800,
                    color: '#cbd5e1',
                    marginBottom: 16,
                    lineHeight: 1
                  }}>
                    {st.step}
                  </div>
                  <Title level={4} style={{ fontWeight: 700, fontSize: 18, color: '#0f172a' }}>
                    {st.title}
                  </Title>
                  <Paragraph style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
                    {st.desc}
                  </Paragraph>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Call to Action Banner */}
      <div style={{ maxWidth: 1000, margin: '70px auto 20px', padding: '0 24px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)',
          borderRadius: 20,
          padding: '48px 36px',
          color: '#ffffff',
          textAlign: 'center',
          boxShadow: '0 12px 30px rgba(22, 119, 255, 0.25)'
        }}>
          <SafetyCertificateFilled style={{ fontSize: 52, marginBottom: 16, color: '#ffffff' }} />
          <Title level={2} style={{ color: '#ffffff', fontWeight: 800, marginBottom: 12 }}>
            Sẵn sàng bảo vệ danh tính số của bạn?
          </Title>
          <Paragraph style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 16, maxWidth: 550, margin: '0 auto 28px' }}>
            Tham gia cộng đồng người dùng DetectDanger ngay hôm nay để nhận thông báo rủi ro tức thì và đóng góp cảnh báo an toàn.
          </Paragraph>
          <Space size="middle">
            <Button 
              size="large"
              onClick={() => navigate('/register')}
              style={{
                height: 46,
                padding: '0 28px',
                borderRadius: 8,
                fontWeight: 700,
                color: '#1677ff',
                background: '#ffffff',
                border: 'none'
              }}
            >
              Đăng ký hoàn toàn miễn phí
            </Button>
            <Button 
              size="large"
              ghost
              onClick={() => navigate('/login')}
              style={{
                height: 46,
                padding: '0 28px',
                borderRadius: 8,
                fontWeight: 600,
                borderColor: '#ffffff',
                color: '#ffffff'
              }}
            >
              Đăng nhập ngay
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default HomePage;