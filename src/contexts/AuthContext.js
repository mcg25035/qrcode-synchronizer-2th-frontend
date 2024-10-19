// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 檢查是否已登入
  useEffect(() => {
    axios.get('/api/accounts/me', { withCredentials: true })
      .then(response => {
        setUser(response.data);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  const login = (username, password) => {
    return axios.post('/api/accounts/login', { username, password }, { withCredentials: true })
      .then(response => setUser(response.data));
  };

  const signup = (username, password) => {
    return axios.post('/api/accounts', { username, password }, { withCredentials: true })
      .then(response => setUser(response.data));
  };

  const logout = () => {
    return axios.post('/api/accounts/logout', {}, { withCredentials: true })
      .then(() => setUser(null));
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
