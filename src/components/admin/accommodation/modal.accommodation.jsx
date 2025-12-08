import { Modal, Form, Tabs, message, notification } from 'antd';
import { useEffect, useState } from 'react';
import {
  callCreateAccommodation,
  callUpdateAccommodation,
  callFetchAccommodationType,
  // callFetchAmenities,
} from '../../../services/accommodation.service'; // Chú ý đường dẫn import
import { callUploadFile } from '../../../services/file.service';

// Import Tabs con
import InfoTab from './tabs/InfoTab';
import AddressTab from './tabs/AddressTab';
// import AmenitiesTab from './tabs/AmenitiesTab';

const ModalAccommodation = (props) => {
  const { openModal, setOpenModal, fetchData, dataInit, setDataInit } = props;
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [isTabsReady, setIsTabsReady] = useState(false);

  // Data Sources
  const [typeOptions, setTypeOptions] = useState([]);
  // const [amenityOptions, setAmenityOptions] = useState([]);

  // Form States
  const [description, setDescription] = useState('');

  // Upload States
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  // 1. Fetch Data (Loại hình & Tiện ích)
  useEffect(() => {
    const fetchPrerequisites = async () => {
      const resType = await callFetchAccommodationType(`page=1&size=100`);
      if (resType?.statusCode === 200) {
        setTypeOptions(
          resType.data.result.map((item) => ({
            label: item.displayName,
            value: item.id,
          }))
        );
      }
      // const resAmenity = await callFetchAmenities(`page=1&size=100`);
      // if (resAmenity?.statusCode === 200) {
      //   setAmenityOptions(
      //     resAmenity.data.result.map((item) => ({
      //       label: item.name,
      //       value: item.id,
      //     }))
      //   );
      // }
    };
    if (openModal) fetchPrerequisites();
  }, [openModal]);

  // 2. Fill Data
  useEffect(() => {
    if (openModal) {
      if (dataInit?.id) {
        // Edit Mode
        const accommodationTypeId = dataInit.type ? dataInit.type.id : null;
        // const amenityIds = dataInit.amenities
        //   ? dataInit.amenities.map((a) => a.id)
        //   : [];

        // Fill ảnh
        if (dataInit.thumbnailImageUrl) {
          const isFullUrl = dataInit.thumbnailImageUrl.startsWith('http');
          const url = isFullUrl
            ? dataInit.thumbnailImageUrl
            : `${import.meta.env.VITE_BACKEND_URL}/storage/accommodations/${dataInit.thumbnailImageUrl}`;
          setFileList([
            {
              uid: '-1',
              name: dataInit.thumbnailImageUrl,
              status: 'done',
              url,
            },
          ]);
        } else {
          setFileList([]);
        }

        form.setFieldsValue({
          ...dataInit,
          accommodationTypeId,
          // amenityIds
        });
        setDescription(dataInit.description || '');
      } else {
        // Create Mode
        form.resetFields();
        setDescription('');
        setFileList([]);
      }
      setTimeout(() => setIsTabsReady(true), 50);
    } else {
      setIsTabsReady(false);
    }
  }, [dataInit, openModal, form]);

  const handleCancel = () => {
    setOpenModal(false);
    setDataInit(null);
    form.resetFields();
    setDescription('');
    setFileList([]);
    setIsTabsReady(false);
  };

  // Upload Logic
  const handleUpload = async ({ file, onSuccess, onError }) => {
    setLoadingUpload(true);
    try {
      const res = await callUploadFile(file, 'accommodations');
      if (res && res.statusCode === 200) {
        const fileName = res.data.fileName;
        const url = `${import.meta.env.VITE_BACKEND_URL}/storage/accommodations/${fileName}`;
        const newFile = {
          uid: file.uid,
          name: fileName,
          status: 'done',
          url,
          response: { fileName, url },
        };
        setFileList([newFile]);
        onSuccess('ok');
      } else onError('Lỗi upload');
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
    if (newFileList.length === 0) setFileList([]);
  };

  // Submit Logic
  const onFinish = async (values) => {
    // 1. Get Thumbnail
    let thumbnailImageUrl = '';
    if (fileList.length > 0) {
      thumbnailImageUrl = fileList[0].name;
    }

    if (!thumbnailImageUrl) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng upload ảnh bìa!',
      });
      return;
    }

    // 2. Payload
    const payload = {
      ...values,
      description,
      thumbnailImageUrl,
      isPriority: values.isPriority || false,
      priorityLevel: values.priorityLevel || 0,
      autoApproveBookings: values.autoApproveBookings || false,
      // amenityIds: values.amenityIds || [],
      latitude: values.latitude || null,
      longitude: values.longitude || null,
    };

    setIsSubmit(true);
    const apiCall = dataInit?.id
      ? callUpdateAccommodation(dataInit.id, payload)
      : callCreateAccommodation(payload);
    const res = await apiCall;

    if (res?.statusCode === 200 || res?.statusCode === 201) {
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

  // Tabs Configuration
  const tabItems = [
    {
      key: 'info',
      label: `Thông tin cơ bản`,
      children: (
        <InfoTab
          typeOptions={typeOptions}
          description={description}
          setDescription={setDescription}
          fileList={fileList}
          loadingUpload={loadingUpload}
          handleUpload={handleUpload}
          handleChange={handleChange}
          handlePreview={handlePreview}
        />
      ),
    },
    {
      key: 'address',
      label: `Địa chỉ`,
      children: <AddressTab />,
    },
    // {
    //   key: 'amenities',
    //   label: `Tiện ích`,
    //   children: <AmenitiesTab amenityOptions={amenityOptions} />,
    // },
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
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {isTabsReady ? (
            <Tabs defaultActiveKey="info" items={tabItems} />
          ) : (
            <div
              style={{
                height: 200,
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
