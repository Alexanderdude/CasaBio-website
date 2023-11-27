import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Fieldguide.css';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function Fieldguide() {

    // Declare variables
    const [fieldguides, setFieldguides] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [searchTerm, setSearchTerm] = useState('Hermannia');
    const [locale, setLocale] = useState('');
    const [page, setPage] = useState(1);
    const [showLoadMore, setShowLoadMore] = useState(false);
    const [center, setCenter] = useState([-33.9249, 18.4241])
    const navigate = useNavigate();

    // Function to get place ID based on locality
    const getPlaceID = async (locality) => {
        try {
            // Use Axios to access the iNat API and return a placeID for the specified locality.
            const response = await axios.get(`https://api.inaturalist.org/v1/places/autocomplete?q=${encodeURIComponent(locality)}`);
            const places = response.data.results;

            // makes sure that places variable has data to be used
            if (places.length > 0) {
                return places[0].id;
            }

            return null; // Return null if no places are found
        } catch (error) {
            console.error('Error fetching place ID:', error);
            return null;
        }
    };

    // Function to fetch common names and pictures from iNaturalist
    const getInatAPI = async (searchTerm) => {
        if (locale.length === 0) {
            try {
                // Make the GET request using Axios with parameters directly in the URL
                const response = await axios.get(`https://api.inaturalist.org/v1/taxa?q=${searchTerm}&page=${page}&per_page=20`);

                // Extract relevant data from the response
                const results = response.data.results;

                if (results.length === 20) {
                    setShowLoadMore(true);
                }

                // Use Promise.all to wait for all asynchronous calls to getTaxonKey
                const updatedFieldguides = await Promise.all(results.map(async (result) => {
                    const imageURL = result.default_photo ? result.default_photo.medium_url : null;
                    const preferredCommonName = result.preferred_common_name;
                    const imageAttribution = result.default_photo?.attribution;
                    const speciesName = result.name;
                    const taxonKey = await getTaxonKey(speciesName);

                    return {
                        imageURL,
                        commonName: preferredCommonName,
                        attribution: imageAttribution,
                        taxonKey: taxonKey,
                        speciesName: speciesName,
                    };
                }));

                // Update the fieldguides state
                setFieldguides((prevFieldguides) => [...prevFieldguides, ...updatedFieldguides]);

            } catch (error) {
                // Handle any errors that may occur
                console.error('Error:', error);
            }
        } else {

            try {

                // Get place ID based on locality
                const placeID = await getPlaceID(locale);

                let apiUrl;

                if (searchTerm) {
                    apiUrl = `https://api.inaturalist.org/v1/observations?taxon_name=${encodeURIComponent(searchTerm)}&order=desc&order_by=created_at&page=${page}`;
                } else {
                    apiUrl = `https://api.inaturalist.org/v1/observations?place_id=${placeID}&order=desc&order_by=created_at&page=${page}`;
                }

                const response = await axios.get(apiUrl);
                // Extract relevant data from the response
                const results = response.data.results;

                if (results.length === 30) {
                    setShowLoadMore(true);
                }

                // Use Promise.all to wait for all asynchronous calls to getTaxonKey
                const updatedFieldguides = await Promise.all(results.map(async (result) => {
                    if (result.taxon === null) {
                        // Skip adding this to updatedFieldguides and go to the next iteration
                        return;
                    } else {
                        const imageURL = result.taxon.default_photo ? result.taxon.default_photo.medium_url : null;
                        const preferredCommonName = result.taxon.preferred_common_name;
                        const imageAttribution = result.taxon.default_photo?.attribution;
                        const speciesName = result.taxon.name;
                        const taxonKey = await getTaxonKey(speciesName);

                        return {
                            imageURL,
                            commonName: preferredCommonName,
                            attribution: imageAttribution,
                            taxonKey: taxonKey,
                            speciesName: speciesName,
                        };
                    }
                }));

                // Remove null values
                const updatedFieldguidesWithoutNull = updatedFieldguides.filter(result => result !== undefined);

                // Filter out duplicates based on speciesName
                const filteredUpdatedFieldguides = [...new Map(updatedFieldguidesWithoutNull.map(result => [result.speciesName, result])).values()];

                // Update the fieldguides state
                setFieldguides((prevFieldguides) => [...prevFieldguides, ...filteredUpdatedFieldguides]);


            } catch (error) {
                // Handle any errors that may occur
                console.error('Error:', error);
            }

        }
    };

    // Use useEffect to run getInatAPI when the page state changes
    useEffect(() => {
        // Fetch data using getInatAPI whenever the page changes
        getInatAPI(searchTerm);

        // eslint-disable-next-line
    }, [page]);

    // Function to get the taxon key from GBIF based on scientific name
    const getTaxonKey = async (speciesName) => {
        // define the dynamic URL of the GBIF API.
        const gbifUrl = `https://api.gbif.org/v1/species?name=${encodeURIComponent(
            speciesName
        )}&limit=${1}`;

        try {

            //use the URL to get the taxonKey of the specified species
            const response = await axios.get(gbifUrl);

            // Check if there are any results
            if (response.data.results.length > 0) {

                // Extracting information from the first result
                const taxonKey = response.data.results[0].nubKey;

                // Return the taxon key
                return taxonKey;

            }
        } catch (error) {
            console.error('Error fetching GBIF data:', error);
            // You may want to handle this error by returning a default value or throwing an error
            return null;
        }
    };

    // function to search and add a row to fieldGuides 
    const handleSearch = async () => {
        setFieldguides([]);

        if (page === 1) {
            if (locale) {
                try {
                    // Fetch coordinates for the specified location using Nominatim API
                    const locationResponse = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locale)}`);

                    if (locationResponse.data && locationResponse.data.length > 0) {
                        const firstResult = locationResponse.data[0];
                        const coords = [parseFloat(firstResult.lat), parseFloat(firstResult.lon)];

                        // Update the map's center with the fetched coordinates
                        setCenter(coords);
                    }
                } catch (error) {
                    console.error('Error fetching location coordinates:', error);
                }
            }

            // Trigger the API call
            getInatAPI(searchTerm);
        } else {
            // If page is not 1, set it to 1
            setPage(1);
        }
    };

    const handleFullscreen = (imageURL, attribution) => {
        // Set the selected image for the modal
        setSelectedImage({ imageURL, attribution });

        // Show the modal
        setShowModal(true);
    };

    const handleImageRowClick = (index, e) => {
        // Check if the click target is the map container or its descendants
        if (!e.target.closest('.leaflet-container')) {
            // Navigate to the desired page using the navigate function
            navigate('/fieldGuide/' + fieldguides[index].speciesName);
        }
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

    const handleLoadMore = () => {

        setShowLoadMore(false);
        // Update page asynchronously
        setPage(page + 1);
    };

    return (
        <div className='fieldGuide-page'>

            {/* Create the search container Div */}
            <div className='search-container'>

                {/* Create the search container heading */}
                <h1>Field Guides</h1>

                {/* Create the search bar DIV (label and input) */}
                <div className='search-bar'>

                    {/* Display the label name */}
                    <label>Species Name: </label>

                    {/* input value searchTerm that changes the variable when the user types */}
                    <input
                        className='search-input'
                        type="text"
                        placeholder="Enter search term"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); }}
                    />

                </div>

                {/* Create the search bar DIV (label and input) */}
                <div className='search-bar'>

                    {/* Display the label name */}
                    <label>Locality: </label>

                    {/* input value searchTerm that changes the variable when the user types */}
                    <input
                        className='search-input'
                        type="text"
                        placeholder="Enter locality"
                        value={locale}
                        onChange={(e) => { setLocale(e.target.value); }}
                    />

                </div>
                {/* Button to trigger the handleSearch() function */}
                <button onClick={() => handleSearch()}>Search</button>

            </div>
            <br />

            {/* define each image row */}
            <div className="image-rows">

                {/* maps out the fieldguides variable for each row */}
                {fieldguides.map((row, index) => (

                    // create an onClick function when the user clicks on a row
                    <div className={`image-row`} key={index} onClick={(e) => handleImageRowClick(index, e)}>
                        {/* displays an image */}
                        <img
                            src={row.imageURL}
                            alt={row.commonName}
                            className="image"
                            style={{ width: '200px', height: '200px', float: 'left', marginRight: '20px', border: '2px solid #ddd', borderRadius: '5px' }}
                        />

                        {/* adds the fullscreen tag to the image with a fullscreen button */}
                        <div className="image-tag" onClick={(e) => { e.stopPropagation(); handleFullscreen(row.imageURL, row.attribution) }}>
                            Fullscreen
                        </div>

                        {/* defines the map Div */}
                        <div style={{ width: '200px', height: '200px', float: 'left', marginRight: '20px', overflow: 'hidden' }}>
                            {/* sets the mapContainer variables */}
                            <MapContainer center={center} zoom={2} style={{ width: '200px', height: '200px', float: 'left', marginRight: '20px' }}>

                                {/* adds the map itself as a layer from openstreetmaps */}
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />

                                {/* sets the heatmap layer using the taxonKey */}
                                <TileLayer
                                    url={`https://api.gbif.org/v2/map/occurrence/density/{z}/{x}/{y}@1x.png?taxonKey=${row.taxonKey}&style=purpleHeat.point`}
                                    attribution="GBIF"
                                />
                            </MapContainer>
                        </div>

                        {/* div for the text displayed */}
                        <div className="text-content">
                            <h3>{row.speciesName}</h3>
                            <p>Common Name: {row.commonName || row.speciesName}</p>
                            <p>Description: {row.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Display "Load More" button conditionally */}
            {showLoadMore && (
                <div className="load-more-container">
                    <button onClick={handleLoadMore}>Load More</button>
                </div>
            )}


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
        </div>
    );
}

export default Fieldguide;