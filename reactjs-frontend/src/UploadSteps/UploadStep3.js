//import different libraries and modules
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import './UploadStep3.css';
import MapModal from './MapModal';
import AutocompleteGBIF from './AutocompleteGBIF';
import axios from "axios"
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import ImageTags from '../Other/ImageTags';


function UploadStep3(props) {

    const { token, setToken } = props; // Destructure the specific props you need
    const [username, setUsername] = useState(null);

    useEffect(() => {
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
    }, [token, setToken]);

    //define different variables
    const navigate = useNavigate();
    const [collectors, setCollectors] = useState([]);
    const [photographers, setPhotographers] = useState([]);
    const [collections, setCollections] = useState([]);
    const [selectedCollectorName, setSelectedCollectorName] = useState(collectors[0]);
    const [selectedCollectionName, setSelectedCollectionName] = useState(collections[0]);
    const [selectedPhotographer, setSelectedPhotographer] = useState(photographers[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [checkboxValues, setCheckboxValues] = useState({
        drawingPaint: false,
        literature: false,
        invaSpec: false,
        dying: false,
        dead: false,
        barkStrip: false,
        camTrap: false,
    });
    const [subjectCheckBox, setSubjectCheckBox] = useState({
        people: false,
        landscape: false,
        dissection: false,
        exSitu: false,
        pollinator: false,
        plant: false,
        wholePlant: false,
        flowerBranch: false,
        flower: false,
        fruitCap: false,
        herbarium: false,
        bark: false,
        leaf: false,
    });

    // Function to fetch data from the server based on the username
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/informationStep3', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 'username': username }),
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data.collectors && data.collectors.length > 0) {
                        setCollectors(data.collectors);
                        setSelectedCollectorName(data.collectors[0]);
                    }

                    if (data.photographers && data.photographers.length > 0) {
                        setPhotographers(data.photographers);
                        setSelectedPhotographer(data.photographers[0]);
                    }

                    if (data.collections && data.collections.length > 0) {
                        setCollections(data.collections);
                        setSelectedCollectionName(data.collections[0]);
                    }
                } else {
                    console.error('Error fetching data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [username]);

    // Add a new useEffect to watch for changes in 'collections'
    useEffect(() => {
        // Check if 'collections' has data and set 'selectedCollectionName' accordingly
        if (collections.length > 0) {
            setSelectedCollectionName(collections[0]); // For example, set it to the first collection in the list
        }
    }, [collections]);

    // Add a new useEffect to watch for changes in 'collectors'
    useEffect(() => {
        // Check if 'collections' has data and set 'selectedCollectorName' accordingly
        if (collectors.length > 0) {
            setSelectedCollectorName(collectors[0]); // set to the first value
        }
    }, [collectors]);

    // Add a new useEffect to watch for changes in 'photographers'
    useEffect(() => {
        // Check if 'collections' has data and set 'selectedPhotographer' accordingly
        if (photographers.length > 0) {
            setSelectedPhotographer(photographers[0]); // set to the first value
        }
    }, [photographers]);


    const location = useLocation();
    const [imageData, setImageData] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [customPhotographer, setCustomPhotographer] = useState('');
    const [showCustomPhotographerInput, setShowCustomPhotographerInput] = useState(false);
    const [customCollectorName, setCustomCollectorName] = useState('');
    const [showCustomCollectorInput, setShowCustomCollectorInput] = useState(false);
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
                collector: image.collector || null,
                photographer: image.photographer || null,
                collection: image.collection || null,
                date: image.date || null,
                latitude: image.latitude || null,
                longitude: image.longitude || null,
                accuracy: image.accuracy || null,
                country: image.country || null,
                province: image.province || null,
                city: image.city || null,
                preciseLocality: image.preciseLocality || null,
                sciName: image.sciName || null,
                taxon: image.taxon || null,
                kingdom: image.kingdom || null,
                mainImageID: image.mainImageID || [],
                extraImageID: image.extraImageID || [],
                username: image.username || null,
                tags: image.tags || null,
                subject: image.subject || null,
            }));
            setImageData(modifiedImageData);
        }

    }, [location.state]);

    //handle the click funcitons when the user clicks on an image
    const handleImageClick = (index, prevIndex) => {
        if (selectedImageIndex !== index) {
            setSelectedImageIndex(index); // Select the image
            handleImageClickData(index, prevIndex);
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

    //function to set all values of newly clicked image
    const handleImageClickData = async (index, prevIndex) => {
        //wait for the save information before continuing
        await handleSaveInformation(prevIndex);
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
        setCheckboxValues(selectedImage.tags || {
            drawingPaint: false,
            literature: false,
            invaSpec: false,
            dying: false,
            dead: false,
            barkStrip: false,
            camTrap: false,
        });
        setSubjectCheckBox(selectedImage.subject || {
            people: false,
            landscape: false,
            dissection: false,
            exSitu: false,
            pollinator: false,
            plant: false,
            wholePlant: false,
            flowerBranch: false,
            flower: false,
            fruitCap: false,
            herbarium: false,
            bark: false,
            leaf: false,
        })
    };

    //function to save all data to selected image
    const handleSaveInformation = async (index) => {
        const updatedImageData = [...imageData];
        const selectedImage = updatedImageData[index];

        // Check if the inputDate matches the DD/MM/YYYY format
        const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
        if (inputDate && !datePattern.test(inputDate)) {
            alert('Please enter a valid date in DD/MM/YYYY format.');
            return; // Exit the function if the date format is invalid
        }

        // Check if the selected photographer is "Custom" and use customPhotographer if true
        selectedImage.photographer = selectedPhotographer === 'custom' ? customPhotographer : selectedPhotographer || '';

        // Check if the selected collector is "Custom" and use customCollectorName if true
        selectedImage.collector = selectedCollectorName === 'custom' ? customCollectorName : selectedCollectorName || '';

        // Check if the selected collection is "Custom" and use customCollectionName if true
        selectedImage.collection = selectedCollectionName === 'custom' ? customCollectionName : selectedCollectionName || '';
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
        selectedImage.username = username || '';
        selectedImage.tags = checkboxValues || '';
        selectedImage.subject = subjectCheckBox || '';

        // Check if a custom name was entered and update the respective array
        if (showCustomPhotographerInput) {
            const updatedPhotographers = [...photographers, customPhotographer];
            setPhotographers(updatedPhotographers);
        }

        //adds custom option to the array of collectors
        if (showCustomCollectorInput) {
            const updatedCollectors = [...collectors, customCollectorName];
            setCollectors(updatedCollectors);
        }

        //adds custom collection to array of collections
        if (showCustomCollectionInput) {
            const updatedCollections = [...collections, customCollectionName];
            setCollections(updatedCollections);
        }

        setImageData(updatedImageData);
    };

    // Function to handle changes in the custom photographer input
    const handleCustomPhotographerChange = (event) => {
        // Set the custom photographer value based on the input
        const newCustomPhotographer = event.target.value;
        setCustomPhotographer(newCustomPhotographer);
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

    };

    // Function to check all data has been submitted between all images and uploads
    const handleCheckUpload = async () => {

        await handleSaveInformation(selectedImageIndex);

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
                !image.sciName
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
            console.log(imageData);
            preRequest();
        }
    };

    // function to convert a blob images to a base64
    const handleBlobToBase = async (blobUrl) => {
        try {
            const response = await fetch(blobUrl);
            const blob = await response.blob();
            const base64String = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve(reader.result.split(',')[1]);
                };
                reader.onerror = (error) => {
                    reject(error);
                };
                reader.readAsDataURL(blob);
            });
            return base64String;
        } catch (error) {
            console.error('Error fetching Blob data:', error);
            throw error; // Rethrow the error so the caller can handle it
        }
    };

    // function to format the array for sending to backend
    const preRequest = async () => {
        setIsLoading(true)
        const updatedImageData = _.cloneDeep(imageData); // Use Lodash's cloneDeep function so copies dont modify original imageData

        // Loop through each image in updatedImageData
        for (let i = 0; i < updatedImageData.length; i++) {
            const idImage = uuidv4(); // Generate a unique ID for the main image
            updatedImageData[i].mainImageID = idImage; // Assign the ID to the main image

            try {
                const tempString = updatedImageData[i].mainImage;
                updatedImageData[i].mainImage = await handleBlobToBase(tempString); // Await the result
            } catch (error) {
                console.error('Error converting main image:', error);
            }

            // Get the extra images for the current image (or an empty array if none)
            const extraImages = updatedImageData[i]?.extraImage ?? [];

            // Generate unique IDs for each extra image using map
            const extraImageIDs = extraImages.map(() => uuidv4());

            // Loop through extra images
            for (let n = 0; n < extraImages.length; n++) {
                try {
                    const tempString = extraImages[n];
                    updatedImageData[i].extraImage[n] = await handleBlobToBase(tempString); // Await the result
                } catch (error) {
                    console.error('Error converting extra image:', error);
                }
            }

            // Assign the array of unique extra image IDs to the current image
            updatedImageData[i].extraImageID = extraImageIDs;
        }

        console.log(updatedImageData)

        console.log('preRequest successful');

        sendImageDataToBackend(updatedImageData);
    };

    // Function to send the array to the backend
    const sendImageDataToBackend = async (dataApiArray) => {

        console.log(dataApiArray);

        try {
            // Send a POST request to the '/information' endpoint with the imageData
            const response = await fetch('/information', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataApiArray), // Use lowercase 'imageData' here, assuming it's your array of data
            });

            // Check if the response status is okay (e.g., 200)
            if (response.ok) {
                // Handle success: Log a message indicating success
                console.log('Information array sent successfully');
                setIsLoading(false);
                alert("Everything has uploaded.")
            } else {
                // Handle error: Log the status text from the response
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            // Handle exceptions that may occur during the fetch request, e.g., network issues
            console.error('Error:', error);
        }
    };

    //sends the user back to step 2 with the correctly formatted data
    const handleSendBackStep2 = async (prevIndex) => {
        await handleSaveInformation(prevIndex);
        navigate('/UploadStep2', { state: { uploadedImages: imageData } });
    };

    //sends the user back to step 1 with the correctly formatted data
    const handleSendBackStep1 = async (prevIndex) => {

        await handleSaveInformation(prevIndex);
        navigate('/upload', { state: { singleImageData: imageData } });

    };

    //useEffect to make sure the values are correct for the user when traversing through the different steps
    useEffect(() => {
        if (selectedImageIndex !== null) {
            const selectedImage = imageData[selectedImageIndex];
            // Check if the selectedImage is defined before accessing its properties
            if (selectedImage) {
                setSelectedPhotographer(selectedImage.photographer || (photographers[0] || ''));
                setSelectedCollectorName(selectedImage.collector || (collectors[0] || ''));
                setSelectedCollectionName(selectedImage.collection || (collections[0] || ''));
                setSelectedScientificName(selectedImage.sciName || '');
                setLatitude(selectedImage.latitude || '');
                setLongitude(selectedImage.longitude || '');
                setAccuracy(selectedImage.accuracy || '');
                setInputDate(selectedImage.date || '');
                setCountryInput(selectedImage.country || '');
                setProvinceInput(selectedImage.province || '');
                setCityInput(selectedImage.city || '');
                setPreciseInput(selectedImage.preciseLocality || '');
                setTaxonInput(selectedImage.taxon || '');
                setKingdomInput(selectedImage.kingdom || '');
                setCheckboxValues(selectedImage.tags || {
                    drawingPaint: false,
                    literature: false,
                    invaSpec: false,
                    dying: false,
                    dead: false,
                    barkStrip: false,
                    camTrap: false,
                });
                setSubjectCheckBox(selectedImage.subject || {
                    people: false,
                    landscape: false,
                    dissection: false,
                    exSitu: false,
                    pollinator: false,
                    plant: false,
                    wholePlant: false,
                    flowerBranch: false,
                    flower: false,
                    fruitCap: false,
                    herbarium: false,
                    bark: false,
                    leaf: false,
                })

            }
        }
    }, [selectedImageIndex, imageData, photographers, collectors, collections]);

    return (

        <div className="upload-step-container">

            {/* left container */}
            <div className="upload-step-left">
                <h2>UPLOAD STEPS:</h2>
                <ol>
                    {/* links to different forms */}
                    <li onClick={() => handleSendBackStep1(selectedImageIndex)}>Step 1:{'\n'}Adding Observations</li>
                    <li onClick={() => handleSendBackStep2(selectedImageIndex)}>Step 2:{'\n'}Grouping Observations</li>
                    <li>Step 3:{'\n'}Adding Information</li>
                </ol>
            </div>
            <div className="upload-step-center">

                {/* center section heading */}
                <h2>ADD INFORMATION</h2>

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
                                    <Col xs={10} md={6} lg={4} key={index}>
                                        {/* adds styling to the selected image and grouped images */}
                                        <div
                                            className={`img-card ${selectedImageIndex === index ? 'image-checked' : ''} ${data.extraImage && data.extraImage.length > 0 ? 'grouped-img-card' : ''}`}
                                            onClick={() => handleImageClick(index, selectedImageIndex)}
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
                <div className="scrollable-content">
                    <h2>BASIC INFO:</h2>

                    {/* adds the user name here */}
                    <p id="username">User name: {username}</p>

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
                    <div>
                        <label htmlFor="imageDate">Date:</label>
                        <input type="text" id="imageDate" name="imageDate" placeholder='DD/MM/YYYY' onChange={(e) => setInputDate(e.target.value)} value={inputDate || ''} />
                    </div>

                    {/* displays a drop down fro the collectors name  */}
                    <div>
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
                    <div>
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

                    <ImageTags
                    checkboxValues={checkboxValues}
                    setCheckboxValues={setCheckboxValues}
                    subjectCheckBox={subjectCheckBox}
                    setSubjectCheckBox={setSubjectCheckBox}
                    />

                    <hr />

                    {/* adds a new sub heading for the coordinates */}
                    <h1>Coordinates</h1>

                    {/* latitude input-group */}
                    <div>
                        <label htmlFor="latNumber">Latitude:</label>
                        <input type="text" id="latNumber" name="latNumber" value={latitude || ''} onChange={(e) => setLatitude(e.target.value)} />
                    </div>

                    {/* longitude input-group */}
                    <div>
                        <label htmlFor="longNumber">Longitude:</label>
                        <input type="text" id="longNumber" name="longNumber" value={longitude || ''} onChange={(e) => setLongitude(e.target.value)} />
                    </div>

                    <hr />

                    {/* adds a new sub heading for the Locality */}
                    <h1>Locality</h1>

                    {/* Country input-group */}
                    <div>
                        <label htmlFor="locCount">Country:</label>
                        <input type="text" id="locCount" name="locCount" value={countryInput || ''} onChange={(e) => setCountryInput(e.target.value)} />
                    </div>

                    {/* Province input-group */}
                    <div>
                        <label htmlFor="locPro">Province:</label>
                        <input type="text" id="locPro" name="locPro" value={provinceInput || ''} onChange={(e) => setProvinceInput(e.target.value)} />
                    </div>

                    {/* minor locality input-group */}
                    <div>
                        <label htmlFor="minLoc">City/Town:</label>
                        <input type="text" id="minLoc" name="minLoc" value={cityInput || ''} onChange={(e) => setCityInput(e.target.value)} />
                    </div>

                    {/* precise locality input-group */}
                    <div>
                        <label htmlFor="preLoc">Precise Locality:</label>
                        <input type="text" id="preLoc" name="preLoc" value={preciseInput || ''} onChange={(e) => setPreciseInput(e.target.value)} />
                    </div>

                    <br />
                    <br />

                    {/* this button is used to check all data and submit it to the database */}
                    <button className='finalise-button' onClick={handleCheckUpload}>finalise</button>

                    {/* Loading indicator */}
        {isLoading && (
          <div className="loading-indicator">
            <p>Please wait for items to finish loading</p>
            <div className="spinner"></div>
          </div>
        )}
        
                    <hr />
                    <br />
                    <br />
                </div>
            </div>
        </div >
    );
}

export default UploadStep3;
