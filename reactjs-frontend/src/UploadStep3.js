//import different libraries and modules
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import './UploadStep3.css';
import MapModal from './MapModal';
import AutocompleteGBIF from './AutocompleteGBIF';


function UploadStep3() {

    //define different variables

    const location = useLocation();
    const [imageData, setImageData] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [selectedPhotographer, setSelectedPhotographer] = useState('');
    const [customPhotographer, setCustomPhotographer] = useState('');
    const [showCustomPhotographerInput, setShowCustomPhotographerInput] = useState(false); 
    const [selectedCollectorName, setSelectedCollectorName] = useState('');
    const [customCollectorName, setCustomCollectorName] = useState('');
    const [showCustomCollectorInput, setShowCustomCollectorInput] = useState(false);
    const [selectedCollectionName, setSelectedCollectionName] = useState('');
    const [customCollectionName, setCustomCollectionName] = useState('');
    const [showCustomCollectionInput, setShowCustomCollectionInput] = useState(false);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [accuracy, setAccuracy] = useState('');
    const [showMapModal, setShowMapModal] = useState(false);
    const [selectedScientificName, setSelectedScientificName] = useState('');

    //sets scientific name for gbif
  const handleUpdateScientificName = (scientificName) => {
    setSelectedScientificName(scientificName);
  };

    //function to show the map modal
    const handleMapModalOpen = () => {

        //if statement to make sure user selects an image
        if (selectedImageIndex !== null) {
            setShowMapModal(true);
        } else {
            alert('Please select an Image before clicking this button');
        }
    };

    //function to close the map modal
    const handleMapModalClose = () => {
        setShowMapModal(false);
    };

    //function to set new coord values 
    const updateLatLng = (lat, lng, acc) => {
        setLatitude(lat);
        setLongitude(lng);
        setAccuracy(acc);

        // Update the longitude input field's value
        const longInput = document.getElementById('longNumber');
        if (longInput) {
            longInput.value = lng; // Set the value
        }

        // Update the Latitude input field's value
        const latInput = document.getElementById('latNumber');
        if (latInput) {
            latInput.value = lat; // Set the value
        }
    };

    const handleTowProCou = (tow, pro, cou) => {
        // Update the town input field's value
        const townInput = document.getElementById('minLoc');
        if (townInput) {
            townInput.value = tow; // Set the value
        }
    
        // Update the province input field's value
        const provinceInput = document.getElementById('locPro');
        if (provinceInput) {
            provinceInput.value = pro; // Set the value
        }
    
        // Update the country input field's value
        const countryInput = document.getElementById('locCount');
        if (countryInput) {
            countryInput.value = cou; // Set the value
        }
    };

    //useEffect to recieve the values from previous form
    useEffect(() => {
        if (location.state && location.state.imageData) {
            setImageData(location.state.imageData);
        }
    }, [location.state]);


    const collectors = ["Collector 1", "Collector 2"]; // Update with actual collector names
    const photographers = ["Testing John", "testing Jane"]; // Update with actual photographer names
    const collections = ["collection1", "collection2"];//update with actual collections

    //function to handle image click and change
    const handleImageClick = (index) => {
        if (selectedImageIndex === index) {
            setSelectedImageIndex(null); // Deselect the image if it's already selected
        } else {
            setSelectedImageIndex(index); // Select the image if it's not selected
        }
    };

    // Function to handle changes in the selected photographer
    const handlePhotographerChange = (event) => {
        // Get the selected value from the event
        const value = event.target.value;
        // Update the selected photographer state
        setSelectedPhotographer(value);

        // Check if the selected value is 'custom'
        if (value === 'custom') {
            // Show the custom photographer input
            setShowCustomPhotographerInput(true);
        } else {
            // Hide the custom photographer input
            setShowCustomPhotographerInput(false);
        }
    };


    // Function to handle changes in the custom photographer input
    const handleCustomPhotographerChange = (event) => {
        // Set the custom photographer value based on the input
        setCustomPhotographer(event.target.value);
    };

    // Function to handle changes in the selected collector name
    const handleCollectorNameChange = (event) => {
        // Get the selected value from the event
        const value = event.target.value;
        // Update the selected collector name state
        setSelectedCollectorName(value);

        // Check if the selected value is 'custom'
        if (value === 'custom') {
            // Show the custom collector input
            setShowCustomCollectorInput(true);
        } else {
            // Hide the custom collector input
            setShowCustomCollectorInput(false);
        }
    };

    // Function to handle changes in the custom collector input
    const handleCustomCollectorNameChange = (event) => {
        // Set the custom collector name value based on the input
        setCustomCollectorName(event.target.value);
    };

    // Function to handle changes in the selected collector name
    const handleCollectionNameChange = (event) => {
        // Get the selected value from the event
        const value = event.target.value;
        // Update the selected collector name state
        setSelectedCollectionName(value);

        // Check if the selected value is 'custom'
        if (value === 'custom') {
            // Show the custom collector input
            setShowCustomCollectionInput(true);
        } else {
            // Hide the custom collector input
            setShowCustomCollectionInput(false);
        }
    };

    // Function to handle changes in the custom collector input
    const handleCustomCollectionNameChange = (event) => {
        // Set the custom collector name value based on the input
        setCustomCollectionName(event.target.value);
    };


    return (

        <div className="upload-step-container">

            {/* left container */}
            <div className="upload-step-left">
                <h2>Upload Steps:</h2>
                <ol>
                    {/* links to different forms */}
                    <li><Link to="/Upload">Step 1 - Adding Observations</Link> </li>
                    <li><Link to="/UploadStep2">Step 2 - Grouping Observations</Link></li>
                    <li><Link to="/UploadStep3">Step 3 - Adding Information</Link></li>
                </ol>
            </div>
            <div className="upload-step-center">

                {/* center section heading */}
                <h2>Add Information</h2>

                {/* button to open the map modal */}
                <button onClick={handleMapModalOpen}>Open Maps for selected image</button>

                {/* define settings for the map modal */}
                <MapModal
                    show={showMapModal}
                    onClose={handleMapModalClose}
                    onUpdateLatLng={updateLatLng}
                    onHandleTowProCou={handleTowProCou}
                />

                {/* sets the image container */}
                <Container>
                    <Row>

                        {/* maps through the imageData array and displays each main image */}
                        {imageData.length > 0 ? (
                            imageData.map((data, index) => (
                                data.mainImage && (
                                    <Col md={4} key={index}>
                                        
                                        {/* adds styling to the selected image and grouped images */}
                                        <div
                                            className={`img-card ${selectedImageIndex === index ? 'image-checked' : ''} ${data.extraImage ? 'grouped-img-card' : ''}`}
                                            onClick={() => handleImageClick(index)}
                                        >

                                            {/* displays the image set to these settings */}
                                            <Image src={data.mainImage} style={{ width: '300px', height: '300px' }} thumbnail />
                                        </div>
                                    </Col>
                                )
                            ))
                        ) : (
                            <Col>

                                {/* text if no images went through */}
                                <p>No images uploaded yet.</p>
                            </Col>
                        )}
                    </Row>
                </Container>
            </div>

            {/* define the right container for the upload step */}
            <div className="upload-step-right">
                <h1>Basic Info</h1>

                {/* adds the user name here */}
                <p id="userName">User name: Testing John</p>

                {/* adds a dropdown for the photographer name */}
                <label htmlFor="namesDropdown">Photographer Name:</label>
                <select
                    id="namesDropdown"
                    value={selectedPhotographer}
                    onChange={handlePhotographerChange}
                >

                    {/* maps out each photographer this user has used before */}
                    {photographers.map((photographer) => (
                        <option key={photographer} value={photographer}>
                            {photographer}
                        </option>
                    ))}

                    {/* displays an input slot if the user chose custom option  */}
                    <option value="custom">Custom</option>
                </select>
                {showCustomPhotographerInput && (
                    <div id="customInputContainer">
                        <label htmlFor="customInput">Enter new Photographer's name:</label>
                        <input
                            type="text"
                            id="customInput"
                            value={customPhotographer}
                            onChange={handleCustomPhotographerChange}
                        />
                    </div>
                )}

                {/* adds a group that allows the user to display a date ###SET A DEFAULT DATE SO USERS KNOW WHAT FORMAT TO USE### */}
                <div className="input-group">
                    <label htmlFor="imageDate">Date:</label>
                    <input type="text" id="imageDate" name="imageDate" />
                </div>

                {/* displays a drop down fro the collectors name  */}
                <div className="input-group">
                    <label htmlFor="colName">Collectors Name:</label>
                    <select
                        id="colName"
                        name="colName"
                        value={selectedCollectorName}
                        onChange={handleCollectorNameChange}
                    >

                        {/* maps out each collector the user has used before */}
                        {collectors.map((collectorName) => (
                            <option key={collectorName} value={collectorName.toLowerCase()}>
                                {collectorName}
                            </option>
                        ))}
                        <option value="custom">Custom</option>
                    </select>
                </div>

                {/* adds a new input box if the user selected the custom option */}
                <div id="colCustom" style={{ display: showCustomCollectorInput ? 'block' : 'none' }}>
                    <label htmlFor="colCustom-input">Enter new Collectors name:</label>
                    <input
                        type="text"
                        id="colCustom-input"
                        value={customCollectorName}
                        onChange={handleCustomCollectorNameChange}
                    />
                </div>

                {/* adds Collection Name with dropdown with all users previous collection names */}
                <div className="input-group">
                    <label htmlFor="collectionName">Collection Name:</label>
                    <select
                        id="collectionName"
                        name="collectionName"
                        value={selectedCollectionName}
                        onChange={handleCollectionNameChange}
                    >

                        {/* maps out each collection name the user has used before */}
                        {collections.map((collectionName) => (
                            <option key={collectionName} value={collectionName.toLowerCase()}>
                                {collectionName}
                            </option>
                        ))}
                        <option value="custom">Custom</option>
                    </select>
                </div>

                {/* adds a new input box if the user selected the custom option */}
                <div id="collectionCustom" style={{ display: showCustomCollectionInput ? 'block' : 'none' }}>
                    <label htmlFor="collectionCustom-input">Enter new Collection name:</label>
                    <input
                        type="text"
                        id="collectionCustom-input"
                        value={customCollectionName}
                        onChange={handleCustomCollectionNameChange}
                    />
                </div>

                {/* Scientific name autosearch */}
                <div>
                    {/*<label htmlFor="sciName">Enter Scientific Name</label>
                    <input type="text" id="sciName" name="sciName"/>*/}
                    <AutocompleteGBIF onUpdateScientificName={handleUpdateScientificName} />

                </div>

                <hr />

                {/* adds a new sub heading for the coordinates */}
                <h1>Coordinates</h1>

                {/* latitude input-group */}
                <div className="input-group">
                    <label htmlFor="latNumber">Latitude:</label>
                    <input type="text" id="latNumber" name="latNumber" />
                </div>

                {/* longitude input-group */}
                <div className="input-group">
                    <label htmlFor="longNumber">Longitude:</label>
                    <input type="text" id="longNumber" name="longNumber" />
                </div>

                {/* Altitude input-group */}
                <div className="input-group">
                    <label htmlFor="altNumber">Altitude:</label>
                    <input type="text" id="altNumber" name="altNumber" />
                </div>
                <hr />

                {/* adds a new sub heading for the Locality */}
                <h1>Locality</h1>

                {/* Country input-group */}
                <div className="input-group">
                    <label htmlFor="locCount">Country:</label>
                    <input type="text" id="locCount" name="locCount" />
                </div>

                {/* Province input-group */}
                <div className="input-group">
                    <label htmlFor="locPro">Province:</label>
                    <input type="text" id="locPro" name="locPro" />
                </div>

                {/* minor locality input-group */}
                <div className="input-group">
                    <label htmlFor="minLoc">Minor Locality:</label>
                    <input type="text" id="minLoc" name="minLoc" />
                </div>

                {/* precise locality input-group */}
                <div className="input-group">
                    <label htmlFor="preLoc">Precise Locality:</label>
                    <input type="text" id="preLoc" name="preLoc" />
                </div>

                {/* this button is used to check all data and submit it to the database */}
                <button>finalise</button>
            </div>
        </div >
    );
}

export default UploadStep3;
