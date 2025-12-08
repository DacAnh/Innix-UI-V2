import {
  EnvironmentOutlined,
  WifiOutlined,
  UserOutlined,
  ExpandAltOutlined,
  CheckCircleOutlined,
  LeftOutlined,
  RightOutlined,
  CoffeeOutlined,
  CarOutlined,
  DesktopOutlined,
} from '@ant-design/icons';
import { Tag, Image, Divider, Button, Row, Col } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

// Component mũi tên Next cho Slider (Giữ nguyên)
function RoomNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'flex',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        right: '10px',
        zIndex: 1,
        width: '30px',
        height: '30px',
      }}
      onClick={onClick}
    >
      <RightOutlined style={{ color: 'white', fontSize: '12px' }} />
    </div>
  );
}

// Component mũi tên Prev cho Slider (Giữ nguyên)
function RoomPrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'flex',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        left: '10px',
        zIndex: 1,
        width: '30px',
        height: '30px',
      }}
      onClick={onClick}
    >
      <LeftOutlined style={{ color: 'white', fontSize: '12px' }} />
    </div>
  );
}

// Hàm helper lấy icon cho tiện ích
const getAmenityIcon = (name) => {
  const lowerName = name?.toLowerCase() || '';
  if (lowerName.includes('wifi') || lowerName.includes('internet'))
    return <WifiOutlined />;
  if (lowerName.includes('bể bơi') || lowerName.includes('hồ bơi'))
    return <CoffeeOutlined />;
  if (lowerName.includes('xe') || lowerName.includes('đỗ'))
    return <CarOutlined />;
  if (lowerName.includes('tivi') || lowerName.includes('tv'))
    return <DesktopOutlined />;
  return <CheckCircleOutlined />;
};

