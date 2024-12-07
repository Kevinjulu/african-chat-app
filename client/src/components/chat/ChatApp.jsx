import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import io from 'socket.io-client';
import RoomSelector from './RoomSelector';
import ChatRoom from './ChatRoom';
import { FiLogOut, FiUser, FiSettings } from 'react-icons/fi';

const ChatApp = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    // Join default room if any
    if (selectedRoom) {
      newSocket.emit('join_room', selectedRoom.id);
    }

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket && selectedRoom) {
      // Leave previous room if any
      socket.emit('leave_room', selectedRoom.id);
      // Join new room
      socket.emit('join_room', selectedRoom.id);
    }
  }, [selectedRoom, socket]);

  const handleLogout = () => {
    if (socket) {
      if (selectedRoom) {
        socket.emit('leave_room', selectedRoom.id);
      }
      socket.disconnect();
    }
    logout();
    navigate('/login');
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container mx-auto px-4 py-6 h-screen flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-t-2xl shadow-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <FiUser className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-white text-xl font-bold">{user?.username}</h1>
                <p className="text-white/80 text-sm">Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                title="Settings"
              >
                <FiSettings className="text-white text-xl" />
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                title="Logout"
              >
                <FiLogOut className="text-white text-xl" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex bg-white/80 backdrop-blur-sm rounded-b-2xl shadow-lg overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 border-r border-orange-200">
            <RoomSelector 
              socket={socket} 
              onRoomSelect={handleRoomSelect}
              selectedRoom={selectedRoom}
            />
          </div>

          {/* Chat Area */}
          <div className="flex-1">
            {selectedRoom ? (
              <ChatRoom 
                socket={socket} 
                room={selectedRoom}
                username={user?.username}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-orange-50 to-amber-50">
                <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
                  <span className="text-4xl">🌍</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to AfriChat</h2>
                <p className="text-gray-600 max-w-md">
                  Select a chat room from the sidebar to start connecting with people across Africa
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
