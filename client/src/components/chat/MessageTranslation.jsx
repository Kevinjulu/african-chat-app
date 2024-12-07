import React, { useState } from 'react';
import { FaLanguage, FaSpinner } from 'react-icons/fa';

const AFRICAN_LANGUAGES = {
  sw: 'Swahili',
  ha: 'Hausa',
  yo: 'Yoruba',
  ig: 'Igbo',
  am: 'Amharic',
  zu: 'Zulu',
  xh: 'Xhosa',
  af: 'Afrikaans'
};

const MessageTranslation = ({ message, onTranslate }) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);

  const handleTranslate = async (targetLang) => {
    setIsTranslating(true);
    setShowLanguages(false);
    try {
      // Here you would integrate with a translation API
      // For example: Google Cloud Translation API or Microsoft Azure Translator
      const translatedText = await onTranslate(message, targetLang);
      setIsTranslating(false);
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      setIsTranslating(false);
    }
  };

  return (
    <div className="relative">
      {isTranslating ? (
        <div className="flex items-center space-x-2 text-orange-500">
          <FaSpinner className="animate-spin" />
          <span className="text-sm">Translating...</span>
        </div>
      ) : (
        <button
          onClick={() => setShowLanguages(!showLanguages)}
          className="p-1 hover:bg-orange-100 rounded-full transition-colors"
          title="Translate message"
        >
          <FaLanguage className="w-5 h-5 text-orange-500" />
        </button>
      )}

      {showLanguages && (
        <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-orange-200 p-2 w-48 animate-fadeInUp">
          <div className="text-sm font-medium text-gray-700 mb-2">Translate to:</div>
          <div className="space-y-1">
            {Object.entries(AFRICAN_LANGUAGES).map(([code, name]) => (
              <button
                key={code}
                onClick={() => handleTranslate(code)}
                className="w-full text-left px-3 py-1.5 text-sm hover:bg-orange-50 rounded transition-colors flex items-center justify-between group"
              >
                <span>{name}</span>
                <span className="text-xs text-gray-400 group-hover:text-orange-500">
                  {code.toUpperCase()}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageTranslation;
