import React, { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './UploadStep1.css';
import { Container, Row, Col, Image, Modal, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';



const UploadStep1 = () => {

//state the different variables
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  //handle the drop image function
  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    const imageArray = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        imageArray.push(file);
      }
    }

    setUploadedImages((prevImages) => [...prevImages, ...imageArray]);
  };

  //hande the drag events
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
  };

  //function to handle file input change
  const handleFileInputChange = (e) => {
    const files = e.target.files;
    const imageArray = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        imageArray.push(file);
      }
    }

    setUploadedImages((prevImages) => [...prevImages, ...imageArray]);
  };

  //function to handle selected image
  const handleClick = (image) => {
    setSelectedImage(image);
  };

  //function to handle image click and change
  const handleImageClick = (index) => {
    if (selectedImageIndex === index) {
      setSelectedImageIndex(null); // Deselect the image if it's already selected
    } else {
      setSelectedImageIndex(index); // Select the image if it's not selected
    }
  };

  //close modal function
  const handleCloseModal = () => {
    setShowModal(false);
  };

  //function to handle image delete
  const handleDelete = () => {
    if (selectedImageIndex !== null) {
      const newArray = [...uploadedImages];
      newArray.splice(selectedImageIndex, 1);
      setUploadedImages(newArray);
      setSelectedImageIndex(null); // Reset selectedImageIndex after deletion
    } else {
      console.error('selectedImageIndex is null.');
    }
  };

  //function to handle the different rotates and flip images.
  const handleRotateRight = () => {
    if (selectedImageIndex !== null) {
      const newArray = [...uploadedImages];
      const rSelectedImage = newArray[selectedImageIndex];

      const imgElement = document.createElement("img");
      imgElement.src = URL.createObjectURL(rSelectedImage);

      // Create a canvas object.
      const canvas = document.createElement("canvas");

      // Wait till the image is loaded.
      imgElement.onload = function () {
        rotateImage();
        saveImage(rSelectedImage.name);
      };

      const rotateImage = () => {
        // Create canvas context.
        const ctx = canvas.getContext("2d");

        // Assign width and height.
        canvas.width = imgElement.height; // Swap width and height for rotation
        canvas.height = imgElement.width;

        ctx.translate(canvas.width / 2, canvas.height / 2);

        // Rotate the image and draw it on the canvas.
        ctx.rotate(Math.PI / 2);
        ctx.drawImage(imgElement, -imgElement.width / 2, -imgElement.height / 2);
      };

      const saveImage = (img_name) => {
        canvas.toBlob((blob) => {
          const updatedImage = new File([blob], img_name, {
            type: "image/jpg", // Change the MIME type if needed
          });

          newArray[selectedImageIndex] = updatedImage;
          setUploadedImages(newArray);
        }, "image/jpg"); // Adjust the MIME type as needed
      };
      setSelectedImageIndex(null);
    } else {
      console.error('selectedImageIndex is null.');
    }
  };

  const handleFlip = () => {
    if (selectedImageIndex !== null) {
      const newArray = [...uploadedImages];
      const selectedImage = newArray[selectedImageIndex];

      const imgElement = document.createElement("img");
      imgElement.src = URL.createObjectURL(selectedImage);

      // Create a canvas object.
      const canvas = document.createElement("canvas");

      // Wait till the image is loaded.
      imgElement.onload = function () {
        flipImage();
        saveImage(selectedImage.name);
      };

      const flipImage = () => {
        // Create canvas context.
        const ctx = canvas.getContext("2d");

        // Assign width and height.
        canvas.width = imgElement.width;
        canvas.height = imgElement.height;

        // Flip the image horizontally and draw it on the canvas.
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
      };

      const saveImage = (img_name) => {
        canvas.toBlob((blob) => {
          const flippedImage = new File([blob], img_name, {
            type: selectedImage.type,
            lastModified: selectedImage.lastModified,
          });

          newArray[selectedImageIndex] = flippedImage;
          setUploadedImages(newArray);
        }, selectedImage.type); // Use the original image type
      };
      setSelectedImageIndex(null);
    } else {
      console.error('selectedImageIndex is null.');
    }
  };

  const handleRotateLeft = () => {
    if (selectedImageIndex !== null) {
      const newArray = [...uploadedImages];
      const rSelectedImage = newArray[selectedImageIndex];

      const imgElement = document.createElement("img");
      imgElement.src = URL.createObjectURL(rSelectedImage);

      // Create a canvas object.
      const canvas = document.createElement("canvas");

      // Wait till the image is loaded.
      imgElement.onload = function () {
        rotateImage();
        saveImage(rSelectedImage.name);
      };

      const rotateImage = () => {
        // Create canvas context.
        const ctx = canvas.getContext("2d");

        // Assign width and height.
        canvas.width = imgElement.height; // Swap width and height for rotation
        canvas.height = imgElement.width;

        ctx.translate(canvas.width / 2, canvas.height / 2);

        // Rotate the image and draw it on the canvas.
        ctx.rotate(-Math.PI / 2);
        ctx.drawImage(imgElement, -imgElement.width / 2, -imgElement.height / 2);
      };

      const saveImage = (img_name) => {
        canvas.toBlob((blob) => {
          const updatedImage = new File([blob], img_name, {
            type: "image/jpg", // Change the MIME type if needed
          });

          newArray[selectedImageIndex] = updatedImage;
          setUploadedImages(newArray);
        }, "image/jpg"); // Adjust the MIME type as needed
      };
      setSelectedImageIndex(null);
    } else {
      console.error('selectedImageIndex is null.');
    }
  };

  const handleSubmit = () => {
    
    navigate('/UploadStep2', { state: { uploadedImages: uploadedImages } });
    window.location.href = '/UploadStep2';
  };


  return (
    <div className="upload-step-one-container">
      {/* Left Section Container Display Upload Steps*/}
      <div className="left-section">
        <h2>Upload Steps:</h2>
        <ol>
          <li><Link to="/Upload">Step 1 - Adding Observations</Link> </li>
          <li><Link to="/UploadStep2">Step 2 - Grouping Observations</Link></li>
          <li><Link to="/UploadStep3">Step 3 - Adding Information</Link></li>
        </ol>
      </div>
      {/* Center Section Container display Images */}
      <div className="center-section"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        style={{ width: '100%', border: '1px dashed #ccc' }}
      >
        <h2>Upload Images or Short Videos</h2>
        <input type="file" multiple onChange={handleFileInputChange} />
        <Container>
          <Row>
            {uploadedImages.map((data, index) => (
              <Col md={4} key={index} >
                <div className={`img-card ${selectedImageIndex === index ? 'image-checked' : ''}`}
                  onClick={() => { handleImageClick(index); handleClick(data) }}>
                  <Image src={URL.createObjectURL(data)} style={{ width: '300px', height: '300px' }} thumbnail />
                </div>
              </Col>
            )
            )}
          </Row>
        </Container>
        {/* Display Modal */}
        <Modal show={showModal !== false} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Full View</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedImage && (
              <Image src={URL.createObjectURL(selectedImage)} style={{ width: '100%', height: '100%' }} />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

      </div>

      {/* Right Section Container with Buttons*/}
      <div className="right-section">
        <h2>Functions</h2>
        <button onClick={() => setShowModal(true)} disabled={selectedImageIndex === null}>View</button>
        <button onClick={handleRotateLeft} disabled={selectedImageIndex === null}>Rotate Left</button>
        <button onClick={handleRotateRight} disabled={selectedImageIndex === null}>Rotate Right</button>
        <button onClick={handleFlip} disabled={selectedImageIndex === null}>Flip selected image</button>
        <button onClick={(handleDelete)} disabled={selectedImageIndex === null}>Delete selected image</button>
        <span>Selected image location:</span>
        <span id="folderlocation">
          {selectedImageIndex !== null && uploadedImages[selectedImageIndex] && uploadedImages[selectedImageIndex].name}
        </span>
        <button onClick={handleSubmit} disabled={uploadedImages && uploadedImages.length === 0}>Submit and Continue</button>
      </div>
    </div>

  );
};

export default UploadStep1;
