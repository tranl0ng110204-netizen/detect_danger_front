import { useEffect } from 'react';
import { Table, Tag, Button, Typography, message, Card, Row, Col, Space, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  RadarChartOutlined, 
  EyeOutlined, 
  SearchOutlined,
  CheckCircleFilled,
  WarningFilled,
  CloseCircleFilled
} from '@ant-design/icons';
import useScanStore from '../../store/scanStore';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const ScanHistory = () => {
  const navigate = useNavigate();
  const { scanHistories, getScanHistory, loading } = useScanStore();

  useEffect(() => {
    getScanHistory().catch(() => {
      message.error('Không thể tải lịch sử phiên quét');
    });
  }, []);

  const getRiskLevelTag = (level) => {
    switch (level) {
      case 'LOW':
        return (
          <Tag icon={<CheckCircleFilled />} color="success" style={{ fontWeight: 600, borderRadius: 12 }}>
            AN TOÀN
          </Tag>
        );
      case 'MEDIUM':
        return (
          <Tag icon={<WarningFilled />} color="warning" style={{ fontWeight: 600, borderRadius: 12 }}>
            TRUNG BÌNH
          </Tag>
        );
      case 'HIGH':
      case 'CRITICAL':
        return (
          <Tag icon={<CloseCircleFilled />} color="error" style={{ fontWeight: 600, borderRadius: 12 }}>
            {level === 'CRITICAL' ? 'NGUY CẤP' : 'NGUY HIỂM'}
          </Tag>
        );
      default:
        return <Tag>{level || 'CHƯA RÕ'}</Tag>;
    }
  };

  const columns = [
    { 
      title: 'Mã', 
      dataIndex: 'scanId', 
      key: 'scanId',
      width: 70,
      render: (id) => <span style={{ fontWeight: 600, color: '#64748b' }}>#{id}</span>
    },
    { 
      title: 'Loại', 
      dataIndex: 'inputType', 
      key: 'inputType',
      width: 100,
      render: (type) => <Tag color="blue" style={{ fontWeight: 600 }}>{type}</Tag>
    },
    {
      title: 'Nội dung đã quét',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <Text code copyable style={{ fontSize: 13 }}>
            {text}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'Điểm rủi ro',
      dataIndex: 'riskScore',
      key: 'riskScore',
      width: 110,
      render: (score) => {
        const val = score ?? 0;
        const color = val > 70 ? '#ef4444' : val > 30 ? '#f59e0b' : '#10b981';
        return (
          <span style={{ fontWeight: 700, fontSize: 15, color }}>
            {val} / 100
          </span>
        );
      },
    },
    {
      title: 'Mức độ',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      width: 140,
      render: (level) => getRiskLevelTag(level),
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (date) => (
        <span style={{ fontSize: 13, color: '#64748b' }}>
          {date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '--'}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 130,
      render: (_, record) => (
        <Button
          type="primary"
          ghost
          size="small"
          icon={<EyeOutlined />}
          onClick={() => navigate('/user/scan/result', { state: { scanResult: record } })}
          style={{ borderRadius: 6, fontWeight: 500 }}
        >
          Xem kết quả
        </Button>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Card
        style={{ borderRadius: 16, border: '1px solid #e2e8f0' }}
        bodyStyle={{ padding: 24 }}
      >
        <Row justify="space-between" align="middle" style={{ marginBottom: 20 }} gutter={[16, 16]}>
          <Col>
            <Space align="center">
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'rgba(22, 119, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <RadarChartOutlined style={{ fontSize: 18, color: '#1677ff' }} />
              </div>
              <div>
                <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
                  Lịch sử Quét Rủi ro
                </Title>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Danh sách các phiên phân tích liên kết, email và số điện thoại của bạn
                </Text>
              </div>
            </Space>
          </Col>

          <Col>
            <Button 
              type="primary" 
              icon={<SearchOutlined />}
              onClick={() => navigate('/user/dashboard')}
              style={{ borderRadius: 8 }}
            >
              Quét rủi ro mới
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={scanHistories}
          rowKey="scanId"
          loading={loading}
          pagination={{ pageSize: 10, showTotal: (total) => `Tổng cộng ${total} phiên quét` }}
        />
      </Card>
    </div>
  );
};

export default ScanHistory;