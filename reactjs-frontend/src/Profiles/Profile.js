import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import './Profile.css';

function Profile(props) {
    // Define state variables
    const [profileData, setProfileData] = useState(null);
    const [observations, setObservations] = useState([]);
    const [editAbout, setEditAbout] = useState(false);
    const [editedAboutText, setEditedAboutText] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);

    // Function to fetch user profile data
    function getData() {
        axios({
            method: 'GET',
            url: '/profile',
            headers: {
                Authorization: 'Bearer ' + props.token,
            },
        })
            .then((response) => {
                const res = response.data;
                if (res.access_token) {
                    props.setToken(res.access_token);
                }
                setProfileData({
                    profile_name: res[0].Username,
                    about_me: res[0].About,
                    id: res[0]._id
                });
                setEditedAboutText(res[0].About); // Initialize the edited text with the current "About me" text.
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
            });
    }

    // Function to save user profile data
    function saveData(username, field, text) {
        // Define the data to be sent in the request body
        const data = {
            username: username,
            field: field,
            text: text,
        };

        // Send a POST request with the data
        axios({
            method: 'POST',
            url: '/editProfile',
            data: data,
        })
            .then((response) => {
                // Handle the response if needed
                console.log('Request successful', response);
            })
            .catch((error) => {
                // Handle errors if the request fails
                console.error('Error:', error);
            });
    }

    // Fetch user profile data on component mount
    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Function to handle "Edit About" button click
    const handleEditAboutClick = () => {
        setEditAbout(true);
    };

    // Function to handle "Save About" button click
    const handleSaveAboutClick = () => {
        console.log(editedAboutText);
        setEditAbout(false);
        saveData(profileData.id, "About", editedAboutText);
        setProfileData((prevProfileData) => ({
            ...prevProfileData,
            about_me: editedAboutText,
        }));
    };

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
                    {editAbout ? (
                        <div className="about-section">
                            <textarea
                                value={editedAboutText}
                                onChange={(e) => setEditedAboutText(e.target.value)}
                                rows="10"
                                cols="50"
                            />
                            <span className="edit-button" onClick={handleSaveAboutClick}>
                                Save
                            </span>
                        </div>
                    ) : (
                        <div className="about-section">
                            <p className="about-me">
                                About me: {profileData.about_me}
                            </p>
                            <span className="edit-button" onClick={handleEditAboutClick}>
                                Edit
                            </span>
                        </div>
                    )}
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
