"use client";
import React from "react";
import Link from "next/link";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Category() {

  const { data, error } = useSWR("http://localhost:3000/categories", fetcher, { revalidateOnFocus: false });

  if (error) return <p>Error: {error.message}</p>;


  if (!data) return <p>Loading...</p>;

  return (
    <ul>
      {data.map((item) => (
        <li className="nav-item" key={item._id}>
          <Link className="nav-link text-black dropdown-item" href={`/category/${item._id}`}>
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
