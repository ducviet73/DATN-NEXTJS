"use client"
import React, { useState, useEffect } from 'react';

const createSlug = (title) => {
  return title
    .toLowerCase()   
    .normalize('NFD')                     // Phân tách ký tự Unicode thành ký tự cơ bản và dấu phụ
    .replace(/[\u0300-\u036f]/g, '')          
    .replace(/[^a-z0-9\s]/g, '')
    .trim()                  
    .replace(/\s+/g, '-')
    .replace(/(^-|-$)/g, '');
};

function ArticleEditor() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');

 
  useEffect(() => {
    setSlug(createSlug(title));
  }, [title]);

  return (
    <div>
      <h1>Article Editor</h1>
      <form>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="slug">Slug:</label>
          <input
            id="slug"
            type="text"
            value={slug}
            readOnly
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default ArticleEditor;
