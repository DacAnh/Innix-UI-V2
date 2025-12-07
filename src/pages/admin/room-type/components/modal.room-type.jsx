import {
  Modal,
  Form,
  Input,
  message,
  notification,
  InputNumber,
  Checkbox,
  Row,
  Col,
  Upload,
} from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import {
  callCreateRoomType,
  callUpdateRoomType,
} from '../../../../services/room.service';
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
  const [amenityOptions, setAmenityOptions] = useState([]);

  // Upload States
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [dataImage, setDataImage] = useState([]); // Danh sách ảnh (có thể nhiều ảnh)
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  // Fetch Tiện ích (Giữ nguyên logic cũ)
  useEffect(() => {
    if (openModal) {
      setAmenityOptions([
        { label: 'Wifi miễn phí', value: 1 },
        { label: 'Điều hòa', value: 2 },
        { label: 'Bể bơi riêng', value: 3 },
      ]);
    }
  }, [openModal]);

  // Fill dữ liệu khi Sửa
  useEffect(() => {
    if (openModal && dataInit?.id) {
      const amenityIds = dataInit.amenities
        ? dataInit.amenities.map((a) => a.id)
        : [];
      form.setFieldsValue({
        ...dataInit,
        amenityIds: amenityIds,
      });

      // Fill ảnh cũ (nếu có)
      if (dataInit.imageUrls && dataInit.imageUrls.length > 0) {
        const fileList = dataInit.imageUrls.map((url, index) => ({
          uid: `-${index}`,
          name: `image-${index}.png`,
          status: 'done',
          url: url,
        }));
        setDataImage(fileList);
      } else {
        setDataImage([]);
      }
    } else {
      form.resetFields();
      setDataImage([]);
    }
  }, [dataInit, openModal]);

  const handleCancel = () => {
    setOpenModal(false);
    setDataInit(null);
    form.resetFields();
    setDataImage([]);
  };

  // === LOGIC UPLOAD ẢNH (Cho phép nhiều ảnh) ===
  const handleUploadFileImage = async ({ file, onSuccess, onError }) => {
    setLoadingUpload(true);
    try {
      const res = await callUploadFile(file, 'room-types'); // Upload vào folder room-types
      if (res && res.statusCode === 200) {
        const fileName = res.data.fileName;
        const url = `${import.meta.env.VITE_BACKEND_URL}/storage/room-types/${fileName}`;
        onSuccess({ url: url, fileName: fileName }, file);
      } else {
        onError('Lỗi upload');
      }
    } catch (error) {
      console.log(error);
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
    // Logic xóa ảnh khỏi list
    const newFileList = dataImage.filter((item) => item.uid !== file.uid);
    setDataImage(newFileList);
  };

  const onFinish = async (values) => {
    // Lấy danh sách URL ảnh từ state
    const imageUrls = dataImage
      .map((item) => item.url || item.response?.url)
      .filter((item) => item);

    if (imageUrls.length === 0) {
      notification.error({
        message: 'Lỗi validate',
        description: 'Vui lòng upload ít nhất 1 ảnh!',
      });
      return;
    }

    const payload = {
      ...values,
      accommodationId: accommodationId,
      imageUrls: imageUrls, // Gửi mảng URL lên Backend (List<String>)
    };

    setIsSubmit(true);
    if (dataInit?.id) {
      const res = await callUpdateRoomType(
        accommodationId,
        dataInit.id,
        payload
      );
      if (res && res.statusCode === 200) {
        message.success('Cập nhật thành công');
        handleCancel();
        fetchData();
      }
      // else notification.error({ message: 'Lỗi', description: res.message });
    } else {
      const res = await callCreateRoomType(accommodationId, payload);
      if (res && res.statusCode === 201) {
        message.success('Tạo mới thành công');
        handleCancel();
        fetchData();
      }
      // else notification.error({ message: 'Lỗi', description: res.message });
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
                rules={[{ required: true }]}
              >
                <Input placeholder="VD: Phòng Deluxe" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Cấu hình giường" name="bedConfiguration">
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

            {/* --- PHẦN UPLOAD ẢNH MỚI --- */}
            <Col span={24}>
              <Form.Item label="Hình ảnh phòng">
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  multiple={true} // Cho phép upload nhiều ảnh
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
            <Col span={24}>
              <Form.Item label="Tiện ích phòng (Chờ API)" name="amenityIds">
                <Checkbox.Group options={amenityOptions} />
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
