import React from 'react';

const MyTripsCard = ({ initDate, endDate, travelPoints }) => {
  const startDate = new Date(initDate).toLocaleDateString();
  const endDateFormatted = new Date(endDate).toLocaleDateString();

  return (
    <div className="bg-primary-blue shadow-md mb-2 p-4 border rounded min-w-[300px] h-[300px] overflow-auto">
      <h3 className="font-bold text-lg text-white">Trip Dates</h3>
      <p>
        From: {startDate} <br />
        To: {endDateFormatted}
      </p>
      <h4 className="mt-2 font-semibold text-white">Travel Points:</h4>
      <ul>
        {travelPoints.map((point, idx) => (
          <li key={idx} className="ml-4 list-disc">{point}</li>
        ))}
      </ul>
    </div>
  );
};

export default MyTripsCard;
