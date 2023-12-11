//import the different libraries and modules
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UploadStep1.css';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import Exif from 'exif-js';
import 'react-image-crop/dist/ReactCrop.css';
import ImageUtils from './ImageUtils';
import ImageCrop from'../Other/ImageCrop';

//define the UploadStep1 
const UploadStep1 = () => {

  //state the different variables
  const location = useLocation();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [singleSelectedImageIndex, setSingleSelectedImageIndex] = useState();

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
  const handleClick = (image, index) => {
    setSelectedImage(image);
    setShowModal(true);
    setSingleSelectedImageIndex(index);
  };

  //function to handle image click and change
  const handleImageClick = (index) => {
    if (selectedImageIndex.includes(index)) {
      setSelectedImageIndex(selectedImageIndex.filter((i) => i !== index)); // Deselect the image if it's already selected
    } else {
      setSelectedImageIndex([...selectedImageIndex, index]); // Select the image if it's not selected
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
        <h2>UPLOAD STEPS:</h2>
        {/* Displays the links to the different upload steps*/}
        <ol>
          <li>Step 1:{'\n'}Adding Observations</li>
          {/* Displays a clickable link to step 1*/}

          <li onClick={uploadedImages.length > 0 ? handleSubmit : null}>Step 2:{'\n'}Grouping Observations</li>
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

        <h2>UPLOAD IMAGES</h2>
        {/* Heading for this container */}

        <input type="file" multiple onChange={handleFileInputChange} />
        {/* Adds an input button that allow the user to click and add image files */}

        <Container>
          {/* Uses Custom Bootstrap container to display images */}

          <Row>

            {/* Maps out the array of images to display them in this container */}
            {uploadedImages.map((data, index) => (

              <Col xs={10} md={6} lg={4} key={index} >
                {/* Sets a max of 4 images for each row */}

                <div className={`img-card ${selectedImageIndex.includes(index) ? 'image-checked' : ''}`}
                  onClick={() => { handleImageClick(index); }}>
                  {/* Adds img-card styling to each image and image-checked styling to the image that was selected */}

                  <Image src={data.mainImage} style={{ width: '300px', height: '300px' }} thumbnail />
                  {/* Displays each image to the correct size */}

                  <div className="image-tag" onClick={(e) => { e.stopPropagation(); handleClick(data.mainImage, index) }}>
                    Crop Image
                  </div>

                </div>
              </Col>
            )
            )}
          </Row>
        </Container>

        <ImageCrop
        selectedImage={selectedImage}
        singleSelectedImageIndex={singleSelectedImageIndex}
        setUploadedImages={setUploadedImages}
        showModal={showModal}
        setShowModal={setShowModal}
        />

      </div>

      {/* Right Section Container with Buttons*/}
      <div className="right-section">
        <h2>FUNCTIONS:</h2>
        {/* Heading for this section */}

        <ImageUtils 
          selectedIndex={selectedImageIndex}
          setSelectedIndex={setSelectedImageIndex}
          imagesArray={uploadedImages}
          setImagesArray={setUploadedImages}
          setLoading={setIsLoading}
          loading={isLoading}
          />

        <button onClick={handleSubmit} disabled={selectedImageIndex === null || isLoading || (uploadedImages && uploadedImages.length === 0)}>Submit and Continue</button>
        {/* Handles the submit function when the button is clicked */}

        {/* Loading indicator */}
        {isLoading && (
          <div className="loading-indicator">
            <p>Please wait for items to finish loading</p>
            <div className="spinner"></div>
          </div>
        )}

      </div>
    </div>

  );
};

export default UploadStep1;
