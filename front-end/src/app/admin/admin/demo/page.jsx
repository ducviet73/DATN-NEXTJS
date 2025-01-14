"use client";
import { useState } from "react";

export default function FormInput() {
  const [inputValue, setInputValue] = useState('');
  const [email, setEmail] = useState('');
  const [focus, setFocus] = useState(false);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Email: ${email}`);
  };

  return (
    <>  
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="text-input">Text Input:</label>
          <input
            id="text-input"
            type="text"
            value={inputValue}
            onChange={handleChange}
          />
          <div>
            <strong>Uppercase Text: </strong>{inputValue.toUpperCase()}
          </div>
        </div>

        <div>
          <label htmlFor="email-input">Email:</label>
          <input
            id="email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            style={{ backgroundColor: focus ? 'blue' : 'white' }}
          />
          {focus && <h1>Nguyễn haha</h1>}
        </div>
        
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
