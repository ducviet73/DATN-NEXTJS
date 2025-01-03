"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlices"; // Make sure this is correct
import ProductBestselling from "@/app/(users)/components/productbestselling";
import useSWR, { mutate } from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Detail({ params }) {
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("37");
    const [selectedColor, setSelectedColor] = useState("");
    const [newReview, setNewReview] = useState("");
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(0); // New state for rating

    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

     const { data, error, isLoading } = useSWR(
        `https://star-backend-z1cm.onrender.com/products/detail/${params.id}`,
        fetcher
    );
     const { data: reviewsData, error: reviewsError, isLoading: reviewsLoading , mutate : mutateReviews} = useSWR(
        `https://star-backend-z1cm.onrender.com/api/reviews/${params.id}`,
        fetcher
    );

      const { data: promotionalProductData} = useSWR(
         `https://star-backend-z1cm.onrender.com/api/promotional-products`,
         fetcher
      );

    if (error) return <strong>Error loading product details</strong>;
    if (isLoading) return <div className="loader">Loading...</div>;
    if (!data) return <p>No product data available.</p>;

      if (reviewsError) return <strong>Error loading reviews</strong>;
      if (reviewsLoading) return <div className="loader">Loading reviews...</div>;


     const getPromotionalProductForProduct = () => {
       return promotionalProductData?.find(promo => promo.id_product?._id === data._id);
    };
      const promotionalProduct = getPromotionalProductForProduct()
      const promotion = promotionalProduct?.id_promotional

        let discountedPrice = data.price;
        let discountPercentage = 0;
          if(promotion){
              discountPercentage = promotion.percent_discount;
               discountedPrice = data.price * (1 - discountPercentage / 100);
         }
            const formattedDiscountedPrice = discountedPrice.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            });
        const originalPrice = data.price.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            });

  const handleAddToCart = (item, quantity, size, color) => {
    dispatch(addToCart({ item, quantity, size, color }));
    router.push("/cart");
  };

  const handleAddReview = async () => {
    if (!user) {
      alert("Bạn cần đăng nhập để viết đánh giá.");
      router.push("/login");
      return;
    }

    if (!newReview.trim()) {
      alert("Vui lòng nhập nội dung đánh giá.");
      return;
    }

    try {
        setLoading(true);
          const newReviewObject = {
               id_user: user._id,
               id_product: params.id,
               content: newReview,
               rating : rating
           }
       mutateReviews( [...reviewsData, newReviewObject], false)

         const response = await fetch(`https://star-backend-z1cm.onrender.com/api/reviews`, {
             method: "POST",
             headers: {
                 "Content-Type": "application/json",
             },
             body: JSON.stringify(newReviewObject),
         });

         if (!response.ok) {
              const message = await response.json()
              throw new Error(message.error || "Failed to add review");
          }

        setNewReview("");
         setRating(0)
          mutateReviews();
           alert("Đánh giá của bạn đã được thêm!");


    } catch (error) {
      console.error("Error adding review:", error);
      alert(`Đã xảy ra lỗi khi thêm đánh giá: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };
   
    const renderStars = () => {
        return [...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
                 <i
                     key={index}
                      onClick={() => handleRatingChange(starValue)}
                     className={`bi ${starValue <= rating ? 'bi-star-fill' : 'bi-star'}`}
                     style={{ cursor: 'pointer', color: '#ffd700' }}
                      aria-hidden="true"
                 ></i>
            );
        });
    };

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="container-detail-all">
          <div className="detail_temple_1">
            <div className="detail_content_product_mota">
              <span>{data.description}</span>
            </div>
          </div>
          <div className="detail_temple_2">
            <div className="detail_temple_2_img_main">
              <img
                 src={data.image.startsWith('http') ? data.image : `https://star-backend-z1cm.onrender.com/${data.image}` }
                 alt={data.name} style={{height:"550px"}}
              />
            </div>
          </div>
          <div className="detail_temple_3">
            <div className="detail_content_product_name">
              <h3>{data.name}</h3>
            </div>
            <div className="detail_temple_cannang">
              <h3>Size</h3>
              <div style={styles.sizeItems}>
                {['37', '38', '39', '40'].map((size) => (
                  <button
                    key={size}
                    style={{
                      ...styles.sizeButton,
                      ...(selectedSize === size ? styles.sizeButtonActive : {}),
                    }}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
             <br />
            <div className="detail_temple_price">
              <h3>Giá</h3>
              <div className="temple_price_two">
                  <div className="temple_price_sale">
                    <span>{formattedDiscountedPrice}</span> VNĐ
                  </div>
                {discountPercentage > 0 && <div className="temple_price_giagoc">
                    <del>{originalPrice}</del> VNĐ
                  </div>}
              </div>
            </div>
            <div className="detail_temple_cauhinh">
              <h4>Size</h4>
              <div style={styles.sizeItems}>
                {['37', '38', '39', '40', '41', '42'].map((size) => (
                  <button
                    key={size}
                    style={{
                      ...styles.sizeButton,
                      ...(size === selectedSize ? styles.sizeButtonSelected : {}),
                    }}
                    onClick={() => setSelectedSize(size)} // Sửa đúng logic chọn size
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="detail_temple_color">
              <h4>Màu</h4>
              <div style={styles.colorItems}>
                {['black', 'white', 'green', 'blue'].map((color) => (
                  <button
                    key={color}
                    style={{
                      ...styles.colorButton,
                      ...(color === selectedColor ? styles.colorButtonSelected : {}),
                      ...(color === 'black' ? styles.colorBlack : {}),
                      ...(color === 'white' ? styles.colorWhite : {}),
                      ...(color === 'green' ? styles.colorGreen : {}),
                      ...(color === 'blue' ? styles.colorBlue : {}),
                    }}
                    onClick={() => setSelectedColor(color)}
                  ></button>
                ))}
              </div>
            </div>
            <div className="thanhtoan-4-1">
              <input
                min="1"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <div className="detail_temple_btn_all">
              <button
                className="detail_addtocart"
                onClick={() => handleAddToCart(data, quantity, selectedSize, selectedColor)}
              >
                Mua Ngay
              </button>
            </div>
          </div>
        </div>
      </div>

       <div className="review-section" style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" , margin : "20px" }}>
           <h2 style={{ fontSize: "24px", marginBottom: "20px", color: "#333" }}>Viết Đánh Giá</h2>
             {!user ? (
                  <p style={{ fontSize: "16px", color: "#555" }}>
                    Bạn cần <a href="/login" style={{ color: "#007bff" }}>đăng nhập</a> để viết đánh giá.
                  </p>
                ) : (
                     <div>
                          <p style={{ fontSize: "16px", color: "#333" }}>Xin chào, <b>{user.username}</b>!</p>
                           <textarea
                               value={newReview}
                               onChange={(e) => setNewReview(e.target.value)}
                               placeholder="Nhập đánh giá của bạn..."
                               rows="4"
                               cols="50"
                               style={{
                                  width: "100%",
                                  padding: "10px",
                                  border: "1px solid #ccc",
                                  borderRadius: "4px",
                                  fontSize: "14px",
                                  marginBottom: "10px",
                                  resize: "vertical",
                               }}
                            />
                        <br />
                        <button
                           onClick={handleAddReview}
                           disabled={loading}
                           style={{
                             padding: "10px 20px",
                             backgroundColor: "#007bff",
                             color: "#fff",
                             border: "none",
                             borderRadius: "4px",
                             cursor: "pointer",
                             fontSize: "16px",
                            }}
                        >
                         {loading ? "Đang gửi..." : "Gửi đánh giá"}
                        </button>
                     </div>
                   )}

              <div className="review-list" style={{ marginTop: "30px" }}>
                  <h3 style={{ fontSize: "20px", color: "#333" }}>Đánh Giá Khách Hàng</h3>
                   {reviewsData && reviewsData.length > 0 ? (
                       reviewsData.map((review, index) => (
                           <div key={index} className="review-item" style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}>
                              <p style={{ fontSize: "16px", color: "#333" }}>
                                <strong style={{ color: "#007bff" }}>{review.id_user ? review.id_user.username : 'Anonymous'}</strong> :
                                    ({review.id_user ? new Date(review.created_at).toLocaleDateString('vi-VN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            }) : ''})
                               <br />
                                  {review.content}
                                  <br/>
                                
                               </p>
                           </div>
                       ))
                    ) : (
                        <p style={{ fontSize: "16px", color: "#555" }}>Chưa có đánh giá nào.</p>
                      )}
                </div>
       </div>


      <ProductBestselling />
    </div>
  );
}
// Define the styles here
const styles = {
    sizeItems: {
        display: 'flex',
    },
    sizeButton: {
      border: '1px solid #ddd',
      padding: '5px 10px',
        borderRadius: '4px',
        marginRight: '5px',
      backgroundColor: 'white',
      cursor: 'pointer',
    },
    sizeButtonActive: {
        backgroundColor: '#007bff',
       color : 'white',
    },
     colorItems: {
        display: 'flex',
        margin : '10px',
    },
    colorButton: {
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        border: '1px solid #ddd',
        cursor: 'pointer',
        marginRight: '5px',
    },
    colorButtonSelected: {
      border: '2px solid black',
    },
    colorBlack: {
        backgroundColor: 'black',
    },
    colorWhite: {
        backgroundColor: 'white',
    },
    colorGreen: {
        backgroundColor: 'green',
    },
    colorBlue: {
        backgroundColor: 'blue',
    },
};