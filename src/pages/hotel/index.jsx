import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Hook để lấy param URL
import {
  callFetchPublicAccommodations,
  callFetchAccommodationTypeById,
} from '../../services/accommodation.service';
import HotelCard from '../../components/client/card/hotel.card';
import { Spin, Breadcrumb, Empty, Pagination } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const HotelsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Lấy typeId từ URL (?type=1)
  const typeId = searchParams.get('type');

  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentType, setCurrentType] = useState(null); // Lưu thông tin loại hình đang chọn

  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 12;

  // 1. Fetch thông tin Loại hình (để lấy tên hiển thị lên tiêu đề)
  useEffect(() => {
    const fetchTypeInfo = async () => {
      if (typeId) {
        try {
          const res = await callFetchAccommodationTypeById(typeId);
          if (res && res.statusCode === 200) {
            setCurrentType(res.data);
          }
        } catch (error) {
          console.log('Lỗi lấy thông tin loại hình:', error);
        }
      } else {
        setCurrentType(null); // Nếu không có typeId thì là xem tất cả
      }
    };
    fetchTypeInfo();
  }, [typeId]);

  // 2. Fetch danh sách Chỗ ở (Lọc theo Type nếu có)
  useEffect(() => {
    const fetchHotels = async () => {
      setIsLoading(true);
      try {
        // Xây dựng query string
        let query = `page=${currentPage}&size=${pageSize}`;

        // Nếu có typeId trên URL thì thêm vào query để Backend lọc
        if (typeId) {
          query += `&typeId=${typeId}`;
        }

        const res = await callFetchPublicAccommodations(query);
        if (res && res.statusCode === 200) {
          setHotels(res.data.result);
          setTotal(res.data.meta.total);
        }
      } catch (error) {
        console.log('Lỗi tải danh sách:', error);
      }
      setIsLoading(false);
    };

    fetchHotels();
  }, [typeId, currentPage]); // Chạy lại khi typeId hoặc trang thay đổi

  // Xử lý đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Cuộn lên đầu
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Breadcrumb & Header */}
      <div className="bg-white shadow-sm mb-6">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb
            items={[
              { href: '/', title: <HomeOutlined /> },
              { title: 'Danh sách chỗ ở' },
            ]}
          />

          <h1 className="text-3xl font-bold text-gray-800 mt-4">
            {currentType ? currentType.displayName : 'Tất cả chỗ ở'}
          </h1>
          {currentType && (
            <p className="text-gray-500 mt-1">
              {currentType.description ||
                `Khám phá các ${currentType.displayName} tốt nhất`}
            </p>
          )}
        </div>
      </div>

      {/* Danh sách Card */}
      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : (
          <>
            {hotels.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {hotels.map((item) => (
                  <HotelCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="py-20 bg-white rounded-lg text-center shadow-sm">
                <Empty description="Không tìm thấy chỗ ở nào phù hợp" />
              </div>
            )}

            {/* Phân trang */}
            {total > 0 && (
              <div className="flex justify-center mt-10">
                <Pagination
                  current={currentPage}
                  total={total}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HotelsPage;
