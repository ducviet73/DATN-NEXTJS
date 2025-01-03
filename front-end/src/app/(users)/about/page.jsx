"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ProductCard from "@/app/(users)/components/ProductCard"; // Nếu bạn có component riêng

const AboutPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:3000/products/hot", { cache: 'no-store' });
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="container my-5">
      <div className="row mb-5">
        {/* Phần Giới Thiệu Cửa Hàng */}
        <div className="col-md-12">
          <div className="bg-light p-4 rounded shadow-sm">
            <h2 className="text-primary text-center mb-3">Chào Mừng Đến Với Shop Giày Của Chúng Tôi!</h2>
            <p className="text-muted">
              Trong thời đại công nghệ phát triển vượt bậc, các thiết bị di động và máy tính được kết nối internet đã thay đổi hoàn toàn thói quen sử dụng dịch vụ của người tiêu dùng. Từ mua sắm đến các dịch vụ tiện ích khác, mọi thứ giờ đây đều có thể thực hiện nhanh chóng chỉ với vài cú nhấp chuột.
            </p>
            <p className="text-muted">
              Một xu hướng không thể phủ nhận là ngày nay, hầu hết khách hàng đều tìm kiếm thông tin trên mạng trước khi quyết định mua sắm hoặc sử dụng dịch vụ. Với sự tiện lợi của việc tra cứu và tham khảo đánh giá trực tuyến, nhu cầu xây dựng một hệ thống website không chỉ giới thiệu sản phẩm mà còn tích hợp tính năng quản lý và đặt hàng trở nên thiết yếu.
            </p>
            <p className="text-muted">
              Website Stars không chỉ là nơi để khách hàng dễ dàng tìm kiếm và lựa chọn sản phẩm, mà còn tích hợp các công nghệ mới nhất nhằm tối ưu hóa trải nghiệm mua sắm. Với các tính năng như:
              <ul>
                <li>Xem và quản lý danh mục sản phẩm: Bao gồm các mẫu giày nổi bật và đang được ưa chuộng.</li>
                <li>Hệ thống đặt hàng trực tuyến: Giúp khách hàng tiết kiệm thời gian và dễ dàng sở hữu đôi giày yêu thích.</li>
                <li>Quản lý kho hàng và đơn hàng dành cho nhà quản lý: Được thiết kế trực quan, hỗ trợ kiểm soát hiệu quả hoạt động kinh doanh.</li>
              </ul>
            </p>
        
            <div className="text-center my-4">
              <img 
                src="/img/logo.jpg" 
                alt="Shop Giày Stars" 
                className="img-fluid rounded" 
              />
            </div>
</div>
        </div>
      </div>

      <div className="text-center mb-5">
      <h3 className="text-uppercase font-weight-bold">Sản Phẩm Nổi Bật</h3>
      <p className="lead text-muted">Dưới đây là những đôi giày được ưa chuộng nhất tại cửa hàng của chúng tôi.</p>
    </div>
    <div className="container my-3">
    <div>
    <div class="container-nav-brand-table-title">
  </div>
      <div className="row">
        <ProductCard data={data} />
      </div>
    </div>
  </div>
    </div>
  );
};

export default AboutPage;