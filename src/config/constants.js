// === ROLES (Vai trò) ===
export const ROLES = {
  ADMIN: 'ADMIN',
  PARTNER: 'PARTNER',
  USER: 'USER',
};

// === GENDER (Giới tính) ===
export const GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
};

// === BOOKING STATUS (Trạng thái đặt phòng) ===
// Khớp với Enum BookingStatus trong Backend
export const BOOKING_STATUS = {
  PENDING: 'PENDING', // Chờ thanh toán/duyệt
  CONFIRMED: 'CONFIRMED', // Đã xác nhận/Đã thanh toán
  CANCELLED: 'CANCELLED', // Đã hủy
  COMPLETED: 'COMPLETED', // Đã hoàn thành (check-out)
  PAYMENT_FAILED: 'PAYMENT_FAILED', // Thanh toán lỗi
};

// === TRANSACTION TYPE (Loại giao dịch ví) ===
export const TRANSACTION_TYPE = {
  DEPOSIT: 'DEPOSIT',
  WITHDRAW: 'WITHDRAW',
  BOOKING_REVENUE: 'BOOKING_REVENUE',
  COMMISSION_FEE: 'COMMISSION_FEE',
  REFUND: 'REFUND',
};

// === TRANSACTION STATUS ===
export const TRANSACTION_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
};

// === ADMIN MODULES (Dùng cho phân quyền) ===
// Các module quản trị
export const ADMIN_MODULES = {
  USERS: 'USERS',
  ROLES: 'ROLES',
  PERMISSIONS: 'PERMISSIONS',
  DASHBOARD: 'DASHBOARD',
  ACCOMMODATION_TYPES: 'ACCOMMODATION-TYPES',
  ACCOMMODATIONS: 'ACCOMMODATIONS',
  ROOM_TYPES: 'ROOM-TYPES',
  AMENITIES: 'AMENITIES',
  WALLET: 'WALLET',
  BOOKINGS: 'BOOKINGS',
  ADMIN_WALLET: 'ADMIN-WALLET',
};

// === FORMAT DATE (Định dạng ngày tháng) ===
export const DATE_FORMAT = {
  DISPLAY_DATE: 'DD/MM/YYYY',
  DISPLAY_DATE_TIME: 'DD/MM/YYYY HH:mm',
  API_DATE: 'YYYY-MM-DD', // Format gửi lên API
};

// === COLORS (Màu sắc trạng thái - Dùng cho Tag Antd) ===
export const STATUS_COLOR = {
  [BOOKING_STATUS.PENDING]: 'orange',
  [BOOKING_STATUS.CONFIRMED]: 'green',
  [BOOKING_STATUS.CANCELLED]: 'red',
  [BOOKING_STATUS.COMPLETED]: 'blue',
  [BOOKING_STATUS.PAYMENT_FAILED]: 'volcano',

  [TRANSACTION_STATUS.PENDING]: 'processing',
  [TRANSACTION_STATUS.SUCCESS]: 'success',
  [TRANSACTION_STATUS.FAILED]: 'error',
};
