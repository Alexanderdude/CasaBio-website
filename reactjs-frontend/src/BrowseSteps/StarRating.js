import React, { useState, useEffect } from 'react';
import './StarRating.css'; // Import your CSS file
import useToken from '../Other/useToken';
import axios from "axios"

const StarRating = ({ id, ratings }) => {
    // set the variables
    const [stars, setStars] = useState(0);
    const [currentRating, setCurrentRating] = useState(0)
    const { token } = useToken();
    const [username, setUsername] = useState('');

    // useEffect to retreive the username
    useEffect(() => {
        // get username from /profile
        const getUsername = async () => {
            try {
                // Use axios to send a GET request at /profile
                const response = await axios.get('/profile', {
                    headers: {
                        Authorization: 'Bearer ' + token // Use the destructured token here
                    }
                });

                const res = response.data;

                // Set the username based on the response (profile name)
                setUsername(res[0].Username);
            } catch (error) {
                if (error.response) {
                    console.log(error.response);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
            }
        };

        // Call getUsername when the component mounts (app starts)
        getUsername();
    }, [token]);

    // function to handle star change
    const handleRatingChange = (value) => {
        setStars(value);
    };

    // useEffect to retrieve the ratings for unique observation
    useEffect(() => {

        if (ratings && Object.keys(ratings).length > 0) {
            // Calculate the average rating
            const ratingValues = Object.values(ratings);
            const averageRating = ratingValues.reduce((sum, rating) => sum + rating, 0) / ratingValues.length;

            // Round the average rating to two decimal points
            const roundedRating = parseFloat(averageRating.toFixed(2));

            // Set the rounded rating as the currentRating
            setCurrentRating(roundedRating);
        } else {
            // Handle the case where there are no ratings
            setCurrentRating(0);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ratings]);

    // useEffect to set new Rating if username is has rated before
    useEffect(() => {
        if (ratings && Object.keys(ratings).length > 0) {
            // Check if the username is in the ratings
            if (ratings.hasOwnProperty(username)) {
                // Set currentRating to the value of ratings[username]
                setStars(ratings[username]);
            }
        }
    }, [ratings, username]);

    // function to save new rating 
    const handleSaveRating = async () => {
        try {
            // Check if the username is already present in the ratings array
            if (ratings && ratings.hasOwnProperty(username)) {
                // Update the existing value for the username
                const updatedRatings = {
                    ...ratings,
                    [username]: stars
                };

                // Use Axios to send a POST request to save the updated ratings
                const response = await axios.post('/ratings', {
                    id: id,
                    ratings: updatedRatings
                });

                // Reload the current page
                window.location.reload();

            } else {
                // If username is not present, add a new entry
                const newRatings = {
                    ...ratings,
                    [username]: stars
                };

                // Use Axios to send a POST request to save the new ratings
                const response = await axios.post('/ratings', {
                    id: id,
                    ratings: newRatings
                });

                // Reload the current page
                window.location.reload();

            }
        } catch (error) {
            console.error('Error saving rating:', error);
        }
    };

    return (
        <div>
            {/* adds a reliablility rating to this component */}
            <p>Reliablilty Rating: {currentRating}</p>
            {token ? (
                <div>
                    {/* adds a star rating system */}
                    <div className="rating">
                        {[...Array(5)].map((_, index) => (
                            
                            <label key={index} className={index + 1 <= stars ? 'selected' : ''}>

                                <input
                                    type="radio"
                                    name="rating"
                                    value={5 - index}
                                    checked={stars === index + 1}
                                    onChange={() => handleRatingChange(index + 1)}
                                />
                                &#9733;
                            </label>
                        ))}
                    </div>
                    {/* adds a button to save rating */}
                    <button onClick={handleSaveRating}>Save new Rating</button>
                </div>
            ) : null}
        </div>
    );
};

export default StarRating;
