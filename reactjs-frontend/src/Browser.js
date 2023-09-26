//import all modules
import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import './Browser.css';

//create the browser component
function Browser() {

    //set all variables useStates
    const [primarySearchTerm, setPrimarySearchTerm] = useState('');
    const [primarySearchType, setPrimarySearchType] = useState('observations'); // Dropdown for primary search
    const [filterOpen, setFilterOpen] = useState(false);
    const [filterSearchTerm, setFilterSearchTerm] = useState('');
    const [filterSearchType, setFilterSearchType] = useState('collections'); // Dropdown for filter search

    const [searchData, setSearchData] = useState([]);

    const [page, setPage] = useState(1); // Current page number
    const [perPage, setPerPage] = useState(20); // Results per page
    const [totalPages, setTotalPages] = useState(1); // Total number of pages


    // Define the sendApiRequest function
    const sendApiRequest = () => {

        // Make the API request using Axios
        axios({ method: "POST", 
                url: '/search', 
                data: {
                    primaryType: primarySearchType.toLowerCase(),
                    primaryTerm: primarySearchTerm,
                    filterType: filterSearchType.toLowerCase(),
                    filterTerm: filterSearchTerm,
                    page: page,
                    per_page: perPage
                }})
            .then((response) => {
                // Handle the response data here
                const receivedData = response.data; // Assuming the response data is an array of results

                // Update the searchData state with the received data
                if (page === 1) {
                    // If it's the first page, replace the existing data
                    setSearchData(receivedData);
                } else {
                    // If it's not the first page, append the new data to the existing data
                    setSearchData([...searchData, ...receivedData]);
                }

                // Calculate the total number of pages based on the response headers
                const totalResults = parseInt(response.headers['x-total-count'], 10);
                const calculatedTotalPages = Math.ceil(totalResults / perPage);
                setTotalPages(calculatedTotalPages);

                // Handle the response data here
                console.log('API response:', receivedData);
            })
            .catch((error) => {
                // Handle any errors
                console.error('API request error:', error);
            });
    };

    // Function to handle the search button click
    const handleSearch = () => {
        setPage(1); // Reset to the first page when performing a new search
        sendApiRequest();
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
        if (page < totalPages) {
            setPage(page + 1); // Increment the page number
            sendApiRequest(); // Fetch the next page of results
        }
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
            setFilterSearchType(''); // Clear the filter dropdown value
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
            setPrimarySearchType(''); // Clear the primary dropdown value
        }
    };

    return (
        <div className="search-page">
            {/* search page div */}

            <div className="search-container">

                {/* Adds a heading for the search page */}
                <h1>Browse Observations</h1>

                {/* Adds the primary search bar */}
                <div className="search-bar">

                    {/* Creates a dropdown menu with different settings */}
                    <select
                        className="search-dropdown"
                        value={primarySearchType}
                        onChange={handlePrimarySearchTypeChange}
                    >

                        {/* Displays options for the dropdown menu */}
                        <option value="Observations">Observations</option>
                        <option value="Collections">Collections</option>
                        <option value="Photographers">Photographers</option>
                        <option value="Collectors">Collectors</option>
                        <option value="Locations">Locations</option>
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
                                <option value="Observations">Observations</option>
                                <option value="Collections">Collections</option>
                                <option value="Photographers">Photographers</option>
                                <option value="Collectors">Collectors</option>
                                <option value="Locations">Locations</option>
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
                <button className="search-button" onClick={handleSearch}>Search</button>
            </div>

            {/* New section for displaying image rows */}
            <div className="image-rows">
                {searchData.map((row, index) => (
                    <div className="image-row" key={index}>
                        <img src={row.imageUrl} alt={row.heading} className="image" />
                        <div className="text-content">
                            <h2>Observation: {row.Observation}</h2>
                            <p>Description: {row.Description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination controls */}
            {page < totalPages && (
                <button className="load-more-button" onClick={fetchMoreResults}>
                    Load More
                </button>
            )}
        </div>
    );
}

export default Browser;
