// src/components/Rooms/RoomList.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const RoomList = () => {
  const { user, logout } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('/api/rooms');
      setRooms(response.data);
    } catch (err) {
      console.error('無法取得房間列表');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div>
      <h2>歡迎, {user.username}</h2>
      <button onClick={handleLogout}>登出</button>
      <h3>房間列表</h3>
      <ul>
        {rooms.map(room => (
          <li key={room.id}>
            <Link to={`/room/${room.id}`}>{room.id}</Link>
          </li>
        ))}
      </ul>
      <Link to="/create-room">建立新房間</Link>
    </div>
  );
};

export default RoomList;
