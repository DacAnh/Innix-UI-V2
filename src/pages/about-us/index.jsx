import React from 'react';

/**
 * Trang giới thiệu về INNIX
 * @returns {jsx}
 */
const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-brand mb-2">Về Chúng Tôi</h1>
      <p className="text-lg mb-8">
        Chào mừng đến với <span className="text-brand">INNIX</span>, nơi chúng
        tôi tận tâm mang đến cho bạn trải nghiệm tốt nhất để đặt phòng khách sạn
        trên toàn thế giới. Sứ mệnh của chúng tôi là làm cho chuyến đi của bạn
        trở nên thoải mái, tiện lợi và đáng nhớ.
      </p>

      <h2 className="text-3xl font-extrabold text-brand mb-2">
        Tầm Nhìn Của Chúng Tôi
      </h2>
      <p className="text-lg mb-8">
        Tại <span className="text-brand">INNIX</span>, chúng tôi hình dung một
        thế giới nơi mọi du khách đều tìm thấy chỗ ở hoàn hảo phù hợp với nhu
        cầu và sở thích của họ. Chúng tôi mong muốn đơn giản hóa quy trình đặt
        phòng khách sạn, cung cấp nhiều lựa chọn cho mọi ngân sách.
      </p>

      <h2 className="text-3xl font-extrabold text-brand mb-2">
        Tại Sao Chọn Chúng Tôi?
      </h2>
      <ul className="list-disc ml-6 mb-8">
        <li className="text-lg mb-3">
          Chúng tôi cung cấp đa dạng các loại khách sạn, từ khu nghỉ dưỡng sang
          trọng đến các khách sạn boutique ấm cúng, đảm bảo bạn sẽ tìm thấy sự
          lựa chọn hoàn hảo cho phong cách du lịch của mình.
        </li>
        <li className="text-lg mb-3">
          Giao diện thân thiện với người dùng của chúng tôi giúp bạn đặt phòng
          một cách đơn giản và nhanh chóng. Chỉ với vài cú nhấp chuột, bạn có
          thể đảm bảo đặt phòng của mình một cách dễ dàng.
        </li>
        <li className="text-lg mb-3">
          Đội ngũ hỗ trợ khách hàng tận tâm của chúng tôi luôn sẵn sàng 24/7 để
          hỗ trợ bạn với bất kỳ câu hỏi hoặc vấn đề nào bạn có thể gặp phải
          trong quá trình đặt phòng hoặc lưu trú.
        </li>
        <li className="text-lg mb-3">
          Chúng tôi ưu tiên bảo mật thông tin cá nhân và giao dịch của bạn. Hãy
          tự tin đặt phòng khi biết rằng dữ liệu của bạn được an toàn với chúng
          tôi.
        </li>
      </ul>

      <h2 className="text-3xl font-extrabold text-brand mb-2">Liên Hệ</h2>
      <p className="text-lg mb-4">
        Bạn có câu hỏi hoặc cần hỗ trợ? Đừng ngần ngại liên hệ với đội ngũ hỗ
        trợ khách hàng của chúng tôi tại{' '}
        <a className="text-brand hover:underline" href="mailto:info@innix.com">
          info@innix.com
        </a>
        . Chúng tôi ở đây để giúp bạn!
      </p>
      <p className="text-lg">
        Cảm ơn bạn đã chọn <span className="text-brand">INNIX</span>. Chúng tôi
        mong muốn trở thành nền tảng đáng tin cậy cho mọi nhu cầu đặt phòng
        khách sạn của bạn.
      </p>
    </div>
  );
};

export default AboutUs;
