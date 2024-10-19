// src/components/Rooms/CreateRoom.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateRoom = () => {
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/rooms', { roomId });
      navigate(`/room/${roomId}`);
    } catch (err) {
      setError(err.response?.data || '無法建立房間，可能是房間 ID 已存在。');
    }
  };

  return (
    <div>
      <h2>建立新房間</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleCreate}>
        <div>
          <label>房間 ID:</label>
          <input
            type="text"
            value={roomId}
            onChange={e => setRoomId(e.target.value)}
            required
          />
        </div>
        <button type="submit">建立</button>
      </form>
    </div>
  );
};

export default CreateRoom;
