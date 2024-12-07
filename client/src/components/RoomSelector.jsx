import React from 'react';

const RoomSelector = ({ rooms, onSelectRoom, username }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-800 mb-2">Welcome to African Chat</h1>
          <p className="text-lg text-orange-700">Hello, {username}! Choose a room to start chatting</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => onSelectRoom(room)}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              <div className="text-2xl mb-2">
                {room.id === 'serengeti' && '🦁'}
                {room.id === 'kilimanjaro' && '🏔️'}
                {room.id === 'sahara' && '🌅'}
                {room.id === 'zimbabwe' && '🏛️'}
                {room.id === 'victoria' && '💦'}
                {room.id === 'zanzibar' && '🏖️'}
                {room.id === 'timbuktu' && '📚'}
                {room.id === 'masai' && '🌍'}
              </div>
              <h3 className="text-xl font-bold text-orange-800 mb-2">{room.name}</h3>
              <p className="text-gray-600">{room.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomSelector;