const HotelDetailsViewCard = ({ hotel, rooms, dateRange }) => {
  const navigate = useNavigate();

  if (!hotel) return null;

  // Xử lý ảnh chính (thumbnail)
  const thumbnail = hotel.thumbnailImageUrl
    ? `${import.meta.env.VITE_BACKEND_URL}/storage/accommodations/${hotel.thumbnailImageUrl}`
    : null;

  // Xử lý list ảnh khách sạn
  const images =
    hotel.imageUrls && hotel.imageUrls.length > 0
      ? hotel.imageUrls.map(
          (name) =>
            `${import.meta.env.VITE_BACKEND_URL}/storage/accommodations/${name}`
        )
      : thumbnail
        ? [thumbnail]
        : ['https://placehold.co/800x400?text=No+Image'];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* --- 1. PHẦN ẢNH VÀ THÔNG TIN CHUNG KHÁCH SẠN --- */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px]">
        <div className="col-span-2 row-span-2 cursor-pointer overflow-hidden">
          <Image
            src={images[0]}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            height="100%"
            width="100%"
          />
        </div>
        {images.slice(1, 5).map((img, index) => (
          <div key={index} className="col-span-1 row-span-1 overflow-hidden">
            <Image
              src={img}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              height="100%"
              width="100%"
            />
          </div>
        ))}
      </div>

      <div className="p-6">
        <div className="mb-4">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {hotel.name}
            </h1>
            {hotel.type && (
              <Tag color="blue" className="mt-2 text-sm px-3 py-1">
                {hotel.type.displayName}
              </Tag>
            )}
          </div>
          <p className="text-gray-600 flex items-center text-base">
            <EnvironmentOutlined className="mr-2 text-brand" />
            {hotel.addressLine}, {hotel.ward}, {hotel.district},{' '}
            {hotel.province}, {hotel.country}
          </p>
        </div>

        <Divider />

        {/* Tiện nghi của Khách sạn (Chung) */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Tiện nghi chỗ ở</h3>
            <div className="flex flex-wrap gap-3">
              {hotel.amenities.map((am) => (
                <Tag
                  key={am.id}
                  icon={getAmenityIcon(am.name)}
                  className="px-3 py-1 text-sm rounded-full border-gray-300"
                >
                  {am.name}
                </Tag>
              ))}
            </div>
            <Divider />
          </div>
        )}

        <div>
          <h3 className="text-xl font-semibold mb-3">Giới thiệu</h3>
          <div
            className="text-gray-700 leading-relaxed ql-editor"
            style={{ padding: 0 }}
            dangerouslySetInnerHTML={{ __html: hotel.description }}
          />
        </div>

        <Divider />

        {/* --- 2. PHẦN DANH SÁCH PHÒNG --- */}
        <div>
          <h3 className="text-2xl font-bold mb-6 text-gray-800">
            Các loại phòng có sẵn
          </h3>

          {/* Cảnh báo nếu chưa chọn ngày */}
          {(!dateRange || !dateRange[0]) && (
            <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-md flex items-center">
              <span className="mr-2">⚠️</span>
              Vui lòng chọn <strong>ngày nhận phòng</strong> và{' '}
              <strong>ngày trả phòng</strong> ở cột bên phải để xem giá chính
              xác.
            </div>
          )}

          {rooms && rooms.length > 0 ? (
            <div className="flex flex-col gap-6">
              {rooms.map((room) => {
                // Cấu hình Slider cho từng phòng
                const sliderSettings = {
                  dots: true,
                  infinite: true,
                  speed: 500,
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  nextArrow: <RoomNextArrow />,
                  prevArrow: <RoomPrevArrow />,
                  adaptiveHeight: true,
                };

                // Xử lý danh sách ảnh của phòng
                const roomImages =
                  room.imageUrls && room.imageUrls.length > 0
                    ? room.imageUrls.map((url) =>
                        url.startsWith('http')
                          ? url
                          : `${import.meta.env.VITE_BACKEND_URL}/storage/room-types/${url}`
                      )
                    : ['https://placehold.co/400x300?text=No+Image'];

                // Tính số đêm (nếu có ngày)
                const numNights =
                  dateRange && dateRange[0] && dateRange[1]
                    ? moment(dateRange[1]).diff(moment(dateRange[0]), 'days')
                    : 0;

                return (
                  <div
                    key={room.id}
                    className={`border rounded-xl p-4 transition-all duration-300 bg-white ${
                      !room.isAvailable && dateRange[0]
                        ? 'opacity-60 grayscale border-gray-200'
                        : 'hover:shadow-lg border-gray-200 hover:border-brand/30'
                    }`}
                  >
                    <Row gutter={24}>
                      {/* Cột Trái: Slider Ảnh Phòng */}
                      <Col xs={24} md={9} lg={8}>
                        <div className="rounded-lg overflow-hidden border border-gray-100 h-full relative">
                          <Slider {...sliderSettings}>
                            {roomImages.map((url, idx) => (
                              <div
                                key={idx}
                                className="h-56 relative focus:outline-none"
                              >
                                <Image
                                  src={url}
                                  className="w-full h-full object-cover"
                                  height="100%"
                                  width="100%"
                                  style={{
                                    objectFit: 'cover',
                                    height: '224px',
                                  }}
                                />
                              </div>
                            ))}
                          </Slider>
                        </div>
                      </Col>

                      {/* Cột Phải: Thông tin & Giá */}
                      <Col xs={24} md={15} lg={16}>
                        <div className="flex flex-col h-full justify-between pl-2 pt-3 md:pt-0">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="text-xl font-bold text-gray-800 mb-2">
                                {room.name}
                              </h4>
                              {/* Badge nếu phòng hết chỗ */}
                              {!room.isAvailable && dateRange[0] && (
                                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
                                  HẾT PHÒNG
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-4 text-gray-600 mb-3 text-sm">
                              <span className="flex items-center bg-gray-50 px-2 py-1 rounded">
                                <ExpandAltOutlined className="mr-1 text-brand" />
                                {room.areaSize} m²
                              </span>
                              <span className="flex items-center bg-gray-50 px-2 py-1 rounded">
                                <UserOutlined className="mr-1 text-brand" />
                                Tối đa {room.maxGuest} người
                              </span>
                              <span className="flex items-center bg-gray-50 px-2 py-1 rounded">
                                🛏️ {room.bedConfiguration}
                              </span>
                            </div>

                            <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                              {room.description}
                            </p>

                            {/* ✅ HIỂN THỊ TIỆN ÍCH PHÒNG (AMENITIES) - MỚI */}
                            <div className="flex flex-wrap gap-2">
                              {room.amenities && room.amenities.length > 0 ? (
                                room.amenities.map((attr) => (
                                  <Tag
                                    key={attr.id}
                                    color="success"
                                    className="border-0 bg-green-50 text-green-700 flex items-center gap-1"
                                  >
                                    {getAmenityIcon(attr.name)} {attr.name}
                                  </Tag>
                                ))
                              ) : (
                                <span className="text-xs text-gray-400 italic">
                                  Đang cập nhật tiện ích...
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Phần Giá và Nút Đặt */}
                          <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-100">
                            <div>
                              {/* Logic Hiển thị Giá */}
                              {dateRange && dateRange[0] ? (
                                room.isAvailable ? (
                                  <>
                                    <span className="text-xs text-gray-500 block mb-1">
                                      Tổng giá cho <strong>{numNights}</strong>{' '}
                                      đêm
                                    </span>
                                    <div className="text-3xl font-extrabold text-brand leading-none">
                                      {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                      }).format(room.displayPrice)}
                                    </div>
                                    <span className="text-xs text-gray-400 mt-1 block">
                                      Đã bao gồm thuế & phí
                                    </span>
                                  </>
                                ) : (
                                  <div className="text-lg font-bold text-red-500">
                                    {room.errorMsg || 'Không có phòng trống'}
                                  </div>
                                )
                              ) : (
                                <div className="text-lg font-bold text-gray-400 flex flex-col">
                                  <span>Chọn ngày để xem giá</span>
                                  <span className="text-xs font-normal mt-1">
                                    Nhập ngày nhận/trả phòng phía trên
                                  </span>
                                </div>
                              )}
                            </div>

                            <Button
                              type="primary"
                              size="large"
                              className={`h-12 px-8 text-lg font-semibold shadow-md ${
                                !room.isAvailable || !dateRange[0]
                                  ? 'bg-gray-300 cursor-not-allowed border-gray-300'
                                  : 'bg-brand hover:bg-blue-700 border-brand'
                              }`}
                              disabled={!room.isAvailable || !dateRange[0]}
                              onClick={() => {
                                navigate(
                                  {
                                    pathname: '/checkout',
                                    search: `?checkIn=${dateRange[0].format('YYYY-MM-DD')}&checkOut=${dateRange[1].format('YYYY-MM-DD')}&hotelName=${hotel.name}`,
                                  },
                                  {
                                    state: {
                                      roomId: room.id,
                                      roomName: room.name,
                                      total: room.displayPrice,
                                      hotelName: hotel.name,
                                      hotelAddress: hotel.addressLine,
                                    },
                                  }
                                );
                              }}
                            >
                              {dateRange && dateRange[0]
                                ? 'Đặt ngay'
                                : 'Chọn ngày'}
                            </Button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <div className="text-4xl mb-2">🛏️</div>
              <p className="text-gray-500 text-lg">
                Hiện chưa có thông tin phòng cho chỗ ở này.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelDetailsViewCard;
