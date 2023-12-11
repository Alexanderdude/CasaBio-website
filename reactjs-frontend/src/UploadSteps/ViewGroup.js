import React, { useState } from "react";
import { Container, Row, Col, Image, Modal } from 'react-bootstrap';

const ViewGroup = ({selectedImageIndex, imageData, setImageData, setViewGroupModalShow, setSelectedImageIndex, viewGroupModalShow }) => {

    const [currentMainImageIndex, setCurrentMainImageIndex] = useState(0);

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

            newImageData.push({
                mainImage: newMainImage,
                extraImage: null
            });

            //removes the selected image from the original group[]
            newImageData[mainIndex].extraImage.splice(currentMainImageIndex - 1, 1);

            //sets the new Array as imageData
            setImageData(newImageData);
            setSelectedImageIndex([mainIndex]);
        }
    };

    return (
        <div>
            {/* Display Modal Section */}
            <Modal
                show={viewGroupModalShow}
                onHide={() => setViewGroupModalShow(false)}
                className='modal-style'
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
                                <button style={{
                                    backgroundColor: '#919312',
                                    color: '#ffffff',
                                    borderRadius: '10px',
                                    padding: '10px 20px',
                                }} onClick={handleMainImageChange}>
                                    Set as Main Image
                                </button>
                                <button onClick={handleSingleImageDelete} style={{
                                    backgroundColor: '#919312',
                                    color: '#ffffff',
                                    borderRadius: '10px',
                                    padding: '10px 20px',
                                }}>
                                    Remove selected Image
                                </button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ViewGroup