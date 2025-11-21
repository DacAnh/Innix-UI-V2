import {
  EnvironmentOutlined,
  WifiOutlined,
  UserOutlined,
  ExpandAltOutlined,
  CheckCircleOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { Tag, Image, Divider, Button, Card, Row, Col } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Slider from 'react-slick';

const HotelDetailsViewCard = ({ hotel, rooms }) => {
  // Nhận thêm prop 'rooms'
  if (!hotel) return null;

  // Xử lý ảnh chính
  const thumbnail = hotel.thumbnailImageUrl
    ? `${import.meta.env.VITE_BACKEND_URL}/storage/accommodations/${hotel.thumbnailImageUrl}`
    : null;

  // Xử lý list ảnh (nếu backend trả về list tên file)
  const images =
    hotel.imageUrls && hotel.imageUrls.length > 0
      ? hotel.imageUrls.map(
          (name) =>
            `${import.meta.env.VITE_BACKEND_URL}/storage/accommodations/${name}`
        )
      : thumbnail
        ? [thumbnail]
        : ['https://placehold.co/800x400?text=No+Image'];

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

  // Mũi tên Prev
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

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* --- PHẦN ẢNH VÀ THÔNG TIN CHUNG (GIỮ NGUYÊN) --- */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px]">
        <div className="col-span-2 row-span-2 cursor-pointer">
          <Image
            src={images[0]}
            className="w-full h-full object-cover"
            height="100%"
            width="100%"
          />
        </div>
        {images.slice(1, 5).map((img, index) => (
          <div key={index} className="col-span-1 row-span-1 overflow-hidden">
            <Image
              src={img}
              className="w-full h-full object-cover"
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

        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Tiện nghi</h3>
            <div className="flex flex-wrap gap-3">
              {hotel.amenities.map((am) => (
                <Tag
                  key={am.id}
                  icon={<WifiOutlined />}
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

        {/* --- ✅ PHẦN DANH SÁCH PHÒNG (MỚI) --- */}
        <div>
          <h3 className="text-2xl font-bold mb-6 text-gray-800">
            Các loại phòng có sẵn
          </h3>

          {rooms && rooms.length > 0 ? (
            <div className="flex flex-col gap-6">
              {rooms.map((room) => {
                // Cấu hình Slider cho từng phòng
                const sliderSettings = {
                  dots: true, // Hiện chấm tròn bên dưới
                  infinite: true,
                  speed: 500,
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  nextArrow: <RoomNextArrow />,
                  prevArrow: <RoomPrevArrow />,
                  adaptiveHeight: true,
                };

                // Danh sách ảnh của phòng (nếu rỗng thì dùng ảnh placeholder)
                const roomImages =
                  room.imageUrls && room.imageUrls.length > 0
                    ? room.imageUrls
                    : ['https://placehold.co/400x300?text=No+Image'];

                return (
                  <div
                    key={room.id}
                    className="border rounded-xl p-4 hover:shadow-md transition-shadow bg-white"
                  >
                    <Row gutter={24}>
                      {/* ✅ Cột Ảnh Phòng: Dùng Slider */}
                      <Col xs={24} md={10}>
                        <div className="rounded-lg overflow-hidden border border-gray-100 h-full">
                          <Slider {...sliderSettings}>
                            {roomImages.map((url, idx) => (
                              <div
                                key={idx}
                                className="h-56 relative focus:outline-none"
                              >
                                {/* focus:outline-none để bỏ viền xanh khi click */}
                                <Image
                                  src={url}
                                  className="w-full h-full object-cover"
                                  height="100%"
                                  width="100%"
                                  style={{
                                    objectFit: 'cover',
                                    height: '224px',
                                  }} // Cố định chiều cao ảnh (56 * 4px)
                                />
                              </div>
                            ))}
                          </Slider>
                        </div>
                      </Col>

                      {/* Thông tin phòng (Giữ nguyên hoặc tinh chỉnh) */}
                      <Col xs={24} md={14}>
                        <div className="flex flex-col h-full justify-between pl-2 pt-2 md:pt-0">
                          <div>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">
                              {room.name}
                            </h4>

                            <div className="flex flex-wrap gap-4 text-gray-600 mb-3 text-sm">
                              <span className="flex items-center">
                                <ExpandAltOutlined className="mr-1" />{' '}
                                {room.areaSize} m²
                              </span>
                              <span className="flex items-center">
                                <UserOutlined className="mr-1" /> Tối đa{' '}
                                {room.maxGuest} người
                              </span>
                              <span className="flex items-center">
                                {room.bedConfiguration}
                              </span>
                            </div>

                            <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                              {room.description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                              <Tag color="green">
                                <CheckCircleOutlined /> Wifi miễn phí
                              </Tag>
                              <Tag color="green">
                                <CheckCircleOutlined /> Điều hòa
                              </Tag>
                            </div>
                          </div>

                          <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-100">
                            <div>
                              {room.displayPrice ? (
                                <>
                                  <span className="text-xs text-gray-500">
                                    Giá mỗi đêm
                                  </span>
                                  <div className="text-2xl font-bold text-brand">
                                    {new Intl.NumberFormat('vi-VN', {
                                      style: 'currency',
                                      currency: 'VND',
                                    }).format(room.displayPrice)}
                                  </div>
                                </>
                              ) : (
                                <div className="text-lg font-bold text-brand">
                                  Liên hệ để có giá
                                </div>
                              )}
                            </div>
                            <Button
                              type="primary"
                              size="large"
                              className="bg-brand"
                            >
                              Chọn phòng
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
            <div className="text-center py-10 bg-gray-50 rounded-lg text-gray-500">
              Hiện chưa có thông tin phòng cho chỗ ở này.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelDetailsViewCard;
