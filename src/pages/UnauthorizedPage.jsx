import { Result, Button, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div className="auth-container">
      <Card style={{ maxWidth: 500, width: '100%', borderRadius: 16, border: '1px solid #e2e8f0', textAlign: 'center' }}>
        <Result
          status="403"
          title="Truy cập bị từ chối"
          subTitle="Bạn không có quyền truy cập vào khu vực này của hệ thống."
          extra={[
            <Button key="back" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
              Quay lại
            </Button>,
            <Button key="home" type="primary" icon={<HomeOutlined />} onClick={() => navigate('/')}>
              Về trang chủ
            </Button>,
          ]}
        />
      </Card>
    </div>
  );
};

export default Unauthorized;