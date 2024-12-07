import React, { useState, useRef } from 'react';
import { FaMicrophone, FaStop, FaTrash, FaPaperPlane } from 'react-icons/fa';

const VoiceMessage = ({ onSend }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    setAudioBlob(null);
    chunksRef.current = [];
  };

  const sendVoiceMessage = () => {
    if (audioBlob) {
      onSend(audioBlob);
      setAudioBlob(null);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {!isRecording && !audioBlob && (
        <button
          onClick={startRecording}
          className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition-colors animate-pulse"
        >
          <FaMicrophone className="w-5 h-5" />
        </button>
      )}

      {isRecording && (
        <div className="flex items-center space-x-2">
          <div className="text-red-500 animate-pulse">Recording...</div>
          <button
            onClick={stopRecording}
            className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            <FaStop className="w-5 h-5" />
          </button>
          <button
            onClick={cancelRecording}
            className="p-2 rounded-full bg-gray-500 text-white hover:bg-gray-600 transition-colors"
          >
            <FaTrash className="w-5 h-5" />
          </button>
        </div>
      )}

      {audioBlob && !isRecording && (
        <div className="flex items-center space-x-2">
          <audio src={URL.createObjectURL(audioBlob)} controls className="h-8" />
          <button
            onClick={sendVoiceMessage}
            className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition-colors"
          >
            <FaPaperPlane className="w-5 h-5" />
          </button>
          <button
            onClick={cancelRecording}
            className="p-2 rounded-full bg-gray-500 text-white hover:bg-gray-600 transition-colors"
          >
            <FaTrash className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceMessage;
