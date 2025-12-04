import { Modal, Form, Input, message, notification, Upload } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import {
  callCreateAccommodationType,
  callUpdateAccommodationType,
} from '../../../services/accommodation.service';
import { callUploadFile } from '../../../services/file.service';

const ModalAccommodationType = (props) => {
  const { openModal, setOpenModal, fetchData, dataInit, setDataInit } = props;
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  // State cho Upload
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [dataImage, setDataImage] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  useEffect(() => {
    if (openModal && dataInit?.id) {
      // Fill dữ liệu khi Edit
      form.setFieldsValue(dataInit);

      // Xử lý hiển thị ảnh cũ từ server
      if (dataInit.iconUrl) {
        setDataImage([
          {
            uid: '-1',
            name: 'icon.png',
            status: 'done',
            url: dataInit.iconUrl,
          },
        ]);
      }
    } else {
      form.resetFields();
      setDataImage([]); // Reset ảnh khi tạo mới
    }
  }, [dataInit, openModal]);

  const handleCancel = () => {
    setOpenModal(false);
    setDataInit(null);
    form.resetFields();
    setDataImage([]);
  };

  // === LOGIC UPLOAD FILE ===
  const handleUploadFileImage = async ({ file, onSuccess, onError }) => {
    setLoadingUpload(true);
    try {
      // Gọi API upload với tham số folder là 'accommodation-types'
      const res = await callUploadFile(file, 'accommodation-types');

      if (res && res.statusCode === 200) {
        // FileController thường trả về 200
        const fileName = res.data.fileName;
        const url = `${import.meta.env.VITE_BACKEND_URL}/storage/accommodation-types/${fileName}`;

        // Quan trọng: Gọi onSuccess và truyền URL vào (hoặc object chứa url)
        // Antd sẽ lưu cái này vào file.response
        onSuccess({ url: url, fileName: fileName }, file);
      } else {
        onError('Đã có lỗi khi upload file');
      }
    } catch (error) {
      console.log(error);
      onError('Đã có lỗi khi upload file');
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
    // Logic map để lấy URL từ response (do handleUploadFileImage trả về qua onSuccess)
    const newFiles = newFileList.map((file) => {
      if (file.response) {
        // Nếu có response từ server (upload mới thành công)
        file.url = file.response.url;
        file.status = 'done';
      }
      return file;
    });

    setDataImage(newFiles);
  };

  const handleRemove = (file) => {
    setDataImage([]);
  };

  // === SUBMIT FORM ===
  const onFinish = async (values) => {
    const { name, displayName, description } = values;

    // Validate ảnh
    if (!dataImage || dataImage.length === 0) {
      notification.error({
        message: 'Lỗi validate',
        description: 'Vui lòng upload icon!',
      });
      return;
    }
    // Lấy URL ảnh từ state đã upload thành công
    // Lưu ý: Nếu là ảnh mới upload -> url nằm trong dataImage[0].url (do ta set ở handleUploadFileImage)
    // Nếu là ảnh cũ (khi Edit) -> url cũng nằm trong dataImage[0].url (do ta set ở useEffect)
    // Lấy ảnh đầu tiên
    const imageObj = dataImage[0];

    // Ưu tiên lấy .url trực tiếp (ảnh cũ hoặc ảnh mới đã qua xử lý onChange)
    // Dự phòng lấy .response.url (nếu onChange chưa kịp map)
    const iconUrl = imageObj.url || imageObj.response?.url;

    console.log('Icon URL final:', iconUrl); // Debug xem đã có chưa

    if (!iconUrl) {
      notification.error({
        message: 'Lỗi',
        description: 'Không lấy được đường dẫn ảnh!',
      });
      return;
    }

    const payload = {
      name,
      displayName,
      description,
      iconUrl,
    };
    setIsSubmit(true);

    if (dataInit?.id) {
      // Update
      const res = await callUpdateAccommodationType(payload, dataInit.id);
      if (res && res.statusCode === 200) {
        message.success('Cập nhật thành công');
        handleCancel();
        fetchData();
      } else notification.error({ message: 'Lỗi', description: res.message });
    } else {
      // Create
      const res = await callCreateAccommodationType(payload);
      if (res && res.statusCode === 201) {
        message.success('Tạo mới thành công');
        handleCancel();
        fetchData();
      } else notification.error({ message: 'Lỗi', description: res.message });
    }
    setIsSubmit(false);
  };

  return (
    <>
      <Modal
        title={dataInit?.id ? 'Cập nhật Loại hình' : 'Tạo mới Loại hình'}
        open={openModal}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        confirmLoading={isSubmit}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Mã loại hình (Code)"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập mã!' }]}
          >
            <Input placeholder="HOTEL" />
          </Form.Item>
          <Form.Item
            label="Tên hiển thị"
            name="displayName"
            rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị!' }]}
          >
            <Input placeholder="Khách sạn" />
          </Form.Item>

          <Form.Item label="Icon (Ảnh minh họa)">
            <Upload
              name="logo"
              listType="picture-card"
              className="avatar-uploader"
              maxCount={1}
              multiple={false}
              customRequest={handleUploadFileImage}
              beforeUpload={(file) => {
                const isJpgOrPng =
                  file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng)
                  message.error('Bạn chỉ có thể upload file JPG/PNG!');
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) message.error('Hình ảnh phải nhỏ hơn 2MB!');
                return isJpgOrPng && isLt2M;
              }}
              onChange={handleChange}
              onRemove={handleRemove}
              onPreview={handlePreview}
              fileList={dataImage}
            >
              <div>
                {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
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

export default ModalAccommodationType;
