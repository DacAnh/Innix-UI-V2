import { Form, Collapse, Row, Col, Checkbox, Switch, Empty } from 'antd';
import { useState } from 'react';
import _ from 'lodash';

// Component con nội bộ (để Modal cha gọi Form.Item name="permissions")
// NHƯNG để nó hoạt động với Form.Item, component này phải nhận props: value, onChange
const PermissionSelection = ({ value = [], onChange, listPermissions }) => {
  const groupByModule = _.groupBy(listPermissions, 'module');
  const [activePanelKeys, setActivePanelKeys] = useState([]);

  // Toggle 1 quyền
  const onSingleCheck = (permissionId, checked) => {
    let nextValue = [...value];
    if (checked) {
      if (!nextValue.includes(permissionId)) nextValue.push(permissionId);
    } else {
      nextValue = nextValue.filter((id) => id !== permissionId);
    }
    onChange(nextValue);
  };

  // Toggle cả module
  const handleSwitchModule = (module, checked) => {
    const permissionsInModule = groupByModule[module].map((p) => p.id);
    let nextValue = [...value];

    if (checked) {
      // Add missing IDs
      const missingIds = permissionsInModule.filter(
        (id) => !nextValue.includes(id)
      );
      nextValue = [...nextValue, ...missingIds];
    } else {
      // Remove all IDs of module
      nextValue = nextValue.filter((id) => !permissionsInModule.includes(id));
    }

    onChange(nextValue);
    if (!activePanelKeys.includes(module)) {
      setActivePanelKeys((prev) => [...prev, module]);
    }
  };

  const handleCollapseChange = (keys) => setActivePanelKeys(keys);

  if (!listPermissions || listPermissions.length === 0)
    return <Empty description="Chưa có quyền nào" />;

  return (
    <Collapse activeKey={activePanelKeys} onChange={handleCollapseChange}>
      {Object.entries(groupByModule).map(([module, perms]) => {
        const isModuleChecked =
          perms.length > 0 && perms.every((p) => value.includes(p.id));

        return (
          <Collapse.Panel
            header={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  alignItems: 'center',
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
                        fontWeight: '500',
                        marginRight: 5,
                      }}
                    >
                      [{p.method}]
                    </span>
                    {p.apiPath} <br />
                    <small style={{ color: '#888', marginLeft: 50 }}>
                      {p.name}
                    </small>
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

const PermissionMatrixTab = ({ listPermissions }) => {
  return (
    <Form.Item name="permissions">
      <PermissionSelection listPermissions={listPermissions} />
    </Form.Item>
  );
};

export default PermissionMatrixTab;
