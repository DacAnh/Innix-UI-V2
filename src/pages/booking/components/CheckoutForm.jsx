import React from 'react';

const InputField = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  required,
  error,
  min,
}) => (
  <div className="mb-4">
    <label
      className="block text-gray-700 text-sm font-bold mb-2"
      htmlFor={name}
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      className={`shadow appearance-none border ${error ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
    />
    {error && (
      <p className="text-red-500 text-xs my-1">Thông tin này là bắt buộc.</p>
    )}
  </div>
);

const CheckoutForm = ({
  formData,
  errors,
  handleChange,
  handleSubmit,
  isLoading,
  isSubmitDisabled,
  total,
}) => {
  return (
    <div className="relative bg-white border shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-lg mx-auto mt-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">
        Thông tin người đặt
      </h2>

      <form onSubmit={handleSubmit} className={isLoading ? 'opacity-40' : ''}>
        <InputField
          label="Họ và tên"
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Nguyễn Văn A"
          required={true}
          error={errors.fullName}
        />
        <InputField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="email@example.com"
          required={true}
          error={errors.email}
        />
        <InputField
          label="Số điện thoại"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="09xxxxxxxx"
          required={true}
          error={errors.phone}
        />
        <InputField
          label="Số lượng khách"
          type="number"
          name="guestCount"
          value={formData.guestCount}
          onChange={handleChange}
          placeholder="1"
          min="1"
          required={true}
        />

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="note"
          >
            Ghi chú (Tùy chọn)
          </label>
          <textarea
            className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="note"
            name="note"
            rows="3"
            value={formData.note}
            onChange={handleChange}
            placeholder="Yêu cầu đặc biệt..."
          />
        </div>

        <div className="flex items-center justify-center mt-6">
          <button
            className={`bg-brand hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full transition duration-300 shadow-lg flex justify-center items-center ${isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            type="submit"
            disabled={isSubmitDisabled}
          >
            <img
              src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746013.png"
              alt="VNPAY"
              className="h-6 mr-2 bg-white rounded px-1 object-contain"
            />
            Thanh toán{' '}
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(total || 0)}
          </button>
        </div>

        <p className="text-xs text-center text-gray-500 mt-3">
          Bạn sẽ được chuyển hướng đến cổng thanh toán an toàn của VNPAY.
        </p>
      </form>
    </div>
  );
};

export default CheckoutForm;
