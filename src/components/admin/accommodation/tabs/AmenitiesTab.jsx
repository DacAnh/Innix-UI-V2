import { Form, Checkbox } from 'antd';

const AmenitiesTab = ({ amenityOptions }) => {
  return (
    <Form.Item name="amenityIds">
      <Checkbox.Group options={amenityOptions} />
    </Form.Item>
  );
};

export default AmenitiesTab;
