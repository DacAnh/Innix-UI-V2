import {
  Modal,
  Form,
  Input,
  Switch,
  Card,
  Row,
  Col,
  message,
  notification,
  Collapse,
  Checkbox,
} from 'antd';
import { useEffect, useState } from 'react';
import {
  callCreateRole,
  callUpdateRole,
  callFetchPermission,
} from '../../../services/role.service';
import _ from 'lodash';

const ModalRole = (props) => {
  const { openModal, setOpenModal, fetchData, dataInit, setDataInit } = props;
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [listPermissions, setListPermissions] = useState([]);

  // 1. Lấy tất cả Permission về để hiển thị list checkbox
  useEffect(() => {
    const fetchPermissions = async () => {
      const res = await callFetchPermission(`page=1&size=1000`);
      if (res && res.statusCode === 200) {
        setListPermissions(res.data.result);
      }
    };

    // Chỉ gọi API khi Modal được yêu cầu MỞ RA
    if (openModal) {
      fetchPermissions();
    }
  }, [openModal]);

  // 2. Fill dữ liệu khi Sửa
  useEffect(() => {
    if (openModal && dataInit?.id) {
      form.setFieldsValue({
        name: dataInit.name,
        description: dataInit.description,
        active: dataInit.active,
        permissions: dataInit.permissions?.map((p) => p.id),
      });
    } else {
      form.resetFields();
      form.setFieldValue('active', true);
    }
  }, [dataInit, openModal]);

  const handleCancel = () => {
    setOpenModal(false);
    setDataInit(null);
    form.resetFields();
  };

  const onFinish = async (values) => {
    const { name, description, active, permissions } = values;
    // Convert mảng ID thành mảng Object {id: 1} theo đúng format Backend yêu cầu
    const checkedPermissions = permissions
      ? permissions.map((id) => ({ id }))
      : [];

    const data = { name, description, active, permissions: checkedPermissions };
    setIsSubmit(true);

    if (dataInit?.id) {
      // Update
      const res = await callUpdateRole({ ...data, id: dataInit.id });
      if (res && res.statusCode === 200) {
        message.success('Cập nhật Role thành công');
        handleCancel();
        fetchData();
      } else notification.error({ message: 'Lỗi', description: res.message });
    } else {
      // Create
      const res = await callCreateRole(data);
      if (res && res.statusCode === 201) {
        message.success('Tạo Role thành công');
        handleCancel();
        fetchData();
      } else notification.error({ message: 'Lỗi', description: res.message });
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      title={dataInit?.id ? 'Cập nhật Role' : 'Tạo mới Role'}
      open={openModal}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      width={800}
      confirmLoading={isSubmit}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Tên Role"
              name="name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Trạng thái" name="active" valuePropName="checked">
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Mô tả" name="description">
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>

        <Card title="Phân quyền (Permissions)" size="small">
          {/* Component con hiển thị danh sách permission */}
          <Form.Item name="permissions">
            <PermissionSelection listPermissions={listPermissions} />
          </Form.Item>
        </Card>
      </Form>
    </Modal>
  );
};

// Component con để render list checkbox permission
const PermissionSelection = ({ value = [], onChange, listPermissions }) => {
  const groupByModule = _.groupBy(listPermissions, 'module');
  const [activePanelKeys, setActivePanelKeys] = useState([]);

  // Hàm toggle 1 permission đơn lẻ
  const onSingleCheck = (permissionId, checked) => {
    let nextValue = [...value];
    if (checked) {
      // Thêm vào nếu chưa có
      if (!nextValue.includes(permissionId)) {
        nextValue.push(permissionId);
      }
    } else {
      // Xóa đi nếu đang có
      nextValue = nextValue.filter((id) => id !== permissionId);
    }
    onChange(nextValue);
  };

  // Hàm toggle cả module
  const handleSwitchModule = (module, checked) => {
    const permissionsInModule = groupByModule[module].map((p) => p.id);
    let nextValue = [...value];

    if (checked) {
      // Thêm những cái chưa có
      const missingIds = permissionsInModule.filter(
        (id) => !nextValue.includes(id)
      );
      nextValue = [...nextValue, ...missingIds];
    } else {
      // Xóa tất cả của module này
      nextValue = nextValue.filter((id) => !permissionsInModule.includes(id));
    }

    onChange(nextValue);

    // Tự động mở panel
    if (!activePanelKeys.includes(module)) {
      setActivePanelKeys((prev) => [...prev, module]);
    }
  };

  const handleCollapseChange = (keys) => {
    setActivePanelKeys(keys);
  };

  return (
    <Collapse activeKey={activePanelKeys} onChange={handleCollapseChange}>
      {Object.entries(groupByModule).map(([module, perms]) => {
        // Logic check module ON/OFF
        const isModuleChecked =
          perms.length > 0 && perms.every((p) => value.includes(p.id));

        return (
          <Collapse.Panel
            header={
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <span style={{ fontWeight: 'bold' }}>
                  {module} ({perms.length})
                </span>
                <Switch
                  size="small"
                  checked={isModuleChecked}
                  onChange={(checked) => handleSwitchModule(module, checked)}
                  checkedChildren="ON"
                  unCheckedChildren="OFF"
                />
              </div>
            }
            key={module}
          >
            <Row>
              {perms.map((p) => (
                <Col span={12} key={p.id} style={{ marginBottom: 10 }}>
                  {/* Checkbox đơn lẻ*/}
                  <Checkbox
                    checked={value.includes(p.id)}
                    onChange={(e) => onSingleCheck(p.id, e.target.checked)}
                  >
                    <span
                      style={{
                        color:
                          p.method === 'GET'
                            ? 'green'
                            : p.method === 'POST'
                              ? 'blue'
                              : 'orange',
                      }}
                    >
                      [{p.method}]
                    </span>{' '}
                    {p.apiPath} <br />
                    <small style={{ color: '#888' }}>{p.name}</small>
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Collapse.Panel>
        );
      })}
    </Collapse>
  );
};

export default ModalRole;
