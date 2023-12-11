import React from 'react';

const ImageUtils = ({ selectedIndex, setSelectedIndex, imagesArray, setImagesArray, setLoading, loading }) => {

    // function to delete all selected images
    const handleDelete = () => {
        if (selectedIndex !== null) {
            const confirmDeletion = window.confirm("Are you sure you want to delete the selected items?");

            if (confirmDeletion) {
                // Create a new array by copying the imagesArray array
                const newArray = [...imagesArray];

                // Sort selectedIndex in descending order
                const sortedIndices = [...selectedIndex].sort((a, b) => b - a);

                sortedIndices.forEach(index => {
                    if (index >= 0 && index < newArray.length) {
                        newArray.splice(index, 1);
                    }
                });

                // Update the state with the new array, effectively removing the selected images
                setImagesArray(newArray);

                // Reset the selectedIndex after successful deletion
                setSelectedIndex([]);
            }
        } else {
            console.error('selectedIndex is null.');
        }
    };

    //function to rotate all selected images
    const handleRotateRight = async () => {

        //checks if value is not null
        if (selectedIndex !== null) {

            //sets variable to true
            setLoading(true);

            //deep copy with new array
            const newArray = [...imagesArray];

            // function to rotate image right
            const rotateImage = (imgElement, index) => {
                return new Promise((resolve) => {

                    //open canvas and set different variables for rotating the image
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    canvas.width = imgElement.height;
                    canvas.height = imgElement.width;
                    ctx.translate(canvas.width / 2, canvas.height / 2);
                    ctx.rotate(Math.PI / 2);
                    ctx.drawImage(imgElement, -imgElement.width / 2, -imgElement.height / 2);

                    // Wait a short delay to ensure the rotation is complete
                    setTimeout(() => resolve({ canvas, index }), 10);
                });
            };

            // Collect promises from the asynchronous operations
            const promises = selectedIndex.map(async (index) => {

                if (index >= 0 && index < newArray.length) {

                    //gets a single selected image
                    const rSelectedImage = newArray[index].mainImage;

                    // create the image element
                    const imgElement = document.createElement("img");
                    imgElement.src = rSelectedImage;

                    await new Promise((resolve) => {

                        // load up the image
                        imgElement.onload = resolve;
                    });

                    // save new image as the rotated old image
                    const { canvas, index: currentIndex } = await rotateImage(imgElement, index);

                    return new Promise((resolve) => {

                        // creates the image as a blob file
                        canvas.toBlob((blob) => {

                            // saves the iamge as a lossless png image
                            const updatedImage = new File([blob], rSelectedImage.name, {
                                type: "image/png",
                            });

                            //saves the value of the new array[index] main image as new rotated image 
                            newArray[currentIndex].mainImage = URL.createObjectURL(updatedImage);

                            //set the new array as uploaded images
                            setImagesArray([...newArray]);
                            resolve();
                        }, "image/png");
                    });
                }
            });

            // Wait for all promises to resolve before setting loading to false
            await Promise.all(promises);

            // Introduce a 2-second delay before setting loading to false
            setTimeout(() => {
                setLoading(false);
            }, 2000);

        } else {
            console.error("selectedIndex is null.");
        }
    };

    // Function to flip all selected images
    const handleFlip = async () => {
        // Checks if value is not null
        if (selectedIndex !== null) {
            // Sets variable to true
            setLoading(true);

            // Deep copy with new array
            const newArray = [...imagesArray];

            // Function to flip image horizontally
            const flipImage = (imgElement, index) => {
                return new Promise((resolve) => {
                    // Create a canvas for flipping the image
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    canvas.width = imgElement.width;
                    canvas.height = imgElement.height;
                    ctx.translate(canvas.width, 0);
                    ctx.scale(-1, 1);
                    ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

                    // Wait a short delay to ensure the flipping is complete
                    setTimeout(() => resolve({ canvas, index }), 10);
                });
            };

            // Collect promises from the asynchronous operations
            const promises = selectedIndex.map(async (index) => {
                if (index >= 0 && index < newArray.length) {
                    const rSelectedImage = newArray[index].mainImage;
                    const imgElement = document.createElement("img");
                    imgElement.src = rSelectedImage;

                    await new Promise((resolve) => {
                        imgElement.onload = resolve;
                    });

                    // Get the flipped image and its index
                    const { canvas, index: currentIndex } = await flipImage(imgElement, index);

                    return new Promise((resolve) => {
                        // Create a blob from the flipped image
                        canvas.toBlob((blob) => {
                            // Save the image as a lossless png file
                            const updatedImage = new File([blob], rSelectedImage.name, {
                                type: "image/png",
                            });

                            // Update the mainImage property in the new array
                            newArray[currentIndex].mainImage = URL.createObjectURL(updatedImage);

                            // Update the uploaded images state with the new array
                            setImagesArray([...newArray]);

                            // Resolve the promise
                            resolve();
                        }, "image/png");
                    });
                }
            });

            // Wait for all promises to resolve before setting loading to false
            await Promise.all(promises);

            // Introduce a 2-second delay before setting loading to false
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        } else {
            console.error("selectedIndex is null.");
        }
    };

    // Function to rotate all selected images to the left
    const handleRotateLeft = async () => {
        // Checks if value is not null
        if (selectedIndex !== null) {
            // Sets variable to true
            setLoading(true);

            // Deep copy with new array
            const newArray = [...imagesArray];

            // Function to rotate image left
            const rotateImage = (imgElement, index) => {
                return new Promise((resolve) => {
                    // Create a canvas for rotating the image
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    canvas.width = imgElement.height;
                    canvas.height = imgElement.width;
                    ctx.translate(canvas.width / 2, canvas.height / 2);
                    ctx.rotate(-Math.PI / 2);
                    ctx.drawImage(imgElement, -imgElement.width / 2, -imgElement.height / 2);

                    // Wait a short delay to ensure the rotation is complete
                    setTimeout(() => resolve({ canvas, index }), 10);
                });
            };

            // Collect promises from the asynchronous operations
            const promises = selectedIndex.map(async (index) => {
                if (index >= 0 && index < newArray.length) {
                    const rSelectedImage = newArray[index].mainImage;
                    const imgElement = document.createElement("img");
                    imgElement.src = rSelectedImage;

                    await new Promise((resolve) => {
                        imgElement.onload = resolve;
                    });

                    // Get the rotated image and its index
                    const { canvas, index: currentIndex } = await rotateImage(imgElement, index);

                    return new Promise((resolve) => {
                        // Create a blob from the rotated image
                        canvas.toBlob((blob) => {
                            // Save the image as a lossless png file
                            const updatedImage = new File([blob], rSelectedImage.name, {
                                type: "image/png",
                            });

                            // Update the mainImage property in the new array
                            newArray[currentIndex].mainImage = URL.createObjectURL(updatedImage);

                            // Update the uploaded images state with the new array
                            setImagesArray([...newArray]);

                            // Resolve the promise
                            resolve();
                        }, "image/png");
                    });
                }
            });

            // Wait for all promises to resolve before setting loading to false
            await Promise.all(promises);

            // Introduce a 2-second delay before setting loading to false
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        } else {
            console.error("selectedIndex is null.");
        }
    };


    return (
        <div>
            <button onClick={handleRotateLeft} disabled={selectedIndex === null || loading}>Rotate Left</button>
            {/* Handles the rotate left function when the button is clicked */}

            <button onClick={handleRotateRight} disabled={selectedIndex === null || loading}>Rotate Right</button>
            {/* Handles the rotate right function when the button is clicked */}

            <button onClick={handleFlip} disabled={selectedIndex === null || loading}>Flip selected images</button>
            {/* Handles the flip function when the button is clicked */}

            <button onClick={handleDelete} disabled={selectedIndex === null || loading}>Delete selected images</button>
            {/* Handles the delete function when the button is clicked */}
        </div>
    );
};

export default ImageUtils;