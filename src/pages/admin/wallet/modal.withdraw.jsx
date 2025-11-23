import { Modal, Form, Input, InputNumber, message, notification } from 'antd';
import { useState } from 'react';
import { callRequestWithdraw } from '../../../config/api';

const ModalWithdraw = (props) => {
  const { openModal, setOpenModal, fetchWallet, fetchTransactions } = props;
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();

  const handleCancel = () => {
    setOpenModal(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    setIsSubmit(true);
    const res = await callRequestWithdraw(values);
    if (res && res.statusCode === 200) {
      message.success('Gửi yêu cầu rút tiền thành công!');
      handleCancel();
      fetchWallet(); // Cập nhật lại số dư (nếu backend trừ ngay hoặc pending)
      fetchTransactions(); // Cập nhật lại lịch sử
    } else {
      notification.error({
        message: 'Lỗi',
        description: res?.message || 'Không thể thực hiện rút tiền',
      });
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      title="Yêu cầu Rút tiền"
      open={openModal}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      confirmLoading={isSubmit}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Số tiền muốn rút (VND)"
          name="amount"
          rules={[
            { required: true, message: 'Vui lòng nhập số tiền!' },
            {
              type: 'number',
              min: 50000,
              message: 'Số tiền tối thiểu là 50,000đ',
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            addonAfter="VND"
          />
        </Form.Item>

        <Form.Item
          label="Tên Ngân hàng"
          name="bankName"
          rules={[{ required: true, message: 'Nhập tên ngân hàng!' }]}
        >
          <Input placeholder="VD: Vietcombank, TPBank..." />
        </Form.Item>

        <Form.Item
          label="Số tài khoản"
          name="bankAccountNumber"
          rules={[{ required: true, message: 'Nhập số tài khoản!' }]}
        >
          <Input placeholder="VD: 123456789" />
        </Form.Item>

        <Form.Item
          label="Tên chủ tài khoản"
          name="accountHolderName"
          rules={[{ required: true, message: 'Nhập tên chủ tài khoản!' }]}
        >
          <Input
            placeholder="VD: NGUYEN VAN A"
            style={{ textTransform: 'uppercase' }}
          />
        </Form.Item>

        <Form.Item label="Ghi chú" name="note">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalWithdraw;
