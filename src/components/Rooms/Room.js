// src/components/Rooms/Room.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';
import { io } from 'socket.io-client';

const Room = () => {
  const { roomId } = useParams();
  const { user } = useContext(AuthContext);
  const [qrCode, setQrCode] = useState('');
  const [receivedQRCodes, setReceivedQRCodes] = useState([]);
  const [receivers, setReceivers] = useState([]);

  // 使用相對路徑連接 Socket.io，透過代理處理
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('/', {
      path: '/socket.io',
      withCredentials: true,
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    if (!socket) return;

    // 加入房間
    socket.emit('joinRoom', { roomId });

    // 接收更新後的接收者列表
    socket.on('receiversList', (data) => {
      setReceivers(data);
    });

    // 接收 QR Code
    socket.on('receiveQRCode', ({ qrCodeData, receiverId }) => {
      if (receiverId === user._id) { // 確保只接收發給自己的 QR Code
        setReceivedQRCodes(prev => [...prev, qrCodeData]);
      }
    });

    // 處理錯誤
    socket.on('error', (message) => {
      console.error('Socket error:', message);
    });

    // 清理事件監聽
    return () => {
      socket.off('receiversList');
      socket.off('receiveQRCode');
      socket.off('error');
    };
  }, [socket, roomId, user._id]);

  const handleSendQRCode = () => {
    if (qrCode.trim() === '') return;

    // 只發送 QR Code 給未點名的接收者
    const activeReceivers = receivers.filter(receiver => receiver.status === '未點名');
    if (activeReceivers.length === 0) {
      alert('沒有未點名的接收者可以發送 QR Code。');
      return;
    }

    socket.emit('sendQRCode', { roomId, qrCodeData: qrCode });
    setQrCode('');
  };

  const handleConfirm = async (receiverId) => {
    try {
      await axios.put(`/api/rooms/${roomId}/receivers/${receiverId}`, { status: '已點名' }, { withCredentials: true });
      socket.emit('confirmStatus', { roomId });
    } catch (err) {
      console.error('Failed to confirm status:', err.response?.data || err.message);
    }
  };

  return (
    <div>
      <h2>房間: {roomId}</h2>
      <div>
        <h3>發送 QR Code</h3>
        <input
          type="text"
          value={qrCode}
          onChange={e => setQrCode(e.target.value)}
          placeholder="輸入 QR Code 資料"
        />
        <button onClick={handleSendQRCode}>發送</button>
      </div>
      <div>
        <h3>接收的 QR Code</h3>
        <ul>
          {receivedQRCodes.map((data, index) => (
            <li key={index}>{data}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>房間內使用者</h3>
        <ul>
          {receivers.map(receiver => (
            <li key={receiver.accountId}>
              {receiver.username} - {receiver.status}
              {receiver.status === '未點名' && (
                <button onClick={() => handleConfirm(receiver.accountId)}>確認已點名</button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Room;
