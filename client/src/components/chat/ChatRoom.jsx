import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiPaperclip, FiImage, FiSmile, FiMic } from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import FileSharing from './FileSharing';
import VoiceMessage from './VoiceMessage';

const ChatRoom = ({ socket, room, username }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    const handleMessageHistory = (history) => {
      setMessages(history);
    };

    const handleTypingUsers = (users) => {
      setTypingUsers(users.filter(user => user !== username));
    };

    socket.on('message', handleMessage);
    socket.on('message_history', handleMessageHistory);
    socket.on('typing_users', handleTypingUsers);

    return () => {
      socket.off('message', handleMessage);
      socket.off('message_history', handleMessageHistory);
      socket.off('typing_users', handleTypingUsers);
    };
  }, [socket, username]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!socket) return;

    try {
      if (message.trim() || fileInputRef.current?.files?.length) {
        let mediaUrl = '';
        if (fileInputRef.current?.files?.length) {
          const file = fileInputRef.current.files[0];
          if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
          }
          setUploading(true);
          mediaUrl = await uploadFile(file);
        }

        const messageData = {
          room: room.id,
          username,
          message: message.trim(),
          timestamp: new Date(),
          type: mediaUrl ? 'media' : 'text',
          mediaUrl
        };

        socket.emit('message', messageData);
        setMessage('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        setShowEmojiPicker(false);
        setShowFileUpload(false);
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setUploading(false);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (!socket) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', { room: room.id, username, isTyping: true });
    }

    // Debounce typing status
    const lastTypingTime = new Date().getTime();
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= 3000 && isTyping) {
        socket.emit('typing', { room: room.id, username, isTyping: false });
        setIsTyping(false);
      }
    }, 3000);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      return data.url;
    } catch (error) {
      throw new Error('Failed to upload file');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className={`flex-none p-4 bg-gradient-to-r ${room.theme.gradient} shadow-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{room.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-white">{room.name}</h2>
              <p className="text-sm text-white/80">{room.description}</p>
            </div>
          </div>
          <div className="text-white/60 text-sm">
            {typingUsers.length > 0 && (
              <div className="animate-pulse">
                {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-orange-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.username === username ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] break-words rounded-2xl p-3 shadow-sm ${
                msg.username === username
                  ? `bg-gradient-to-r ${room.theme.gradient} text-white`
                  : 'bg-white text-gray-800'
              }`}
            >
              {msg.username !== username && (
                <div className={`text-xs mb-1 ${
                  msg.username === username ? 'text-white/80' : 'text-gray-500'
                }`}>
                  {msg.username}
                </div>
              )}
              {msg.type === 'media' ? (
                msg.mediaUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                  <img 
                    src={msg.mediaUrl} 
                    alt="Shared media" 
                    className="max-w-full rounded-lg"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-blue-500 hover:text-blue-600">
                    <FiPaperclip />
                    <a href={msg.mediaUrl} target="_blank" rel="noopener noreferrer">
                      Download File
                    </a>
                  </div>
                )
              ) : (
                <p className="whitespace-pre-wrap">{msg.message}</p>
              )}
              <div className={`text-xs mt-1 ${
                msg.username === username ? 'text-white/60' : 'text-gray-400'
              }`}>
                {format(new Date(msg.timestamp), 'HH:mm')}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex-none p-4 bg-white border-t border-orange-100">
        <form onSubmit={handleSendMessage} className="space-y-2">
          {showEmojiPicker && (
            <div className="absolute bottom-20 right-4">
              <EmojiPicker
                onEmojiClick={(emojiObject) => {
                  setMessage((prev) => prev + emojiObject.emoji);
                }}
                disableSearchBar
                disableSkinTonePicker
              />
            </div>
          )}
          
          {showFileUpload && (
            <FileSharing onSend={(file) => {
              if (fileInputRef.current) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInputRef.current.files = dataTransfer.files;
                handleSendMessage({ preventDefault: () => {} });
              }
            }} />
          )}

          {showVoiceRecorder && (
            <VoiceMessage onSend={async (audioBlob) => {
              try {
                setUploading(true);
                const formData = new FormData();
                formData.append('file', audioBlob, 'voice-message.webm');
                const mediaUrl = await uploadFile(audioBlob);
                
                const messageData = {
                  room: room.id,
                  username,
                  message: '🎤 Voice Message',
                  timestamp: new Date(),
                  type: 'media',
                  mediaUrl
                };

                socket.emit('message', messageData);
                setShowVoiceRecorder(false);
              } catch (error) {
                toast.error('Failed to send voice message');
              } finally {
                setUploading(false);
              }
            }} />
          )}

          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={() => handleSendMessage({ preventDefault: () => {} })}
            />
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={handleTyping}
                placeholder="Type your message..."
                className="w-full px-4 py-2 rounded-full bg-orange-100 text-gray-800 focus:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-gray-500 hover:text-orange-500 transition-colors"
            >
              <FiSmile className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={() => setShowFileUpload(!showFileUpload)}
              className="p-2 text-gray-500 hover:text-orange-500 transition-colors"
            >
              <FiPaperclip className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}
              className="p-2 text-gray-500 hover:text-orange-500 transition-colors"
            >
              <FiMic className="w-6 h-6" />
            </button>

            <button
              type="submit"
              disabled={uploading}
              className={`p-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition-colors ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiSend className="w-6 h-6" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
