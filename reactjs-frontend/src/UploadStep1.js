//import the different libraries and modules
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UploadStep1.css';
import { Container, Row, Col, Image, Modal, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';


//define the UploadStep1 
const UploadStep1 = () => {

  //state the different variables
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();


  // Function to handle the dropped files
  const handleDrop = (e) => {
    e.preventDefault(); // Prevent the default behavior of opening the file
    const files = e.dataTransfer.files; // Get the dropped files
    const imageArray = []; // Initialize an array to store image files

    // Loop through the dropped files
    for (let i = 0; i < files.length; i++) {
      const file = files[i]; // Get the current file

      // Check if the file is of type image
      if (file.type.startsWith('image/')) {
        imageArray.push(file); // Add image files to the array
      }
    }

    // Update the state with the newly uploaded image files
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

  // Function to handle the file input change
  const handleFileInputChange = (e) => {
    const files = e.target.files; // Get the selected files from the input
    const imageArray = []; // Initialize an array to store image files

    // Loop through the selected files
    for (let i = 0; i < files.length; i++) {
      const file = files[i]; // Get the current file

      // Check if the file is of type image
      if (file.type.startsWith('image/')) {
        imageArray.push(file); // Add image files to the array
      }
    }

    // Update the state with the newly uploaded image files
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

  // Function to handle image deletion
  const handleDelete = () => {
    if (selectedImageIndex !== null) {
      // Create a new array by copying the uploadedImages array
      const newArray = [...uploadedImages];

      // Remove the image at the selectedImageIndex from the new array
      newArray.splice(selectedImageIndex, 1);

      // Update the state with the new array, effectively removing the selected image
      setUploadedImages(newArray);

      // Reset the selectedImageIndex after successful deletion
      setSelectedImageIndex(null);
    } else {
      console.error('selectedImageIndex is null.');
    }
  };


  // Function to handle rotating the selected image to the right
  const handleRotateRight = () => {
    // Check if an image is selected
    if (selectedImageIndex !== null) {
      // Create a copy of the uploaded images array
      const newArray = [...uploadedImages];
      // Get the selected image from the copied array
      const rSelectedImage = newArray[selectedImageIndex];

      // Create an img element and load the selected image
      const imgElement = document.createElement("img");
      imgElement.src = URL.createObjectURL(rSelectedImage);

      // Create a canvas object
      const canvas = document.createElement("canvas");

      // Wait till the image is loaded
      imgElement.onload = function () {
        // Call the rotateImage function
        rotateImage();
        // Call the saveImage function with the original image name
        saveImage(rSelectedImage.name);
      };

      // Rotate the image and draw it on the canvas
      const rotateImage = () => {
        // Create canvas context
        const ctx = canvas.getContext("2d");
        // Set canvas dimensions
        canvas.width = imgElement.height;
        canvas.height = imgElement.width;
        // Translate context to rotate around center
        ctx.translate(canvas.width / 2, canvas.height / 2);
        // Rotate the image by 90 degrees (PI/2 radians)
        ctx.rotate(Math.PI / 2);
        // Draw the rotated image on the canvas
        ctx.drawImage(imgElement, -imgElement.width / 2, -imgElement.height / 2);
      };

      // Save the rotated image
      const saveImage = (img_name) => {
        // Convert canvas to a Blob
        canvas.toBlob((blob) => {
          // Create a new File object with the rotated Blob
          const updatedImage = new File([blob], img_name, {
            type: "image/jpg",
          });
          // Replace the selected image in the copied array
          newArray[selectedImageIndex] = updatedImage;
          // Update the uploadedImages state with the new array
          setUploadedImages(newArray);
        }, "image/jpg");
      };

      // Reset selectedImageIndex after the rotation
      setSelectedImageIndex(null);
    } else {
      console.error('selectedImageIndex is null.');
    }
  };

  // Function to handle flipping the selected image horizontally
  const handleFlip = () => {
    // Check if an image is selected
    if (selectedImageIndex !== null) {
      // Create a copy of the uploaded images array
      const newArray = [...uploadedImages];
      // Get the selected image from the copied array
      const selectedImage = newArray[selectedImageIndex];

      // Create an img element and load the selected image
      const imgElement = document.createElement("img");
      imgElement.src = URL.createObjectURL(selectedImage);

      // Create a canvas object
      const canvas = document.createElement("canvas");

      // Wait till the image is loaded
      imgElement.onload = function () {
        // Call the flipImage function
        flipImage();
        // Call the saveImage function with the original image name
        saveImage(selectedImage.name);
      };

      // Flip the image and draw it on the canvas
      const flipImage = () => {
        // Create canvas context
        const ctx = canvas.getContext("2d");
        // Set canvas dimensions
        canvas.width = imgElement.width;
        canvas.height = imgElement.height;
        // Translate and scale context to flip horizontally
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        // Draw the flipped image on the canvas
        ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
      };

      // Save the flipped image
      const saveImage = (img_name) => {
        // Convert canvas to a Blob
        canvas.toBlob((blob) => {
          // Create a new File object with the flipped Blob
          const flippedImage = new File([blob], img_name, {
            type: selectedImage.type,
            lastModified: selectedImage.lastModified,
          });
          // Replace the selected image in the copied array
          newArray[selectedImageIndex] = flippedImage;
          // Update the uploadedImages state with the new array
          setUploadedImages(newArray);
        }, selectedImage.type);
      };

      // Reset selectedImageIndex after the flip
      setSelectedImageIndex(null);
    } else {
      console.error('selectedImageIndex is null.');
    }
  };


  // Function to handle rotating the selected image to the left
  const handleRotateLeft = () => {
    // Check if an image is selected
    if (selectedImageIndex !== null) {
      // Create a copy of the uploaded images array
      const newArray = [...uploadedImages];
      // Get the selected image from the copied array
      const rSelectedImage = newArray[selectedImageIndex];

      // Create an img element and load the selected image
      const imgElement = document.createElement("img");
      imgElement.src = URL.createObjectURL(rSelectedImage);

      // Create a canvas object
      const canvas = document.createElement("canvas");

      // Wait till the image is loaded
      imgElement.onload = function () {
        // Call the rotateImage function
        rotateImage();
        // Call the saveImage function with the original image name
        saveImage(rSelectedImage.name);
      };

      // Rotate the image and draw it on the canvas
      const rotateImage = () => {
        // Create canvas context
        const ctx = canvas.getContext("2d");
        // Set canvas dimensions (swap width and height for rotation)
        canvas.width = imgElement.height;
        canvas.height = imgElement.width;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        // Rotate the image and draw it on the canvas
        ctx.rotate(-Math.PI / 2);
        ctx.drawImage(imgElement, -imgElement.width / 2, -imgElement.height / 2);
      };

      // Save the rotated image
      const saveImage = (img_name) => {
        // Convert canvas to a Blob
        canvas.toBlob((blob) => {
          // Create a new File object with the rotated Blob
          const updatedImage = new File([blob], img_name, {
            type: "image/jpg", // Change the MIME type if needed
          });
          // Replace the selected image in the copied array
          newArray[selectedImageIndex] = updatedImage;
          // Update the uploadedImages state with the new array
          setUploadedImages(newArray);
        }, "image/jpg"); // Adjust the MIME type as needed
      };

      // Reset selectedImageIndex after the rotation
      setSelectedImageIndex(null);
    } else {
      console.error('selectedImageIndex is null.');
    }
  };

//sets the handleSubmit function
  const handleSubmit = () => {
    //navigates to the next form and saves the uploadedImage array for use on UploadStep2
    navigate('/UploadStep2', { state: { uploadedImages: uploadedImages } });
  
  };


  return (
    <div className="upload-step-one-container">

      {/* Left Section Container Display Upload Steps*/}
      <div className="left-section">
        <h2>Upload Steps:</h2>
        {/* Displays the links to the different upload steps*/}
        <ol>
          <li><Link to="/Upload">Step 1 - Adding Observations</Link> </li>
          {/* Displays a clickable link to step 1*/}

          <li><Link to="/UploadStep2">Step 2 - Grouping Observations</Link></li>
          {/* Displays a clickable link to step 2*/}

          <li><Link to="/UploadStep3">Step 3 - Adding Information</Link></li>
          {/* Displays a clickable link to step 3*/}

        </ol>
      </div>

      
      <div className="center-section"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        style={{ width: '100%', border: '1px dashed #ccc' }}
      > {/* Center Section Container to display images and handle all the drag and drop events */}

        <h2>Upload Images or Short Videos</h2>
        {/* Heading for this container */}

        <input type="file" multiple onChange={handleFileInputChange} />
        {/* Adds an input button that allow the user to click and add image files */}

        <Container>
        {/* Uses Custom Bootstrap container to display images */}
          
          <Row>

            {/* Maps out the array of images to display them in this container */}
            {uploadedImages.map((data, index) => (

              <Col md={4} key={index} >
              {/* Sets a max of 4 images for each row */}

                <div className={`img-card ${selectedImageIndex === index ? 'image-checked' : ''}`}
                  onClick={() => { handleImageClick(index); handleClick(data) }}>
                {/* Adds img-card styling to each image and image-checked styling to the image that was selected */}

                  <Image src={URL.createObjectURL(data)} style={{ width: '300px', height: '300px' }} thumbnail />
                  {/* Displays each image to the correct size */}

                </div>
              </Col>
            )
            )}
          </Row>
        </Container>

        {/* Display Modal with multiple functions */}
        <Modal show={showModal !== false} onHide={handleCloseModal} centered>
          
          <Modal.Header closeButton>
          {/* Adds a closeButton to modal */}

            <Modal.Title>Full View</Modal.Title>
            {/* Adds a title to the Modal */}

          </Modal.Header>
          <Modal.Body>
            {selectedImage && (
              <Image src={URL.createObjectURL(selectedImage)} style={{ width: '100%', height: '100%' }} />
            )}
            {/* Displays the selected image at full size */}

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            {/* adds a secondary close button to this modal */}
          </Modal.Footer>
        </Modal>

      </div>

      {/* Right Section Container with Buttons*/}
      <div className="right-section">
        <h2>Functions</h2>
        {/* Heading for this section */}

        <button onClick={() => setShowModal(true)} disabled={selectedImageIndex === null}>View</button>
        {/* Displays the selected image by dislpaying the modal */}

        <button onClick={handleRotateLeft} disabled={selectedImageIndex === null}>Rotate Left</button>
        {/* Handles the rotate left function when the button is clicked */}

        <button onClick={handleRotateRight} disabled={selectedImageIndex === null}>Rotate Right</button>
        {/* Handles the rotate right function when the button is clicked */}

        <button onClick={handleFlip} disabled={selectedImageIndex === null}>Flip selected image</button>
        {/* Handles the flip function when the button is clicked */}

        <button onClick={(handleDelete)} disabled={selectedImageIndex === null}>Delete selected image</button>
        {/* Handles the delete function when the button is clicked */}

        <span>Selected image location:</span>
        <span id="folderlocation">
          {selectedImageIndex !== null && uploadedImages[selectedImageIndex] && uploadedImages[selectedImageIndex].name}
        </span>
        {/* Displays the selected image URL for ease of use */}

        <button onClick={handleSubmit} disabled={uploadedImages && uploadedImages.length === 0}>Submit and Continue</button>
        {/* Handles the submit function when the button is clicked */}

      </div>
    </div>

  );
};

export default UploadStep1;
