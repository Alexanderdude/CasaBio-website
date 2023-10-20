//import different libraries and modules
import React, { useState, useEffect } from 'react';
import './UploadStep2.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Image, Modal, Button } from 'react-bootstrap';

const UploadStep2 = () => {

    //state variables
    const location = useLocation();

    const [imageData, setImageData] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState([]);
    const [viewGroupModalShow, setViewGroupModalShow] = useState(false);
    const [currentMainImageIndex, setCurrentMainImageIndex] = useState(0);

    const navigate = useNavigate();

    //handle the useEffect to recieve variable from previous Upload Step
    useEffect(() => {
        if (location.state && location.state.uploadedImages) {
            setImageData(location.state.uploadedImages);
        }
    }, [location.state]);

    //handle display group as modal
    const handleViewGroup = () => {
        const selectedGroupImages = selectedImageIndex.filter(index => imageData[index].extraImage);

        //checks if the selectedGroupImages variable has one or more extra Images in length
        if (selectedGroupImages.length > 0) {
            //displays the modal for the selected image
            setViewGroupModalShow(true);
        } else {
            //popup error message
            alert('Please select a group image with extra images and try again.');
        }
    };

    //handle group main image thumbnail change
    const handleMainImageChange = () => {
        if (selectedImageIndex.length !== 1) {
            //returns the function if the length of the selectedImageIndex is not equal to 1
            return;
        }

        //places new selectedImageIndex value as the new mainImageIndex
        const mainImageIndex = selectedImageIndex[0];

        if (currentMainImageIndex === 0) {
            return; // Do nothing if selected image index is the same as current main image index
        }

        // Deep copy the imageData object
        const newImageData = JSON.parse(JSON.stringify(imageData));

        //declare the two images swapping as variables
        const extraImageNew = newImageData[mainImageIndex]?.mainImage;
        const mainImageNew = newImageData[mainImageIndex]?.extraImage[currentMainImageIndex - 1];

        // update the previous extra image as the new main image
        if (extraImageNew) {
            newImageData[mainImageIndex].mainImage = mainImageNew;
        }

        // Update the previous main image as the new extra image
        if (mainImageNew) {
            newImageData[mainImageIndex].extraImage[currentMainImageIndex - 1] = extraImageNew;
        }

        // Update the state with the modified object and stop displaying the variable
        setImageData(newImageData);
        setViewGroupModalShow(false);
    };

    //handle multiple image selection
    const handleImageClick = (index) => {
        if (selectedImageIndex.includes(index)) {
            //removes the index value if it was clicked again
            setSelectedImageIndex(selectedImageIndex.filter(i => i !== index));
        } else {
            //sets the index value of the selected image
            setSelectedImageIndex([...selectedImageIndex, index]);
        }
    };

    //Function to group selected images
    const handleGroupImages = () => {
        if (selectedImageIndex.length < 2) {
            //displays a popup error if you are merging an incorrect number of images
            if (!window.confirm('Please select more than one image and try again.')) {
                return;
            }
        }

        //declare variables
        const mainIndex = selectedImageIndex[0];
        const extraImages = selectedImageIndex.slice(1);
        const newImageData = [...imageData];

        //adds the values to extraImages if the value equal to or more than
        if (extraImages.length > 0) {

            // Initialize extraImage property as an empty array
            newImageData[mainIndex].extraImage = newImageData[mainIndex].extraImage || [];

            extraImages.forEach(index => {
                const extraImage = newImageData[index].extraImage;

                //if the extra image value of a newly merged main image is not equal to null or blank
                if (extraImage !== null && extraImage !== '') {

                    // Add main image and extra images to main group's extraImage array
                    newImageData[mainIndex].extraImage.push(newImageData[index].mainImage);
                    newImageData[mainIndex].extraImage.push(...extraImage);

                    // Clear mainImage and extraImage properties of the secondary group
                    newImageData[index].mainImage = null;
                    newImageData[index].extraImage = null;
                } else {
                    // Add only main image to main group's extraImage array
                    newImageData[mainIndex].extraImage.push(newImageData[index].mainImage);
                    newImageData[index].mainImage = null; // Clear mainImage for secondary group
                }
            });
        }

        //sets the main array as the newly created array and selected the new group
        setImageData(newImageData);
        setSelectedImageIndex([mainIndex]);
    };

    //Function to disband entire group selected
    const handleUngroupGroup = () => {
        //checks if the selected image doesnt have any extra images
        if (imageData[selectedImageIndex[0]].extraImage === null || imageData[selectedImageIndex[0]].extraImage === '') {
            if (!window.confirm('Please select a group and try again.')) {
                return;
            }
        }

        //declare variables
        const mainIndex = selectedImageIndex[0];
        const extraImages = imageData[mainIndex]?.extraImage || [];
        const newImageData = [...imageData];

        // Move the extra images back to main images
        extraImages.forEach((extraImage, index) => {
            //for each index in the imageData array
            for (let i = 0; i < newImageData.length; i++) {
                //if the imageData has a empty mainImage then
                if (!newImageData[i].mainImage) {

                    //set the extraImage value as the new mainImage
                    newImageData[i].mainImage = extraImage;

                    //clear the old extraImage value
                    newImageData[mainIndex].extraImage[index] = null;

                    break; // Exit the loop after finding the first empty mainImage
                }
            }
        });

        // Remove extra images array 
        newImageData[mainIndex].extraImage = null;

        //set the new array as ImageData
        setImageData(newImageData);
        setSelectedImageIndex([mainIndex]);
    };

    //Function to delete an image from group
    const handleSingleImageDelete = () => {

        //sets the selectedImageIndex
        const mainIndex = selectedImageIndex[0];

        //if the user wants to delete the mainImage
        if (currentMainImageIndex === 0) {

            const newImageData = [...imageData];

            // Get the first extra image and the mainImage
            const firstExtraImage = newImageData[mainIndex].extraImage[0];
            const newMainImage = newImageData[mainIndex].mainImage;

            // Update the main image with the first extra image and then remove that image from extraImages
            newImageData[mainIndex].mainImage = firstExtraImage;
            newImageData[mainIndex].extraImage.splice(0, 1);

            // Create a new main image in the newImageData array
            newImageData.push({
                mainImage: newMainImage,
                extraImage: null
            });

            //sets the new Array as imageData
            setImageData(newImageData);
            setCurrentMainImageIndex(newImageData.length - 1); // Set the currentMainImageIndex to the new main image

        } else {
            //sets the selected image as a variable
            const newImageData = [...imageData];
            const newMainImage = newImageData[mainIndex].extraImage[currentMainImageIndex - 1];

            //loops through imageData to find a unused index
            for (let i = 0; i < newImageData.length; i++) {
                if (!newImageData[i].mainImage || newImageData[i].mainImage === '') {
                    //sets the extraImage as a mainImage
                    newImageData[i].mainImage = newMainImage;
                    break;
                }
            }

            //removes the selected image from the original group[]
            newImageData[mainIndex].extraImage.splice(currentMainImageIndex - 1, 1);
            
            //sets the new Array as imageData
            setImageData(newImageData);
            setSelectedImageIndex([mainIndex]);
        }
    };

    //formats the imageData so that it doesnt have null values befor submitting
    const handleFormat = (inputArray) => {

        //creates an empty array
        const outputArray = [];

        //loops through the inputArray
        for (let i = 0; i < inputArray.length; i++) {
            
            //set variable for the value at index i
            const item = inputArray[i];

            //if the value is not blank or undefined then
            if (item.mainImage && item.mainImage !== '' && item.mainImage !== undefined) {
                
                //put the item value as a new index on output array
                outputArray.push(item);
            }
        }

        //return output array
        return outputArray;
    };

    //function for clearing values in imageIndex
    const handleProcessing = (bool) => {

        //sets variable for a newly cleared imageData
        const outputArray = handleFormat(imageData);

        if (bool === 'true') {
            //sends the formatted array to the submit function
            handleSubmit(outputArray);
        } else {
            handleBackStep(outputArray);
        };
    };

    //function to handle submit
    const handleSubmit = (formattedArray) => {

        //navigate to next form and sets the formatted array as imageData value 
        navigate('/UploadStep3', { state: { imageData: formattedArray } });
    };

    const handleBackStep = (formattedArray) => {
      
        navigate('/upload', { state: { singleImageData: formattedArray } });
    };

    const handleDelete = () => {
        const confirmDeletion = window.confirm("Are you sure you want to delete this item?");
        
        if (confirmDeletion) {
          // Make a copy of the imageData array
          const newArray = [...imageData];
      
          // Use splice to remove the item at the selectedImageIndex
          newArray.splice(selectedImageIndex[0], 1);
      
          // Update the imageData state with the modified array
          setImageData(newArray);
      
          // Reset the selectedImageIndex to a valid value, or handle it based on your use case
          setSelectedImageIndex([0]);
        }
      };

    return (
        <div className="upload-step-two-container">

            {/* Left Section Container upload steps*/}
            <div className="left-section">
                <h2>Upload Steps:</h2>
                <ol>
                    {/* displays the links to the different steps */}
                    <li onClick={() => handleProcessing('false')}>Step 1 - Adding Observations</li>
                    <li>Step 2 - Grouping Observations</li>
                    <li onClick={() => handleProcessing('true')}>Step 3 - Adding Information</li>
                </ol>
            </div>

            {/* Center Section Container with Image View*/}
            <div className="center-section">

                {/* display the heading for this form */}
                <h2>Group Images</h2>

                {/* sets a container for all the images */}
                <Container>
                    <Row>
                        {/* maps through the imageData and displays each image */}
                        {imageData.length > 0 ? (
                            imageData.map((data, index) => (
                                data.mainImage && (
                                    <Col md={4} key={index}>
                                        <div
                                            
                                            className={`img-card ${selectedImageIndex.includes(index) ? 'image-checked' : ''} ${data.extraImage ? 'grouped-img-card' : ''}`}
                                            onClick={() => handleImageClick(index)}
                                        >
                                            <Image src={data.mainImage} style={{ width: '300px', height: '300px' }} thumbnail />
                                        </div>
                                        {/* sets a size for each image. also adds specific styling if the image is a group or a selected image */}

                                    </Col>
                                )
                            ))
                        ) : (
                            <Col>
                                {/* displays a text if imageData has no images */}
                                <p>No images uploaded yet.</p>
                            </Col>
                        )}
                    </Row>
                </Container>
            </div>

            {/* Right Section Container with buttons*/}
            <div className="right-section">
                <h2>Functions:</h2>
                {/* Displays the different buttons and disables some if no image is selected */}
                <button onClick={handleDelete}>Delete selected image or group</button>
                <button onClick={handleViewGroup} disabled={selectedImageIndex.length !== 1}>View selected group</button>
                <button onClick={handleGroupImages}>Merge selected images</button>
                <button onClick={handleUngroupGroup} disabled={selectedImageIndex.length !== 1}>Ungroup selected group</button>
                <button onClick={() => handleProcessing('true')}>Submit and Continue</button>
                
            </div>

            {/* Display Modal Section */}
            <Modal
                show={viewGroupModalShow}
                onHide={() => setViewGroupModalShow(false)}
                size="lg"
                centered
            >
                {/* adds a close button to the modal */}
                <Modal.Header closeButton>

                    {/* adds a heading for the modal */}
                    <Modal.Title>View Group</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    {/* adds an image container to the modal */}
                    <Container>
                        <Row>
                            <Col md={6}>

                                {/* adds styling to the selected image */}
                                <div className={`img-card ${currentMainImageIndex === 0 ? 'image-checked' : ''}`}>
                                    
                                    {/* displays the mainImage value */}
                                    <Image
                                        src={imageData[selectedImageIndex[0]]?.mainImage}
                                        style={{ width: '300px', height: '300px', cursor: 'pointer' }}
                                        thumbnail
                                        onClick={() => setCurrentMainImageIndex(0)}
                                    />
                                </div>
                            </Col>

                            {/* checks if the main image has extra images */}
                            {imageData[selectedImageIndex[0]]?.extraImage?.map((extraImage, imageIndex) => (
                                <Col md={6} key={imageIndex}>

                                    {/* adds styling to the selected images */}
                                    <div className={`img-card ${currentMainImageIndex === imageIndex + 1 ? 'image-checked' : ''}`}>
                                        
                                        {/* displays each extra image */}
                                        <Image
                                            src={extraImage}
                                            style={{ width: '300px', height: '300px', cursor: 'pointer' }}
                                            thumbnail
                                            onClick={() => setCurrentMainImageIndex(imageIndex + 1)}
                                        />
                                    </div>
                                </Col>
                            ))}
                        </Row>
                        <Row>
                            <Col md={12}>

                                {/* adds different buttons to do specific functions */}
                                <Button variant="primary" onClick={handleMainImageChange}>
                                    Set as Main Image
                                </Button>
                                <Button variant="primary" onClick={handleSingleImageDelete}>
                                    Remove selected Image
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default UploadStep2;
