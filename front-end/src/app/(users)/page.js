import Image from "next/image";
import styles from "./page.module.css";
import ProductCard from "./components/ProductCard";
import Banner from "./components/Banner";
import Category from "./category/page";
import ProductBestselling from "./components/productbestselling";
import ProductHot from "./components/producthot";

export default async function Home() {
  const res = await fetch("http://localhost:3000/products", {
    cache: "no-store",
  });
  const data = await res.json();
  console.log(data);
  return (
    <>
      <Banner />
      <div className="container my-3">
        <div>
          <div className="row d-flex justify-content-between mx-1 ">
            <div className="container-nav-brand-table-title">
              <div className="nav-brand-table-title-animated">
                <h3>Sản phẩm mới </h3>
              </div>
            </div>
          </div>
          <div className="row ">
            <ProductCard data={data.slice(0, 4)} />
          </div>
        </div>
      </div>

      <div className="container my-3">
        <div className="container-outfit-product-all">
          <div className="container-nav-brand-table-title">
            <div className="nav-brand-table-title-animated">
              <h3>Trend Outfits</h3>
            </div>
          </div>
          <div className="container-outfit-product-items">
            <div className="outfit-product-item">
              <img src="img/outfit-1.jpg" alt="Outfit 1" />
              <div className="outfit-product-item-text-content">
                <span data-text="Outfits 1">Outfits 1</span>
              </div>
            </div>
            <div className="outfit-product-item">
              <img src="img/outfit-2.jpg" alt="Outfit 2" />
              <div className="outfit-product-item-text-content">
                <span data-text="Outfits 2">Outfits 2</span>
              </div>
            </div>
            <div className="outfit-product-item">
              <img src="img/outfit-3.jpg" alt="Outfit 3" />
              <div className="outfit-product-item-text-content">
                <span data-text="Outfits 3">Outfits 3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductBestselling />
      <div className="container-nav-brand-table-title">
        <div className="nav-brand-table-title-animated">
          <h3>Quảng cáo</h3>
        </div>
      </div>
      <div className="container-outfit-product-item-big">
        <img src="img/banner-items.jpg" alt="Banner" />
      </div>
      <ProductHot />
      <div className="container my-3">
        <div className="container-nav-brand-table-title">
          <div className="nav-brand-table-title-animated">
            <h3>Thương hiệu</h3>
          </div>
        </div>
        <div className="container-nav-brand-table-poduct">
          <div className="container-nav-brand-table-poduct-items">
            <div className="container-nav-brand-table-poduct-item">
              <div className="brand-table-poduct-item-img">
                <img src="img/danhmuc.jpg" alt="Nike" />
              </div>
              <div className="brand-table-poduct-item-name">
                <span>Nike</span>
              </div>
              <div className="brand-table-poduct-item-name-main">
                <button>Xem Ngay</button>
              </div>
              <div className="brand-table-poduct-item-thanhtoan">
                <span>
                  <i className="bx bx-receipt"></i> Đã bán 105
                </span>
              </div>
            </div>
            <div className="container-nav-brand-table-poduct-item">
              <div className="brand-table-poduct-item-img">
                <img src="img/danhmuc-bancelona.jpg" alt="Barcelona" />
              </div>
              <div className="brand-table-poduct-item-name">
                <span>Barcelona</span>
              </div>
              <div className="brand-table-poduct-item-name-main">
                <button>Xem Ngay</button>
              </div>
              <div className="brand-table-poduct-item-thanhtoan">
                <span>
                  <i className="bx bx-receipt"></i> Đã bán 555
                </span>
              </div>
            </div>
            <div className="container-nav-brand-table-poduct-item">
              <div className="brand-table-poduct-item-img">
                <img src="img/danhmuc-nike-max.jpg" alt="Nike Max Jr" />
              </div>
              <div className="brand-table-poduct-item-name">
                <span>Nike Max Jr</span>
              </div>
              <div className="brand-table-poduct-item-name-main">
                <button>Xem Ngay</button>
              </div>
              <div className="brand-table-poduct-item-thanhtoan">
                <span>
                  <i className="bx bx-receipt"></i> Đã bán 200
                </span>
              </div>
            </div>
            <div className="container-nav-brand-table-poduct-item">
              <div className="brand-table-poduct-item-img">
                <img src="img/danhmuc-rela.jpg" alt="Rela" />
              </div>
              <div className="brand-table-poduct-item-name">
                <span>Rela</span>
              </div>
              <div className="brand-table-poduct-item-name-main">
                <button>Xem Ngay</button>
              </div>
              <div className="brand-table-poduct-item-thanhtoan">
                <span>
                  <i className="bx bx-receipt"></i> Đã bán 88
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
