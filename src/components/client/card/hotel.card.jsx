import { EnvironmentOutlined, StarFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Tag } from 'antd';

const HotelCard = ({ item }) => {
  const navigate = useNavigate();

  // Xử lý ảnh: Nếu không có ảnh thì dùng ảnh placeholder
  const imageUrl = item.thumbnailImageUrl
    ? `${import.meta.env.VITE_BACKEND_URL}/storage/accommodations/${item.thumbnailImageUrl}`
    : 'https://placehold.co/600x400?text=No+Image';

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden border border-gray-100 flex flex-col h-full"
      onClick={() => navigate(`/hotel/${item.id}`)}
    >
      {/* 1. Phần Hình ảnh (Chiếm 50-60% chiều cao card) */}
      <div className="relative h-48 overflow-hidden group">
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Label Loại hình (VD: Khách sạn, Resort) ở góc ảnh */}
        <div className="absolute top-3 left-3">
          <Tag
            color="blue"
            className="m-0 font-semibold shadow-sm border-none px-2 py-1"
          >
            {item.type?.displayName || 'Chỗ ở'}
          </Tag>
        </div>
      </div>

      {/* 2. Phần Thông tin chi tiết */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          {/* Tên và Đánh giá */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-800 line-clamp-2 hover:text-brand transition-colors">
              {item.name}
            </h3>
            {/* Nếu có rating thì hiện, không thì ẩn */}
            {item.ratingStar > 0 && (
              <div className="flex items-center bg-brand/10 px-1.5 py-0.5 rounded text-xs font-bold text-brand">
                <span>{item.ratingStar}</span>
                <StarFilled className="text-[10px] ml-1" />
              </div>
            )}
          </div>

          {/* Địa chỉ */}
          <div className="flex items-start text-gray-500 text-sm mb-3">
            <EnvironmentOutlined className="mt-1 mr-1.5 flex-shrink-0" />
            <span className="line-clamp-2">
              {item.addressLine}, {item.ward}, {item.district}, {item.province}
            </span>
          </div>
        </div>

        {/* Giá & Nút (Phần chân card) */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-end">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Giá mỗi đêm từ</p>
            {/* Backend chưa trả về minPrice nên tạm thời để "Liên hệ" */}
            <p className="text-lg font-extrabold text-gray-900">
              Liên hệ
              {/* Hoặc hiển thị số nếu có: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(1500000)} */}
            </p>
          </div>
          <button className="bg-brand text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Xem ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
