// src/components/Auth/Signup.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(username, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data || '註冊失敗，可能是帳號已存在。');
    }
  };

  return (
    <div>
      <h2>註冊</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>帳號:</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>密碼:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">註冊</button>
      </form>
      <p>已有帳號？ <Link to="/login">登入</Link></p>
    </div>
  );
};

export default Signup;
