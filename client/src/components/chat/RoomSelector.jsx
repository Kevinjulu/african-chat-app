import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';

// African-themed chat rooms with unique visual themes
const CHAT_ROOMS = [
  {
    id: 'serengeti',
    name: 'Serengeti Lounge',
    description: 'Connect with nature enthusiasts',
    icon: '🦁',
    region: 'East Africa',
    theme: {
      gradient: 'from-amber-500 to-yellow-600',
      hoverGradient: 'from-amber-600 to-yellow-700',
      bgPattern: 'bg-safari-pattern',
      accentColor: 'text-amber-900',
      description: 'Inspired by the golden savannas and endless plains'
    }
  },
  {
    id: 'kilimanjaro',
    name: 'Kilimanjaro Summit',
    description: 'Reach new heights together',
    icon: '🗻',
    region: 'Tanzania',
    theme: {
      gradient: 'from-blue-400 to-indigo-600',
      hoverGradient: 'from-blue-500 to-indigo-700',
      bgPattern: 'bg-mountain-pattern',
      accentColor: 'text-blue-900',
      description: 'Reflecting the majestic snow-capped peaks'
    }
  },
  {
    id: 'sahara',
    name: 'Sahara Oasis',
    description: 'Desert wisdom and stories',
    icon: '🐪',
    region: 'North Africa',
    theme: {
      gradient: 'from-orange-300 to-amber-400',
      hoverGradient: 'from-orange-400 to-amber-500',
      bgPattern: 'bg-desert-pattern',
      accentColor: 'text-orange-900',
      description: 'Inspired by golden dunes and desert sunsets'
    }
  },
  {
    id: 'zimbabwe',
    name: 'Great Zimbabwe',
    description: 'Historical discussions',
    icon: '🏛️',
    region: 'Southern Africa',
    theme: {
      gradient: 'from-stone-500 to-stone-700',
      hoverGradient: 'from-stone-600 to-stone-800',
      bgPattern: 'bg-ruins-pattern',
      accentColor: 'text-stone-900',
      description: 'Echoing ancient stone architecture'
    }
  },
  {
    id: 'victoria',
    name: 'Victoria Falls',
    description: 'Natural wonders & adventures',
    icon: '💦',
    region: 'Zambia/Zimbabwe',
    theme: {
      gradient: 'from-cyan-400 to-blue-500',
      hoverGradient: 'from-cyan-500 to-blue-600',
      bgPattern: 'bg-waterfall-pattern',
      accentColor: 'text-cyan-900',
      description: 'Inspired by the mighty falls and rainbows'
    }
  },
  {
    id: 'zanzibar',
    name: 'Zanzibar Beach',
    description: 'Coastal culture & traditions',
    icon: '🏖️',
    region: 'Tanzania',
    theme: {
      gradient: 'from-teal-400 to-cyan-500',
      hoverGradient: 'from-teal-500 to-cyan-600',
      bgPattern: 'bg-beach-pattern',
      accentColor: 'text-teal-900',
      description: 'Reflecting turquoise waters and white sands'
    }
  },
  {
    id: 'timbuktu',
    name: 'Timbuktu Archives',
    description: 'Knowledge & literature',
    icon: '📚',
    region: 'Mali',
    theme: {
      gradient: 'from-amber-700 to-brown-800',
      hoverGradient: 'from-amber-800 to-brown-900',
      bgPattern: 'bg-library-pattern',
      accentColor: 'text-amber-900',
      description: 'Inspired by ancient manuscripts and wisdom'
    }
  },
  {
    id: 'masai',
    name: 'Masai Mara',
    description: 'Cultural exchange & heritage',
    icon: '🦓',
    region: 'Kenya',
    theme: {
      gradient: 'from-red-500 to-orange-600',
      hoverGradient: 'from-red-600 to-orange-700',
      bgPattern: 'bg-tribal-pattern',
      accentColor: 'text-red-900',
      description: 'Reflecting vibrant Masai culture and wildlife'
    }
  }
];

const RoomSelector = ({ socket, onRoomSelect, selectedRoom }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeUsers, setActiveUsers] = useState({});
  const [hoveredRoom, setHoveredRoom] = useState(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('room_users', (data) => {
      setActiveUsers(prev => ({
        ...prev,
        [data.room]: data.users
      }));
    });

    return () => {
      socket.off('room_users');
    };
  }, [socket]);

  const filteredRooms = CHAT_ROOMS.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/50 border border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Rooms List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-3 p-4">
          {filteredRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => onRoomSelect(room)}
              onMouseEnter={() => setHoveredRoom(room.id)}
              onMouseLeave={() => setHoveredRoom(null)}
              className={`w-full text-left p-4 rounded-xl transition-all transform hover:scale-[1.02] ${
                selectedRoom?.id === room.id
                  ? `bg-gradient-to-r ${room.theme.gradient} text-white shadow-lg`
                  : `bg-white/50 hover:bg-gradient-to-r hover:${room.theme.hoverGradient} hover:text-white`
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{room.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold">{room.name}</h3>
                  <p className={`text-sm ${
                    selectedRoom?.id === room.id ? 'text-white/80' : 'text-gray-600'
                  }`}>
                    {room.description}
                  </p>
                  <div className={`text-xs mt-1 ${
                    selectedRoom?.id === room.id ? 'text-white/60' : 'text-gray-500'
                  }`}>
                    {room.region} • {activeUsers[room.id]?.length || 0} online
                  </div>
                </div>
              </div>
              {hoveredRoom === room.id && (
                <div className="mt-2 text-xs italic text-white/80 bg-black/20 p-2 rounded-lg">
                  {room.theme.description}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomSelector;
