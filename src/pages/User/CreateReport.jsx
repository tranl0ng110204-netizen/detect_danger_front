import { useEffect } from 'react';
import { Form, Input, Select, Button, message, Card, Typography, Alert } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeftOutlined, 
  InfoCircleOutlined,
  SendOutlined,
  FileProtectOutlined
} from '@ant-design/icons';
import useReportStore from '../../store/reportStore';
import useAuthStore from '../../store/useAuthStore';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const CreateReport = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { createReport, loading } = useReportStore();
  const { token } = useAuthStore();

  useEffect(() => {
    if (location.state?.prefillContent) {
      form.setFieldsValue({
        content: location.state.prefillContent,
        inputType: location.state.prefillType || 'URL',
      });
    }
  }, [location.state, form]);

  const onFinish = async (values) => {
    try {
      if (token) {
        await createReport(values, token);
        message.success('Báo cáo rủi ro đã được gửi đến ban kiểm duyệt thành công!');
        navigate('/user/history');
      } else {
        message.warning('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
        navigate('/login');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Gửi báo cáo thất bại, vui lòng thử lại');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/user/dashboard')}
        style={{ marginBottom: 16, borderRadius: 8 }}
      >
        Quay lại Bảng điều khiển
      </Button>

      <Card 
        style={{ 
          borderRadius: 16, 
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
        }}
        bodyStyle={{ padding: '32px 36px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: 'rgba(22, 119, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileProtectOutlined style={{ fontSize: 24, color: '#1677ff' }} />
          </div>
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
              Gửi Báo Cáo Vi Phạm / Rủi Ro
            </Title>
            <Text type="secondary">
              Đóng góp thông tin về đường dẫn lừa đảo, số điện thoại spam hoặc nội dung độc hại.
            </Text>
          </div>
        </div>

        <Alert
          message="Lưu ý khi báo cáo"
          description="Báo cáo của bạn sẽ được hệ thống phân tích tự động và gửi đến Moderator thẩm định. Những báo cáo chính xác sẽ giúp gia tăng Điểm uy tín của bạn trong hệ thống."
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          style={{ marginBottom: 24, borderRadius: 8 }}
        />

        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onFinish}
          initialValues={{ inputType: 'URL' }}
        >
          <Form.Item 
            name="inputType" 
            label={<span style={{ fontWeight: 600 }}>Loại đối tượng nghi vấn</span>} 
            rules={[{ required: true, message: 'Vui lòng chọn loại đối tượng' }]}
          >
            <Select size="large" style={{ borderRadius: 8 }}>
              <Option value="URL">🌐 Đường dẫn liên kết (URL)</Option>
              <Option value="EMAIL">📧 Địa chỉ Email mạo danh</Option>
              <Option value="PHONE">📞 Số điện thoại lừa đảo / spam</Option>
              <Option value="MESSAGE">💬 Đoạn tin nhắn độc hại</Option>
            </Select>
          </Form.Item>

          <Form.Item 
            name="content" 
            label={<span style={{ fontWeight: 600 }}>Nội dung chi tiết</span>} 
            rules={[{ required: true, message: 'Vui lòng nhập nội dung cần báo cáo' }]}
          >
            <TextArea 
              rows={3} 
              placeholder="Nhập đường dẫn URL, số điện thoại, email hoặc nội dung tin nhắn nghi vấn..." 
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item 
            name="reason" 
            label={<span style={{ fontWeight: 600 }}>Lý do & Mô tả hành vi đáng ngờ</span>}
          >
            <TextArea 
              rows={3} 
              placeholder="Mô tả dấu hiệu đáng ngờ (ví dụ: yêu cầu nạp tiền, mạo danh ngân hàng, gửi mã OTP giả mạo, v.v.)..." 
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <Button 
              size="large" 
              onClick={() => navigate('/user/dashboard')}
              style={{ borderRadius: 8 }}
            >
              Hủy bỏ
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
              loading={loading}
              icon={<SendOutlined />}
              style={{ 
                borderRadius: 8, 
                fontWeight: 600,
                padding: '0 28px',
                background: '#1677ff',
                boxShadow: '0 4px 12px rgba(22, 119, 255, 0.3)'
              }}
            >
              Gửi báo cáo thẩm định
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CreateReport;