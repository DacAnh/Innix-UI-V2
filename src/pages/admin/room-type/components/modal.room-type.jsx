import {
  Modal,
  Form,
  Input,
  message,
  notification,
  InputNumber,
  Row,
  Col,
  Upload,
  Select, // ✅ Dùng Select thay vì Checkbox
} from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import {
  callCreateRoomType,
  callUpdateRoomType,
} from '../../../../services/room.service';
import { callFetchAmenities } from '../../../../services/accommodation.service'; // ✅ Import API Tiện ích
import { callUploadFile } from '../../../../services/file.service';

const ModalRoomType = (props) => {
  const {
    openModal,
    setOpenModal,
    fetchData,
    dataInit,
    setDataInit,
    accommodationId,
  } = props;
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [amenityOptions, setAmenityOptions] = useState([]); // State lưu tiện ích từ API

  // Upload States
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [dataImage, setDataImage] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  // 1. Fetch Tiện ích từ Backend (Dùng API thật)
  useEffect(() => {
    const fetchAmenities = async () => {
      // Lấy tất cả tiện ích
      const res = await callFetchAmenities('page=1&size=100');
      if (res && res.statusCode === 200) {
        // Map về dạng { label, value } cho Select
        const options = res.data.result.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        setAmenityOptions(options);
      }
    };

    if (openModal) {
      fetchAmenities();
    }
  }, [openModal]);

  // 2. Fill Data khi Edit
  useEffect(() => {
    if (openModal && dataInit?.id) {
      // Fill tiện ích
      const amenityIds = dataInit.amenities
        ? dataInit.amenities.map((a) => a.id)
        : [];

      form.setFieldsValue({
        ...dataInit,
        amenityIds: amenityIds, // Fill vào form
      });

      // Fill ảnh cũ
      if (dataInit.imageUrls && dataInit.imageUrls.length > 0) {
        const fileList = dataInit.imageUrls.map((url, index) => {
          const isFullUrl = url.startsWith('http');
          const finalUrl = isFullUrl
            ? url
            : `${import.meta.env.VITE_BACKEND_URL}/storage/room-types/${url}`;
          return {
            uid: `-${index}`,
            name: `image-${index}.png`, // Tên giả
            status: 'done',
            url: finalUrl,
            response: { url: finalUrl }, // Để logic submit lấy được
          };
        });
        setDataImage(fileList);
      } else {
        setDataImage([]);
      }
    } else {
      // Reset khi tạo mới
      form.resetFields();
      setDataImage([]);
    }
  }, [dataInit, openModal, form]);

  const handleCancel = () => {
    setOpenModal(false);
    setDataInit(null);
    form.resetFields();
    setDataImage([]);
  };

  // === LOGIC UPLOAD ẢNH ===
  const handleUploadFileImage = async ({ file, onSuccess, onError }) => {
    setLoadingUpload(true);
    try {
      const res = await callUploadFile(file, 'room-types');
      if (res && res.statusCode === 200) {
        const fileName = res.data.fileName;
        const url = `${import.meta.env.VITE_BACKEND_URL}/storage/room-types/${fileName}`;
        onSuccess({ url: url, fileName: fileName }, file);
      } else {
        onError('Lỗi upload');
      }
    } catch (error) {
      onError('Lỗi upload');
    }
    setLoadingUpload(false);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    );
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleChange = ({ fileList: newFileList }) => {
    // Cập nhật lại list file, giữ lại response url
    const newFiles = newFileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
        file.status = 'done';
      }
      return file;
    });
    setDataImage(newFiles);
  };

  const handleRemove = (file) => {
    const newFileList = dataImage.filter((item) => item.uid !== file.uid);
    setDataImage(newFileList);
  };

  // === SUBMIT ===
  const onFinish = async (values) => {
    // 1. Lấy URL ảnh
    const imageUrls = dataImage
      .map((item) => item.url || item.response?.url)
      .filter((item) => item); // Lọc null

    if (imageUrls.length === 0) {
      notification.error({
        message: 'Lỗi validate',
        description: 'Vui lòng upload ít nhất 1 ảnh!',
      });
      return;
    }

    // 2. Lấy tiện ích (đảm bảo luôn là mảng)
    const amenityIds = values.amenityIds || [];

    // 3. Payload
    const payload = {
      ...values,
      accommodationId: accommodationId,
      imageUrls: imageUrls, // List<String>
      amenityIds: amenityIds, // List<Long>
    };

    setIsSubmit(true);
    let res;
    if (dataInit?.id) {
      // Update
      res = await callUpdateRoomType(accommodationId, dataInit.id, payload);
    } else {
      // Create
      res = await callCreateRoomType(accommodationId, payload);
    }

    if (res && (res.statusCode === 200 || res.statusCode === 201)) {
      message.success(
        dataInit?.id ? 'Cập nhật thành công' : 'Tạo mới thành công'
      );
      handleCancel();
      fetchData();
    } else {
      notification.error({
        message: 'Lỗi',
        description: res?.message || 'Có lỗi xảy ra',
      });
    }
    setIsSubmit(false);
  };

  return (
    <>
      <Modal
        title={dataInit?.id ? 'Cập nhật Loại phòng' : 'Thêm mới Loại phòng'}
        open={openModal}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        confirmLoading={isSubmit}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên Loại phòng"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
              >
                <Input placeholder="VD: Phòng Deluxe" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Cấu hình giường"
                name="bedConfiguration"
                rules={[{ required: true }]}
              >
                <Input placeholder="VD: 1 Giường đôi cực lớn" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Diện tích (m²)"
                name="areaSize"
                rules={[{ required: true }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Sức chứa (Người)"
                name="maxGuest"
                rules={[{ required: true }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} />
              </Form.Item>
            </Col>

            {/* UPLOAD ẢNH */}
            <Col span={24}>
              <Form.Item label="Hình ảnh phòng">
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  multiple={true}
                  customRequest={handleUploadFileImage}
                  onChange={handleChange}
                  onPreview={handlePreview}
                  onRemove={handleRemove}
                  fileList={dataImage}
                >
                  <div>
                    {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Mô tả" name="description">
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>

            {/* CHỌN TIỆN ÍCH (SELECT MULTIPLE) */}
            <Col span={24}>
              <Form.Item label="Tiện ích phòng" name="amenityIds">
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: '100%' }}
                  placeholder="Chọn các tiện ích có trong phòng này..."
                  options={amenityOptions}
                  filterOption={(input, option) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default ModalRoomType;
