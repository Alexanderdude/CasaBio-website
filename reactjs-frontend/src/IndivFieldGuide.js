import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './IndivFieldGuide.css';

function IndivFieldGuide() {

    // Declare Variables
    const { speciesName } = useParams();
    const [notFound, setNotFound] = useState(false);
    const [fieldguides, setFieldguides] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {

        // Call the function with the speciesName
        getInatAPI(speciesName);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array means it will run once on mount

    // Function to fetch common names and pictures from iNaturalist
    const getInatAPI = async (searchTerm) => {
        try {
            // Make the GET request using Axios with parameters directly in the URL
            const response = await axios.get(`https://api.inaturalist.org/v1/taxa?q=${searchTerm}&page=1&per_page=1`);

            // Extract relevant data from the response
            const results = response.data.results;

            // Use Promise.all to wait for all asynchronous calls to getTaxonKey
            const updatedFieldguides = await Promise.all(results.map(async (result) => {
                const imageURL = result.default_photo ? result.default_photo.medium_url : null;
                const preferredCommonName = result.preferred_common_name;
                const imageAttribution = result.default_photo?.attribution;
                const gbifResults = await getTaxonKey(speciesName, result.iconic_taxon_name);
                const taxonKey = gbifResults.taxonKey;
                const name = result.name;
                const taxonomicRankArray = gbifResults.taxonomicRankArray;

                if (name !== speciesName) {
                    setNotFound(true);
                }

                return {
                    imageURL,
                    commonName: preferredCommonName,
                    attribution: imageAttribution,
                    taxonKey: taxonKey,
                    speciesName: speciesName,
                    taxonomicRankArray: taxonomicRankArray,
                };
            }));

            // Update the fieldguides state
            setFieldguides((prevFieldguides) => [...prevFieldguides, ...updatedFieldguides]);

        } catch (error) {
            // Handle any errors that may occur
            console.error('Error:', error);
        }


    };

    const getTaxonKey = async (speciesName, kingdom) => {
        // Define the dynamic URL of the GBIF API.
        const gbifUrl = `https://api.gbif.org/v1/species?name=${encodeURIComponent(speciesName)}`;

        try {
            // Use the URL to get the taxonKey of the specified species
            const response = await axios.get(gbifUrl);

            // Check if there are any results
            if (response.data.results.length > 0) {
                const results = response.data.results;

                let matchingData = null;

                // Loop through the results
                for (let index = 0; index < Math.min(results.length, 20); index++) {
                    const result = results[index];

                    // Check if the kingdom in the result matches the specified kingdom
                    if (result.kingdom === kingdom) {
                        // Save data and stop the loop if a match is found
                        matchingData = {
                            taxonKey: result.nubKey,
                            taxonomicRankArray: {
                                kingdom: result.kingdom,
                                phylum: result.phylum,
                                class: result.class,
                                order: result.order,
                                family: result.family,
                                genus: result.genus,
                                species: result.species,
                            },
                        };
                        break;
                    }
                }

                // If no match is found, use the data from index 0
                if (!matchingData && results[0]) {
                    matchingData = {
                        taxonKey: results[0].nubKey,
                        taxonomicRankArray: {
                            kingdom: results[0].kingdom,
                            phylum: results[0].phylum,
                            class: results[0].class,
                            order: results[0].order,
                            family: results[0].family,
                            genus: results[0].genus,
                            species: results[0].species,
                        },
                    };
                }

                // Return the matching data
                return matchingData;
            }
        } catch (error) {
            console.error('Error fetching GBIF data:', error);
            // You may want to handle this error by returning a default value or throwing an error
            return null;
        }
    };


    const handleFullscreen = (imageURL, attribution) => {
        // Set the selected image for the modal
        setSelectedImage({ imageURL, attribution });

        // Show the modal
        setShowModal(true);
    };

    const handleClose = () => {
        // Hide the modal
        setShowModal(false);
    };

    // Define a state variable to control the zoom level
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragStartY, setDragStartY] = useState(0);
    const [imagePositionX, setImagePositionX] = useState(0);
    const [imagePositionY, setImagePositionY] = useState(0);


    const handleZoomIn = () => {
        // Reset image position when zooming
        setImagePositionX(0);
        setImagePositionY(0);

        // Limit the zoom level to a reasonable maximum value (e.g., 4x)
        if (zoomLevel < 4) {
            setZoomLevel(zoomLevel + 0.5);
        }
    };

    const handleZoomOut = () => {
        // Reset image position when zooming
        setImagePositionX(0);
        setImagePositionY(0);

        // Limit the zoom level to a reasonable minimum value (e.g., 1x)
        if (zoomLevel > 1) {
            setZoomLevel(zoomLevel - 0.5);
        }
    };

    // Function to handle the mousedown event on the image
    const handleImageMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        setDragStartX(e.clientX);
        setDragStartY(e.clientY);
    };

    // Function to handle the mousemove event on the image
    const handleImageMouseMove = (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;

        // Update the image position based on mouse movement
        setImagePositionX(imagePositionX + deltaX);
        setImagePositionY(imagePositionY + deltaY);

        // Update the starting position for the next movement calculation
        setDragStartX(e.clientX);
        setDragStartY(e.clientY);
    };

    // Function to handle the mouseup event on the image
    const handleImageMouseUp = () => {
        setIsDragging(false);
    };

    // Define a CSS class for the modal content to set the boundaries
    const modalContentStyle = {
        maxWidth: '100%',
        maxHeight: '80vh',
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab',
        position: 'relative', // Required for positioning the child image
    };

    // Function to reset the image position to default
    const resetImagePosition = () => {
        // Reset the image position and zoom level to their defaults
        setImagePositionX(0);
        setImagePositionY(0);
        setZoomLevel(1);
    };

    // function to navigate to specific areas
    const navTaxanomic = (name) => {
        navigate('/fieldGuide/' + name);
        window.location.reload();
    };

    // Function to handle popstate event
    const handlePopState = () => {
        // The user clicked the back or forward button
        // You can perform actions or trigger a reload here
        window.location.reload();
    };

    // Use useEffect to add the popstate event listener
    useEffect(() => {
        window.addEventListener('popstate', handlePopState);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []); // Empty dependency array means it will run once on mount

    return (
        <div>
            {notFound ? (
                // If the observation is not found, navigate to the not-found page
                <Navigate to="/not-found" />
            ) : (
                <div className='fieldGuide-page'>

                    <h1>{fieldguides[0]?.speciesName}</h1>
                    <div className='image-and-text-container'>
                        <div className='image-area'>

                            {/* Image on the left */}
                            <div style={{ display: 'flex', alignItems: 'flex-start' }}>

                                {/* displays an image */}
                                <img
                                    src={fieldguides[0]?.imageURL}
                                    alt={fieldguides[0]?.commonName}
                                    style={{ width: '300px', height: '300px' }}
                                />

                                {/* adds the fullscreen tag to the image with a fullscreen button */}
                                <div className="image-tag" onClick={(e) => { e.stopPropagation(); handleFullscreen(fieldguides[0]?.imageURL, fieldguides[0]?.attribution) }}>
                                    Fullscreen
                                </div>
                            </div>
                        </div>

                        <div className='text-content'>
                            <h1>{fieldguides[0]?.commonName}</h1>
                            {fieldguides[0]?.taxonomicRankArray && (
                                <div>
                                    {Object.entries(fieldguides[0]?.taxonomicRankArray).map(([rank, value], index) => (
                                        <p key={index} className="taxonomic-rank" style={{ marginLeft: `${index * 20}px` }} onClick={() => navTaxanomic(value)}>
                                            {value !== null && value !== undefined ? <><strong>{rank}:</strong> {value}</> : null}                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    <br />

                    {/* defines the map Div */}
                    <div className="map-container">
                        {/* sets the mapContainer variables */}
                        <MapContainer center={[0, 0]} zoom={1} style={{ width: '600px', height: '400px' }}>

                            {/* adds the map itself as a layer from openstreetmaps */}
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />

                            {/* sets the heatmap layer using the taxonKey */}
                            <TileLayer
                                url={`https://api.gbif.org/v2/map/occurrence/density/{z}/{x}/{y}@1x.png?taxonKey=${fieldguides[0]?.taxonKey}&style=purpleHeat.point`}
                                attribution="GBIF"
                            />
                        </MapContainer>
                    </div>

                    <button onClick={() => { console.log(fieldguides) }}>ClickMe</button>
                </div>
            )
            }

            {/* Display Modal with multiple functions */}
            < Modal show={showModal} onHide={() => {
                handleClose();
                resetImagePosition(); // Reset image position when the modal is closed
            }} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Full View</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedImage && (
                        <div
                            style={{
                                ...modalContentStyle,
                                width: '100%',
                                height: '100%',
                                // Adds some styling to the image div
                            }}

                            // Adds dome functions to the mouse down and mouse move
                            onMouseDown={handleImageMouseDown}
                            onMouseMove={handleImageMouseMove}
                            onMouseUp={handleImageMouseUp}
                        >
                            {/* Adds the image itself to the image div container */}
                            <img
                                src={selectedImage.imageURL}
                                style={{
                                    width: `${zoomLevel * 100}%`,
                                    transform: `translate(${imagePositionX}px, ${imagePositionY}px)`,
                                }}
                                alt="Full View"
                                draggable="false"
                            />
                        </div>
                    )}
                    <p>{selectedImage.attribution}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        handleClose(); // Close the modal when the user clicks this button
                        resetImagePosition();
                    }}>
                        Close
                    </Button>
                    {/* adds a secondary close button to this modal */}
                    <div className="zoom-controls">
                        <button onClick={handleZoomIn}>Zoom In</button>
                        <button onClick={handleZoomOut}>Zoom Out</button>
                    </div>
                </Modal.Footer>
            </Modal>

        </div >

    );
}
export default IndivFieldGuide;