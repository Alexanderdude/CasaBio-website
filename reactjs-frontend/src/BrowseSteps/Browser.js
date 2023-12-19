//import all modules
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import './Browser.css';
import { useNavigate } from 'react-router-dom';

//create the browser component
function Browser() {

    //set all variables useStates
    const [primarySearchTerm, setPrimarySearchTerm] = useState('');
    const [primarySearchType, setPrimarySearchType] = useState('scientific_name'); // Dropdown for primary search
    const [filterOpen, setFilterOpen] = useState(false);
    const [filterSearchTerm, setFilterSearchTerm] = useState('');
    const [filterSearchType, setFilterSearchType] = useState('collections'); // Dropdown for filter search
    const [searchData, setSearchData] = useState([]);
    const [page, setPage] = useState(1); // Current page number
    const perPage = 20; // Results per page (constant value)
    const [ping, setPing] = useState(0);
    const navigate = useNavigate();

    // Pagination controls
    const displayedItemsCount = searchData.length;

    // Check if the number of displayed items is a multiple of 20 (excluding 0)
    const shouldShowLoadMore = displayedItemsCount > 0 && displayedItemsCount % 20 === 0;

    // Define the sendApiRequest function
    const sendApiRequest = async () => {

        // Make the API request using Axios
        axios({
            method: "GET",
            url: '/observation/search',
            params: {
                primaryType: primarySearchType.toLowerCase(),
                primaryTerm: primarySearchTerm,
                filterType: filterSearchType.toLowerCase(),
                filterTerm: filterSearchTerm,
                page: page,
                per_page: perPage
            },
        })
            .then(async (response) => {
                // Handle the response data here
                const receivedData = response.data; // Assuming the response data is an array of results

                // Fetch images for each row in searchData
                const updatedData = await Promise.all(
                    receivedData.map(async (row) => {
                        const imageUrl = await getImageBackend(row.mainImageID, row.username);
                        return {
                            ...row,
                            imageUrl
                        };
                    })
                );

                // Update the searchData state with the received data
                if (page === 1) {
                    // If it's the first page, replace the existing data
                    setSearchData(updatedData);
                } else {
                    // If it's not the first page, append the new data to the existing data
                    setSearchData([...searchData, ...updatedData]);
                }

                // Handle the response data here
                console.log('API response:', receivedData);
            })
            .catch((error) => {
                // Handle any errors
                console.error('API request error:', error);
            });
    };

    useEffect(() => {
        sendApiRequest();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, ping]);


    // Function to handle the search button click
    const handleSearch = () => {
        setPage(1); // Reset to the first page when performing a new search
        setPing(ping + 1);
    };

    // Create a state variable to track whether the initial API request has been triggered
    const [initialSearch, setInitialSearch] = useState(false);

    // Trigger the API request once on component start (page startup)
    if (!initialSearch) {
        sendApiRequest();
        setInitialSearch(true); // Mark the initial search as done
    }

    // Function to fetch more results when scrolling to the bottom
    const fetchMoreResults = () => {
        const newPage = page + 1;
        setPage(newPage);
    };

    //handle the primary search text change
    const handlePrimarySearchChange = (e) => {
        //set the variable to the new value
        setPrimarySearchTerm(e.target.value);
    };

    //handle the primary dropdown type change
    const handlePrimarySearchTypeChange = (e) => {

        //sets selected type to primary type
        setPrimarySearchType(e.target.value);

        // Ensure that the filter dropdown does not have the same value as the primary dropdown
        if (e.target.value === filterSearchType) {
            setFilterSearchType((prevFilterSearchType) => {
                if (prevFilterSearchType === "collections") {
                    return "scientific_name";
                } else {
                    return "collections";
                }
            });
        }
    };

    //adds a toggleFilter function 
    const toggleFilter = () => {
        //opens or closes the filter bar by setting variable
        setFilterOpen(!filterOpen);
    };

    //handle the filter search text change
    const handleFilterSearchChange = (e) => {
        
        //set the variable to the new value
        setFilterSearchTerm(e.target.value);
    };

    //function to handle the filter search type change
    const handleFilterSearchTypeChange = (e) => {

        //sets the selected value to the variable
        setFilterSearchType(e.target.value);

        // Ensure that the primary dropdown does not have the same value as the filter dropdown
        if (e.target.value === primarySearchType) {
            setPrimarySearchType((prevPrimarySearchType) => {
                if (prevPrimarySearchType === "collections") {
                    return "scientific_name";
                } else {
                    return "collections";
                }
            });
        }
    };

    // Function to handle row clicks and store the selected index
    const handleRowClick = (index) => {
        // Navigate to the desired page using the navigate function
        navigate('/observation/' + searchData[index].mainImageID);
    };


    const getImageBackend = async (image_name, username) => {
        try {
            // Make a GET request to your backend API
            axios({
                method: "GET",
                url: '/observation/get_image',
                params: {
                    username: username,
                    image_name: image_name,
                }
            })
                .then((response) => {
                    // Check if the response contains image data
                    if (response.status === 200 && response.data instanceof Blob) {
                        // Create a blob URL for the image
                        const imageUrl = URL.createObjectURL(response.data);
                        return imageUrl;
                    } else {
                        // Handle any other response status or data types here
                        console.error('Unexpected response:', response);
                        return null; // Return null if the response doesn't contain an image
                    }
                })
                .catch((error) => {
                    // Handle network errors or other exceptions
                    console.error('Error fetching image:', error);
                    return null; // Return null in case of errors
                });
        } catch (error) {
            // Handle any exceptions from the try block
            console.error('Error fetching image:', error);
            return null; // Return null in case of errors
        }
    };

    const handleFieldGuides = () => {

        navigate('/fieldGuide');

    };

    return (
        <div className="search-page">
            {/* search page div */}

            <div className="search-container">

                {/* Adds a heading for the search page */}
                <h1 className='browse-heading'>BROWSE OBSERVATIONS</h1>

                {/* Adds the primary search bar */}
                <div className="search-bar">

                    {/* Creates a dropdown menu with different settings */}
                    <select
                        className="search-dropdown"
                        value={primarySearchType}
                        onChange={handlePrimarySearchTypeChange}
                    >

                        {/* Displays options for the dropdown menu */}
                        <option value="scientific_name">Scientific Name</option>
                        <option value="collections">Collections</option>
                        <option value="photographers">Photographers</option>
                        <option value="collectors">Collectors</option>
                        <option value="username">Username</option>
                        <option value="country">Country</option>
                    </select>

                    {/* Gets the users input for searching data */}
                    <input
                        type="text"
                        className="primary-search"
                        placeholder="Search..."
                        value={primarySearchTerm}
                        onChange={handlePrimarySearchChange}
                    />
                </div>

                {/* Adds the filter search bar */}
                <div className="filter-container">

                    {/* Button that triggers the toggle filter function */}
                    <span className="filter-button" onClick={toggleFilter}>
                        Filter:
                    </span>

                    {/* displays the search bar if the filter toggle is true */}
                    {filterOpen && (
                        <div className="search-bar">

                            {/* Creates the dropdown menu with selected settings */}
                            <select
                                className="search-dropdown"
                                value={filterSearchType}
                                onChange={handleFilterSearchTypeChange}
                            >

                                {/* Displays the options for the dropdown menu */}
                                <option value="scientific_name">Scientific Name</option>
                                <option value="collections">Collections</option>
                                <option value="photographers">Photographers</option>
                                <option value="collectors">Collectors</option>
                                <option value="username">Username</option>
                                <option value="country">Country</option>
                            </select>

                            {/* Gets the users input for the filter search bar */}
                            <input
                                type="text"
                                className="sub-search"
                                placeholder="Filter by..."
                                value={filterSearchTerm}
                                onChange={handleFilterSearchChange}
                            />
                        </div>
                    )}
                </div>

                <br />

                <span className="filter-button" onClick={handleFieldGuides}>
                        View Field Guides:
                </span>

                <br />
                <button className="search-button" onClick={handleSearch}>Search</button>
            </div>

                        <br />
            {/* New section for displaying image rows */}
            <div className="image-rows">
                {searchData.map((row, index) => (
                    <div
                        className={`image-row`}
                        key={index}
                        onClick={() => handleRowClick(index)}
                    >
                        <img src={row.imageUrl} alt={row.heading} className="image" />
                        <div className="text-content">
                            <h3>{row.scientific_name}</h3>
                            <p>Kingdom: {row.kingdom || 'undefined'}</p>
                            <p>Locality: {row.province || 'undefined'}</p>
                            <p>Username: {row.username || 'undefined'}</p>
                            <p>Collection: {row.collections || 'undefined'}</p>
                            <p>Collector: {row.collectors || 'undefined'}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination controls */}
            {shouldShowLoadMore && (
                <button className='search-button' onClick={fetchMoreResults}>
                    Load More
                </button>
            )}
        </div>
    );
}

export default Browser;
