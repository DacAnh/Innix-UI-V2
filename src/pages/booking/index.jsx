import React, { useEffect, useState } from 'react';
import FinalBookingSummary from './components/final-booking-summary/FinalBookingSummary';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getReadableMonthFormat } from '../../config/utils/date-helpers'; // Sửa lại đường dẫn import cho đúng
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext'; // Sửa lại đường dẫn import
import Loader from '../../components/share/loader/loader'; // Sửa lại đường dẫn import
import Toast from '../../components/share/toast/Toast'; // Sửa lại đường dẫn import
import { callCreateBooking, callCreateVnPayUrl } from '../../config/api'; // Import API

const Checkout = () => {
  const [errors, setErrors] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [toastMessage, setToastMessage] = useState('');
  const { isAuthenticated, user } = useContext(AuthContext); // Lấy user từ context mới (user, không phải userDetails)
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dismissToast = () => setToastMessage('');

  // Form chỉ cần thông tin liên hệ cơ bản (Không cần thẻ)
  const [formData, setFormData] = useState({
    email: user?.email || '',
    fullName: user?.name || '', // Lấy từ user.name
    phone: user?.phone || '', // Nếu user có phone
    note: '',
    guestCount: 1,
  });

  // Thông tin từ trang trước (HotelDetails) truyền qua
  const { roomId, roomName, pricePerNight, checkInTime, checkOutTime, total } =
    location.state || {};
  // Lưu ý: 'total' ở đây nên là số nguyên (VD: 1500000) để gửi cho VNPAY

  const checkInDate = searchParams.get('checkIn');
  const checkOutDate = searchParams.get('checkOut');

  const checkInDateTime = `${getReadableMonthFormat(checkInDate)}, ${checkInTime || '14:00'}`;
  const checkOutDateTime = `${getReadableMonthFormat(checkOutDate)}, ${checkOutTime || '12:00'}`;

  useEffect(() => {
    if (!location.state || !checkInDate || !checkOutDate) {
      console.log('Thiếu dữ liệu checkout:', {
        state: location.state,
        checkIn: checkInDate,
        checkOut: checkOutDate,
      });
      // navigate('/'); // 👈 Tạm thời comment dòng này để xem log
    }
  }, [location, navigate, searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Validate đơn giản khi gõ
    if (value.trim() !== '') {
      setErrors({ ...errors, [name]: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const newErrors = {};
    if (!formData.email) newErrors.email = true;
    if (!formData.fullName) newErrors.fullName = true;
    if (!formData.phone) newErrors.phone = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setIsSubmitDisabled(true);

    try {
      // 1. TẠO BOOKING (PENDING)
      // Cần khớp với BookingRequest.java của Backend

      const bookedRoom = {
        roomTypeId: roomId,
        quantity: 1, // Mặc định 1 phòng (hoặc lấy từ input nếu có)
      };

      const bookingPayload = {
        // checkInDate: checkInDate,  // "YYYY-MM-DD"
        // checkOutDate: checkOutDate, // "YYYY-MM-DD"
        checkInDate: `${checkInDate}T14:00:00`, // Thêm giờ check-in (14h)
        checkOutDate: `${checkOutDate}T12:00:00`, // Thêm giờ check-out (12h)
        totalPrice: total, // Số tiền (VD: 2000000)
        guestCount: parseInt(formData.guestCount), // ✅ Thêm dòng này (ép kiểu int cho chắc)
        guestContactName: formData.fullName, // Map fullName -> guestContactName
        guestContactPhone: formData.phone, // Map phone -> guestContactPhone
        specialRequests: formData.note, // Map note -> specialRequests
        currency: 'VND', // ✅ Thêm currency (để tránh lỗi null)
        rooms: [bookedRoom], // ID loại phòng
        paymentMethod: 'VNPAY',
      };

      console.log('Booking Payload:', bookingPayload);

      const resBooking = await callCreateBooking(bookingPayload);

      if (resBooking && resBooking.statusCode === 201) {
        const bookingId = resBooking.data.id; // Lấy ID booking vừa tạo

        // 2. GỌI API LẤY LINK VNPAY
        // Backend: POST /api/v2/payment/create-vnpay-url?bookingId=...
        const resPayment = await callCreateVnPayUrl(bookingId);

        if (resPayment && resPayment.statusCode === 200) {
          // Backend trả về chuỗi URL trực tiếp hoặc object { url: "..." }
          // Dựa vào code PaymentController: return ResponseEntity.ok(url); (String)
          // Nhưng axios-customize thường wrap data.
          // Hãy kiểm tra log hoặc giả định nó nằm trong res.data hoặc chính là res

          const paymentUrl = resPayment.data?.paymentUrl;
          // (Lưu ý: Nếu axios-customize trả về trực tiếp string thì là resPayment, nếu bọc data thì là resPayment.data)

          if (paymentUrl) {
            // 3. CHUYỂN HƯỚNG SANG VNPAY
            window.location.href = paymentUrl;
          } else {
            setToastMessage('URL thanh toán không hợp lệ.');
            setIsSubmitDisabled(false);
          }
        } else {
          setToastMessage('Lỗi tạo cổng thanh toán.');
          setIsSubmitDisabled(false);
        }
      } else {
        setToastMessage(resBooking?.message || 'Lỗi tạo đơn đặt phòng.');
        setIsSubmitDisabled(false);
      }
    } catch (error) {
      console.log(error);
      setToastMessage('Có lỗi xảy ra, vui lòng thử lại.');
      setIsSubmitDisabled(false);
    } finally {
      // Chỉ tắt loading nếu có lỗi, nếu thành công thì để loading chờ redirect
      if (!isSubmitDisabled) setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 py-10">
      <FinalBookingSummary
        hotelName={searchParams.get('hotelName')?.replaceAll('-', ' ')}
        checkIn={checkInDateTime}
        checkOut={checkOutDateTime}
        isAuthenticated={isAuthenticated}
        // Truyền lại data vừa nhập để hiển thị bên summary nếu cần
        phone={formData.phone}
        email={formData.email}
        fullName={formData.fullName}
      />

      <div className="relative bg-white border shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-lg mx-auto mt-6">
        {isLoading && (
          <Loader
            isFullScreen={true}
            loaderText={'Đang chuyển hướng sang VNPAY...'}
          />
        )}

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
            placeholder="0912xxxxxx"
            required={true}
            error={errors.phone}
          />

          {/* ✅ THÊM INPUT SỐ LƯỢNG KHÁCH */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="guestCount"
            >
              Số lượng khách <span className="text-red-500">*</span>
            </label>
            <input
              className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="guestCount"
              type="number"
              name="guestCount"
              min="1"
              value={formData.guestCount}
              onChange={handleChange}
              placeholder="Nhập số lượng khách"
              required
            />
          </div>

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
              className={`bg-brand hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full transition duration-300 shadow-lg flex justify-center items-center ${
                isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              type="submit"
              disabled={isSubmitDisabled}
            >
              <img
                src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746013.png"
                alt="VNPAY"
                className="h-6 mr-2 bg-white rounded px-1"
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

        {toastMessage && (
          <div className="mt-4">
            <Toast
              message={toastMessage}
              type={'error'}
              dismissError={dismissToast}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Component InputField giữ nguyên (hoặc copy lại nếu cần)
const InputField = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  required,
  error,
}) => (
  <div className="mb-4">
    <label
      className="block text-gray-700 text-sm font-bold mb-2"
      htmlFor={name}
    >
      {label} <span className="text-red-500">{required && '*'}</span>
    </label>
    <input
      className={`shadow appearance-none border ${
        error ? 'border-red-500' : 'border-gray-300'
      } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
    {error && (
      <p className="text-red-500 text-xs my-1">Thông tin này là bắt buộc.</p>
    )}
  </div>
);

export default Checkout;
