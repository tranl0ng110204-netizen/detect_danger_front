import { useEffect, useState } from 'react';
import { Table, Tag, Button, Popconfirm, message, Modal, Form, Input, Space, Descriptions, Card, Typography, Select, Row, Col } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  FileTextOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useReportStore from '../../store/reportStore';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

const ReportHistory = () => {
  const navigate = useNavigate();
  const { reports, fetchMyReports, deleteMyReport, updateMyReport, loading } = useReportStore();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchMyReports();
  }, []);

  const handleViewDetail = (record) => {
    setViewingReport(record);
    setIsDetailModalVisible(true);
  };

  const handleOpenEdit = (record) => {
    setEditingReport(record);
    form.setFieldsValue({
      inputType: record.inputType,
      content: record.content,
      reason: record.reason,
    });
    setIsEditModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteMyReport(id);
      message.success('Đã xóa báo cáo vi phạm');
    } catch (error) {
      message.error(error.response?.data?.message || 'Xóa báo cáo thất bại');
    }
  };

  const handleUpdate = async (values) => {
    try {
      await updateMyReport(editingReport.id, values);
      message.success('Cập nhật báo cáo thành công');
      setIsEditModalVisible(false);
      setEditingReport(null);
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 'PENDING':
        return <Tag icon={<ClockCircleOutlined />} color="gold" style={{ fontWeight: 600 }}>Đang chờ duyệt</Tag>;
      case 'REVIEWING':
        return <Tag icon={<ClockCircleOutlined />} color="processing" style={{ fontWeight: 600 }}>Đang thẩm định</Tag>;
      case 'VERIFIED':
        return <Tag icon={<CheckCircleOutlined />} color="success" style={{ fontWeight: 600 }}>Đã xác thực</Tag>;
      case 'REJECTED':
      case 'REJECT':
        return <Tag icon={<CloseCircleOutlined />} color="error" style={{ fontWeight: 600 }}>Bị từ chối</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const filteredReports = reports.filter((item) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'PENDING') return item.status === 'PENDING' || item.status === 'REVIEWING';
    if (statusFilter === 'VERIFIED') return item.status === 'VERIFIED';
    if (statusFilter === 'REJECTED') return item.status === 'REJECTED' || item.status === 'REJECT';
    return true;
  });

  const columns = [
    { 
      title: 'Mã', 
      dataIndex: 'id', 
      key: 'id',
      width: 70,
      render: (id) => <span style={{ fontWeight: 600, color: '#64748b' }}>#{id}</span>
    },
    { 
      title: 'Loại', 
      dataIndex: 'inputType', 
      key: 'type',
      width: 100,
      render: (type) => <Tag color="blue" style={{ fontWeight: 600 }}>{type}</Tag>
    },
    { 
      title: 'Nội dung báo cáo', 
      dataIndex: 'content', 
      key: 'content', 
      ellipsis: true,
      render: (text) => <Text code copyable style={{ fontSize: 13 }}>{text}</Text>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Thời gian gửi',
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
      width: 180,
      render: (_, record) => {
        const isPending = record.status === 'PENDING';
        return (
          <Space size="small">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
              style={{ color: '#1677ff' }}
            >
              Chi tiết
            </Button>
            {isPending && (
              <>
                <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => handleOpenEdit(record)}
                  style={{ color: '#faad14' }}
                >
                  Sửa
                </Button>
                <Popconfirm
                  title="Xác nhận xóa báo cáo này?"
                  onConfirm={() => handleDelete(record.id)}
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                >
                  <Button type="text" danger size="small" icon={<DeleteOutlined />}>
                    Xóa
                  </Button>
                </Popconfirm>
              </>
            )}
          </Space>
        );
      },
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
                <FileTextOutlined style={{ fontSize: 18, color: '#1677ff' }} />
              </div>
              <div>
                <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
                  Lịch sử Báo cáo Vi phạm
                </Title>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Theo dõi tiến độ xử lý và phản hồi từ ban kiểm duyệt
                </Text>
              </div>
            </Space>
          </Col>

          <Col>
            <Space>
              <Select 
                value={statusFilter} 
                onChange={(val) => setStatusFilter(val)}
                style={{ width: 170 }}
              >
                <Option value="ALL">Tất cả trạng thái</Option>
                <Option value="PENDING">Đang chờ xử lý</Option>
                <Option value="VERIFIED">Đã xác thực</Option>
                <Option value="REJECTED">Bị từ chối</Option>
              </Select>
              <Button 
                type="primary" 
                icon={<PlusCircleOutlined />} 
                onClick={() => navigate('/user/create-report')}
                style={{ borderRadius: 8 }}
              >
                Gửi báo cáo mới
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredReports}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showTotal: (total) => `Tổng cộng ${total} báo cáo` }}
        />
      </Card>

      {/* Modal Xem chi tiết */}
      <Modal
        title={
          <Space>
            <FileTextOutlined style={{ color: '#1677ff' }} />
            <span>Chi tiết báo cáo #{viewingReport?.id}</span>
          </Space>
        }
        open={isDetailModalVisible}
        onCancel={() => {
          setIsDetailModalVisible(false);
          setViewingReport(null);
        }}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsDetailModalVisible(false)} style={{ borderRadius: 8 }}>
            Đóng
          </Button>,
        ]}
        width={720}
      >
        {viewingReport && (
          <Descriptions bordered column={2} style={{ marginTop: 16 }}>
            <Descriptions.Item label="Mã báo cáo">#{viewingReport.id}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {getStatusTag(viewingReport.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Loại dữ liệu">
              <Tag color="blue">{viewingReport.inputType}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày gửi">
              {viewingReport.createdAt ? dayjs(viewingReport.createdAt).format('DD/MM/YYYY HH:mm') : '--'}
            </Descriptions.Item>
            <Descriptions.Item label="Nội dung" span={2}>
              <Text copyable code style={{ fontSize: 13, wordBreak: 'break-all', display: 'inline-block' }}>
                {viewingReport.content}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Lý do / Mô tả" span={2}>
              {viewingReport.reason || <Text type="secondary">Không có mô tả thêm</Text>}
            </Descriptions.Item>
            {viewingReport.feedback && (
              <Descriptions.Item label="Phản hồi từ Moderator" span={2}>
                <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: 6, border: '1px solid #e2e8f0', color: '#0f172a' }}>
                  {viewingReport.feedback}
                </div>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Modal Sửa báo cáo */}
      <Modal
        title="Chỉnh sửa thông tin báo cáo"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingReport(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate} style={{ marginTop: 16 }}>
          <Form.Item name="inputType" label="Loại đối tượng">
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung mới"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <TextArea rows={3} placeholder="Nhập nội dung mới" />
          </Form.Item>
          <Form.Item name="reason" label="Lý do / Mô tả">
            <TextArea rows={3} placeholder="Mô tả chi tiết" />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setIsEditModalVisible(false)}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading} style={{ borderRadius: 8 }}>
              Lưu thay đổi
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ReportHistory;