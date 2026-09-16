import { useEffect, useState } from 'react';
import { Table, Tag, Button, Popconfirm, message, Space, Modal, Input, Form, Card, Typography, Row, Col, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, FileTextOutlined, ReloadOutlined } from '@ant-design/icons';
import useReportStore from '../../store/reportStore';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const ManageReports = () => {
  const { reports, fetchAllReports, deleteReport, updateReport, loading } = useReportStore();
  const [params, setParams] = useState({ page: 0, limit: 10 });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAllReports(params);
  }, [params]);

  const handleDelete = async (id) => {
    try {
      await deleteReport(id);
      message.success('Đã xóa báo cáo khỏi hệ thống');
    } catch (error) {
      message.error(error.response?.data?.message || 'Xóa báo cáo thất bại');
    }
  };

  const handleEdit = (record) => {
    setEditingReport(record);
    form.setFieldsValue({ reason: record.reason });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      await updateReport(editingReport.id, { reason: values.reason });
      message.success('Cập nhật lý do báo cáo thành công');
      setEditModalVisible(false);
      setEditingReport(null);
      fetchAllReports(params);
    } catch {
      message.error('Cập nhật thất bại');
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 'PENDING':
        return <Tag color="gold" style={{ fontWeight: 600 }}>Chờ duyệt</Tag>;
      case 'REVIEWING':
        return <Tag color="processing" style={{ fontWeight: 600 }}>Đang duyệt</Tag>;
      case 'APPROVED':
      case 'VERIFIED':
        return <Tag color="success" style={{ fontWeight: 600 }}>Đã xác thực</Tag>;
      case 'REJECTED':
      case 'REJECT':
        return <Tag color="error" style={{ fontWeight: 600 }}>Bị từ chối</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

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
      title: 'Nội dung', 
      dataIndex: 'content',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <Text code copyable style={{ fontSize: 13 }}>{text}</Text>
        </Tooltip>
      )
    },
    { 
      title: 'Lý do / Mô tả', 
      dataIndex: 'reason', 
      ellipsis: true,
      render: (text) => text || <Text type="secondary">Không có</Text>
    },
    { 
      title: 'User ID', 
      dataIndex: 'userId',
      width: 90,
      render: (userId) => <Tag color="geekblue">#{userId}</Tag>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 130,
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
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
      width: 110,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="text" 
            size="small"
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)} 
            style={{ color: '#1677ff' }}
          />
          <Popconfirm 
            title="Xóa báo cáo này khỏi hệ thống?" 
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger type="text" size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
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
                <FileTextOutlined style={{ fontSize: 20, color: '#1677ff' }} />
              </div>
              <div>
                <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
                  Quản Lý Báo Cáo Toàn Hệ Thống
                </Title>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Giám sát toàn bộ dữ liệu báo cáo rủi ro từ tất cả người dùng
                </Text>
              </div>
            </Space>
          </Col>

          <Col>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => fetchAllReports(params)}
              loading={loading}
              style={{ borderRadius: 8 }}
            >
              Tải lại
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={reports?.content || []}
          rowKey="id"
          loading={loading}
          pagination={{ 
            current: params.page + 1,
            total: reports?.totalElements,
            pageSize: params.limit,
            showTotal: (total) => `Tổng số ${total} báo cáo`,
            onChange: (page) => setParams({ ...params, page: page - 1 })
          }}
        />
      </Card>

      {/* Modal chỉnh sửa lý do */}
      <Modal
        title="Chỉnh sửa lý do / mô tả báo cáo"
        open={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingReport(null);
          form.resetFields();
        }}
        okText="Cập nhật"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="reason"
            label={<span style={{ fontWeight: 600 }}>Lý do / Mô tả cập nhật</span>}
            rules={[{ required: true, message: 'Vui lòng nhập lý do' }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập lý do mới" style={{ borderRadius: 8 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageReports;