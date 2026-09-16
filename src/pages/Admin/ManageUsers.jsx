import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Popconfirm, Card, Typography, Row, Col, Tag, Avatar } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined, 
  CrownOutlined, 
  SafetyCertificateOutlined
} from '@ant-design/icons';
import useAdminStore from '../../store/adminStore';

const { Option } = Select;
const { Title, Text } = Typography;

const ManageUsers = () => {
  const { users, fetchUsers, createUser, updateUser, deleteUser, loading } = useAdminStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers().catch(() => {
      message.error('Không thể tải danh sách người dùng');
    });
  }, []);

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, values);
        message.success('Cập nhật người dùng thành công');
      } else {
        await createUser(values);
        message.success('Tạo người dùng mới thành công');
      }
      handleCloseModal();
    } catch (error) {
      message.error(error.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const getRoleTag = (role) => {
    switch (role) {
      case 'ADMIN':
      case 'ROLE_ADMIN':
        return <Tag icon={<CrownOutlined />} color="red" style={{ fontWeight: 600 }}>ADMIN</Tag>;
      case 'MODERATOR':
      case 'ROLE_MODERATOR':
        return <Tag icon={<SafetyCertificateOutlined />} color="purple" style={{ fontWeight: 600 }}>MODERATOR</Tag>;
      default:
        return <Tag icon={<UserOutlined />} color="blue" style={{ fontWeight: 600 }}>USER</Tag>;
    }
  };

  const userList = Array.isArray(users) ? users : [];
  const filteredUsers = userList.filter(u => {
    if (roleFilter === 'ALL') return true;
    return u.role === roleFilter;
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
      title: 'Họ và tên', 
      dataIndex: 'name', 
      key: 'name',
      render: (name, record) => (
        <Space>
          <Avatar style={{ backgroundColor: record.role === 'ADMIN' ? '#ef4444' : record.role === 'MODERATOR' ? '#722ed1' : '#1677ff' }} size="small">
            {(name || 'U')[0]?.toUpperCase()}
          </Avatar>
          <span style={{ fontWeight: 600, color: '#0f172a' }}>{name}</span>
        </Space>
      )
    },
    { 
      title: 'Email', 
      dataIndex: 'email', 
      key: 'email',
      render: (email) => (
        <span style={{ color: '#475569' }}>{email}</span>
      )
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 150,
      render: (role) => getRoleTag(role),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="text" 
            size="small" 
            icon={<EditOutlined />} 
            onClick={() => handleOpenModal(record)} 
            style={{ color: '#1677ff' }}
          />
          <Popconfirm 
            title="Xác nhận xóa người dùng này?" 
            onConfirm={() => deleteUser(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger size="small" icon={<DeleteOutlined />} />
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
                background: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <UserOutlined style={{ fontSize: 20, color: '#ef4444' }} />
              </div>
              <div>
                <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
                  Quản Lý Người Dùng & Phân Quyền
                </Title>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Kiểm soát danh sách tài khoản, gán quyền Quản trị viên, Moderator hoặc User
                </Text>
              </div>
            </Space>
          </Col>

          <Col>
            <Space>
              <Select 
                value={roleFilter} 
                onChange={(val) => setRoleFilter(val)}
                style={{ width: 160 }}
              >
                <Option value="ALL">Tất cả vai trò</Option>
                <Option value="USER">Người dùng (User)</Option>
                <Option value="MODERATOR">Kiểm duyệt (Mod)</Option>
                <Option value="ADMIN">Quản trị viên</Option>
              </Select>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => handleOpenModal()}
                style={{ borderRadius: 8 }}
              >
                Thêm người dùng
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showTotal: (total) => `Tổng cộng ${total} tài khoản` }}
        />
      </Card>

      {/* Modal Add / Edit User */}
      <Modal
        title={
          <Space>
            <UserOutlined style={{ color: '#1677ff' }} />
            <span>{editingUser ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}</span>
          </Space>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnClose
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item 
            name="name" 
            label={<span style={{ fontWeight: 600 }}>Họ và tên</span>} 
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
          >
            <Input placeholder="Nguyễn Văn A" style={{ borderRadius: 8 }} />
          </Form.Item>

          <Form.Item 
            name="email" 
            label={<span style={{ fontWeight: 600 }}>Email</span>} 
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không đúng định dạng' }
            ]}
          >
            <Input placeholder="email@domain.com" style={{ borderRadius: 8 }} />
          </Form.Item>

          <Form.Item 
            name="role" 
            label={<span style={{ fontWeight: 600 }}>Vai trò hệ thống</span>} 
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
            initialValue="USER"
          >
            <Select style={{ borderRadius: 8 }}>
              <Option value="USER">User (Người dùng thông thường)</Option>
              <Option value="MODERATOR">Moderator (Kiểm duyệt viên)</Option>
              <Option value="ADMIN">Admin (Quản trị viên tối cao)</Option>
            </Select>
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 24 }}>
            <Button onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading} style={{ borderRadius: 8 }}>
              Lưu thông tin
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageUsers;