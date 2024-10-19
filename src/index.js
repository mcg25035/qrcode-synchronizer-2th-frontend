// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from 'axios';
import './index.css';


// 設定 Axios 預設
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

ReactDOM.render(<App />, document.getElementById('root'));
