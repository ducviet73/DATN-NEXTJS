"use client";

import { useState } from "react";

const NewsPage = () => {
  const [showNike, setShowNike] = useState(false);
  const [showAdidas, setShowAdidas] = useState(false);
  const [showBalenciaga, setShowBalenciaga] = useState(false);
  const [showVans, setShowVans] = useState(false);

  return (
    <div className="container my-5">
      <h1 className="text-center mb-5 text-primary font-weight-bold">Sự Lựa Chọn Dành Cho Bạn</h1>
      <div className="row justify-content-center">
        {/* Giày Nike */}
        <GiayCard
          imgSrc="/img/product-14.jpg"
          title="Giày Nike - Biểu Tượng Của Sự Đổi Mới Và Hiệu Suất"
          description="Nike luôn dẫn đầu trong ngành công nghiệp thể thao với công nghệ hiện đại và thiết kế sáng tạo."
          details={
            <>
              <p className="card-text text-muted">
                **Nike** được thành lập năm 1964, nổi bật với slogan **"Just Do It"**. Thương hiệu này đã không ngừng cải tiến, sáng tạo các dòng giày mang tính biểu tượng trên toàn cầu.
              </p>
              <p className="card-text text-muted">
                <strong>Nike Air Max</strong> sở hữu bộ đệm khí **Air-Sole** độc quyền, mang đến sự êm ái tuyệt vời và giảm thiểu chấn động. Đế giày trong suốt là thiết kế mang tính đột phá, không chỉ hiệu quả mà còn cực kỳ thời trang.
              </p>
              <p className="card-text text-muted">
                Với **Nike Air Force 1**, thương hiệu này đã tạo ra biểu tượng của sự kết hợp giữa thể thao và thời trang đường phố. Đôi giày da với phần đế dày mang đến phong cách năng động và lịch lãm.
              </p>
              <p className="card-text text-muted">
                Ngoài ra, Nike còn phát triển nhiều dòng giày chuyên biệt cho bóng rổ, bóng đá và chạy bộ, luôn đáp ứng nhu cầu của cả vận động viên chuyên nghiệp lẫn người tiêu dùng thông thường.
              </p>
              <p className="card-text text-muted">
                Thông qua các sản phẩm của mình, Nike không chỉ cung cấp giày thể thao mà còn truyền tải tinh thần chiến thắng và động lực vượt qua giới hạn.
              </p>
            </>
          }
          showDetails={showNike}
          toggleDetails={() => setShowNike(!showNike)}
        />

        {/* Giày Adidas */}
        <GiayCard
          imgSrc="/img/product-15.jpg"
          title="Giày Adidas - Sự Kết Hợp Giữa Hiệu Năng Và Phong Cách"
          description="Adidas là thương hiệu nổi tiếng với những đôi giày mang thiết kế thanh lịch và công nghệ đột phá."
          details={
            <>
              <p className="card-text text-muted">
                Được thành lập từ năm 1949, **Adidas** đã khẳng định vị thế hàng đầu trong làng thể thao thế giới. Với khẩu hiệu **"Impossible is Nothing"**, Adidas luôn truyền tải thông điệp vượt qua giới hạn bản thân.
              </p>
              <p className="card-text text-muted">
                <strong>Adidas UltraBoost</strong> nổi bật với công nghệ **Boost™**, giúp hoàn trả năng lượng mỗi bước di chuyển. Thân giày **Primeknit** co giãn linh hoạt, ôm sát bàn chân và mang lại trải nghiệm tối ưu cho người dùng.
              </p>
              <p className="card-text text-muted">
                Ngoài ra, **Adidas Stan Smith** là đôi giày classic kinh điển với thiết kế trắng tinh tế. Sự đơn giản này đã giúp đôi giày trở thành biểu tượng thời trang, dễ dàng kết hợp với nhiều phong cách từ thanh lịch đến năng động.
              </p>
              <p className="card-text text-muted">
                **Adidas NMD** và **Yeezy** cũng là những dòng giày thời trang nổi bật, kết hợp giữa tính năng và phong cách hiện đại, được giới trẻ ưa chuộng toàn cầu.
              </p>
            </>
          }
          showDetails={showAdidas}
          toggleDetails={() => setShowAdidas(!showAdidas)}
        />

        {/* Giày Balenciaga */}
        <GiayCard
          imgSrc="/img/product-16.jpg"
          title="Giày Balenciaga - Đỉnh Cao Của Thời Trang Cao Cấp"
          description="Balenciaga luôn mang đến những thiết kế độc đáo, phá cách và táo bạo trong từng sản phẩm."
          details={
            <>
              <p className="card-text text-muted">
                Thương hiệu **Balenciaga** được thành lập từ năm 1919 tại Tây Ban Nha và đã trở thành một biểu tượng trong thế giới thời trang xa xỉ.
              </p>
              <p className="card-text text-muted">
                Với thiết kế **Triple S**, Balenciaga đã đi đầu trong xu hướng **chunky sneakers**. Đế giày dày nhiều lớp và màu sắc táo bạo là điểm nhấn đặc biệt, thu hút giới trẻ yêu thích phong cách thời thượng.
              </p>
              <p className="card-text text-muted">
                Dòng giày **Speed Trainer** mang phong cách tương lai với phần thân giày dạng tất co giãn, ôm trọn bàn chân và tạo cảm giác thoải mái như đi chân trần.
              </p>
              <p className="card-text text-muted">
                Balenciaga không chỉ sản xuất giày mà còn là biểu tượng cho sự sáng tạo và đẳng cấp trong giới thời trang toàn cầu.
              </p>
            </>
          }
          showDetails={showBalenciaga}
          toggleDetails={() => setShowBalenciaga(!showBalenciaga)}
        />

        {/* Giày Vans */}
        <GiayCard
          imgSrc="/img/product-17.jpg"
          title="Giày Vans - Tinh Thần Tự Do Và Văn Hóa Đường Phố"
          description="Vans là biểu tượng của phong cách bụi bặm, tự do và năng động."
          details={
            <>
              <p className="card-text text-muted">
                Ra đời vào năm 1966 tại California, **Vans** đã nhanh chóng trở thành thương hiệu biểu tượng trong giới trượt ván và thời trang đường phố.
              </p>
              <p className="card-text text-muted">
                **Vans Old Skool** với đường kẻ sọc jazz đặc trưng và chất liệu **canvas** bền bỉ, đã trở thành biểu tượng của phong cách trẻ trung, phóng khoáng.
              </p>
              <p className="card-text text-muted">
                Dòng **Vans Slip-On** nổi bật với thiết kế không dây và họa tiết **Checkerboard** quen thuộc, mang đến sự tiện lợi và phong cách đặc trưng.
              </p>
              <p className="card-text text-muted">
                Vans không chỉ là thương hiệu giày, mà còn đại diện cho **tinh thần tự do**, văn hóa âm nhạc và nghệ thuật đường phố, được giới trẻ toàn cầu yêu thích.
              </p>
            </>
          }
          showDetails={showVans}
          toggleDetails={() => setShowVans(!showVans)}
        />
      </div>
    </div>
  );
};

const GiayCard = ({ imgSrc, title, description, details, showDetails, toggleDetails }) => (
  <div className="col-md-6 mb-4">
    <div className="card shadow-lg border-light rounded">
      <img
        src={imgSrc}
        className="card-img-top rounded-top"
        alt={title}
        style={{ height: "300px", objectFit: "cover" }}
      />
      <div className="card-body">
        <h5 className="card-title text-primary font-weight-bold">{title}</h5>
        <p className="card-text text-muted">{description}</p>
        {showDetails && details}
        <button className="btn btn-outline-primary" onClick={toggleDetails}>
          {showDetails ? "Ẩn bớt" : "Xem thêm"}
        </button>
      </div>
    </div>
  </div>
);

export default NewsPage;
