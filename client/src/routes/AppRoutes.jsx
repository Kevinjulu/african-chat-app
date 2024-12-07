import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from '../components/landing/WelcomePage';
import ChatApp from '../components/chat/ChatApp';
import { useAuth } from '../context/AuthContext';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route 
        path="/chat" 
        element={
          user ? <ChatApp /> : <Navigate to="/" replace />
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
