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
    console.log(imageData);
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

  //function to go back in a step
  const handleBackStep = (formattedArray) => {

    navigate('/upload', { state: { singleImageData: formattedArray } });
  };

  //function to handle multiple image delete
  const handleDelete = () => {
    const confirmDeletion = window.confirm("Are you sure you want to delete the selected items?");

    if (confirmDeletion) {
      // Make a copy of the imageData array
      const newArray = [...imageData];

      // Sort selectedImageIndex in descending order
      const sortedIndices = [...selectedImageIndex].sort((a, b) => b - a);

      // Remove items at each selected index
      sortedIndices.forEach(index => {
        if (index >= 0 && index < newArray.length) {
          newArray.splice(index, 1);
        }
      });

      // Update the imageData state with the modified array
      setImageData(newArray);

      // Reset the selectedImageIndex to an empty array
      setSelectedImageIndex([]);
    }
  };

  // Function to handle rotating the selected image to the right
  const handleRotateRight = () => {
    if (selectedImageIndex !== null) {
      // Create a copy of the uploaded images array
      const newArray = [...imageData];

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
              setImageData(newArray);
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
      const newArray = [...imageData];

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
              setImageData(newArray);
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
      const newArray = [...imageData];

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
              setImageData(newArray);
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

  // Define a state variable to control the zoom level
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [imagePositionX, setImagePositionX] = useState(0);
  const [imagePositionY, setImagePositionY] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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

  //function to handle selected image
  const handleClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  // function to format the Exif date into javascript date
  const formatDate = (inputDate) => {
    const dateParts = inputDate.split(' '); // Split the input into date and time
    const date = dateParts[0].replace(/:/g, '-'); // Format date part
    const time = dateParts[1]; // Time remains the same
  
    const formattedDateStr = date + 'T' + time;
    const dateObj = new Date(formattedDateStr); //formattedDate as a Date variable

    if (!isNaN(dateObj)) {
      return formattedDateStr; //return Date
    } else {
      // Invalid date format
      return NaN;
      
    }
  };

  const handleAutoGroup = () => {
    // Confirmation message
    const confirmDeletion = window.confirm(
      "This will autogroup your observations based on the time each picture was taken. Are you sure you want to do this?"
    );
  
    if (confirmDeletion) {
      const updatedImageData = [...imageData]; // Create a copy of the imageData
  
      // Iterate through the updatedImageData
      for (let i = 0; i < updatedImageData.length; i++) {

        //get the mainImage we are working with
        const currentImage = updatedImageData[i];

        // makes sure the image has exifData saved
        if (currentImage.exifData && currentImage.exifData.DateTimeOriginal) {
          const currentTimestamp = new Date(formatDate(currentImage.exifData.DateTimeOriginal));
          const imagesWithin3Minutes = [];
  
          //iterate through the updatedImageData again
          for (let j = 0; j < updatedImageData.length; j++) {

            //skip the mainImage index
            if (i !== j && updatedImageData[i] && updatedImageData[j]) {
              const otherImage = updatedImageData[j];

              if (otherImage.exifData && otherImage.exifData.DateTimeOriginal && currentImage.mainImage && otherImage.mainImage) { // Check for mainImage and DateTimeOriginal
                const otherTimestamp = new Date(formatDate(otherImage.exifData.DateTimeOriginal));

                const timeDifference = (currentTimestamp - otherTimestamp) / 1000; // Get the Difference between times and convert to seconds
                if (timeDifference >= -180 && timeDifference <= 180) { // Within 3 minutes range
                  imagesWithin3Minutes.push(otherImage.mainImage);

                  updatedImageData.splice(j, 1);
                  j--; // Adjust the index since we removed an element
                }
              }
            }
          }
  
          // Add images within 3 minutes to the extraImage array of the current image
          if (imagesWithin3Minutes.length > 0) {
            if (!currentImage.extraImage) {
              currentImage.extraImage = [];
            }
            currentImage.extraImage.push(...imagesWithin3Minutes); // add to the current images extraImage
          }
        }
      }

      setImageData(updatedImageData)
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

                    className={`img-card ${selectedImageIndex.includes(index) ? 'image-checked' : ''} ${data.extraImage && data.extraImage.length > 0 ? 'grouped-img-card' : ''}`}
                    onClick={() => handleImageClick(index)}
                  >
                    <Image src={data.mainImage} style={{ width: '300px', height: '300px' }} thumbnail />

                    <div className="image-tag" onClick={(e) => { e.stopPropagation(); handleClick(data.mainImage) }}>
                      Fullscreen
                    </div>

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
      <button onClick={handleRotateRight}>Rotate Right</button>
      <button onClick={handleRotateLeft}>Rotate Left</button>
      <button onClick={handleFlip}>Flip Image(s)</button>
      <button onClick={handleDelete}>Delete selected image or group</button>
      <button onClick={handleViewGroup} disabled={selectedImageIndex.length !== 1}>View selected group</button>
      <button onClick={handleGroupImages}>Merge selected images</button>
      <button onClick={handleUngroupGroup} disabled={selectedImageIndex.length !== 1}>Ungroup selected group</button>
      <button onClick={handleAutoGroup}>Autogroup Images</button>
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
);
};

export default UploadStep2;
