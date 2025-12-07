import { Row, Col, Form, Input, Select, InputNumber, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const InfoTab = ({
  typeOptions,
  description,
  setDescription,
  fileList,
  loadingUpload,
  handleUpload,
  handleChange,
  handlePreview,
}) => {
  return (
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Tên Chỗ ở"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
        >
          <Input placeholder="VD: Khách sạn ABC" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Loại hình"
          name="accommodationTypeId"
          rules={[{ required: true, message: 'Vui lòng chọn loại hình!' }]}
        >
          <Select placeholder="Chọn loại hình" options={typeOptions} />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label="Tổng số phòng"
          name="totalRoom"
          initialValue={1}
          rules={[{ required: true }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label="SĐT Liên hệ"
          name="contactPhone"
          rules={[{ required: true, message: 'Nhập số điện thoại!' }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label="Email Liên hệ"
          name="contactEmail"
          rules={[
            { required: true, type: 'email', message: 'Email không hợp lệ!' },
          ]}
        >
          <Input />
        </Form.Item>
      </Col>

      {/* Upload Ảnh */}
      <Col span={24}>
        <Form.Item label="Ảnh bìa (Thumbnail)">
          <Upload
            name="thumbnail"
            listType="picture-card"
            className="avatar-uploader"
            maxCount={1}
            customRequest={handleUpload}
            onChange={handleChange}
            onPreview={handlePreview}
            fileList={fileList}
          >
            {fileList.length < 1 && (
              <div>
                {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Col>

      {/* Editor Mô tả */}
      <Col span={24}>
        <Form.Item label="Mô tả chi tiết">
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            style={{ height: 200, marginBottom: 50 }}
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default InfoTab;
