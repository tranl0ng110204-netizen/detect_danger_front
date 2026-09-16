import { useEffect } from 'react';
import { Table, Tag, Card, Typography, Row, Col, Space, Button, Tooltip } from 'antd';
import { AuditOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons';
import useAdminStore from '../../store/adminStore';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const AuditLogs = () => {
  const { audits, fetchAuditLogs, loading } = useAdminStore();

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const getActionTag = (action) => {
    switch (action) {
      case 'VERIFY':
      case 'APPROVE':
        return <Tag color="success" style={{ fontWeight: 600 }}>Duyệt báo cáo</Tag>;
      case 'REJECT':
        return <Tag color="error" style={{ fontWeight: 600 }}>Từ chối báo cáo</Tag>;
      case 'UPDATE':
        return <Tag color="warning" style={{ fontWeight: 600 }}>Cập nhật</Tag>;
      case 'DELETE':
        return <Tag color="red" style={{ fontWeight: 600 }}>Xóa</Tag>;
      default:
        return <Tag color="blue" style={{ fontWeight: 600 }}>{action}</Tag>;
    }
  };

  const columns = [
    { 
      title: 'Mã vết', 
      dataIndex: 'id',
      width: 80,
      render: (id) => <span style={{ fontWeight: 600, color: '#64748b' }}>#{id}</span>
    },
    { 
      title: 'Hành động', 
      dataIndex: 'action',
      width: 140,
      render: (action) => getActionTag(action)
    },
    { 
      title: 'Người thực hiện', 
      dataIndex: 'moderatorId',
      width: 160,
      render: (modId) => (
        <Space>
          <UserOutlined style={{ color: '#722ed1' }} />
          <span style={{ fontWeight: 500 }}>Moderator #{modId}</span>
        </Space>
      )
    },
    { 
      title: 'Chi tiết / Ghi chú thẩm định', 
      dataIndex: 'reason', 
      ellipsis: true,
      render: (reason) => (
        <Tooltip title={reason}>
          <span style={{ color: '#334155' }}>{reason || '--'}</span>
        </Tooltip>
      )
    },
    {
      title: 'Thời gian ghi nhận',
      dataIndex: 'createdAt',
      width: 180,
      render: (date) => (
        <span style={{ fontSize: 13, color: '#64748b' }}>
          {date ? dayjs(date).format('DD/MM/YYYY HH:mm:ss') : '--'}
        </span>
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
                <AuditOutlined style={{ fontSize: 20, color: '#1677ff' }} />
              </div>
              <div>
                <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
                  Nhật Ký Kiểm Toán Hệ Thống (Audit Logs)
                </Title>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Truy xuất mọi hành động thẩm định, phê duyệt và xử lý báo cáo theo thời gian thực
                </Text>
              </div>
            </Space>
          </Col>

          <Col>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => fetchAuditLogs()}
              loading={loading}
              style={{ borderRadius: 8 }}
            >
              Làm mới
            </Button>
          </Col>
        </Row>

        <Table 
          columns={columns} 
          dataSource={audits?.content || (Array.isArray(audits) ? audits : [])} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10, showTotal: (total) => `Tổng cộng ${total} sự kiện kiểm toán` }}
        />
      </Card>
    </div>
  );
};

export default AuditLogs;