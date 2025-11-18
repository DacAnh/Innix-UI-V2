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
} from 'antd';
import { useEffect, useState } from 'react';
import {
  callCreateRoomType,
  callUpdateRoomType,
  callFetchAmenities,
} from '../../../config/api';

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

  // Fetch Tiện ích
  useEffect(() => {
    const fetchAmenities = async () => {
      // TODO: Chờ API Backend
      // const res = await callFetchAmenities('page=1&size=100');
      // if (res && res.statusCode === 200) {
      //     setAmenityOptions(res.data.result.map(item => ({ label: item.name, value: item.id })));
      // }
      setAmenityOptions([
        { label: 'Wifi miễn phí', value: 1 },
        { label: 'Điều hòa', value: 2 },
        { label: 'Bể bơi riêng', value: 3 },
      ]);
    };
    if (openModal) {
      fetchAmenities();
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
    } else {
      form.resetFields();
    }
  }, [dataInit, openModal]);

  const handleCancel = () => {
    setOpenModal(false);
    setDataInit(null);
    form.resetFields();
  };

  const onFinish = async (values) => {
    setIsSubmit(true);
    // Khớp với RoomTypeRequest.java
    const payload = {
      ...values,
      accommodationId: accommodationId, // Gắn ID chỗ ở vào (API Controller cũ không cần, nhưng DTO mới cần)
    };

    if (dataInit?.id) {
      // API mới yêu cầu cả 2 ID trên URL
      const res = await callUpdateRoomType(
        accommodationId,
        dataInit.id,
        payload
      );
      if (res && res.statusCode === 200) {
        message.success('Cập nhật thành công');
        handleCancel();
        fetchData();
      } else notification.error({ message: 'Lỗi', description: res.message });
    } else {
      // API mới yêu cầu accId trên URL
      const res = await callCreateRoomType(accommodationId, payload);
      if (res && res.statusCode === 201) {
        message.success('Tạo mới thành công');
        handleCancel();
        fetchData();
      } else notification.error({ message: 'Lỗi', description: res.message });
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      title={dataInit?.id ? 'Cập nhật Loại phòng' : 'Thêm mới Loại phòng'}
      open={openModal}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      confirmLoading={isSubmit}
      width={700}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Tên Loại phòng"
              name="name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Số lượng phòng"
              name="quantity"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Giá (VND)"
              name="price"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Sức chứa (Người lớn)"
              name="capacityAdult"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Sức chứa (Trẻ em)"
              name="capacityChild"
              rules={[{ required: true }]}
              initialValue={0}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
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
  );
};

export default ModalRoomType;
