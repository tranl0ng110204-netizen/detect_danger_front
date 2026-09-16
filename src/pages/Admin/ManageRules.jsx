import { useEffect, useMemo, useState } from 'react';
import {
  Table, Tag, Button, Popconfirm, message, Space, Modal, Input, Form,
  Card, Typography, Row, Col, Tooltip, Select, Switch, InputNumber,
  Badge, Divider,
} from 'antd';
import {
  DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined,
  SafetyCertificateOutlined, SearchOutlined, FilterOutlined,
} from '@ant-design/icons';
import useRuleStore from '../../store/ruleStore';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const INPUT_TYPES = ['EMAIL', 'PHONE', 'URL', 'MESSAGE', 'FILE'];

const RULE_TYPES = [
  'REGEX',
  'SET_LOOKUP',
  'PREFIX_MATCH',
  'SUFFIX_MATCH',
  'CONTAINS',
  'EXACT_MATCH',
  'BLACKLIST',
  'WHITELIST',
];

const INPUT_TYPE_COLOR = {
  EMAIL: 'blue',
  PHONE: 'purple',
  URL: 'cyan',
  MESSAGE: 'orange',
  FILE: 'magenta',
};

const ManageRule = () => {
  const {
    rules,
    fetchAllRules,
    createRule,
    updateRule,
    deleteRule,
    loading,
  } = useRuleStore();

  // params chỉ dùng cho FE: phân trang + filter client-side
  const [params, setParams] = useState({
    page: 0,
    limit: 10,
    keyword: '',
    inputType: undefined,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [form] = Form.useForm();

  // Load 1 lần duy nhất khi mount
  useEffect(() => {
    fetchAllRules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================= FILTER + PAGINATE CLIENT-SIDE ================= */

  const rawList = Array.isArray(rules) ? rules : [];

  const filteredList = useMemo(() => {
    const kw = (params.keyword || '').trim().toLowerCase();
    return rawList.filter((r) => {
      const matchKw =
        !kw ||
        r.ruleName?.toLowerCase().includes(kw) ||
        r.ruleValue?.toLowerCase().includes(kw);
      const matchType =
        !params.inputType || r.inputType === params.inputType;
      return matchKw && matchType;
    });
  }, [rawList, params.keyword, params.inputType]);

  const pagedList = useMemo(() => {
    const start = params.page * params.limit;
    return filteredList.slice(start, start + params.limit);
  }, [filteredList, params.page, params.limit]);

  /* ================= HANDLERS ================= */

  const handleDelete = async (ruleName) => {
    try {
      await deleteRule(ruleName);
      message.success('Đã xóa quy tắc khỏi hệ thống');
    } catch (error) {
      message.error(error.response?.data?.message || 'Xóa quy tắc thất bại');
    }
  };

  const openCreateModal = () => {
    setEditingRule(null);
    form.resetFields();
    form.setFieldsValue({
      active: true,
      ruleStatus: 'ACTIVE',
      weight: 30,
      version: '1.0',
      inputType: 'EMAIL',
      ruleType: 'REGEX',
    });
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRule(record);
    form.setFieldsValue({
      ruleName: record.ruleName,
      inputType: record.inputType,
      ruleType: record.ruleType,
      ruleStatus: record.ruleStatus,
      weight: record.weight,
      ruleValue: record.ruleValue,
      version: record.version,
      active: record.active,
    });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingRule) {
        await updateRule(editingRule.ruleName, values);
        message.success('Cập nhật quy tắc thành công');
      } else {
        await createRule(values);
        message.success('Thêm quy tắc mới thành công');
      }

      setModalVisible(false);
      setEditingRule(null);
      form.resetFields();
      // Không cần fetch lại — store tự update state
    } catch (error) {
      if (error?.errorFields) return; // lỗi validate form
      message.error(
        error.response?.data?.message ||
          (editingRule ? 'Cập nhật thất bại' : 'Thêm mới thất bại')
      );
    }
  };

  /* ================= TAG / COLOR ================= */

  const getInputTypeTag = (type) => (
    <Tag color={INPUT_TYPE_COLOR[type] || 'default'} style={{ fontWeight: 600 }}>
      {type}
    </Tag>
  );

  const getRuleTypeTag = (type) => (
    <Tag color="geekblue" style={{ fontWeight: 600 }}>
      {type}
    </Tag>
  );

  const getStatusTag = (status, active) => {
    if (active === false) {
      return <Tag color="default" style={{ fontWeight: 600 }}>Đã tắt</Tag>;
    }
    switch (status) {
      case 'ACTIVE':
        return <Tag color="success" style={{ fontWeight: 600 }}>Hoạt động</Tag>;
      case 'INACTIVE':
        return <Tag color="default" style={{ fontWeight: 600 }}>Ngừng</Tag>;
      case 'DRAFT':
        return <Tag color="warning" style={{ fontWeight: 600 }}>Nháp</Tag>;
      case 'PENDING':
        return <Tag color="gold" style={{ fontWeight: 600 }}>Chờ duyệt</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const getWeightColor = (w) => {
    if (w >= 50) return '#dc2626';
    if (w >= 35) return '#f59e0b';
    return '#16a34a';
  };

  /* ================= COLUMNS ================= */

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 70,
      render: (_, __, index) => (
        <span style={{ fontWeight: 600, color: '#64748b' }}>
          #{params.page * params.limit + index + 1}
        </span>
      ),
    },
    {
      title: 'Tên quy tắc',
      dataIndex: 'ruleName',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span style={{ fontWeight: 600, color: '#0f172a' }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Input',
      dataIndex: 'inputType',
      width: 100,
      render: (t) => getInputTypeTag(t),
    },
    {
      title: 'Loại',
      dataIndex: 'ruleType',
      width: 130,
      render: (t) => getRuleTypeTag(t),
    },
    {
      title: 'Giá trị',
      dataIndex: 'ruleValue',
      ellipsis: true,
      render: (text) => (
        <Tooltip
          title={
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{text}</pre>
          }
        >
          <Text code style={{ fontSize: 12 }}>
            {text?.length > 50 ? text.slice(0, 50) + '…' : text}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'Trọng số',
      dataIndex: 'weight',
      width: 100,
      sorter: (a, b) => (a.weight || 0) - (b.weight || 0),
      render: (w) => (
        <Badge
          color={getWeightColor(w)}
          text={<span style={{ fontWeight: 700 }}>{w}</span>}
        />
      ),
    },
    {
      title: 'Version',
      dataIndex: 'version',
      width: 90,
      render: (v) => <Tag color="default">{v || '1.0'}</Tag>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'ruleStatus',
      width: 120,
      render: (status, record) => getStatusTag(status, record.active),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 150,
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
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Sửa quy tắc">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ color: '#1677ff' }}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa quy tắc này khỏi hệ thống?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => handleDelete(record.ruleName)}
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

  /* ================= RENDER ================= */

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <Card
        style={{ borderRadius: 16, border: '1px solid #e2e8f0' }}
        bodyStyle={{ padding: 24 }}
      >
        {/* HEADER */}
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 20 }}
          gutter={[16, 16]}
        >
          <Col>
            <Space align="center">
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: 'rgba(22, 119, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SafetyCertificateOutlined
                  style={{ fontSize: 20, color: '#1677ff' }}
                />
              </div>
              <div>
                <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
                  Quản Lý Quy Tắc Phát Hiện Rủi Ro
                </Title>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Cấu hình và quản lý toàn bộ rule engine của hệ thống
                </Text>
              </div>
            </Space>
          </Col>

          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchAllRules()}
                loading={loading}
                style={{ borderRadius: 8 }}
              >
                Tải lại
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={openCreateModal}
                style={{ borderRadius: 8 }}
              >
                Thêm quy tắc
              </Button>
            </Space>
          </Col>
        </Row>

        {/* FILTER BAR */}
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={10}>
            <Input
              placeholder="Tìm theo tên quy tắc hoặc giá trị..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              allowClear
              value={params.keyword}
              onChange={(e) =>
                setParams({ ...params, keyword: e.target.value, page: 0 })
              }
              style={{ borderRadius: 8 }}
            />
          </Col>
          <Col xs={12} md={6}>
            <Select
              placeholder="Loại input"
              allowClear
              value={params.inputType}
              onChange={(v) =>
                setParams({ ...params, inputType: v, page: 0 })
              }
              style={{ width: '100%' }}
              suffixIcon={<FilterOutlined />}
            >
              {INPUT_TYPES.map((t) => (
                <Option key={t} value={t}>
                  {t}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Divider style={{ margin: '8px 0 16px' }} />

        {/* TABLE */}
        <Table
          columns={columns}
          dataSource={pagedList}
          rowKey="ruleName"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            current: params.page + 1,
            total: filteredList.length,
            pageSize: params.limit,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} quy tắc`,
            onChange: (page, pageSize) =>
              setParams({ ...params, page: page - 1, limit: pageSize }),
          }}
        />
      </Card>

      {/* MODAL THÊM / SỬA */}
      <Modal
        title={
          <Space>
            {editingRule ? <EditOutlined /> : <PlusOutlined />}
            <span style={{ fontWeight: 700 }}>
              {editingRule ? 'Chỉnh sửa quy tắc' : 'Thêm quy tắc mới'}
            </span>
          </Space>
        }
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          setEditingRule(null);
          form.resetFields();
        }}
        okText={editingRule ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
        width={720}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="ruleName"
            label={<span style={{ fontWeight: 600 }}>Tên quy tắc</span>}
            rules={[{ required: true, message: 'Vui lòng nhập tên quy tắc' }]}
          >
            <Input
              placeholder="VD: Email rác / Email dùng một lần"
              style={{ borderRadius: 8 }}
              disabled={!!editingRule} // không cho đổi tên nếu là key
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="inputType"
                label={<span style={{ fontWeight: 600 }}>Loại input</span>}
                rules={[{ required: true, message: 'Chọn loại input' }]}
              >
                <Select style={{ width: '100%' }}>
                  {INPUT_TYPES.map((t) => (
                    <Option key={t} value={t}>
                      {t}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="ruleType"
                label={<span style={{ fontWeight: 600 }}>Loại quy tắc</span>}
                rules={[{ required: true, message: 'Chọn loại quy tắc' }]}
              >
                <Select style={{ width: '100%' }}>
                  {RULE_TYPES.map((t) => (
                    <Option key={t} value={t}>
                      {t}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="ruleValue"
            label={
              <span style={{ fontWeight: 600 }}>
                Giá trị quy tắc (rule value)
              </span>
            }
            rules={[
              { required: true, message: 'Vui lòng nhập giá trị quy tắc' },
            ]}
            tooltip="Có thể là chuỗi regex, danh sách prefix (phân tách bởi dấu phẩy), hoặc keyword tùy theo ruleType."
          >
            <Input.TextArea
              rows={4}
              placeholder="VD: 10minutemail.com,tempmail.com,... hoặc regex"
              style={{
                borderRadius: 8,
                fontFamily: 'monospace',
                fontSize: 13,
              }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="weight"
                label={<span style={{ fontWeight: 600 }}>Trọng số</span>}
                rules={[{ required: true, message: 'Nhập trọng số' }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  style={{ width: '100%', borderRadius: 8 }}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="version"
                label={<span style={{ fontWeight: 600 }}>Version</span>}
              >
                <Input placeholder="1.0" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="ruleStatus"
                label={<span style={{ fontWeight: 600 }}>Trạng thái</span>}
                rules={[{ required: true }]}
              >
                <Select style={{ width: '100%' }}>
                  <Option value="ACTIVE">Hoạt động</Option>
                  <Option value="INACTIVE">Ngừng</Option>
                  <Option value="DRAFT">Nháp</Option>
                  <Option value="PENDING">Chờ duyệt</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="active"
            label={<span style={{ fontWeight: 600 }}>Kích hoạt</span>}
            valuePropName="checked"
          >
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageRule;