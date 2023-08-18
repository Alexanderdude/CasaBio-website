import React, { useState, useEffect } from 'react';
import './UploadStep2.css';
import { Link, useLocation } from 'react-router-dom';
import { Container, Row, Col, Image, Modal, Button } from 'react-bootstrap';

const UploadStep2 = () => {

    //state variables
    const location = useLocation();

    const [imageData, setImageData] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState([]);
    const [viewGroupModalShow, setViewGroupModalShow] = useState(false);
    const [currentMainImageIndex, setCurrentMainImageIndex] = useState(0);

    //handle the useEffect to recieve variable from previous Upload Step
    useEffect(() => {
        if (location.state && location.state.uploadedImages) {
            const initialImageData = location.state.uploadedImages.map(image => ({
                mainImage: URL.createObjectURL(image),
                extraImage: null, // Initialize extraImage to null for individual images
            }));
            setImageData(initialImageData);
        }
    }, [location.state]);

    //handle display group as modal
    const handleViewGroup = () => {
        const selectedGroupImages = selectedImageIndex.filter(index => imageData[index].extraImage);

        if (selectedGroupImages.length > 0) {
            setViewGroupModalShow(true);
        } else {
            alert('Please select a group image with extra images and try again.');
        }
    };

    //handle group main image thumbnail change
    const handleMainImageChange = () => {
        if (selectedImageIndex.length !== 1) {
            return;
        }

        const mainImageIndex = selectedImageIndex[0];

        if (currentMainImageIndex === 0) {
            return; // Do nothing if selected image index is the same as current main image index
        }

        // Deep copy the imageData object
        const newImageData = JSON.parse(JSON.stringify(imageData));

        const extraImageNew = newImageData[mainImageIndex]?.mainImage;
        const mainImageNew = newImageData[mainImageIndex]?.extraImage[currentMainImageIndex - 1];

        // Remove the previously switched image from extra images of the new main image
        if (extraImageNew) {
            newImageData[mainImageIndex].mainImage = mainImageNew;
        }

        // Update the extra images of the previously selected main image
        if (mainImageNew) {
            newImageData[mainImageIndex].extraImage[currentMainImageIndex - 1] = extraImageNew;
        }

        // Update the state with the modified object
        setImageData(newImageData);
        setViewGroupModalShow(false);
    };

    //handle multiple image selection
    const handleImageClick = (index) => {
        if (selectedImageIndex.includes(index)) {
            setSelectedImageIndex(selectedImageIndex.filter(i => i !== index));
        } else {
            setSelectedImageIndex([...selectedImageIndex, index]);
        }
    };
    
    //Function to group selected images
    const handleGroupImages = () => {
        if (selectedImageIndex.length < 2) {
          if (!window.confirm('Please select more than one image and try again.')) {
            return;
          }
        }
      
        const mainIndex = selectedImageIndex[0];
        const extraImages = selectedImageIndex.slice(1);
      
        const newImageData = [...imageData];
      
        if (extraImages.length > 0) {
          // Initialize extraImage property as an empty array
          newImageData[mainIndex].extraImage = newImageData[mainIndex].extraImage || [];
      
          extraImages.forEach(index => {
            const extraImage = newImageData[index].extraImage;
      
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
      
        setImageData(newImageData);
        setSelectedImageIndex([mainIndex]);
      };

    //Function to disband entire group selected
    const handleUngroupGroup = () => {
        if (imageData[selectedImageIndex[0]].extraImage === null || imageData[selectedImageIndex[0]].extraImage === '') {
            if (!window.confirm('Please select a group and try again.')) {
                return;
            }
        }

        const mainIndex = selectedImageIndex[0];
        const extraImages = imageData[mainIndex]?.extraImage || [];

        const newImageData = [...imageData];

        // Move the extra images back to main images
        extraImages.forEach((extraImage, index) => {
            for (let i = 0; i < newImageData.length; i++) {
                if (!newImageData[i].mainImage) {
                    newImageData[i].mainImage = extraImage;
                    newImageData[mainIndex].extraImage[index] = null;
                    break; // Exit the loop after finding the first empty mainImage
                }
            }
        });

        // Remove extra images array
        newImageData[mainIndex].extraImage = null;

        setImageData(newImageData);
        setSelectedImageIndex([mainIndex]);
    };

    //Function to delete an image from group
    const handleSingleImageDelete = () => {
        const mainIndex = selectedImageIndex[0];

        if (currentMainImageIndex === 0) {

            const newImageData = [...imageData];

            // Get the first extra image, if it exists
            const firstExtraImage = newImageData[mainIndex].extraImage[0];
            const newMainImage = newImageData[mainIndex].mainImage;

            // Update the main image with the first extra image
            newImageData[mainIndex].mainImage = firstExtraImage;
            newImageData[mainIndex].extraImage.splice(0, 1);

            // Create a new main image in the newImageData array
            newImageData.push({
                mainImage: newMainImage,
                extraImage: null
            });

            setImageData(newImageData);
            setCurrentMainImageIndex(newImageData.length - 1); // Set the currentMainImageIndex to the new main image

        } else {
            const newImageData = [...imageData];
            const newMainImage=newImageData[mainIndex].extraImage[currentMainImageIndex-1];

            for (let i = 0; i < newImageData.length; i++) {
                if (!newImageData[i].mainImage || newImageData[i].mainImage === '') {
                    newImageData[i].mainImage=newMainImage;
                    break;
                }
            }

            newImageData[mainIndex].extraImage.splice(currentMainImageIndex-1,1);
            setImageData(newImageData);
            setSelectedImageIndex([mainIndex]);
        }
    };

    return (
        <div className="upload-step-two-container">

            {/* Left Section Container upload steps*/}
            <div className="left-section">
                <h2>Upload Steps:</h2>
                <ol>
                    <li><Link to="/Upload">Step 1 - Adding Observations</Link></li>
                    <li><Link to="/UploadStep2">Step 2 - Grouping Observations</Link></li>
                    <li><Link to="/UploadStep3">Step 3 - Adding Information</Link></li>
                </ol>
            </div>

            {/* Center Section Container with Image View*/}
            <div className="center-section">
                <h2>Group Images</h2>
                <Container>
                    <Row>
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
                                    </Col>
                                )
                            ))
                        ) : (
                            <Col>
                                <p>No images uploaded yet.</p>
                            </Col>
                        )}
                    </Row>
                </Container>
            </div>

            {/* Right Section Container with buttons*/}
            <div className="right-section">
                <h2>Functions:</h2>
                <button onClick={handleViewGroup} disabled={selectedImageIndex.length !== 1}>View selected group</button>
                <button onClick={handleGroupImages}>Merge selected images</button>
                <button onClick={handleUngroupGroup} disabled={selectedImageIndex.length !== 1}>Ungroup selected group</button>
                <button>Submit and Continue</button>
            </div>

            {/* Display Modal Section */}
            <Modal
                show={viewGroupModalShow}
                onHide={() => setViewGroupModalShow(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>View Group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col md={6}>
                                <div className={`img-card ${currentMainImageIndex === 0 ? 'image-checked' : ''}`}>
                                    <Image
                                        src={imageData[selectedImageIndex[0]]?.mainImage}
                                        style={{ width: '300px', height: '300px', cursor: 'pointer' }}
                                        thumbnail
                                        onClick={() => setCurrentMainImageIndex(0)}
                                    />
                                </div>
                            </Col>
                            {imageData[selectedImageIndex[0]]?.extraImage?.map((extraImage, imageIndex) => (
                                <Col md={6} key={imageIndex}>
                                    <div className={`img-card ${currentMainImageIndex === imageIndex + 1 ? 'image-checked' : ''}`}>
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
