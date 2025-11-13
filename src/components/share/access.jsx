import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const Access = (props) => {
  // hideChildren: Nếu = true thì ẩn luôn component con. Nếu = false thì có thể hiện thông báo cấm (tùy logic)
  const { permission, hideChildren = true, children } = props;
  const { user } = useContext(AuthContext);

  // Lấy danh sách permissions từ user đang đăng nhập
  // Lưu ý: Backend API /account phải trả về cấu trúc user -> role -> permissions
  const permissions = user?.role?.permissions || [];
  console.log('Current Permissions:', permissions);

  // Kiểm tra xem user có quyền này không (Check cả API Path và Method)
  const isAllowed = permissions.some(
    (p) => p.apiPath === permission.apiPath && p.method === permission.method
  );

  // Nếu có quyền -> Render nút bấm (children)
  if (isAllowed) {
    return <>{children}</>;
  }

  // Nếu không có quyền -> Ẩn luôn
  return (
    <>
      {hideChildren
        ? null
        : // Có thể render component "Not Permitted" ở đây nếu muốn
          null}
    </>
  );
};

export default Access;
