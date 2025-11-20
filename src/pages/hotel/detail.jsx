import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  callFetchPublicAccommodationById,
  callFetchPublicRoomTypes,
} from '../../config/api'; // ✅ Import thêm API Room
import HotelDetailsViewCard from './components/hotel-details-view-card/HotelDetailsViewCard';
import HotelBookingDetailsCard from './components/hotel-booking-details-card/HotelBookingDetailsCard';
import HotelDetailsViewCardSkeleton from './components/hotel-details-view-card-skeleton/HotelDetailsViewCardSkeleton';
import { Row, Col, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const HotelDetails = () => {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]); // ✅ State lưu danh sách phòng
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHotelDetail = async () => {
      setIsLoading(true);
      try {
        // 1. Gọi API thông tin khách sạn
        const resHotel = await callFetchPublicAccommodationById(hotelId);
        if (resHotel && resHotel.statusCode === 200) {
          setHotel(resHotel.data);
        }

        // 2. Gọi API danh sách phòng (Lấy tất cả)
        const resRooms = await callFetchPublicRoomTypes(
          hotelId,
          'page=1&size=100'
        );
        if (resRooms && resRooms.statusCode === 200) {
          setRooms(resRooms.data.result);
        }
      } catch (error) {
        console.log('Lỗi tải dữ liệu:', error);
      }
      setIsLoading(false);
    };

    if (hotelId) {
      fetchHotelDetail();
    }
  }, [hotelId]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <HotelDetailsViewCardSkeleton />
      </div>
    );
  }

  if (!hotel) {
    return <div className="text-center py-20">Không tìm thấy chỗ ở này.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="bg-white shadow-sm mb-4">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumb
            items={[
              { href: '/', title: <HomeOutlined /> },
              { href: '/hotels', title: 'Khách sạn' },
              { title: hotel.name },
            ]}
          />
        </div>
      </div>

      <div className="container mx-auto px-4">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            {/* ✅ Truyền thêm props 'rooms' xuống */}
            <HotelDetailsViewCard hotel={hotel} rooms={rooms} />
          </Col>

          <Col xs={24} lg={8}>
            <div className="sticky top-24">
              <HotelBookingDetailsCard hotel={hotel} />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HotelDetails;
