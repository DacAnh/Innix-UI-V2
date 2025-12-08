/**
 * Kiểm tra xem user có quyền truy cập vào Module này không
 * @param {Object} user - User object từ Context (đã bao gồm role và permissions)
 * @param {string} moduleName - Tên module trong DB (VD: 'USERS', 'BOOKING')
 * @returns {boolean}
 */
export const checkModuleAccess = (user, moduleName) => {
  // 1. Nếu tắt tính năng ACL (trong .env) -> Luôn mở
  if (import.meta.env.VITE_ACL_ENABLE !== 'true') return true;

  // 2. Nếu là Super Admin (hoặc role đặc biệt) -> Luôn mở (Tùy chọn)
  // if (user?.role?.name === 'SUPER_ADMIN') return true;

  // 3. Kiểm tra danh sách permissions
  const permissions = user?.role?.permissions || [];

  // Tìm xem user có quyền nào thuộc module này và method là GET (Xem) hay không
  // (Logic: Chỉ cần xem được là hiện menu)
  return permissions.some((p) => p.module === moduleName);
};
