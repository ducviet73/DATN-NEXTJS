'use client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const CategoryForm = ({ category, onSuccess }) => {
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
    const isEditing = Boolean(category);

    useEffect(() => {
        if (category) {
           
            setValue('name', category.name);
        } else {
          
            reset();
        }
    }, [category, setValue, reset]);

    const onSubmit = async (data) => {
        try {
            const response = await fetch(`http://localhost:3000/categories${isEditing ? `/${category._id}` : ''}`, {
                method: isEditing ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Category saved successfully:', result);
            onSuccess(); // Call onSuccess after a successful response
        } catch (error) {
            console.error("Error saving category:", error);
            alert('Error saving category. Please try again.');
        }
    };

    return (
        <div className="card rounded-0 border-0 shadow-sm mb-4">
            <div className="card-body">
                <h6 className="pb-3 border-bottom">{isEditing ? 'Edit Category' : 'Add Category'}</h6>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Category Name *</label>
                        <input
                            type="text"
                            id="name"
                            className="form-control rounded-0"
                            {...register('name', { required: 'Category name is required' })}
                        />
                        {errors.name && <div className="text-danger">{errors.name.message}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg rounded-0 mt-2">
                        {isEditing ? 'Update Category' : 'Add Category'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CategoryForm;
