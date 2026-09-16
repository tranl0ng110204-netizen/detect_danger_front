import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Tag, List, Typography, Button, Progress, Row, Col, Space } from 'antd';
import { 
  ArrowLeftOutlined, 
  SafetyCertificateFilled, 
  WarningFilled, 
  CloseCircleFilled, 
  CheckCircleFilled,
  PlusCircleOutlined,
  RadarChartOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import useScanStore from '../../store/scanStore';

const { Title, Text, Paragraph } = Typography;

const ScanResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scanResult, clearScanResult } = useScanStore();

  const data = location.state?.scanResult || scanResult;

  useEffect(() => {
    if (!data) {
      navigate('/user/dashboard');
    }
  }, [data, navigate]);

  if (!data) return null;

  const {
    scanId,
    inputType,
    content,
    riskScore = 0,
    riskLevel = 'LOW',
    ruleResultList = [],
    createdAt,
  } = data;

  const getRiskConfig = (level) => {
    switch (level) {
      case 'LOW':
        return {
          color: '#10b981',
          bg: 'rgba(16, 185, 129, 0.1)',
          label: 'AN TOÀN',
          desc: 'Không phát hiện dấu hiệu nguy hại đáng kể. Đối tượng kiểm tra có vẻ đáng tin cậy.',
          icon: <CheckCircleFilled style={{ fontSize: 32, color: '#10b981' }} />
        };
      case 'MEDIUM':
        return {
          color: '#f59e0b',
          bg: 'rgba(245, 158, 11, 0.1)',
          label: 'RỦI RO TRUNG BÌNH',
          desc: 'Phát hiện một số yếu tố bất thường hoặc tên miền mới khởi tạo. Hãy thận trọng khi tương tác.',
          icon: <WarningFilled style={{ fontSize: 32, color: '#f59e0b' }} />
        };
      case 'HIGH':
      case 'CRITICAL':
        return {
          color: '#ef4444',
          bg: 'rgba(239, 68, 68, 0.1)',
          label: 'NGUY CƠ ĐỘC HẠI CAO',
          desc: 'Phát hiện mã độc, liên kết lừa đảo hoặc nằm trong danh sách đen cảnh báo an ninh mạng.',
          icon: <CloseCircleFilled style={{ fontSize: 32, color: '#ef4444' }} />
        };
      default:
        return {
          color: '#64748b',
          bg: '#f1f5f9',
          label: 'CHƯA XÁC ĐỊNH',
          desc: 'Chưa đủ dữ liệu để đưa ra kết luận chính xác.',
          icon: <WarningFilled style={{ fontSize: 32, color: '#64748b' }} />
        };
    }
  };

  const riskConfig = getRiskConfig(riskLevel);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Top Bar Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => {
            clearScanResult();
            navigate('/user/dashboard');
          }}
          style={{ borderRadius: 8, height: 38 }}
        >
          Quay lại Bảng điều khiển
        </Button>

        <Space>
          <Tag color="blue" style={{ borderRadius: 6, padding: '4px 10px', fontSize: 13, fontWeight: 600 }}>
            Mã phiên quét: #{scanId}
          </Tag>
        </Space>
      </div>

      {/* Main Risk Assessment Card */}
      <Card 
        style={{ 
          borderRadius: 16, 
          border: '1px solid #e2e8f0', 
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
          marginBottom: 24,
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: 32 }}
      >
        <Row gutter={[32, 24]} align="middle">
          {/* Gauge / Progress */}
          <Col xs={24} md={8} style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Progress
                type="dashboard"
                percent={riskScore}
                strokeColor={riskConfig.color}
                size={160}
                format={(percent) => (
                  <div>
                    <div style={{ fontSize: 36, fontWeight: 800, color: riskConfig.color }}>
                      {percent}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>ĐIỂM RỦI RO</div>
                  </div>
                )}
              />
            </div>
          </Col>

          {/* Verdict Summary */}
          <Col xs={24} md={16}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 20,
              background: riskConfig.bg,
              marginBottom: 12
            }}>
              <span style={{ fontWeight: 700, color: riskConfig.color, fontSize: 14 }}>
                {riskConfig.label}
              </span>
            </div>

            <Title level={3} style={{ margin: '0 0 8px', fontWeight: 700 }}>
              Kết luận kiểm tra an ninh
            </Title>
            <Paragraph style={{ fontSize: 15, color: '#475569', lineHeight: 1.6, marginBottom: 20 }}>
              {riskConfig.desc}
            </Paragraph>

            <Space wrap>
              <Button
                type="primary"
                danger={riskLevel === 'HIGH' || riskLevel === 'CRITICAL'}
                icon={<PlusCircleOutlined />}
                onClick={() => navigate('/user/create-report', { state: { prefillContent: content, prefillType: inputType } })}
                style={{ borderRadius: 8, fontWeight: 600, height: 38 }}
              >
                Tạo báo cáo vi phạm
              </Button>
              <Button
                icon={<RadarChartOutlined />}
                onClick={() => {
                  clearScanResult();
                  navigate('/user/dashboard');
                }}
                style={{ borderRadius: 8, height: 38 }}
              >
                Quét đối tượng khác
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Target Details */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <GlobalOutlined style={{ color: '#1677ff' }} />
            <span style={{ fontWeight: 600 }}>Chi tiết đối tượng kiểm tra</span>
          </div>
        }
        style={{ borderRadius: 16, border: '1px solid #e2e8f0', marginBottom: 24 }}
      >
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Loại dữ liệu">
            <Tag color="cyan" style={{ fontWeight: 600 }}>{inputType}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian thực hiện">
            {createdAt ? new Date(createdAt).toLocaleString('vi-VN') : 'Vừa xong'}
          </Descriptions.Item>
          <Descriptions.Item label="Nội dung đã quét" span={2}>
            <Text copyable code style={{ fontSize: 14, wordBreak: 'break-all', display: 'inline-block' }}>
              {content}
            </Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Rule Results */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SafetyCertificateFilled style={{ color: '#1677ff' }} />
            <span style={{ fontWeight: 600 }}>Danh sách quy tắc đã kiểm tra ({ruleResultList.length})</span>
          </div>
        }
        style={{ borderRadius: 16, border: '1px solid #e2e8f0' }}
      >
        {ruleResultList && ruleResultList.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={ruleResultList}
            renderItem={(rule, index) => (
              <List.Item style={{ padding: '14px 16px', background: index % 2 === 0 ? '#f8fafc' : '#ffffff', borderRadius: 8, marginBottom: 6 }}>
                <Space align="center" style={{ width: '100%' }}>
                  <CheckCircleFilled style={{ color: '#10b981', fontSize: 16 }} />
                  <Text style={{ fontSize: 14, color: '#334155' }}>{rule}</Text>
                </Space>
              </List.Item>
            )}
          />
        ) : (
          <Text type="secondary">Chưa có thông tin phân tích quy tắc chi tiết từ máy chủ.</Text>
        )}
      </Card>
    </div>
  );
};

export default ScanResult;