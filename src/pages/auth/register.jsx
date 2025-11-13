import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'config/axios-customize';
import Toast from 'components/share/toast/Toast';
import { REGISTRATION_MESSAGES } from 'config/constants';
import { callRegister } from '../../config/api';
import { Formik, Form, Field } from 'formik';
import Schemas from 'config/utils/validation-schemas';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Khởi tạo State chứa toàn bộ dữ liệu form khớp với Backend UserRegistrationRequest
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '', // Trường này chỉ dùng ở FE để check
    fullName: '',
    phone: '',
    age: '',
    gender: 'MALE', // Giá trị mặc định khớp với Enum Gender trong Java
    address: '',
  });

  // Hàm xử lý khi nhập liệu (One handler for all inputs)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // 1. Validate cơ bản phía Frontend
    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    setIsLoading(true);
    toast.dismiss(); // Xóa thông báo cũ

    try {
      // 2. Chuẩn bị dữ liệu gửi đi (Loại bỏ confirmPassword)
      const { confirmPassword, ...dataToSend } = formData;

      // Chuyển đổi age sang số nguyên (nếu backend yêu cầu Integer)
      dataToSend.age = parseInt(dataToSend.age);
      dataToSend.fullName = `${formData.lastName} ${formData.firstName}`.trim();

      // 3. Gọi API
      const res = await callRegister(dataToSend);

      // 4. Xử lý kết quả
      if (res && res.statusCode === 201) {
        // Thường tạo mới trả về 201, hoặc 200 tùy code backend bạn
        toast.success('Đăng ký tài khoản thành công!');
        navigate('/login');
      } else {
        // 5. Xử lý lỗi (Logic giống hệt trang Login)
        if (res?.message) {
          let errorsToDisplay = [];
          if (Array.isArray(res.message)) {
            errorsToDisplay = [...res.message];
          } else {
            errorsToDisplay = [res.message];
          }

          // Sắp xếp lỗi
          errorsToDisplay.sort((a, b) => a.localeCompare(b));

          if (errorsToDisplay.length > 1) {
            toast.error(
              <ul
                style={{
                  listStyleType: 'disc',
                  paddingLeft: '20px',
                  textAlign: 'left',
                }}
              >
                {errorsToDisplay.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            );
          } else {
            toast.error(errorsToDisplay[0]);
          }
        } else {
          toast.error('Đăng ký thất bại! Vui lòng thử lại.');
        }
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra từ hệ thống.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Bộ class style dùng chung cho các ô input (lấy từ code cũ của bạn)
  const inputClass =
    'appearance-none block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded focus:outline-none focus:bg-white border';

  return (
    <>
      <div className="register__form">
        <div className="container mx-auto p-4 flex justify-center min-h-[600px] items-center">
          <form onSubmit={handleRegister} className="w-full">
            <div className="w-full max-w-lg p-4 shadow-md md:p-10 mx-auto bg-white rounded-lg">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-extrabold text-brand">
                  Tham Gia Cuộc Phiêu Lưu!
                </h2>
                <p className="text-gray-500">
                  Tạo tài khoản và bắt đầu hành trình của bạn với chúng tôi
                </p>
              </div>

              {/* --- HỌ VÀ TÊN --- */}
              <div className="flex flex-wrap mb-6 -mx-3">
                <div className="w-full px-3 mb-6 md:w-1/2 md:mb-0 relative">
                  <input
                    name="firstName"
                    placeholder="Tên"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div className="w-full px-3 md:w-1/2">
                  <input
                    name="lastName"
                    placeholder="Họ"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* --- EMAIL --- */}
              <div className="mb-6">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={inputClass}
                />
              </div>

              {/* --- SỐ ĐIỆN THOẠI --- */}
              <div className="mb-6">
                <input
                  name="phone" // Map với state phone
                  type="tel"
                  placeholder="Số điện thoại"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={inputClass}
                />
              </div>

              {/* --- TUỔI & GIỚI TÍNH (Mới thêm cho khớp Backend) --- */}
              <div className="flex flex-wrap mb-6 -mx-3">
                <div className="w-full px-3 mb-6 md:w-1/2 md:mb-0">
                  <input
                    name="age"
                    type="number"
                    placeholder="Tuổi"
                    min="18"
                    value={formData.age}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
                <div className="w-full px-3 md:w-1/2">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>
              </div>

              {/* --- ĐỊA CHỈ (Mới thêm cho khớp Backend) --- */}
              <div className="mb-6">
                <input
                  name="address"
                  type="text"
                  placeholder="Địa chỉ"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={inputClass}
                />
              </div>

              {/* --- MẬT KHẨU --- */}
              <div className="mb-6">
                <input
                  name="password"
                  type="password"
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className={inputClass}
                />
              </div>

              {/* --- XÁC NHẬN MẬT KHẨU --- */}
              <div className="mb-6">
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Xác nhận Mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className={inputClass}
                />
              </div>

              <div className="flex items-center w-full my-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2 font-bold text-white rounded bg-brand hover:bg-blue-700 focus:outline-none focus:shadow-outline disabled:bg-gray-400"
                >
                  {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
                </button>
              </div>

              <Link
                to="/login"
                className="inline-block w-full text-lg text-center text-gray-500 align-baseline hover:text-blue-800"
              >
                Quay lại trang đăng nhập
              </Link>

              {/* Toast đã được xử lý global ở BaseLayout, không cần component Toast cũ ở đây nữa */}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
