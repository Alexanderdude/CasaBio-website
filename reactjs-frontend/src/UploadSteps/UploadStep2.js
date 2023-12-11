//import different libraries and modules
import React, { useState, useEffect } from 'react';
import './UploadStep2.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import ImageUtils from './ImageUtils';
import ImageView from '../Other/ImageView';
import ViewGroup from './ViewGroup';

const UploadStep2 = () => {

  //state variables
  const location = useLocation();

  const [imageData, setImageData] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState([]);
  const [viewGroupModalShow, setViewGroupModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  //handle the useEffect to recieve variable from previous Upload Step
  useEffect(() => {
    if (location.state && location.state.uploadedImages) {
      setImageData(location.state.uploadedImages);
    }
  }, [location.state]);


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
    if (!Array.isArray(selectedImageIndex) || selectedImageIndex.length !== 1 || imageData[selectedImageIndex[0]].extraImage === null || imageData[selectedImageIndex[0]].extraImage === '') {
      if (!window.confirm('Please select a single group and try again.')) {
        return;
      }
    } else {

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
    }
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
  // function to group images using Exif
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




  return (
    <div className="upload-step-two-container">

      {/* Left Section Container upload steps*/}
      <div className="left-section">
        <h2>UPLOAD STEPS:</h2>
        <ol>
          {/* displays the links to the different steps */}
          <li onClick={() => handleProcessing('false')}>Step 1:{'\n'}Adding Observations</li>
          <li>Step 2:{'\n'}Grouping Observations</li>
          <li onClick={() => handleProcessing('true')}>Step 3:{'\n'}Adding Information</li>
        </ol>
      </div>

      {/* Center Section Container with Image View*/}
      <div className="center-section">

        {/* display the heading for this form */}
        <h2>GROUP IMAGES</h2>

        {/* sets a container for all the images */}
        <Container>
          <Row >
            {/* maps through the imageData and displays each image */}
            {imageData.length > 0 ? (
              imageData.map((data, index) => (
                data.mainImage && (
                  <Col xs={10} md={6} lg={4} key={index}>
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
        <h2>FUNCTIONS:</h2>

        <ImageUtils
          selectedIndex={selectedImageIndex}
          setSelectedIndex={setSelectedImageIndex}
          imagesArray={imageData}
          setImagesArray={setImageData}
          setLoading={setIsLoading}
          loading={isLoading}
        />

        <br />

        <button onClick={handleViewGroup} disabled={selectedImageIndex.length !== 1 || isLoading}>
          View selected group
        </button>

        <button onClick={handleGroupImages} disabled={selectedImageIndex.length === 0 || isLoading}>
          Group selected images
        </button>

        <button onClick={handleAutoGroup} disabled={isLoading}>
          Autogroup Images
        </button>

        <button onClick={handleUngroupGroup} disabled={selectedImageIndex.length === 0 || isLoading}>
          Ungroup selected group
        </button>

        <br />

        <button onClick={() => handleProcessing('true')} disabled={isLoading}>
          Submit and Continue
        </button>
        {/* Loading indicator */}
        {isLoading && (
          <div className="loading-indicator">
            <p>Please wait for items to finish loading</p>
            <div className="spinner"></div>
          </div>
        )}
      </div>

      <ViewGroup
        selectedImageIndex={selectedImageIndex}
        imageData={imageData}
        setImageData={setImageData}
        setViewGroupModalShow={setViewGroupModalShow}
        setSelectedImageIndex={setSelectedImageIndex}
        viewGroupModalShow={viewGroupModalShow}
      />

      <ImageView
        showModal={showModal}
        setShowModal={setShowModal}
        selectedImage={selectedImage}
      />

    </div>
  );
};

export default UploadStep2;
