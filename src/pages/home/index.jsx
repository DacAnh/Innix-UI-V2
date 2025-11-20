import HeroCover from './components/hero-cover/HeroCover';
import { useState, useEffect } from 'react';
import { callFetchAccommodationType } from '../../config/api';
import AccommodationSection from './components/accommodation-section/AccommodationSection'; // Import Component mới
import { Spin } from 'antd';

const Home = () => {
  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Lấy danh sách Loại hình (Hotel, Resort, Homestay...)
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await callFetchAccommodationType('page=1&size=10'); // Lấy 10 loại hình đầu tiên
        if (res && res.statusCode === 200) {
          setTypes(res.data.result);
        }
      } catch (error) {
        console.log('Lỗi tải loại hình:', error);
      }
      setIsLoading(false);
    };
    fetchTypes();
  }, []);

  return (
    <div className="home-page pb-12 bg-gray-50">
      <HeroCover />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <div className="mt-8">
          {/* 2. Duyệt qua từng loại hình và render Section tương ứng */}
          {types.length > 0 &&
            types.map((type) => (
              <AccommodationSection key={type.id} type={type} />
            ))}

          {types.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              Chưa có dữ liệu.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
