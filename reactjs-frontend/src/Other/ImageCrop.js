import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Modal } from 'react-bootstrap';

const ImageCrop = ({ selectedImage, singleSelectedImageIndex, setUploadedImages, showModal, setShowModal }) => {

    const [crop, setCrop] = useState();
    const imgRef = useRef(null);
    const [isCropping, setIsCropping] = useState(false);

    //close modal function
    const handleCloseModal = () => {
        setShowModal(false);
        setCrop();
        setIsCropping(false);
    };

    const getCroppedImg = async (imageSrc, crop) => {
        try {
            const image = document.createElement('img');
            image.src = imageSrc;

            const scale = image.naturalHeight / imgRef.current.clientHeight;

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Set canvas size to the cropped area
            canvas.width = crop.width;
            canvas.height = crop.height

            // Draw the cropped image
            ctx.drawImage(
                image,
                crop.x * scale,
                crop.y * scale,
                crop.width * scale,
                crop.height * scale,
                0,
                0,
                crop.width,
                crop.height
            );

            // Convert the canvas to a Blob
            const blob = await new Promise((resolve) =>
                canvas.toBlob(resolve, 'image/png', 1.0)
            );

            return blob;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    const handleSaveCroppedImage = async () => {
        try {

            // Save the cropped image
            const blob = await getCroppedImg(selectedImage, crop);

            const croppedImageUrl = URL.createObjectURL(blob);

            // Update the mainImage property of the selected image in the uploadedImages array
            if (singleSelectedImageIndex !== null && singleSelectedImageIndex >= 0) {
                setUploadedImages((prevImages) => {
                    const newImages = [...prevImages];
                    newImages[singleSelectedImageIndex].mainImage = croppedImageUrl;
                    return newImages;
                });
            }

            // Close the modal
            handleCloseModal();
        } catch (error) {
            console.error('Error cropping image:', error);
        }
    };

    return (
        <div>
            {/* Display Modal with multiple functions */}
            <Modal show={showModal !== false} onHide={() => {
                handleCloseModal();
            }} centered className='modal-style'
                size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Full View</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedImage && !isCropping && (
                        <div
                            style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {/* Display the image without cropping */}
                            <img
                                src={selectedImage}
                                alt="text"
                                style={{ maxWidth: '100%', maxHeight: '100%' }}
                                ref={imgRef}
                            />
                        </div>
                    )}

                    {selectedImage && isCropping && (
                        <div
                            style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {/* Display the ReactCrop component for cropping */}
                            <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
                                <img
                                    src={selectedImage}
                                    alt="text"
                                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                                    ref={imgRef}
                                />
                            </ReactCrop>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <button
                        onClick={() => {
                            // Toggle between crop mode and regular view mode
                            setIsCropping(!isCropping);
                        }}
                        style={{
                            backgroundColor: '#919312',
                            color: '#ffffff',
                            borderRadius: '10px',
                            padding: '10px 20px',
                            marginTop: '10px',
                        }}
                    >
                        {isCropping ? 'Cancel Crop' : 'Start Crop'}
                    </button>

                    {isCropping && (
                        <button
                            onClick={handleSaveCroppedImage}
                            style={{
                                backgroundColor: '#919312',
                                color: '#ffffff',
                                borderRadius: '10px',
                                padding: '10px 20px',
                                marginTop: '10px',
                            }}
                        >
                            Save Cropped Image
                        </button>
                    )}

                    <button
                        onClick={() => {
                            // Close the modal when the user clicks this button
                            handleCloseModal();
                        }}
                        style={{
                            backgroundColor: '#919312',
                            color: '#ffffff',
                            borderRadius: '10px',
                            padding: '10px 20px',
                            marginTop: '10px',
                        }}
                    >
                        Close
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ImageCrop;