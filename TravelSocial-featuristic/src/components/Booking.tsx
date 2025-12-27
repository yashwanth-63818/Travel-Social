import React from 'react';

// Booking component is disabled - all booking functionality has been moved to Search page
// If you need booking functionality, navigate to /search instead
const Booking: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white py-6 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl text-yellow-400 mb-4">Booking Disabled</h1>
        <p className="text-gray-400">
          All booking functionality has been moved to the Search page.
          <br />
          Please navigate to /search instead.
        </p>
      </div>
    </div>
  );
};

export default Booking;