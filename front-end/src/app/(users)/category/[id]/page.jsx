'use client'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProductCard from "@/app/(users)/components/ProductCard";

export default function Detail({ params }) {
  const [data, setProduct] = useState([]); // Initialize as an empty array
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products/category/${params.id}`,
          { cache: "no-store" }
        );
        const result = await response.json();
        console.log("Fetched data:", result);
        // Ensure the fetched data is an array
        setProduct(Array.isArray(result) ? result : []);
        setCategoryName(params.children || "");
      } catch (error) {
        console.error("Error fetching data:", error);
        setProduct([]); // Set to an empty array on error
      }
    };
    fetchData();
  }, [params.id, params.children]);

  return (
    <>
      <div className="container my-3">
        <div>
          <div className="row d-flex justify-content-between mx-1 ">
            <div className="p-1 w-auto">
              <h5 className="text-success">SẢN PHẨM ĐẾN TỪ {categoryName}</h5>
            </div>
          </div>
          <div className="row ">
            <ProductCard data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
