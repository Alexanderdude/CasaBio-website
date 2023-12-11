import React, { useState} from "react";
import { Modal } from 'react-bootstrap';

const ImageView = ({showModal, setShowModal, selectedImage}) => {

    // Define a state variable to control the zoom level
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragStartY, setDragStartY] = useState(0);
    const [imagePositionX, setImagePositionX] = useState(0);
    const [imagePositionY, setImagePositionY] = useState(0);

    //close modal function
    const handleCloseModal = () => {
        setShowModal(false);
    };

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

    return (
        <div>
            {/* Display Modal with multiple functions */}
            <Modal show={showModal !== false} onHide={() => {
                handleCloseModal();
                resetImagePosition(); // Reset image position when the modal is closed
            }}
                centered
                className='modal-style'
                size='lg'>
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
                                src={selectedImage?.imageURL || selectedImage}
                                style={{
                                    width: `${zoomLevel * 100}%`,
                                    transform: `translate(${imagePositionX}px, ${imagePositionY}px)`,
                                }}
                                alt="Full View"
                                draggable="false"
                            />
                        </div>
                    )}
                    <p>{selectedImage?.attribution || ''}</p>
                </Modal.Body>
                <Modal.Footer>
                    <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex' }}>
                            <button style={{
                                backgroundColor: '#919312',
                                color: '#ffffff',
                                borderRadius: '10px',
                                padding: '10px 20px',
                            }} onClick={handleZoomIn}>
                                Zoom In
                            </button>

                            <button style={{
                                backgroundColor: '#919312',
                                color: '#ffffff',
                                borderRadius: '10px',
                                padding: '10px 20px',
                            }} onClick={handleZoomOut}>
                                Zoom Out
                            </button>
                        </div>
                    </div>
                    <button variant="secondary" onClick={() => {
                        handleCloseModal(); // Close the modal when the user clicks this button
                        resetImagePosition();
                    }}
                        style={{
                            backgroundColor: '#919312',
                            color: '#ffffff',
                            borderRadius: '10px',
                            padding: '10px 20px',
                            marginTop: '10px' // Adds some space between Zoom buttons and Close button
                        }}>
                        Close
                    </button>
                </Modal.Footer>
            </Modal>
        </div>

    );
};

export default ImageView;