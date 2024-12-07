import React, { useState } from 'react';
import { FaSmile, FaHeart, FaThumbsUp, FaRegLaughBeam, FaStar } from 'react-icons/fa';

const REACTIONS = [
  { emoji: '👍', icon: FaThumbsUp, label: 'Like' },
  { emoji: '❤️', icon: FaHeart, label: 'Love' },
  { emoji: '😂', icon: FaRegLaughBeam, label: 'Haha' },
  { emoji: '⭐', icon: FaStar, label: 'Star' },
  { emoji: '🙏', label: 'Thank you' },
  { emoji: '🎉', label: 'Celebrate' },
  { emoji: '💪', label: 'Strong' },
  { emoji: '🌟', label: 'Brilliant' },
];

const AFRICAN_REACTIONS = [
  { emoji: '🌍', label: 'Africa' },
  { emoji: '🦁', label: 'Lion' },
  { emoji: '🐘', label: 'Elephant' },
  { emoji: '🌺', label: 'Flower' },
  { emoji: '🌴', label: 'Palm' },
  { emoji: '☀️', label: 'Sun' },
  { emoji: '🥁', label: 'Drum' },
  { emoji: '💃', label: 'Dance' },
];

const MessageReactions = ({ onReact, existingReactions = {} }) => {
  const [showReactions, setShowReactions] = useState(false);

  const handleReaction = (reaction) => {
    onReact(reaction);
    setShowReactions(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowReactions(!showReactions)}
        className="p-1 hover:bg-orange-100 rounded-full transition-colors"
        title="Add reaction"
      >
        <FaSmile className="w-5 h-5 text-orange-500" />
      </button>

      {showReactions && (
        <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-lg border border-orange-200 p-3 w-72 animate-fadeInUp z-50">
          <div className="space-y-3">
            {/* Standard Reactions */}
            <div>
              <div className="text-xs font-medium text-gray-500 mb-2">Quick Reactions</div>
              <div className="grid grid-cols-4 gap-2">
                {REACTIONS.map((reaction) => (
                  <button
                    key={reaction.emoji}
                    onClick={() => handleReaction(reaction)}
                    className="p-2 hover:bg-orange-50 rounded-lg transition-colors flex flex-col items-center"
                  >
                    <span className="text-xl mb-1">{reaction.emoji}</span>
                    <span className="text-xs text-gray-600">{reaction.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* African-themed Reactions */}
            <div>
              <div className="text-xs font-medium text-gray-500 mb-2">African Reactions</div>
              <div className="grid grid-cols-4 gap-2">
                {AFRICAN_REACTIONS.map((reaction) => (
                  <button
                    key={reaction.emoji}
                    onClick={() => handleReaction(reaction)}
                    className="p-2 hover:bg-orange-50 rounded-lg transition-colors flex flex-col items-center"
                  >
                    <span className="text-xl mb-1">{reaction.emoji}</span>
                    <span className="text-xs text-gray-600">{reaction.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Display existing reactions */}
      {Object.entries(existingReactions).length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {Object.entries(existingReactions).map(([reaction, count]) => (
            <div
              key={reaction}
              className="flex items-center space-x-1 bg-orange-50 px-2 py-1 rounded-full text-sm"
            >
              <span>{reaction}</span>
              <span className="text-orange-600 font-medium">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageReactions;
