import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { callFetchAllAccommodation } from '../../../../services/accommodation.service'; // API chung
import HotelCard from '../../../../components/client/card/hotel.card'; // Dùng lại Card cũ
import { Spin, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './AccommodationSection.scss'; // CSS custom cho mũi tên

// Custom mũi tên Next
function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'flex',
        background: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        right: '-20px',
      }}
      onClick={onClick}
    >
      <RightOutlined style={{ color: 'black', fontSize: '14px' }} />
    </div>
  );
}

// Custom mũi tên Prev
function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'flex',
        background: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        left: '-20px',
      }}
      onClick={onClick}
    >
      <LeftOutlined style={{ color: 'black', fontSize: '14px' }} />
    </div>
  );
}

const AccommodationSection = ({ type }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Gọi API: Lọc theo typeId, lấy 8 cái mới nhất
      const query = `page=1&size=8&typeId=${type.id}`;
      const res = await callFetchAllAccommodation(query);
      if (res && res.statusCode === 200) {
        setItems(res.data.result);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [type.id]);

  // Nếu type này không có chỗ ở nào thì không render
  if (!isLoading && items.length === 0) return null;

  const settings = {
    dots: false,
    infinite: false, // Không cuộn vòng tròn
    speed: 500,
    slidesToShow: 4, // Desktop hiện 4 cái
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="py-8 container mx-auto px-4 relative accommodation-section">
      <div className="flex justify-between items-end mb-4 px-1">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {type.displayName}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {type.description || `Khám phá các ${type.displayName} tốt nhất`}
          </p>
        </div>
        {/* Link xem tất cả */}
        <a
          href={`/hotels?type=${type.id}`}
          className="text-brand font-semibold hover:underline text-sm"
        >
          Xem tất cả {type.displayName} &rarr;
        </a>
      </div>

      {isLoading ? (
        <Spin />
      ) : (
        // Thêm padding x để mũi tên không bị cắt
        <div className="px-2">
          <Slider {...settings}>
            {items.map((item) => (
              <div key={item.id} className="px-2 pb-2 pt-2">
                {' '}
                {/* Padding giữa các card */}
                <HotelCard item={item} />
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default AccommodationSection;
