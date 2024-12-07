import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiLogOut } from 'react-icons/fi';
import { BsEmojiSmile } from 'react-icons/bs';
import EmojiPicker from 'emoji-picker-react';
import { format } from 'date-fns';

const ChatRoom = ({ room, username, socket, onLeave }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
      scrollToBottom();
    });

    socket.on('user_joined', (data) => {
      setMessages((prev) => [...prev, { ...data, type: 'system' }]);
    });

    socket.on('user_left', (data) => {
      setMessages((prev) => [...prev, { ...data, type: 'system' }]);
    });

    socket.on('room_users', (roomUsers) => {
      setUsers(roomUsers);
    });

    socket.on('user_typing', ({ username: typingUser, isTyping }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        if (isTyping) {
          newSet.add(typingUser);
        } else {
          newSet.delete(typingUser);
        }
        return newSet;
      });
    });

    return () => {
      socket.off('receive_message');
      socket.off('user_joined');
      socket.off('user_left');
      socket.off('room_users');
      socket.off('user_typing');
    };
  }, [socket]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('send_message', {
        room: room.id,
        message: message.trim(),
      });
      setMessage('');
      setShowEmoji(false);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    socket.emit('typing', { room: room.id, username, isTyping: true });

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', { room: room.id, username, isTyping: false });
    }, 1000);
  };

  const onEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto bg-white shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-orange-600 text-white">
        <div>
          <h2 className="text-xl font-bold">{room.name}</h2>
          <p className="text-sm opacity-75">{room.description}</p>
        </div>
        <button
          onClick={onLeave}
          className="flex items-center gap-2 px-4 py-2 bg-orange-700 rounded-lg hover:bg-orange-800 transition-colors"
        >
          <FiLogOut /> Leave Room
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 ${
                msg.type === 'system'
                  ? 'text-center text-gray-500 text-sm'
                  : msg.username === username
                  ? 'flex flex-col items-end'
                  : 'flex flex-col items-start'
              }`}
            >
              {msg.type !== 'system' && (
                <div
                  className={`max-w-[70%] break-words rounded-lg p-3 ${
                    msg.username === username
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  <p className="font-semibold text-sm">
                    {msg.username === username ? 'You' : msg.username}
                  </p>
                  <p>{msg.message}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {format(new Date(msg.timestamp), 'HH:mm')}
                  </p>
                </div>
              )}
              {msg.type === 'system' && <p>{msg.message}</p>}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Users List */}
        <div className="w-64 bg-gray-50 p-4 border-l">
          <h3 className="font-bold mb-4">Online Users ({users.length})</h3>
          <ul>
            {users.map((user) => (
              <li
                key={user}
                className="flex items-center gap-2 mb-2"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {user} {user === username && '(You)'}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Typing Indicator */}
      {typingUsers.size > 0 && (
        <div className="px-4 py-2 text-sm text-gray-500">
          {Array.from(typingUsers)
            .filter((user) => user !== username)
            .join(', ')}{' '}
          {typingUsers.size === 1 ? 'is' : 'are'} typing...
        </div>
      )}

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t relative">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowEmoji(!showEmoji)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <BsEmojiSmile size={24} />
          </button>
          <input
            type="text"
            value={message}
            onChange={handleTyping}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            <FiSend size={24} />
          </button>
        </div>
        
        {showEmoji && (
          <div className="absolute bottom-full right-0 mb-2">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatRoom;
