import { useEffect } from 'react';
import { Table, Tag, Button, Space, Typography, Card, Row, Col, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  FileSearchOutlined, 
  ClockCircleOutlined, 
  ReloadOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import useReportStore from '../../store/reportStore';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const ReviewReports = () => {
  const navigate = useNavigate();
  const { pendingReports, fetchPendingReports, loading } = useReportStore();

  useEffect(() => {
    fetchPendingReports();
  }, []);

  const columns = [
    { 
      title: 'Mã', 
      dataIndex: 'id',
      width: 70,
      render: (id) => <span style={{ fontWeight: 600, color: '#64748b' }}>#{id}</span>
    },
    { 
      title: 'Loại', 
      dataIndex: 'inputType',
      width: 100,
      render: (type) => <Tag color="blue" style={{ fontWeight: 600 }}>{type}</Tag>
    },
    {
      title: 'Nội dung nghi vấn',
      dataIndex: 'content',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <Text code copyable style={{ fontSize: 13 }}>{text || '--'}</Text>
        </Tooltip>
      )
    },
    { 
      title: 'Lý do người dùng gửi', 
      dataIndex: 'reason', 
      ellipsis: true,
      render: (reason) => reason || <Text type="secondary">Không có mô tả</Text>
    },
    {
      title: 'Thời gian gửi',
      dataIndex: 'createdAt',
      width: 160,
      render: (date) => (
        <span style={{ fontSize: 13, color: '#64748b' }}>
          {date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '--'}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 140,
      render: (status) => (
        <Tag icon={<ClockCircleOutlined />} color="gold" style={{ fontWeight: 600, borderRadius: 12 }}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 140,
      render: (_, record) => (
        <Button 
          type="primary" 
          icon={<FileSearchOutlined />} 
          onClick={() => navigate(`/moderator/report/${record.id}/review`)}
          style={{ borderRadius: 6, fontWeight: 600 }}
        >
          Thẩm định
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
                background: 'rgba(114, 46, 209, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <SafetyCertificateOutlined style={{ fontSize: 20, color: '#722ed1' }} />
              </div>
              <div>
                <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
                  Bàn Kiểm Duyệt Báo Cáo
                </Title>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Danh sách các báo cáo vi phạm đang chờ thẩm định và đưa ra quyết định xử lý
                </Text>
              </div>
            </Space>
          </Col>

          <Col>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => fetchPendingReports()}
              loading={loading}
              style={{ borderRadius: 8 }}
            >
              Làm mới danh sách
            </Button>
          </Col>
        </Row>

        <Table 
          columns={columns} 
          dataSource={pendingReports} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10, showTotal: (total) => `Tổng cộng ${total} báo cáo chờ duyệt` }}
        />
      </Card>
    </div>
  );
};

export default ReviewReports;