import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { differenceInCalendarDays } from 'date-fns';
import DateRangePicker from 'components/share/data-range-picker/DateRangePicker';
import { networkAdapter } from 'config/axios-customize';
import { DEFAULT_TAX_DETAILS } from 'config/constants';
import { useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { formatPrice } from 'utils/price-helpers';
import Toast from 'components/share/toast/Toast';
import format from 'date-fns/format';

/**
 * A component that displays the booking details for a hotel, including date range, room type, and pricing.
 *
 * @param {Object} props - The component's props.
 * @param {string} props.hotelCode - The unique code for the hotel.
 */
const HotelBookingDetailsCard = ({ hotelCode }) => {
  // State for date picker visibility
  const [isDatePickerVisible, setisDatePickerVisible] = useState(false);

  const navigate = useNavigate();

  // State for error message
  const [errorMessage, setErrorMessage] = useState('');

  // State for date range
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection',
    },
  ]);

  // State for selected room, guests, and rooms
  const [selectedRoom, setSelectedRoom] = useState({
    value: '1 Giường Cỡ King Tiêu Chuẩn Không Hút Thuốc',
    label: '1 Giường Cỡ King Tiêu Chuẩn Không Hút Thuốc',
  });
  const [selectedGuests, setSelectedGuests] = useState({
    value: 2,
    label: '2 khách',
  });
  const [selectedRooms, setSelectedRooms] = useState({
    value: 1,
    label: '1 phòng',
  });

  // State for pricing and booking details
  const [total, setTotal] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [bookingPeriodDays, setBookingPeriodDays] = useState(1);
  const [bookingDetails, setBookingDetails] = useState({});

  // Options for guests and rooms
  const guestOptions = Array.from(
    { length: bookingDetails.maxGuestsAllowed },
    (_, i) => ({ value: i + 1, label: `${i + 1} khách` })
  );
  const roomNumberOptions = Array.from(
    { length: bookingDetails.maxRoomsAllowedPerGuest },
    (_, i) => ({ value: i + 1, label: `${i + 1} phòng` })
  );
  const roomOptions = [
    {
      value: '1 Giường Cỡ King Tiêu Chuẩn Không Hút Thuốc',
      label: '1 Giường Cỡ King Tiêu Chuẩn Không Hút Thuốc',
    },
  ];

  // Handlers for select changes
  const handleRoomTypeChange = (selectedOption) => {
    setSelectedRoom(selectedOption);
    calculatePrices();
  };
  const handleGuestsNumberChange = (selectedOption) => {
    setSelectedGuests(selectedOption);
  };
  const handleRoomsNumberChange = (selectedOption) => {
    setSelectedRooms(selectedOption);
    calculatePrices();
  };

  // Handler for date picker visibility toggle
  const onDatePickerIconClick = () => {
    setisDatePickerVisible(!isDatePickerVisible);
  };

  /**
   * Handler for date range changes. Updates the booking period days and recalculates prices.
   *
   * @param {Object} ranges - The selected date ranges.
   */
  const onDateChangeHandler = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setDateRange([ranges.selection]);
    const days =
      startDate && endDate
        ? differenceInCalendarDays(endDate, startDate) + 1
        : 1;
    setBookingPeriodDays(days);
    calculatePrices();
  };

  /**
   * Calculates the total price and taxes based on the selected room and booking period.
   */
  const calculatePrices = () => {
    const pricePerNight = bookingDetails.currentNightRate * selectedRooms.value;
    const gstRate =
      pricePerNight <= 2500 ? 0.12 : pricePerNight > 7500 ? 0.18 : 0.12;
    const totalGst = (pricePerNight * bookingPeriodDays * gstRate).toFixed(2);
    const totalPrice = (
      pricePerNight * bookingPeriodDays +
      parseFloat(totalGst)
    ).toFixed(2);
    if (!isNaN(totalPrice)) {
      setTotal(`${formatPrice(totalPrice)} VNĐ`);
    }
    setTaxes(`${formatPrice(totalGst)} VNĐ`);
  };

  const onBookingConfirm = () => {
    if (!dateRange[0].startDate || !dateRange[0].endDate) {
      setErrorMessage('Vui lòng chọn ngày nhận và trả phòng.');
      return;
    }
    const checkIn = format(dateRange[0].startDate, 'dd-MM-yyyy');
    const checkOut = format(dateRange[0].endDate, 'dd-MM-yyyy');
    const queryParams = {
      hotelCode,
      checkIn,
      checkOut,
      guests: selectedGuests.value,
      rooms: selectedRooms.value,
      hotelName: bookingDetails.name.replaceAll(' ', '-'), // url friendly hotel name
    };

    const url = `/checkout?${queryString.stringify(queryParams)}`;
    navigate(url, {
      state: {
        total,
        checkInTime: bookingDetails.checkInTime,
        checkOutTime: bookingDetails.checkOutTime,
      },
    });
  };

  // Handler for dismissing error message
  const dismissError = () => {
    setErrorMessage('');
  };

  // Effect for initial price calculation
  useEffect(() => {
    calculatePrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingPeriodDays, selectedRooms, selectedRoom, bookingDetails]);

  // Effect for fetching booking details
  useEffect(() => {
    const getBookingDetails = async () => {
      const response = await networkAdapter.get(
        `api/hotel/${hotelCode}/booking/enquiry`
      );
      if (response && response.data) {
        setBookingDetails(response.data);
      }
    };
    getBookingDetails();
  }, [hotelCode]);

  return (
    <div className="mx-2 bg-white shadow-xl rounded-xl overflow-hidden mt-2 md:mt-0 w-full md:w-[380px]">
      <div className="px-6 py-4 bg-brand text-white">
        <h2 className="text-xl font-bold">Chi Tiết Đặt Phòng</h2>
      </div>
      <div className="p-6 text-sm md:text-base">
        {/* Total Price */}
        <div className="mb-4">
          <div className="text-lg font-semibold text-gray-800 mb-1">
            Tổng Giá
          </div>
          <div className="text-xl font-bold text-indigo-600">{total}</div>
          <div className="text-sm text-green-600">
            {bookingDetails.cancellationPolicy}
          </div>
        </div>

        {/* Dates & Time */}
        <div className="mb-4">
          <div className="font-semibold text-gray-800">Ngày & Giờ</div>
          <div className="text-gray-600">
            <DateRangePicker
              isDatePickerVisible={isDatePickerVisible}
              onDatePickerIconClick={onDatePickerIconClick}
              onDateChangeHandler={onDateChangeHandler}
              setisDatePickerVisible={setisDatePickerVisible}
              dateRange={dateRange}
              inputStyle="DARK"
            />
          </div>
        </div>

        {/* Reservation */}
        <div className="mb-4">
          <div className="font-semibold text-gray-800">Đặt Phòng</div>
          <Select
            value={selectedRooms}
            onChange={handleRoomsNumberChange}
            options={roomNumberOptions}
            className="mb-2"
            placeholder="Chọn số phòng"
          />
          <Select
            value={selectedGuests}
            onChange={handleGuestsNumberChange}
            options={guestOptions}
            placeholder="Chọn số khách"
          />
        </div>

        {/* Room Type */}
        <div className="mb-4">
          <div className="font-semibold text-gray-800">Loại Phòng</div>
          <Select
            value={selectedRoom}
            onChange={handleRoomTypeChange}
            options={roomOptions}
          />
        </div>

        {/* Per day rate */}
        <div className="mb-4">
          <div className="font-semibold text-gray-800">Giá mỗi đêm</div>
          <div className="text-gray-600">
            {formatPrice(bookingDetails.currentNightRate)} VNĐ
          </div>
        </div>

        {/* Taxes */}
        <div className="mb-4">
          <div className="font-semibold text-gray-800">Thuế</div>
          <div className="text-gray-600">{taxes}</div>
          <div className="text-xs text-gray-500">{DEFAULT_TAX_DETAILS}</div>
        </div>

        {errorMessage && (
          <Toast
            type="error"
            message={errorMessage}
            dismissError={dismissError}
          />
        )}
      </div>
      <div className="px-6 py-4 bg-gray-50">
        <button
          onClick={onBookingConfirm}
          className="w-full bg-brand-secondary text-white py-2 rounded hover:bg-yellow-600 transition duration-300"
        >
          Xác Nhận Đặt Phòng
        </button>
      </div>
    </div>
  );
};

export default HotelBookingDetailsCard;