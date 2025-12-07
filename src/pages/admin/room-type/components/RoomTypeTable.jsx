import { Table, Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const RoomTypeTable = ({
  dataSource,
  loading,
  onEdit,
  onDelete,
  onSelect,
  selectedId,
}) => {
  const columns = [
    {
      title: 'Tên loại phòng',
      dataIndex: 'name',
      render: (text, record) => (
        <a onClick={() => onEdit(record)} style={{ fontWeight: 'bold' }}>
          {text}
        </a>
      ),
    },
    { title: 'Sức chứa', render: (_, record) => `${record.maxGuest} người` },
    { title: 'Diện tích', render: (_, record) => `${record.areaSize} m²` },
    { title: 'Giường', dataIndex: 'bedConfiguration' },
    {
      title: 'Hành động',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(record);
            }}
          />
          <Popconfirm
            title="Bạn chắc chắn muốn xóa?"
            onConfirm={(e) => {
              e.stopPropagation();
              onDelete(record.id);
            }}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      rowKey="id"
      pagination={false} // Hoặc true nếu bạn muốn phân trang
      // Logic highlight dòng đang chọn
      rowClassName={(record) => (record.id === selectedId ? 'bg-blue-50' : '')}
      onRow={(record) => ({
        onClick: () => onSelect(record), // Click dòng để chọn xem lịch
        style: { cursor: 'pointer' },
      })}
    />
  );
};

export default RoomTypeTable;
