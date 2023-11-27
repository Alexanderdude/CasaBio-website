import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import axios from 'axios';
import './PublicProfile.css'; // Import your CSS file

function Profile() {
    // Define state variables
    const { name } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [observations, setObservations] = useState([]);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);

    function getData() {
        axios({
            method: 'GET',
            url: '/userprofile',
            params: { name: name },  // Assuming 'name' is a query parameter
        })
            .then((response) => {
                const res = response.data;
                setProfileData({
                    profile_name: res[0].Username,
                    about_me: res[0].About,
                    id: res[0]._id
                });
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
            });
    }

    // Fetch user profile data on component mount
    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name]);

    // Function to show a notification message
    const showNotificationWithMessage = (message, duration = 1000) => {
        setNotificationMessage(message);
        setShowNotification(true);

        // Automatically hide the notification after the specified duration
        setTimeout(() => {
            setShowNotification(false);
        }, duration);
    };

    // Function to handle "Copy URL" button click
    const handleCopyUrl = () => {
        const url = `http://localhost:3000/profile/${profileData.profile_name}`;

        navigator.clipboard.writeText(url)
            .then(() => {
                showNotificationWithMessage('Copied to clipboard');
            });
    };

    return (
        <div className="Profile">
            {profileData && (
                <div className='centered-text'>
                    <h1>Profile name: {profileData.profile_name}</h1>

                    <div className="about-section">
                        <p className="about-me">
                            About me: {profileData.about_me}
                        </p>
                    </div>

                    <div className={`notification${showNotification ? ' show' : ''}`}>
                        {notificationMessage}
                    </div>
                    <p className="edit-button" onClick={handleCopyUrl}>Share Profile</p>

                    <div className="Observations">
                        <Container>
                            {/* Uses Custom Bootstrap container to display images */}
                            <Row>
                                {/* Maps out the array of images to display them in this container */}
                                {observations.map((data, index) => (
                                    <Col md={4} key={index}>
                                        {/* Sets a max of 4 images for each row */}
                                        <div>
                                            <Image
                                                src={data.mainImage}
                                                style={{ width: '300px', height: '300px' }}
                                                thumbnail
                                            />
                                            {/* Displays each image to the correct size */}
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </Container>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;
