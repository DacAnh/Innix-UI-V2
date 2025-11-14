import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { callLogin } from '../../config/api';
import { AuthContext } from 'contexts/AuthContext';
import validations from 'config/utils/validations';
import Toast from 'components/share/toast/Toast';
import { LOGIN_MESSAGES } from 'config/constants';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // setErrorMessage("");

    try {
      // 1. Gọi API
      const res = await callLogin(email, password);

      // 2. LOG RA ĐỂ KIỂM TRA (Rất quan trọng khi debug)
      console.log('Check res:', res);

      // 3. Kiểm tra kết quả (SỬA LẠI CHỖ NÀY)
      // Backend trả về 'statusCode', không phải 'code'
      if (res && res.statusCode === 200) {
        // 4. Lấy token (SỬA LẠI CHỖ NÀY)
        // Token nằm trong object 'data', tên là 'access_token'
        const accessToken = res.data?.access_token;
        const userData = res.data?.user;

        if (accessToken) {
          localStorage.setItem('access_token', accessToken);

          // 5. CẬP NHẬT CONTEXT NGAY LẬP TỨC
          login(userData);
          navigate('/');
        } else {
          setErrorMessage('Không tìm thấy Token trong phản hồi!');
        }
      } else {
        // Xử lý lỗi trả về từ Backend

        // 1. Kiểm tra xem message có phải là Mảng (nhiều lỗi) không?
        if (Array.isArray(res.message)) {
          // Sắp xếp danh sách lỗi (Sort A-Z)
          res.message.sort((a, b) => a.localeCompare(b));
          const errorList = (
            <ul
              style={{
                listStyleType: 'none',
                paddingLeft: '20px',
                textAlign: 'left',
              }}
            >
              {res.message.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          );
          setErrorMessage(errorList);
        } else {
          // 2. Nếu message là chuỗi đơn bình thường
          setErrorMessage(res.message);
        }
      }
    } catch (error) {
      setErrorMessage('Có lỗi xảy ra, vui lòng thử lại.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const dismissError = () => {
    setErrorMessage('');
  };

  return (
    <>
      <div className="login__form">
        <div className="container mx-auto p-4 flex justify-center min-h-[600px] items-center">
          <form
            onSubmit={handleLogin}
            className="w-full max-w-lg p-4 md:p-10 shadow-md"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-brand">
                Chào Mừng Trở Lại
              </h2>
              <p className="text-gray-500">
                Đăng nhập để tiếp tục vào tài khoản của bạn
              </p>
            </div>
            <div className="mb-6">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              />
            </div>
            {errorMessage && (
              <Toast
                type="error"
                message={errorMessage}
                dismissError={dismissError}
              />
            )}
            <div className="items-center">
              <div>
                <button
                  type="submit"
                  className="bg-brand hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                >
                  Đăng Nhập
                </button>
              </div>
              <div className="flex flex-wrap justify-center my-3 w-full">
                <Link
                  to="/forgot-password"
                  className="inline-block align-baseline text-md text-gray-500 hover:text-blue-800 text-right"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-0 right-0 flex justify-center items-center">
                  <div className="border-t w-full absolute"></div>
                  <span className="bg-white px-3 text-gray-500 z-10">
                    Bạn chưa có tài khoản INNIX?
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center my-3 w-full mt-12">
                <Link
                  to="/register"
                  className="inline-block align-baseline font-medium text-md text-brand hover:text-blue-800 text-right"
                >
                  Tạo tài khoản
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="bg-slate-50 flex flex-col mx-auto w-full max-w-lg px-4">
        <small className="text-slate-600">Thông tin người dùng test</small>
        <small className="text-slate-600">Email: user1@example.com</small>
        <small className="text-slate-600">Mật khẩu: password1</small>
      </div>
    </>
  );
};

export default Login;
