import React, { useState } from 'react';
import './styles.css'; // Make sure to import your CSS file
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function SignUpForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    remember: false
  });
  const navigate=useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      for (let key in formData) {
        data.append(key, formData[key]);
      }
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
      const response = await axios.post('https://atulfinal.pythonanywhere.com/signup', data, config);
      if(response.data['status']==='register success')
      {
         navigate('/')
      } // Do something with the response if needed
      if(response.data['status']==='error'){
          alert('user already Exists')
      }

    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <div className="input-group">
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" placeholder="Your Name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" placeholder="Your Email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" placeholder="Your Password" value={formData.password} onChange={handleChange} />
        </div>
        <div className="checkbox">
          <label htmlFor="remember">
            <input type="checkbox" name="remember" id="remember" checked={formData.remember} onChange={handleChange} /> Remember Me
          </label>
        </div>
        <button type="submit">Sign Up</button>
        <p>Already have an account? <Link to="/">Login</Link></p>
      </form>
    </div>
  );
}

export default SignUpForm;
