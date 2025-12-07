import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';
import {
  callCreateBooking,
  callCreateVnPayUrl,
} from '../../../services/booking.service'; // Import từ service mới
import { getReadableMonthFormat } from '../../../config/utils/date-helpers';

export const useCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errors, setErrors] = useState({});

  // 1. Lấy dữ liệu từ URL & State
  const checkInDateParam = searchParams.get('checkIn');
  const checkOutDateParam = searchParams.get('checkOut');
  const hotelName = searchParams.get('hotelName')?.replaceAll('-', ' ') || '';

  const locationState = location.state || {};
  const { roomId, total, checkInTime, checkOutTime } = locationState;

  // 2. Init Form Data
  const [formData, setFormData] = useState({
    email: user?.email || '',
    fullName: user?.name || '',
    phone: user?.phone || '',
    note: '',
    guestCount: 1,
  });

  // 3. Format Date Time Display
  const checkInDisplay = checkInDateParam
    ? `${getReadableMonthFormat(checkInDateParam)}, ${checkInTime || '14:00'}`
    : '...';
  const checkOutDisplay = checkOutDateParam
    ? `${getReadableMonthFormat(checkOutDateParam)}, ${checkOutTime || '12:00'}`
    : '...';

  // 4. Validate Initial Data
  useEffect(() => {
    if (!location.state || !checkInDateParam || !checkOutDateParam) {
      console.warn('Thiếu thông tin đặt phòng, redirecting...');
      // navigate('/'); // Uncomment để redirect nếu cần
    }
  }, [location, checkInDateParam, checkOutDateParam, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value && value.trim() !== '')
      setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate Form
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
      // Create Booking Payload
      const bookingPayload = {
        checkInDate: `${checkInDateParam}T14:00:00`,
        checkOutDate: `${checkOutDateParam}T12:00:00`,
        totalPrice: total,
        guestCount: parseInt(formData.guestCount),
        guestContactName: formData.fullName,
        guestContactPhone: formData.phone,
        specialRequests: formData.note,
        currency: 'VND',
        rooms: [{ roomTypeId: roomId, quantity: 1 }],
        paymentMethod: 'VNPAY',
      };

      // Call API Create Booking
      const resBooking = await callCreateBooking(bookingPayload);

      if (resBooking?.statusCode === 201) {
        const bookingId = resBooking.data.id;

        // Call API Get Payment URL
        const resPayment = await callCreateVnPayUrl(bookingId);

        // Handle Payment Response
        // (Kiểm tra cả dạng string trực tiếp và dạng object {data: url})
        let paymentUrl = '';
        if (typeof resPayment === 'string' && resPayment.startsWith('http')) {
          paymentUrl = resPayment;
        } else if (resPayment?.data?.paymentUrl) {
          paymentUrl = resPayment.data.paymentUrl;
        } else if (resPayment?.data && typeof resPayment.data === 'string') {
          paymentUrl = resPayment.data;
        }

        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          setToastMessage('URL thanh toán không hợp lệ.');
          setIsSubmitDisabled(false);
        }
      } else {
        setToastMessage(resBooking?.message || 'Lỗi tạo đơn đặt phòng.');
        setIsSubmitDisabled(false);
      }
    } catch (error) {
      console.error(error);
      setToastMessage('Có lỗi xảy ra, vui lòng thử lại.');
      setIsSubmitDisabled(false);
    } finally {
      if (!isSubmitDisabled) setIsLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    errors,
    isLoading,
    isSubmitDisabled,
    toastMessage,
    setToastMessage,
    displayInfo: {
      hotelName,
      checkInDisplay,
      checkOutDisplay,
      total,
      isAuthenticated,
      user,
    },
  };
};
