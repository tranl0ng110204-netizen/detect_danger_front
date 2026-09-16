import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Input, message, Spin, Row, Col, Tag, Typography, List, Space, Alert, Divider } from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  PlayCircleOutlined, 
  ArrowLeftOutlined,
  SafetyCertificateOutlined,
  RobotOutlined
} from '@ant-design/icons';
import useReportStore from '../../store/reportStore';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Title, Paragraph, Text } = Typography;

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentReport, getReportDetail, startReview, verifyReportStatus, rejectReportStatus, loading } = useReportStore();
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (id) getReportDetail(id);
  }, [id]);

  const handleStartReview = async () => {
    try {
      await startReview(id);
      message.success('Đã khởi chạy phân tích tự động thành công');
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể bắt đầu phân tích');
    }
  };

  const handleStatusVerify = async () => {
    if (!feedback.trim()) {
      message.warning('Vui lòng nhập lý do / phản hồi thẩm định');
      return;
    }
    try {
      await verifyReportStatus(id, feedback);
      message.success('Đã xác thực và phê duyệt báo cáo vi phạm');
      navigate('/moderator/reports');
    } catch (error) {
      message.error(error.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  const handleStatusReject = async () => {
    if (!feedback.trim()) {
      message.warning('Vui lòng nhập lý do từ chối báo cáo');
      return;
    }
    try {
      await rejectReportStatus(id, feedback);
      message.success('Đã từ chối báo cáo');
      navigate('/moderator/reports');
    } catch (error) {
      message.error(error.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  if (loading || !currentReport) {
    return <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />;
  }

  const {
    id: reportId,
    userId,
    inputType,
    content,
    status,
    reason,
    createdAt,
    updatedAt,
    reportReviewResult,
  } = currentReport;

  const statusConfig = {
    PENDING: { color: 'gold', text: 'Chờ thẩm định' },
    REVIEWING: { color: 'processing', text: 'Đang thẩm định' },
    VERIFIED: { color: 'success', text: 'Đã xác thực' },
    REJECTED: { color: 'error', text: 'Bị từ chối' },
    REJECT: { color: 'error', text: 'Bị từ chối' },
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/moderator/reports')}
        style={{ marginBottom: 16, borderRadius: 8 }}
      >
        Quay lại Bàn kiểm duyệt
      </Button>

      {/* Main Container */}
      <Card
        style={{ borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', marginBottom: 24 }}
        bodyStyle={{ padding: 28 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <Space align="center">
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'rgba(114, 46, 209, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <SafetyCertificateOutlined style={{ fontSize: 22, color: '#722ed1' }} />
            </div>
            <div>
              <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
                Hồ Sơ Thẩm Định Báo Cáo #{reportId}
              </Title>
              <Text type="secondary" style={{ fontSize: 13 }}>
                Người gửi: User #{userId} • Ngày tạo: {createdAt ? dayjs(createdAt).format('DD/MM/YYYY HH:mm') : '--'}
              </Text>
            </div>
          </Space>

          <Tag color={statusConfig[status]?.color || 'default'} style={{ fontSize: 14, padding: '4px 14px', borderRadius: 20, fontWeight: 600 }}>
            {statusConfig[status]?.text || status}
          </Tag>
        </div>

        <Row gutter={[24, 24]}>
          {/* Left Column: Report Details */}
          <Col xs={24} lg={12}>
            <Card type="inner" title={<span style={{ fontWeight: 600 }}>Thông tin đối tượng nghi vấn</span>} style={{ borderRadius: 12, height: '100%' }}>
              <Descriptions column={1} bordered size="middle">
                <Descriptions.Item label="Loại đối tượng">
                  <Tag color="blue" style={{ fontWeight: 600 }}>{inputType}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Nội dung">
                  <Text copyable code style={{ fontSize: 13, wordBreak: 'break-all', display: 'inline-block' }}>
                    {content || 'Không có nội dung'}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả từ người gửi">
                  {reason || <Text type="secondary">Không có mô tả chi tiết</Text>}
                </Descriptions.Item>
                <Descriptions.Item label="Cập nhật lần cuối">
                  {updatedAt ? dayjs(updatedAt).format('DD/MM/YYYY HH:mm') : '--'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {/* Right Column: Automated Review Results */}
          <Col xs={24} lg={12}>
            <Card
              type="inner"
              title={
                <Space>
                  <RobotOutlined style={{ color: '#1677ff' }} />
                  <span style={{ fontWeight: 600 }}>Kết quả Phân tích Tự động</span>
                </Space>
              }
              style={{ borderRadius: 12, height: '100%' }}
            >
              {reportReviewResult ? (
                <div>
                  <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                    <Col span={12}>
                      <div style={{ fontSize: 12, color: '#64748b' }}>Điểm nguy cơ tổng hợp</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>
                        {reportReviewResult.totalScore ?? '--'}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ fontSize: 12, color: '#64748b' }}>Khuyến nghị hệ thống</div>
                      <Tag 
                        color={reportReviewResult.recommendation === 'ACCEPT_RECOMMEND' ? 'green' : 'red'}
                        style={{ marginTop: 4, fontWeight: 600 }}
                      >
                        {reportReviewResult.recommendation || 'Chưa xác định'}
                      </Tag>
                    </Col>
                  </Row>

                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: '#475569' }}>
                    Chi tiết các quy tắc đã kiểm định:
                  </div>
                  <List
                    size="small"
                    dataSource={reportReviewResult.ruleResult || []}
                    renderItem={(rule) => (
                      <List.Item style={{ padding: '6px 0' }}>
                        <Space>
                          <CheckCircleOutlined style={{ color: '#10b981' }} />
                          <Text style={{ fontSize: 13 }}>{rule}</Text>
                        </Space>
                      </List.Item>
                    )}
                  />
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                  <RobotOutlined style={{ fontSize: 36, color: '#cbd5e1', marginBottom: 12 }} />
                  <div style={{ color: '#64748b', fontSize: 14 }}>Chưa chạy phân tích tự động cho báo cáo này.</div>
                </div>
              )}
            </Card>
          </Col>
        </Row>

        <Divider style={{ margin: '28px 0' }} />

        {/* Decision & Action Area */}
        {status === 'PENDING' && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={handleStartReview}
              loading={loading}
              style={{ borderRadius: 8, fontWeight: 600, height: 44, padding: '0 32px' }}
            >
              Bắt đầu quy trình đánh giá
            </Button>
            <Paragraph style={{ marginTop: 10, color: '#64748b', fontSize: 13 }}>
              Hệ thống sẽ chạy đối soát tự động với cơ sở dữ liệu rủi ro và đưa trạng thái báo cáo sang "Đang thẩm định".
            </Paragraph>
          </div>
        )}

        {status === 'REVIEWING' && (
          <div style={{ background: '#f8fafc', padding: 24, borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <Title level={4} style={{ margin: '0 0 12px', fontWeight: 700, color: '#0f172a' }}>
              Quyết định Thẩm định & Phản hồi
            </Title>
            <Paragraph style={{ color: '#64748b', fontSize: 13, marginBottom: 16 }}>
              Vui lòng nhập nội dung nhận xét hoặc kết luận để gửi phản hồi tới người báo cáo.
            </Paragraph>

            <TextArea
              rows={3}
              placeholder="Nhập phản hồi chi tiết (ví dụ: Đã xác thực đây là trang web mạo danh ngân hàng lừa đảo người dùng)..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              style={{ borderRadius: 8, marginBottom: 16 }}
            />

            <Space size="middle">
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleStatusVerify}
                loading={loading}
                style={{
                  borderRadius: 8,
                  fontWeight: 600,
                  height: 40,
                  background: '#10b981',
                  borderColor: '#10b981'
                }}
              >
                Xác thực & Duyệt báo cáo
              </Button>
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={handleStatusReject}
                loading={loading}
                style={{ borderRadius: 8, fontWeight: 600, height: 40 }}
              >
                Từ chối báo cáo
              </Button>
            </Space>
          </div>
        )}

        {(status === 'VERIFIED' || status === 'REJECT' || status === 'REJECTED') && (
          <Alert
            message={<span style={{ fontWeight: 600 }}>Báo cáo đã hoàn tất thẩm định</span>}
            description={
              <div>
                <div><strong>Trạng thái:</strong> {status}</div>
                <div><strong>Phản hồi đã lưu:</strong> {currentReport.feedback || 'Không có phản hồi'}</div>
              </div>
            }
            type={status === 'VERIFIED' ? 'success' : 'warning'}
            showIcon
            style={{ borderRadius: 12 }}
          />
        )}
      </Card>
    </div>
  );
};

export default ReportDetail;