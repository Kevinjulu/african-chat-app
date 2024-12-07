import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ChatApp from './components/chat/ChatApp';
import LandingPage from './components/landing/LandingPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/animations.css';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/chat" /> : <LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/chat" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/chat" /> : <Register />} />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatApp />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
