import {
  Modal,
  Form,
  Input,
  message,
  notification,
  Select,
  Tabs,
  Row,
  Col,
  InputNumber,
  Checkbox,
  Upload,
} from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import {
  callCreateAccommodation,
  callUpdateAccommodation,
  callFetchAccommodationType,
  callFetchAmenities,
  callUploadFile,
} from '../../../config/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ModalAccommodation = (props) => {
  const { openModal, setOpenModal, fetchData, dataInit, setDataInit } = props;
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [isTabsReady, setIsTabsReady] = useState(false);

  // Data Sources
  const [typeOptions, setTypeOptions] = useState([]);
  const [amenityOptions, setAmenityOptions] = useState([]);

  // Form States
  const [description, setDescription] = useState('');

  // Upload States
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [dataImage, setDataImage] = useState([]); // Chứa file ảnh bìa
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  // 1. Fetch Data (Loại hình & Tiện ích)
  useEffect(() => {
    const fetchPrerequisites = async () => {
      // Lấy Loại hình
      const resType = await callFetchAccommodationType(`page=1&size=100`);
      if (resType && resType.statusCode === 200) {
        setTypeOptions(
          resType.data.result.map((item) => ({
            label: item.displayName,
            value: item.id,
          }))
        );
      }

      // Lấy Tiện ích
      const resAmenity = await callFetchAmenities(`page=1&size=100`);
      if (resAmenity && resAmenity.statusCode === 200) {
        setAmenityOptions(
          resAmenity.data.result.map((item) => ({
            label: item.name,
            value: item.id,
          }))
        );
      }
    };

    if (openModal) {
      fetchPrerequisites();
    }
  }, [openModal]);

  // 2. Fill Data khi Edit
  useEffect(() => {
    if (openModal) {
      if (dataInit?.id) {
        // --- Xử lý dữ liệu khi Sửa ---
        const accommodationTypeId = dataInit.type ? dataInit.type.id : null;
        const amenityIds = dataInit.amenities
          ? dataInit.amenities.map((a) => a.id)
          : [];

        // Xử lý ảnh bìa
        if (dataInit.thumbnailImageUrl) {
          // Kiểm tra xem DB lưu full URL hay tên file
          const isFullUrl = dataInit.thumbnailImageUrl.startsWith('http');
          const url = isFullUrl
            ? dataInit.thumbnailImageUrl
            : `${import.meta.env.VITE_BACKEND_URL}/storage/accommodations/${dataInit.thumbnailImageUrl}`;

          setDataImage([
            {
              uid: '-1',
              name: dataInit.thumbnailImageUrl, // Lưu tên file gốc
              status: 'done',
              url: url,
            },
          ]);
        } else {
          setDataImage([]);
        }

        form.setFieldsValue({
          ...dataInit,
          accommodationTypeId: accommodationTypeId,
          amenityIds: amenityIds,
        });
        setDescription(dataInit.description || '');
      } else {
        // --- Reset khi Tạo mới ---
        form.resetFields();
        setDescription('');
        setDataImage([]);
      }

      // Hack để render Tabs đúng cách
      setTimeout(() => setIsTabsReady(true), 50);
    } else {
      setIsTabsReady(false);
    }
  }, [dataInit, openModal, form]); // Bỏ typeOptions khỏi dependency để tránh reset form

  const handleCancel = () => {
    setOpenModal(false);
    setDataInit(null);
    form.resetFields();
    setDescription('');
    setDataImage([]);
    setIsTabsReady(false);
  };

  // === LOGIC UPLOAD ẢNH ===
  const handleUploadFileImage = async ({ file, onSuccess, onError }) => {
    setLoadingUpload(true);
    try {
      const res = await callUploadFile(file, 'accommodations');
      if (res && res.statusCode === 200) {
        const fileName = res.data.fileName;
        const url = `${import.meta.env.VITE_BACKEND_URL}/storage/accommodations/${fileName}`;

        // Tạo object file chuẩn
        const newFile = {
          uid: file.uid,
          name: fileName,
          status: 'done',
          url: url,
          response: { fileName, url },
        };

        // ✅ CẬP NHẬT STATE TRỰC TIẾP TẠI ĐÂY
        setDataImage([newFile]);

        onSuccess('ok');
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

  const handleChange = ({ fileList }) => {
    // Nếu fileList rỗng (người dùng xóa ảnh), cập nhật state rỗng
    if (fileList.length === 0) {
      setDataImage([]);
    }
  };

  // === SUBMIT ===

  const onFinish = async (values) => {
    const {
      name,
      country,
      province,
      district,
      ward,
      addressLine,
      contactPhone,
      contactEmail,
      accommodationTypeId,
      amenityIds,
      latitude,
      longitude,
    } = values;

    // === 1. LOGIC LẤY URL ẢNH (SỬA LẠI CHO CHẮC CHẮN) ===
    let thumbnailImageUrl = '';
    if (dataImage.length > 0) {
      // Nếu là ảnh mới upload -> lấy từ name (do handleUpload đã gán fileName vào name)
      // Nếu là ảnh cũ -> lấy từ name (do useEffect đã gán)
      thumbnailImageUrl = dataImage[0].name;

      // Trường hợp đặc biệt: Nếu name là full URL (do logic cũ nào đó), ta phải cắt lấy tên file
      // Nhưng với logic chuẩn ở trên, name luôn là fileName (vd: "abc.jpg")
    }

    console.log('DEBUG Submit:', { dataImage, thumbnailImageUrl });

    if (!thumbnailImageUrl) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng upload ảnh bìa!',
      });
      return;
    }

    // === 3. TẠO PAYLOAD ===
    const payload = {
      name,
      description: description, // Lấy từ state ReactQuill
      totalRoom: values.totalRoom,
      country,
      province,
      district,
      ward,
      addressLine,
      contactPhone,
      contactEmail,
      isPriority: values.isPriority || false,
      priorityLevel: values.priorityLevel || 0,
      autoApproveBookings: values.autoApproveBookings || false,

      accommodationTypeId,
      amenityIds: amenityIds || [],

      thumbnailImageUrl: thumbnailImageUrl, // ✅ Đảm bảo biến này có giá trị
      latitude: latitude || null,
      longitude: longitude || null,
    };

    console.log('Payload gửi đi:', payload); // Xem cái này trong F12 Console

    setIsSubmit(true);

    let res;
    if (dataInit?.id) {
      res = await callUpdateAccommodation(dataInit.id, payload);
    } else {
      res = await callCreateAccommodation(payload);
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

  const tabItems = [
    {
      key: 'info',
      label: `Thông tin cơ bản`,
      children: (
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Tên Chỗ ở"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
            >
              <Input />
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
          <Col span={12}>
            <Form.Item
              label="SĐT Liên hệ"
              name="contactPhone"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Email Liên hệ"
              name="contactEmail"
              rules={[{ required: true, type: 'email' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Ảnh bìa (Thumbnail)">
              <Upload
                name="thumbnail"
                listType="picture-card"
                className="avatar-uploader"
                maxCount={1}
                multiple={false}
                customRequest={handleUploadFileImage}
                onChange={handleChange}
                onPreview={handlePreview}
                fileList={dataImage}
              >
                {dataImage.length < 1 && (
                  <div>
                    {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>
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
      ),
    },
    {
      key: 'address',
      label: `Địa chỉ`,
      children: (
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Quốc gia"
              name="country"
              rules={[{ required: true }]}
              initialValue={'Việt Nam'}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Tỉnh/Thành phố"
              name="province"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Phường/Xã"
              name="ward"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Địa chỉ chi tiết"
              name="addressLine"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Vĩ độ (Lat)" name="latitude">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Kinh độ (Long)" name="longitude">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      key: 'amenities',
      label: `Tiện ích`,
      children: (
        <Form.Item name="amenityIds">
          <Checkbox.Group options={amenityOptions} />
        </Form.Item>
      ),
    },
  ];

  return (
    <>
      <Modal
        title={dataInit?.id ? 'Cập nhật Chỗ ở' : 'Thêm mới Chỗ ở'}
        open={openModal}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        confirmLoading={isSubmit}
        width={1000}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {isTabsReady ? (
            <Tabs defaultActiveKey="info" items={tabItems} forceRender={true} />
          ) : (
            <div
              style={{
                height: '200px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              Loading form...
            </div>
          )}
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

export default ModalAccommodation;
