//import the different libraries and modules
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UploadStep1.css';
import { Container, Row, Col, Image, Modal, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Exif from 'exif-js';



//define the UploadStep1 
const UploadStep1 = () => {

  //state the different variables
  const location = useLocation();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();



  useEffect(() => {
    if (location.state && location.state.singleImageData) {
      setUploadedImages(location.state.singleImageData);
    }
  }, [location.state]);

  // Function to handle the dropped files
  const handleDrop = async (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    const imageArray = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);

        // Wrap the Exif.getData function in a Promise
        const exifData = await new Promise((resolve) => {
          Exif.getData(file, function () {
            const data = Exif.getAllTags(this);
            resolve(data);
          });
        });

        imageArray.push({
          mainImage: imageUrl,
          extraImage: null,
          filename: file.name,
          exifData: exifData,
        });
      }
    }

    // Concatenate the new images with the existing images, and then sort them by filename
    setUploadedImages((prevImages) => {
      const combinedImages = [...prevImages, ...imageArray];
      return combinedImages.sort((a, b) => {
        const filenameA = (a.filename || '').toLowerCase(); // Handle undefined or null filenames
        const filenameB = (b.filename || '').toLowerCase(); // Handle undefined or null filenames
        return filenameA.localeCompare(filenameB);
      });
    });
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
  const handleFileInputChange = async (e) => {
    const files = e.target.files;
    const imageArray = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);

        // Wrap the Exif.getData function in a Promise
        const exifData = await new Promise((resolve) => {
          Exif.getData(file, function () {
            const data = Exif.getAllTags(this);
            resolve(data);
          });
        });

        imageArray.push({
          mainImage: imageUrl,
          extraImage: null,
          filename: file.name,
          exifData: exifData,
        });
      }
    }

    setUploadedImages((prevImages) => {
      const combinedImages = [...prevImages, ...imageArray];
      return combinedImages.sort((a, b) => {
        const filenameA = (a.filename || '').toLowerCase(); // Handle undefined or null filenames
        const filenameB = (b.filename || '').toLowerCase(); // Handle undefined or null filenames
        return filenameA.localeCompare(filenameB);
      });
    });
  };



  //function to handle selected image for fullview
  const handleClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  //function to handle image click and change
  const handleImageClick = (index) => {
    if (selectedImageIndex.includes(index)) {
      setSelectedImageIndex(selectedImageIndex.filter((i) => i !== index)); // Deselect the image if it's already selected
    } else {
      setSelectedImageIndex([...selectedImageIndex, index]); // Select the image if it's not selected
    }
  };

  //close modal function
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDelete = () => {
    if (selectedImageIndex !== null) {
      const confirmDeletion = window.confirm("Are you sure you want to delete the selected items?");

      if (confirmDeletion) {
        // Create a new array by copying the uploadedImages array
        const newArray = [...uploadedImages];

        // Sort selectedImageIndex in descending order
        const sortedIndices = [...selectedImageIndex].sort((a, b) => b - a);

        sortedIndices.forEach(index => {
          if (index >= 0 && index < newArray.length) {
            newArray.splice(index, 1);
          }
        });

        // Update the state with the new array, effectively removing the selected images
        setUploadedImages(newArray);

        // Reset the selectedImageIndex after successful deletion
        setSelectedImageIndex([]);
      }
    } else {
      console.error('selectedImageIndex is null.');
    }
  };



  // Function to handle rotating the selected image to the right
  const handleRotateRight = () => {
    if (selectedImageIndex !== null) {
      // Create a copy of the uploaded images array
      const newArray = [...uploadedImages];

      selectedImageIndex.forEach(index => {
        if (index >= 0 && index < newArray.length) {
          // Get the selected image from the copied array
          const rSelectedImage = newArray[index].mainImage;

          // Create an img element and load the selected image
          const imgElement = document.createElement("img");
          imgElement.src = rSelectedImage;

          // Create a canvas object
          const canvas = document.createElement("canvas");

          // Wait until the image is loaded
          imgElement.onload = function () {
            // Call the rotateImage function
            rotateImage();
            // Call the saveImage function with the original image name
            saveImage(rSelectedImage.name, index);
          };

          // Rotate the image and draw it on the canvas
          const rotateImage = () => {
            // Create canvas context
            const ctx = canvas.getContext("2d");
            // Set canvas dimensions
            canvas.width = imgElement.height;
            canvas.height = imgElement.width;
            // Translate context to rotate around the center
            ctx.translate(canvas.width / 2, canvas.height / 2);
            // Rotate the image by 90 degrees (PI/2 radians)
            ctx.rotate(Math.PI / 2);
            // Draw the rotated image on the canvas
            ctx.drawImage(imgElement, -imgElement.width / 2, -imgElement.height / 2);
          };

          // Save the rotated image
          const saveImage = (img_name, imgIndex) => {
            // Convert canvas to a Blob
            canvas.toBlob((blob) => {
              // Create a new File object with the rotated Blob
              const updatedImage = new File([blob], img_name, {
                type: "image/png",
              });
              // Replace the selected image in the copied array
              newArray[imgIndex].mainImage = URL.createObjectURL(updatedImage);
              // Update the uploadedImages state with the new array
              setUploadedImages(newArray);
            }, "image/png");
          };
        }
      });

      // Reset selectedImageIndex after the rotation
      setSelectedImageIndex([]);
    } else {
      console.error('selectedImageIndex is null.');
    }
  };

  // Function to handle flipping the selected image horizontally
  const handleFlip = () => {
    if (selectedImageIndex !== null) {
      // Create a copy of the uploaded images array
      const newArray = [...uploadedImages];

      selectedImageIndex.forEach(index => {
        if (index >= 0 && index < newArray.length) {
          // Get the selected image from the copied array
          const rSelectedImage = newArray[index].mainImage;

          // Create an img element and load the selected image
          const imgElement = document.createElement("img");
          imgElement.src = rSelectedImage;

          // Create a canvas object
          const canvas = document.createElement("canvas");

          // Wait until the image is loaded
          imgElement.onload = function () {
            // Call the rotateImage function
            flipImage();
            // Call the saveImage function with the original image name
            saveImage(rSelectedImage.name, index);
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

          // Save the rotated image
          const saveImage = (img_name, imgIndex) => {
            // Convert canvas to a Blob
            canvas.toBlob((blob) => {
              // Create a new File object with the rotated Blob
              const updatedImage = new File([blob], img_name, {
                type: "image/png",
              });
              // Replace the selected image in the copied array
              newArray[imgIndex].mainImage = URL.createObjectURL(updatedImage);
              // Update the uploadedImages state with the new array
              setUploadedImages(newArray);
            }, "image/png");
          };
        }
      });

      // Reset selectedImageIndex after the rotation
      setSelectedImageIndex([]);
    } else {
      console.error('selectedImageIndex is null.');
    }
  };


  // Function to handle rotating the selected image to the left
  const handleRotateLeft = () => {
    if (selectedImageIndex !== null) {
      // Create a copy of the uploaded images array
      const newArray = [...uploadedImages];

      selectedImageIndex.forEach(index => {
        if (index >= 0 && index < newArray.length) {
          // Get the selected image from the copied array
          const rSelectedImage = newArray[index].mainImage;

          // Create an img element and load the selected image
          const imgElement = document.createElement("img");
          imgElement.src = rSelectedImage;

          // Create a canvas object
          const canvas = document.createElement("canvas");

          // Wait until the image is loaded
          imgElement.onload = function () {
            // Call the rotateImage function
            rotateImage();
            // Call the saveImage function with the original image name
            saveImage(rSelectedImage.name, index);
          };

          // Rotate the image and draw it on the canvas
          const rotateImage = () => {
            // Create canvas context
            const ctx = canvas.getContext("2d");
            // Set canvas dimensions
            canvas.width = imgElement.height;
            canvas.height = imgElement.width;
            // Translate context to rotate around the center
            ctx.translate(canvas.width / 2, canvas.height / 2);
            // Rotate the image by 90 degrees (PI/2 radians)
            ctx.rotate(-Math.PI / 2);
            // Draw the rotated image on the canvas
            ctx.drawImage(imgElement, -imgElement.width / 2, -imgElement.height / 2);
          };

          // Save the rotated image
          const saveImage = (img_name, imgIndex) => {
            // Convert canvas to a Blob
            canvas.toBlob((blob) => {
              // Create a new File object with the rotated Blob
              const updatedImage = new File([blob], img_name, {
                type: "image/png",
              });
              // Replace the selected image in the copied array
              newArray[imgIndex].mainImage = URL.createObjectURL(updatedImage);
              // Update the uploadedImages state with the new array
              setUploadedImages(newArray);
            }, "image/png");
          };
        }
      });

      // Reset selectedImageIndex after the rotation
      setSelectedImageIndex([]);
    } else {
      console.error('selectedImageIndex is null.');
    }
  };

  //sets the handleSubmit function
  const handleSubmit = () => {
    //navigates to the next form and saves the uploadedImage array for use on UploadStep2
    navigate('/UploadStep2', { state: { uploadedImages: uploadedImages } });

  };

  // Define a state variable to control the zoom level
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [imagePositionX, setImagePositionX] = useState(0);
  const [imagePositionY, setImagePositionY] = useState(0);


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
    <div className="upload-step-one-container">

      {/* Left Section Container Display Upload Steps*/}
      <div className="left-section">
        <h2>Upload Steps:</h2>
        {/* Displays the links to the different upload steps*/}
        <ol>
          <li><Link to="/Upload">Step 1 - Adding Observations</Link> </li>
          {/* Displays a clickable link to step 1*/}

          <li onClick={handleSubmit}>Step 2 - Grouping Observations</li>
          {/* Displays a clickable link to step 2*/}

        </ol>
      </div>


      <div className="center-section"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        style={{ width: '100%', border: '1px dashed #ccc' }}
      > {/* Center Section Container to display images and handle all the drag and drop events */}

        <h2>Upload Images</h2>
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

                <div className={`img-card ${selectedImageIndex.includes(index) ? 'image-checked' : ''}`}
                  onClick={() => { handleImageClick(index); }}>
                  {/* Adds img-card styling to each image and image-checked styling to the image that was selected */}

                  <Image src={data.mainImage} style={{ width: '300px', height: '300px' }} thumbnail />
                  {/* Displays each image to the correct size */}

                  <div className="image-tag" onClick={(e) => { e.stopPropagation(); handleClick(data.mainImage) }}>
                    Fullscreen
                  </div>

                </div>
              </Col>
            )
            )}
          </Row>
        </Container>

        {/* Display Modal with multiple functions */}
        <Modal show={showModal !== false} onHide={() => {
          handleCloseModal();
          resetImagePosition(); // Reset image position when the modal is closed
        }} centered>
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
                  src={selectedImage}
                  style={{
                    width: `${zoomLevel * 100}%`,
                    transform: `translate(${imagePositionX}px, ${imagePositionY}px)`,
                  }}
                  alt="Full View"
                  draggable="false"
                />
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              handleCloseModal(); // Close the modal when the user clicks this button
              resetImagePosition();
            }}>
              Close
            </Button>
            {/* adds a secondary close button to this modal */}
            <div className="zoom-controls">
              <button onClick={handleZoomIn}>Zoom In</button>
              <button onClick={handleZoomOut}>Zoom Out</button>
            </div>
          </Modal.Footer>
        </Modal>

      </div>

      {/* Right Section Container with Buttons*/}
      <div className="right-section">
        <h2>Functions</h2>
        {/* Heading for this section */}

        <button onClick={handleRotateLeft} disabled={selectedImageIndex === null}>Rotate Left</button>
        {/* Handles the rotate left function when the button is clicked */}

        <button onClick={handleRotateRight} disabled={selectedImageIndex === null}>Rotate Right</button>
        {/* Handles the rotate right function when the button is clicked */}

        <button onClick={handleFlip} disabled={selectedImageIndex === null}>Flip selected images</button>
        {/* Handles the flip function when the button is clicked */}

        <button onClick={(handleDelete)} disabled={selectedImageIndex === null}>Delete selected images</button>
        {/* Handles the delete function when the button is clicked */}

        <button onClick={handleSubmit} disabled={uploadedImages && uploadedImages.length === 0}>Submit and Continue</button>
        {/* Handles the submit function when the button is clicked */}

      </div>
    </div>

  );
};

export default UploadStep1;
