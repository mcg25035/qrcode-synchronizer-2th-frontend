// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { AuthProvider, AuthContext } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import RoomList from './components/Rooms/RoomList';
import CreateRoom from './components/Rooms/CreateRoom';
import Room from './components/Rooms/Room';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/signup" element={<SignupRoute />} />
          <Route path="/" element={<PrivateRoute><RoomList /></PrivateRoute>} />
          <Route path="/create-room" element={<PrivateRoute><CreateRoom /></PrivateRoute>} />
          <Route path="/room/:roomId" element={<PrivateRoute><Room /></PrivateRoute>} />
          {/* 其他路由可以在此添加 */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

// Private Route Component
const PrivateRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

// Redirect authenticated users away from login/signup
const LoginRoute = () => {
  const { user } = React.useContext(AuthContext);
  return user ? <Navigate to="/" /> : <Login />;
};

const SignupRoute = () => {
  const { user } = React.useContext(AuthContext);
  return user ? <Navigate to="/" /> : <Signup />;
};

export default App;
