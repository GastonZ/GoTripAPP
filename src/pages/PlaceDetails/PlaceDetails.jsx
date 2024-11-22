import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PlaceDetails = () => {
  const { name } = useParams();
  const [placeDetails, setPlaceDetails] = useState(null);

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json`, {
          params: {
            input: name,
            inputtype: 'textquery',
            fields: 'formatted_address,name,rating,opening_hours,geometry',
            key: 'AIzaSyAvBg2_LvfISOBrPQI5gIVNkF_65ypu-8k',
          },
        });
        
        if (response.data && response.data.candidates && response.data.candidates.length > 0) {
          setPlaceDetails(response.data.candidates[0]);
        } else {
          console.error('No place details found.');
        }
      } catch (error) {
        console.error('Error fetching place details:', error);
      }
    };

    fetchPlaceDetails();
  }, [name]);

  if (!placeDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto p-4 container">
      <h1 className="font-bold text-2xl">{placeDetails.name}</h1>
      <p>Address: {placeDetails.formatted_address}</p>
      <p>Rating: {placeDetails.rating}</p>
      {placeDetails.opening_hours && placeDetails.opening_hours.weekday_text && (
        <div>
          <h3>Opening Hours:</h3>
          <ul>
            {placeDetails.opening_hours.weekday_text.map((day, index) => (
              <li key={index}>{day}</li>
            ))}
          </ul>
        </div>
      )}
      <iframe
        width="600"
        height="450"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAvBg2_LvfISOBrPQI5gIVNkF_65ypu-8k&q=${placeDetails.geometry.location.lat},${placeDetails.geometry.location.lng}`}
      ></iframe>
    </div>
  );
};

export default PlaceDetails;
