import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Navigate } from 'react-router-dom';
import './ObservationView.css'; // Import your custom CSS
import QuarterSquareGrid from './QuarterSquareGrid';
import StarRating from './StarRating';

function ObservationView() {
  const { observationID } = useParams();
  const [observationData, setObservationData] = useState([]);
  const [notFound, setNotFound] = useState(false);

  // Use useEffect to fetch data when the component mounts or observationID changes
  useEffect(() => {
    // Make the API request using Axios
    axios({
      method: 'GET',
      url: '/observation/search',
      params: {
        primaryType: 'mainImageID',
        primaryTerm: observationID,
        filterType: '',
        filterTerm: '',
        page: 1,
        per_page: 2,
      },
    })
      .then(async (response) => {
        setObservationData(response.data);

        // Check if the response data is an empty array
        if (Array.isArray(response.data) && response.data.length === 0) {
          setNotFound(true);
        }
      })
      .catch((error) => {
        // Handle any errors
        console.error('API request error:', error);
      });
  }, [observationID]);

  return (
    <div>
      {notFound ? (
        // If the observation is not found, navigate to the not-found page
        <Navigate to="/not-found" />
      ) : (
        <div>
          <h1>{observationData[0]?.scientific_name || ''}</h1>
          {observationData[0]?.kingdom !== null && observationData[0]?.kingdom !== '' && observationData[0]?.kingdom !== undefined && (
            <p>Kingdom: {observationData[0].kingdom}</p>
          )}
          {observationData[0]?.taxon !== null && observationData[0]?.taxon !== '' && observationData[0]?.taxon !== undefined && (
            <p>Taxon rank: {observationData[0].taxon}</p>
          )}
          <p>Date of Event: {observationData[0]?.imageDate || ''}</p>
          <p>Username: {observationData[0]?.username || ''}</p>
          <p>Collection: {observationData[0]?.collections || ''}</p>
          <p>Collector: {observationData[0]?.collectors || ''}</p>
          <p>Photographer: {observationData[0]?.photographers || ''}</p>
          <p>Country: {observationData[0]?.country || ''}</p>
          <p>City/Town: {observationData[0]?.city || ''}</p>
          
          {observationData && (
            <StarRating
              id={observationData[0]?._id}
              ratings={observationData[0]?.ratings}
            />
          )}
          <div className="bordered-box">
            {observationData.length > 0 && (
              // Render the QuarterSquareGrid component with specified props
              <QuarterSquareGrid
                latitude={observationData[0]?.latitude || 0}
                longitude={observationData[0]?.longitude || 0}
                className="bordered-map centered-map"
                mapWidth={'50vw'} // Set the width of the map
                mapHeight={'50vh'} // Set the height of the map
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ObservationView;
