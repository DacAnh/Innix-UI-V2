import { Modal, Form, Tabs, message, notification } from 'antd';
import { useEffect, useState } from 'react';
import { callCreateRole, callUpdateRole } from '../../../services/role.service'; // Chú ý đường dẫn
import { callFetchPermission } from '../../../services/role.service';

// Import các phần tử con
import RoleInfoTab from './tabs/RoleInfoTab';
import PermissionMatrixTab from './tabs/PermissionMatrixTab';

const ModalRole = (props) => {
  const { openModal, setOpenModal, fetchData, dataInit, setDataInit } = props;
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [listPermissions, setListPermissions] = useState([]);

  // 1. Fetch Permissions
  useEffect(() => {
    const fetchPermissions = async () => {
      const res = await callFetchPermission(`page=1&size=1000`);
      if (res?.statusCode === 200) {
        setListPermissions(res.data.result);
      }
    };
    if (openModal) fetchPermissions();
  }, [openModal]);

  // 2. Fill Data
  useEffect(() => {
    if (openModal && dataInit?.id) {
      form.setFieldsValue({
        name: dataInit.name,
        description: dataInit.description,
        active: dataInit.active,
        // Map permission object array -> ID array
        permissions: dataInit.permissions?.map((p) => p.id),
      });
    } else {
      form.resetFields();
      form.setFieldValue('active', true);
    }
  }, [dataInit, openModal, form]);

  const handleCancel = () => {
    setOpenModal(false);
    setDataInit(null);
    form.resetFields();
  };

  const onFinish = async (values) => {
    const { name, description, active, permissions } = values;

    // Map ID array -> Object array {id: 1}
    const checkedPermissions = permissions
      ? permissions.map((id) => ({ id }))
      : [];

    const payload = {
      name,
      description,
      active,
      permissions: checkedPermissions,
    };

    if (dataInit?.id) payload.id = dataInit.id;

    setIsSubmit(true);
    const apiCall = dataInit?.id
      ? callUpdateRole(payload)
      : callCreateRole(payload);
    const res = await apiCall;

    if (res?.statusCode === 200 || res?.statusCode === 201) {
      message.success(
        dataInit?.id ? 'Cập nhật thành công' : 'Tạo mới thành công'
      );
      handleCancel();
      fetchData();
    } else {
      notification.error({ message: 'Lỗi', description: res?.message });
    }
    setIsSubmit(false);
  };

  const items = [
    {
      key: 'info',
      label: 'Thông tin chung',
      children: <RoleInfoTab />,
    },
    {
      key: 'permissions',
      label: `Phân quyền (${listPermissions.length})`,
      children: <PermissionMatrixTab listPermissions={listPermissions} />,
    },
  ];

  return (
    <Modal
      title={dataInit?.id ? 'Cập nhật Role' : 'Tạo mới Role'}
      open={openModal}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      width={800}
      confirmLoading={isSubmit}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Tabs defaultActiveKey="info" items={items} />
      </Form>
    </Modal>
  );
};

export default ModalRole;
