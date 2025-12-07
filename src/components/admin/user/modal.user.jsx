import { Modal, Form, message, notification } from 'antd';
import { useEffect, useState } from 'react';
import { callCreateUser, callUpdateUser } from '../../../services/user.service';
import { callFetchRole } from '../../../services/role.service';

// Import component con (Chỉ cần 1 cái)
import UserInfoTab from './tabs/UserInfoTab';

const ModalUser = (props) => {
  const { openModal, setOpenModal, fetchUser, dataInit, setDataInit } = props;
  const [isSubmit, setIsSubmit] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]);
  const [form] = Form.useForm();

  // 1. Fetch Roles
  useEffect(() => {
    const fetchRoles = async () => {
      const res = await callFetchRole(`page=1&size=100`);
      if (res?.statusCode === 200) {
        setRoleOptions(
          res.data.result.map((item) => ({ label: item.name, value: item.id }))
        );
      }
    };
    if (openModal) fetchRoles();
  }, [openModal]);

  // 2. Fill Data
  useEffect(() => {
    if (openModal && dataInit?.id) {
      // Logic tách tên
      const fullName = dataInit.fullName || '';
      const lastSpaceIndex = fullName.lastIndexOf(' ');
      let firstName = fullName;
      let lastName = '';

      if (lastSpaceIndex !== -1) {
        lastName = fullName.substring(0, lastSpaceIndex);
        firstName = fullName.substring(lastSpaceIndex + 1);
      }

      form.setFieldsValue({
        ...dataInit,
        firstName,
        lastName,
        role: dataInit.roleUser?.id || null,
      });
    } else {
      form.resetFields();
    }
  }, [dataInit, openModal, form]);

  const handleCancel = () => {
    setOpenModal(false);
    setDataInit(null);
    form.resetFields();
  };

  const onFinish = async (values) => {
    const { firstName, lastName, role, ...otherValues } = values;

    // Gộp tên
    const fullName = `${lastName} ${firstName}`.trim();
    // Map role ID sang Object
    const roleUser = role ? { id: role } : null;

    const payload = {
      ...otherValues,
      fullName,
      roleUser,
    };

    if (dataInit?.id) {
      payload.id = dataInit.id;
      delete payload.password;
    }

    setIsSubmit(true);
    const apiCall = dataInit?.id
      ? callUpdateUser(payload)
      : callCreateUser(payload);
    const res = await apiCall;

    if (res?.statusCode === 200 || res?.statusCode === 201) {
      message.success(
        dataInit?.id ? 'Cập nhật thành công' : 'Tạo mới thành công'
      );
      handleCancel();
      fetchUser();
    } else {
      notification.error({
        message: 'Lỗi',
        description: res?.message || 'Có lỗi xảy ra',
      });
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      title={dataInit?.id ? 'Cập nhật người dùng' : 'Tạo mới người dùng'}
      open={openModal}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      confirmLoading={isSubmit}
      width={700}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Gọi component con và truyền roleOptions vào */}
        <UserInfoTab isEditMode={!!dataInit?.id} roleOptions={roleOptions} />
      </Form>
    </Modal>
  );
};

export default ModalUser;
