//import different libraries and modules
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import './UploadStep3.css';
import MapModal from './MapModal';
import AutocompleteGBIF from './AutocompleteGBIF';


function UploadStep3() {

    //define different variables
    const [collectors, setCollectors] = useState(["Collector 1", "Collector 2"]);
    const [photographers, setPhotographers] = useState(["Testing John", "testing Jane"]);
    const [collections, setCollections] = useState(["collection1", "collection2"]);

    const location = useLocation();
    const [imageData, setImageData] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedPhotographer, setSelectedPhotographer] = useState(photographers[0]);
    const [customPhotographer, setCustomPhotographer] = useState('');
    const [showCustomPhotographerInput, setShowCustomPhotographerInput] = useState(false);
    const [selectedCollectorName, setSelectedCollectorName] = useState(collectors[0]);
    const [customCollectorName, setCustomCollectorName] = useState('');
    const [showCustomCollectorInput, setShowCustomCollectorInput] = useState(false);
    const [selectedCollectionName, setSelectedCollectionName] = useState(collections[0]);
    const [customCollectionName, setCustomCollectionName] = useState('');
    const [showCustomCollectionInput, setShowCustomCollectionInput] = useState(false);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [accuracy, setAccuracy] = useState('');
    const [showMapModal, setShowMapModal] = useState(false);
    const [selectedScientificName, setSelectedScientificName] = useState('');
    const [taxonInput, setTaxonInput] = useState(null);
    const [kingdomInput, setKingdomInput] = useState(null);
    const [inputDate, setInputDate] = useState(null);
    const [countryInput, setCountryInput] = useState(null);
    const [provinceInput, setProvinceInput] = useState(null);
    const [cityInput, setCityInput] = useState(null);
    const [preciseInput, setPreciseInput] = useState(null);

    //sets scientific name for gbif
    const handleUpdateScientificName = (scientificName) => {
        setSelectedScientificName(scientificName);
    };

    //sets Class and kingdom from gbif
    const handleClassKing = (classValue, kingdomValue) => {

        setTaxonInput(classValue);
        setKingdomInput(kingdomValue);
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
    };

    //function to update town,province and country values
    const handleTowProCou = (tow, pro, cou) => {
        setCityInput(tow); // Set the value
        setProvinceInput(pro); // Set the value
        setCountryInput(cou); // Set the value
    };

    //useEffect to recieve the values from previous form and sets additional values to the array
    useEffect(() => {
        if (location.state && location.state.imageData) {
            const modifiedImageData = location.state.imageData.map((image) => ({
                ...image,
                collector: null,
                photographer: null,
                collection: null,
                date: null,
                latitude: null,
                longitude: null,
                accuracy: null,
                country: null,
                province: null,
                city: null,
                preciseLocality: null,
                sciName: null,
                taxon: null,
                kingdom: null,

            }));
            setImageData(modifiedImageData);
        }
    }, [location.state]);


    const handleImageClick = (index) => {
        if (selectedImageIndex !== index) {
            setSelectedImageIndex(index); // Select the image
            handleImageClickData(index);
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

    const handleImageClickData = (index) => {
        const selectedImage = imageData[index];

        setSelectedPhotographer(selectedImage.photographer || photographers[0]);
        setSelectedCollectorName(selectedImage.collector || collectors[0]);
        setSelectedCollectionName(selectedImage.collection || collections[0]);
        setSelectedScientificName(selectedImage.sciName || '');
        setLatitude(selectedImage.latitude || '');
        setLongitude(selectedImage.longitude || '');
        setAccuracy(selectedImage.accuracy || '');
        setInputDate(selectedImage.date || '');
        setCountryInput(selectedImage.country || '');
        setProvinceInput(selectedImage.province || '');
        setCityInput(selectedImage.city || '');
        setPreciseInput(selectedImage.preciseLocality || '');
        setShowCustomCollectionInput(false);
        setShowCustomCollectorInput(false);
        setShowCustomPhotographerInput(false);
        setCustomCollectionName('');
        setCustomCollectorName('');
        setCustomPhotographer('');
    };

    const handleSaveInformation = (index) => {
        const updatedImageData = [...imageData];
        const selectedImage = updatedImageData[index];

        selectedImage.photographer = selectedPhotographer || '';
        selectedImage.collector = selectedCollectorName || '';
        selectedImage.collection = selectedCollectionName || '';
        selectedImage.sciName = selectedScientificName || '';
        selectedImage.taxon = taxonInput || '';
        selectedImage.kingdom = kingdomInput || '';
        selectedImage.latitude = latitude || '';
        selectedImage.longitude = longitude || '';
        selectedImage.accuracy = accuracy || '';
        selectedImage.date = inputDate || '';
        selectedImage.country = countryInput || '';
        selectedImage.province = provinceInput || '';
        selectedImage.city = cityInput || '';
        selectedImage.preciseLocality = preciseInput || '';

        // Check if a custom name was entered and update the respective array
        if (showCustomPhotographerInput) {
            const updatedPhotographers = [...photographers, selectedPhotographer];
            setPhotographers(updatedPhotographers);
        }

        //adds custom option to the array of collectors
        if (showCustomCollectorInput) {
            const updatedCollectors = [...collectors, selectedCollectorName];
            setCollectors(updatedCollectors);
        }

        //adds custom collection to array of collections
        if (showCustomCollectionInput) {
            const updatedCollections = [...collections, selectedCollectionName];
            setCollections(updatedCollections);
        }

        setImageData(updatedImageData);
    };


    // Function to handle changes in the custom photographer input
    const handleCustomPhotographerChange = (event) => {
        // Set the custom photographer value based on the input
        const newCustomPhotographer = event.target.value;
        setCustomPhotographer(newCustomPhotographer);
        setSelectedPhotographer(newCustomPhotographer);
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
        const newCustomCollectors = event.target.value;
        setCustomCollectorName(newCustomCollectors);
        setSelectedCollectorName(newCustomCollectors);

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
        const newCustomCollection = event.target.value;
        setCustomCollectionName(newCustomCollection);
        setSelectedCollectionName(newCustomCollection);

    };

    // Function to check all data has been submitted between all images and uploads
    const handleCheckUpload = () => {
        let missingFields = [];

        // Iterate through the imageData array
        for (let i = 0; i < imageData.length; i++) {
            const image = imageData[i];

            // Check if any of the required fields are null (excluding extraImages)
            if (
                !image.photographer ||
                !image.collector ||
                !image.collection ||
                !image.date ||
                !image.latitude ||
                !image.longitude ||
                !image.accuracy ||
                !image.country ||
                !image.province ||
                !image.city ||
                !image.preciseLocality ||
                !image.sciName ||
                !image.taxon ||
                !image.kingdom
            ) {
                missingFields.push(`Image ${i + 1}`);
            }
        }

        // Check if any missing fields were found
        if (missingFields.length > 0) {
            const missingFieldsMsg = missingFields.join(', ');
            alert(`Please fill in all required fields for ${missingFieldsMsg}.`);
            console.log(imageData);
        } else {
            console.log('imageUploading');
            sendImageDataToBackend();
        }
    };

    // Function to send the array to the backend
    const sendImageDataToBackend = async () => {
        try {
            // Send a POST request to the '/information' endpoint with the imageData
            const response = await fetch('/information', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(imageData), // Use lowercase 'imageData' here, assuming it's your array of data
            });

            // Check if the response status is okay (e.g., 200)
            if (response.ok) {
                // Handle success: Log a message indicating success
                console.log('Information array sent successfully');
            } else {
                // Handle error: Log the status text from the response
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            // Handle exceptions that may occur during the fetch request, e.g., network issues
            console.error('Error:', error);
        }
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
                <button onClick={handleMapModalOpen} >Open Maps for selected image</button>

                {/* define settings for the map modal */}
                <MapModal
                    show={showMapModal}
                    onClose={handleMapModalClose}
                    onUpdateLatLng={updateLatLng}
                    onHandleTowProCou={handleTowProCou}
                    longitudeInput={longitude}
                    latitudeInput={latitude}
                    accuracyInput={accuracy}
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
                    <input type="text" id="imageDate" name="imageDate" placeholder='DD/MM/YYYY' onChange={(e) => setInputDate(e.target.value)} value={inputDate || ''} />
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

                    <AutocompleteGBIF onValueSet={selectedScientificName} onUpdateScientificName={handleUpdateScientificName} onUpdateClassKing={handleClassKing} />
                </div>

                <hr />

                {/* adds a new sub heading for the coordinates */}
                <h1>Coordinates</h1>

                {/* latitude input-group */}
                <div className="input-group">
                    <label htmlFor="latNumber">Latitude:</label>
                    <input type="text" id="latNumber" name="latNumber" value={latitude || ''} onChange={(e) => setLatitude(e.target.value)} />
                </div>

                {/* longitude input-group */}
                <div className="input-group">
                    <label htmlFor="longNumber">Longitude:</label>
                    <input type="text" id="longNumber" name="longNumber" value={longitude || ''} onChange={(e) => setLongitude(e.target.value)} />
                </div>

                <hr />

                {/* adds a new sub heading for the Locality */}
                <h1>Locality</h1>

                {/* Country input-group */}
                <div className="input-group">
                    <label htmlFor="locCount">Country:</label>
                    <input type="text" id="locCount" name="locCount" value={countryInput || ''} onChange={(e) => setCountryInput(e.target.value)} />
                </div>

                {/* Province input-group */}
                <div className="input-group">
                    <label htmlFor="locPro">Province:</label>
                    <input type="text" id="locPro" name="locPro" value={provinceInput || ''} onChange={(e) => setProvinceInput(e.target.value)} />
                </div>

                {/* minor locality input-group */}
                <div className="input-group">
                    <label htmlFor="minLoc">City/Town:</label>
                    <input type="text" id="minLoc" name="minLoc" value={cityInput || ''} onChange={(e) => setCityInput(e.target.value)} />
                </div>

                {/* precise locality input-group */}
                <div className="input-group">
                    <label htmlFor="preLoc">Precise Locality:</label>
                    <input type="text" id="preLoc" name="preLoc" value={preciseInput || ''} onChange={(e) => setPreciseInput(e.target.value)} />
                </div>

                {/* save data for selected image button */}
                <button onClick={() => handleSaveInformation(selectedImageIndex)} >Save Information for selected image</button>

                <br />
                <br />

                {/* this button is used to check all data and submit it to the database */}
                <button onClick={handleCheckUpload}>finalise</button>
            </div>
        </div >
    );
}

export default UploadStep3;
