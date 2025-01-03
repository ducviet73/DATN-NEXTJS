"use client";
import React, { useEffect, useState } from "react";
import CategoryForm from "../components/CategoryForm";
import Link from "next/link";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);

  // Define fetchCategories function outside useEffect
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:3000/categories");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setCategories(data); // Set categories data to state
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Call fetchCategories inside useEffect
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/categories/${id}`, {
        method: "DELETE",
      });
      setCategories(categories.filter((category) => category._id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
  };

  const handleSuccess = () => {
    setEditingCategory(null);
    fetchCategories(); // Refresh the list after adding/updating
  };

  return (
    <div className="container mt-4">
      <div className=" d-flex justify-content-between">
        <Link
          href="/admin/product"
          className="btn btn-outline-secondary rounded-0"
        >
          <i className="far fa-long-arrow-left"></i> Back
        </Link>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="p-3 border bg-light">
            <h2>Category List is ({categories.length})</h2>
            <ul className="list-group">
              {categories.map((category) => (
                <li
                  key={category._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>{category.name}</span>
                  <div>
                    <button
                      className="btn btn-primary btn-sm me-1"
                      onClick={() => handleEdit(category)}
                      title="Edit"
                    >
                      <i className="fas fa-eye fa-fw"></i>
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(category._id)}
                      title="Delete"
                    >
                      <i className="fas fa-times fa-fw"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div class="col-md-6">
          <div class="p-3 border bg-light">
            <CategoryForm
              category={editingCategory}
              onSuccess={() => {
                setEditingCategory(null);
                fetchCategories();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
