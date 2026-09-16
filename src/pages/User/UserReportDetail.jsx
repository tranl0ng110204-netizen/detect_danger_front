import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Button,
  Modal,
  Form,
  Input,
  message,
  Spin,
  Tag,
  Typography,
  Space,
  Popconfirm,
  Alert
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MessageOutlined
} from '@ant-design/icons';
import useReportStore from '../../store/reportStore';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Title, Text } = Typography;

const UserReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentReport, getReportDetail, updateMyReport, deleteMyReport, loading } =
    useReportStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (id) getReportDetail(id);
  }, [id]);

  const handleEdit = () => {
    form.setFieldsValue({
      content: currentReport?.content,
      reason: currentReport?.reason,
    });
    setIsModalVisible(true);
  };

  const handleUpdate = async (values) => {
    try {
      await updateMyReport(id, values);
      message.success('Cập nhật thông tin báo cáo thành công');
      setIsModalVisible(false);
      getReportDetail(id);
    } catch (error) {
      message.error(error.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMyReport(id);
      message.success('Đã xóa báo cáo');
      navigate('/user/history');
    } catch (error) {
      message.error(error.response?.data?.message || 'Xóa thất bại');
    }
  };

  if (loading || !currentReport) {
    return <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />;
  }

  const { status, inputType, content, reason, createdAt, updatedAt, feedback } =
    currentReport;

  const getStatusTag = (st) => {
    switch (st) {
      case 'PENDING':
        return <Tag icon={<ClockCircleOutlined />} color="gold" style={{ fontWeight: 600 }}>Đang chờ duyệt</Tag>;
      case 'REVIEWING':
        return <Tag icon={<ClockCircleOutlined />} color="processing" style={{ fontWeight: 600 }}>Đang thẩm định</Tag>;
      case 'VERIFIED':
        return <Tag icon={<CheckCircleOutlined />} color="success" style={{ fontWeight: 600 }}>Đã xác thực</Tag>;
      case 'REJECT':
      case 'REJECTED':
        return <Tag icon={<CloseCircleOutlined />} color="error" style={{ fontWeight: 600 }}>Bị từ chối</Tag>;
      default:
        return <Tag>{st}</Tag>;
    }
  };

  const isEditable = status === 'PENDING';

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/user/history')}
        style={{ marginBottom: 16, borderRadius: 8 }}
      >
        Quay lại Danh sách báo cáo
      </Button>

      <Card
        style={{ borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}
        bodyStyle={{ padding: 32 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <Space align="center">
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'rgba(22, 119, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileTextOutlined style={{ fontSize: 20, color: '#1677ff' }} />
            </div>
            <div>
              <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
                Chi tiết Báo cáo #{id}
              </Title>
              <Text type="secondary" style={{ fontSize: 13 }}>
                Gửi lúc {createdAt ? dayjs(createdAt).format('DD/MM/YYYY HH:mm') : '--'}
              </Text>
            </div>
          </Space>

          {isEditable && (
            <Space>
              <Button icon={<EditOutlined />} onClick={handleEdit} style={{ borderRadius: 8 }}>
                Chỉnh sửa
              </Button>
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa báo cáo này?"
                onConfirm={handleDelete}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Button danger icon={<DeleteOutlined />} style={{ borderRadius: 8 }}>
                  Xóa báo cáo
                </Button>
              </Popconfirm>
            </Space>
          )}
        </div>

        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Trạng thái">
            {getStatusTag(status)}
          </Descriptions.Item>
          <Descriptions.Item label="Loại đối tượng">
            <Tag color="blue" style={{ fontWeight: 600 }}>{inputType}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Nội dung báo cáo" span={2}>
            <Text copyable code style={{ fontSize: 14, wordBreak: 'break-all', display: 'inline-block' }}>
              {content}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Lý do / Mô tả" span={2}>
            {reason || <Text type="secondary">Không có mô tả chi tiết</Text>}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {createdAt ? dayjs(createdAt).format('DD/MM/YYYY HH:mm') : '--'}
          </Descriptions.Item>
          <Descriptions.Item label="Cập nhật lần cuối">
            {updatedAt ? dayjs(updatedAt).format('DD/MM/YYYY HH:mm') : '--'}
          </Descriptions.Item>
        </Descriptions>

        {feedback && (
          <div style={{ marginTop: 24 }}>
            <Alert
              message={<span style={{ fontWeight: 600 }}>Phản hồi từ Kiểm duyệt viên</span>}
              description={feedback}
              type={status === 'VERIFIED' ? 'success' : 'warning'}
              showIcon
              icon={<MessageOutlined />}
              style={{ borderRadius: 8 }}
            />
          </div>
        )}
      </Card>

      {/* Modal chỉnh sửa */}
      <Modal
        title="Chỉnh sửa nội dung báo cáo"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate} style={{ marginTop: 16 }}>
          <Form.Item label="Loại đối tượng" name="inputType" initialValue={inputType}>
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Nội dung"
            name="content"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <TextArea rows={3} placeholder="Nhập nội dung mới" />
          </Form.Item>
          <Form.Item label="Lý do / Mô tả" name="reason">
            <TextArea rows={3} placeholder="Mô tả chi tiết" />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
            <Button onClick={() => setIsModalVisible(false)}>
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

export default UserReportDetail;