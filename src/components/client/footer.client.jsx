import React from 'react';
import { Link } from 'react-router-dom';

const FooterLink = ({ to, label }) => (
  <Link
    to={to}
    className="block text-slate-700 hover:text-brand transition-colors duration-300"
  >
    {label}
  </Link>
);

const GlobalFooter = () => {
  return (
    <footer className="bg-slate-50 text-slate-700 mt-6">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="font-bold text-lg mb-2">Thông Tin Công Ty</h4>
            <FooterLink to="/about-us" label="Về Chúng Tôi" />
            <FooterLink to="/" label="Liên Hệ" />
            <FooterLink to="/" label="Chính Sách Bảo Mật" />
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="font-bold text-lg mb-2">Hỗ Trợ</h4>
            <FooterLink to="/" label="Câu Hỏi Thường Gặp" />
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="font-bold text-lg mb-2">Bản Tin</h4>
            <p>Cập nhật những xu hướng mới nhất của chúng tôi</p>
            <form>
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="p-2 rounded"
              />
              <button className="ml-2 p-2 bg-brand text-white rounded">
                Đăng Ký
              </button>
            </form>
          </div>
        </div>
        <div className="text-center mt-10">
          <p>Thiết kế và phát triển bởi izoogood</p>
          <p>
            &copy; {new Date().getFullYear()} izoogood. Đã đăng ký bản quyền.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;