import { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Button, Form, Input, Select, message, Typography, Space, Tag, Tooltip, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  RadarChartOutlined,
  PlusCircleOutlined,
  UserOutlined,
  TrophyOutlined,
  MailOutlined,
  SearchOutlined,
  InboxOutlined,
  FilePdfOutlined
} from '@ant-design/icons';
import useReportStore from '../../store/reportStore';
import useAuthStore from '../../store/useAuthStore';
import useScanStore from '../../store/scanStore';

const { Option } = Select;
const { Title, Text } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  const { reports, fetchMyReports, loading } = useReportStore();
  const { scanLoading, performScan, performScanPdf } = useScanStore();
  const { reputationScore, user, token } = useAuthStore();
  const [inputType, setInputType] = useState('URL');

  useEffect(() => {
    if (token) {
      fetchMyReports(token);
    }
  }, [token]);

  const [form] = Form.useForm();
  const total = reports.length;
  const pending = reports.filter(r => r.status === 'PENDING' || r.status === 'REVIEWING').length;
  const approved = reports.filter(r => r.status === 'VERIFIED').length;
  const rejected = reports.filter(r => r.status === 'REJECTED').length;

  const handleTypeChange = (val) => {
    setInputType(val);
    form.setFieldsValue({
      content: undefined,
      file: undefined,
    });
  };

  const handleScan = async (values) => {
    try {
      let result;
      if (values.inputType === 'FILE') {
        const fileList = values.file;
        const fileObj = fileList?.[0]?.originFileObj || fileList?.[0];
        if (!fileObj) {
          message.error('Vui lòng chọn một tệp PDF để phân tích');
          return;
        }
        if (!fileObj.name.toLowerCase().endsWith('.pdf')) {
          message.error('Hệ thống hiện tại chỉ hỗ trợ định dạng tệp PDF');
          return;
        }
        if (fileObj.size > 10 * 1024 * 1024) {
          message.error('Dung lượng tệp không được vượt quá 10MB');
          return;
        }
        result = await performScanPdf(fileObj);
        navigate('/user/scan/result', { 
          state: { 
            scanResult: result, 
            inputData: { inputType: 'FILE', content: fileObj.name } 
          } 
        });
      } else {
        result = await performScan(values);
        navigate('/user/scan/result', { state: { scanResult: result, inputData: values } });
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Quét rủi ro thất bại, vui lòng thử lại');
    }
  };

  const getPlaceholder = (type) => {
    switch (type) {
      case 'URL':
        return 'Nhập đường dẫn URL cần phân tích (ví dụ: https://nganhang-xacminh.com)...';
      case 'EMAIL':
        return 'Nhập địa chỉ email nghi vấn lừa đảo (ví dụ: security@alert-bank.xyz)...';
      case 'PHONE':
        return 'Nhập số điện thoại cần tra cứu (ví dụ: 0987654321)...';
      case 'MESSAGE':
        return 'Dán nội dung tin nhắn SMS hoặc thông báo lừa đảo cần kiểm tra...';
      default:
        return 'Nhập nội dung cần kiểm tra...';
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Welcome Banner */}
      <Card 
        style={{ 
          marginBottom: 24, 
          borderRadius: 16, 
          border: '1px solid #e2e8f0',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
        bodyStyle={{ padding: '24px 28px' }}
      >
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Space direction="vertical" size={6}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <Title level={3} style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>
                  Trung tâm An toàn & Kiểm định Rủi ro
                </Title>
                <Tag color="blue" style={{ borderRadius: 12, padding: '2px 10px', fontWeight: 600 }}>
                  Tài khoản cá nhân
                </Tag>
              </div>
              <Text type="secondary" style={{ fontSize: 14 }}>
                Quét nhanh liên kết nghi vấn hoặc gửi báo cáo vi phạm để bảo vệ cộng đồng không gian số.
              </Text>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <Space size={4}>
                  <UserOutlined style={{ color: '#64748b' }} />
                  <Text strong>{user?.sub || 'User'}</Text>
                </Space>
                {user?.email && (
                  <Space size={4}>
                    <MailOutlined style={{ color: '#64748b' }} />
                    <Text type="secondary">{user?.email}</Text>
                  </Space>
                )}
                <Tooltip title="Điểm uy tín tích lũy từ các báo cáo chuẩn xác của bạn">
                  <Tag icon={<TrophyOutlined />} color="gold" style={{ borderRadius: 12, fontWeight: 600 }}>
                    Điểm uy tín: {reputationScore ?? 100}
                  </Tag>
                </Tooltip>
              </div>
            </Space>
          </Col>

          <Col xs={24} md={8} style={{ textAlign: 'right' }}>
            <Button 
              type="primary" 
              size="large"
              icon={<PlusCircleOutlined />}
              onClick={() => navigate('/user/create-report')}
              style={{ borderRadius: 8, fontWeight: 600, height: 42 }}
            >
              Tạo báo cáo vi phạm
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 4 Stat Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 28 }}>
        <Col xs={12} sm={6}>
          <Card className="stat-card-pro" bodyStyle={{ padding: 18 }}>
            <Space align="center" style={{ marginBottom: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(22, 119, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileTextOutlined style={{ fontSize: 18, color: '#1677ff' }} />
              </div>
              <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>Tổng báo cáo</Text>
            </Space>
            <Statistic value={total} loading={loading} valueStyle={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }} />
          </Card>
        </Col>

        <Col xs={12} sm={6}>
          <Card className="stat-card-pro" bodyStyle={{ padding: 18 }}>
            <Space align="center" style={{ marginBottom: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ClockCircleOutlined style={{ fontSize: 18, color: '#f59e0b' }} />
              </div>
              <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>Đang chờ duyệt</Text>
            </Space>
            <Statistic value={pending} loading={loading} valueStyle={{ fontSize: 28, fontWeight: 800, color: '#f59e0b' }} />
          </Card>
        </Col>

        <Col xs={12} sm={6}>
          <Card className="stat-card-pro" bodyStyle={{ padding: 18 }}>
            <Space align="center" style={{ marginBottom: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircleOutlined style={{ fontSize: 18, color: '#10b981' }} />
              </div>
              <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>Đã xác thực</Text>
            </Space>
            <Statistic value={approved} loading={loading} valueStyle={{ fontSize: 28, fontWeight: 800, color: '#10b981' }} />
          </Card>
        </Col>

        <Col xs={12} sm={6}>
          <Card className="stat-card-pro" bodyStyle={{ padding: 18 }}>
            <Space align="center" style={{ marginBottom: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CloseCircleOutlined style={{ fontSize: 18, color: '#ef4444' }} />
              </div>
              <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>Bị từ chối</Text>
            </Space>
            <Statistic value={rejected} loading={loading} valueStyle={{ fontSize: 28, fontWeight: 800, color: '#ef4444' }} />
          </Card>
        </Col>
      </Row>

      {/* Quick Threat Scanner */}
      <Card
        className="scanner-box"
        style={{ borderRadius: 16, border: '1px solid #e2e8f0', marginBottom: 28 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'rgba(22, 119, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <RadarChartOutlined style={{ fontSize: 20, color: '#1677ff' }} />
          </div>
          <div>
            <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
              Quét Rủi ro Nhanh (Threat Scanner)
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Hệ thống tự động tra cứu cơ sở dữ liệu mối đe dọa và đánh giá điểm nguy hại tức thời.
            </Text>
          </div>
        </div>

        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleScan}
          initialValues={{ inputType: 'URL' }}
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} md={6}>
              <Form.Item name="inputType" label={<span style={{ fontWeight: 600 }}>Loại đối tượng</span>} rules={[{ required: true }]}>
                <Select 
                  size="large" 
                  onChange={handleTypeChange}
                  style={{ borderRadius: 8 }}
                >
                  <Option value="URL">🌐 Đường dẫn (URL)</Option>
                  <Option value="EMAIL">📧 Địa chỉ Email</Option>
                  <Option value="PHONE">📞 Số điện thoại</Option>
                  <Option value="MESSAGE">💬 Đoạn tin nhắn</Option>
                  <Option value="FILE">📄 Tệp tin (File PDF)</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={18}>
              {inputType === 'FILE' ? (
                <Form.Item 
                  name="file" 
                  label={<span style={{ fontWeight: 600 }}>Tệp PDF cần kiểm tra</span>} 
                  valuePropName="fileList"
                  getValueFromEvent={(e) => {
                    if (Array.isArray(e)) return e;
                    return e && e.fileList.slice(-1);
                  }}
                  rules={[{ required: true, message: 'Vui lòng chọn hoặc kéo thả một tệp PDF cần phân tích' }]}
                >
                  <Upload.Dragger
                    name="file"
                    multiple={false}
                    maxCount={1}
                    accept=".pdf,application/pdf"
                    beforeUpload={() => false}
                    style={{
                      background: '#f8fafc',
                      borderRadius: 10,
                      borderColor: '#cbd5e1',
                      padding: '12px 16px'
                    }}
                  >
                    <p className="ant-upload-drag-icon" style={{ marginBottom: 6 }}>
                      <InboxOutlined style={{ fontSize: 32, color: '#1677ff' }} />
                    </p>
                    <p className="ant-upload-text" style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>
                      Nhấp hoặc kéo thả tệp PDF vào đây để quét mã độc & liên kết lừa đảo
                    </p>
                    <p className="ant-upload-hint" style={{ fontSize: 12, color: '#64748b', marginTop: 4, margin: 0 }}>
                      Hỗ trợ định dạng .PDF (tối đa 10MB). Phân tích cấu trúc, script ẩn và các URL độc hại.
                    </p>
                  </Upload.Dragger>
                </Form.Item>
              ) : (
                <Form.Item 
                  name="content" 
                  label={<span style={{ fontWeight: 600 }}>Nội dung cần kiểm tra</span>} 
                  rules={[{ required: true, message: 'Vui lòng nhập nội dung cần kiểm tra' }]}
                >
                  <Input 
                    size="large"
                    placeholder={getPlaceholder(inputType)}
                    prefix={<SearchOutlined style={{ color: '#94a3b8', marginRight: 6 }} />}
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
              )}
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <Button 
              type="primary" 
              size="large" 
              htmlType="submit" 
              loading={scanLoading}
              icon={<RadarChartOutlined />}
              style={{
                height: 44,
                padding: '0 32px',
                borderRadius: 8,
                fontWeight: 700,
                background: '#1677ff',
                boxShadow: '0 4px 14px rgba(22, 119, 255, 0.35)'
              }}
            >
              {scanLoading ? 'Đang phân tích dữ liệu...' : 'Bắt đầu quét rủi ro'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Dashboard;