import React, { useState } from 'react';
import './new.css'; // Make sure to import your CSS file
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
    <div style={{ backgroundColor: '#033366', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="signup_container" style={{ width: '80%', maxWidth: '300px', padding: '20px', borderRadius: '15px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}> 
        <form onSubmit={handleSubmit}>
          <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Create Account</h2>
          <div className="signup_input-group" style={{ marginBottom: '10px' }}>
            <label htmlFor="name" style={{ marginBottom: '5px' }}>Name</label>
            <input type="text" name="name" id="name" placeholder="Your Name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '7px', fontSize: '14px' }} />
          </div>
          <div className="signup_input-group" style={{ marginBottom: '10px' }}>
            <label htmlFor="email" style={{ marginBottom: '5px' }}>Email</label>
            <input type="email" name="email" id="email" placeholder="Your Email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '7px', fontSize: '14px' }} />
          </div>
          <div className="input-group" style={{ marginBottom: '10px' }}>
            <label htmlFor="password" style={{ marginBottom: '5px' }}>Password</label>
            <input type="password" name="password" id="password" placeholder="Your Password" value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '7px', fontSize: '14px' }} />
          </div>
          <div className="signup_checkbox" style={{ marginBottom: '10px' }}>
            <label htmlFor="remember">
              <input type="checkbox" name="remember" id="remember" checked={formData.remember} onChange={handleChange} style={{ marginRight: '5px' }} /> Remember Me
            </label>
          </div>
          <button type="submit" className="signup_button" style={{ width: '100%', padding: '10px', backgroundColor: '#52359c', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', cursor: 'pointer' }}>Sign Up</button>
          <p style={{ textAlign: 'center', fontSize: '14px' }}>Already have an account? <Link to="/" className="login-link" style={{ color: '#033366', textDecoration: 'none' }}>Login</Link></p>
        </form>
      </div>
    </div>
    
  );
}

export default SignUpForm;
