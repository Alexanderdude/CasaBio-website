// Autosearch component (AutocompleteGBIF.js)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AutocompleteGBIF.css'; // Import your custom CSS file for styling

//define the autocomplete component from form UploadStep3
const AutocompleteGBIF = ({ onValueSet, onUpdateScientificName, onUpdateClassKing }) => {

    // State to store input value, suggestions, selected suggestion, and suggestion visibility
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);

    //useEffect to update inputvalue when the onValueSet changes
    useEffect(() => {

        setInputValue(onValueSet);

    },[onValueSet]);

    // Effect to fetch suggestions from GBIF API based on input value
    useEffect(() => {

        // Function to fetch suggestions from GBIF API
        const fetchData = async () => {

            //try an API request from GBIF or displays an error
            try {
                const response = await axios.get(
                    //API request from GBIF to give limit 5 suggestions from the species database
                    `https://api.gbif.org/v1/species/suggest?q=${inputValue}&limit=5`
                );

                console.log(response);

                // Extract and trim the name from suggestion data
                const fetchedSuggestions = response.data.map((item) => {
                    const nameParts = item.scientificName.split(','); // Split name and date
                    return nameParts[0].trim(); // Extract and trim the name
                });

                setSuggestions(fetchedSuggestions);
            } catch (error) {

                //display the error
                console.error('Error fetching suggestions from GBIF:', error);
            }
        };

        // Fetch suggestions if input value is at least 2 characters long
        if (inputValue.length >= 2) {
            fetchData();
        } else {
            setSuggestions([]); // Clear suggestions if input is too short
        }
    }, [inputValue]);

    // Function to fetch detailed taxonomic information from GBIF API based on selected suggestion
    const fetchExtraInformation = async (name) => {
        try {
            const response = await axios.get(

                //API to search species from GBIF with selected name
                `https://api.gbif.org/v1/species/search?q=${name}`
            );
        
            const detailedInfo = response.data;
        
            //gets different results and displays them in console ##TO BE CHANGES LATER
            if (detailedInfo.results && detailedInfo.results.length > 0) {
                const firstResult = detailedInfo.results[0];
                onUpdateClassKing(firstResult.class, firstResult.kingdom);
            }
        } catch (error) {

            //error message is API is invalid
            console.error('Error fetching detailed information from GBIF:', error);
        }
    };

    // Handle selection of a suggestion and sets the selected result
    const handleSelectSuggestion = (suggestion) => {
        setInputValue(suggestion);
        setSelectedSuggestion(suggestion);
        setShowSuggestions(false);
        fetchExtraInformation(suggestion); // Fetch additional taxonomic information
        onUpdateScientificName(suggestion); // Pass selected value to parent component
    };

    // Handle input focus to show suggestions
    const handleInputFocus = () => {
        setShowSuggestions(true);
    };

    // Handle input blur to delay hiding suggestions
    const handleInputBlur = () => {
        setTimeout(() => setShowSuggestions(false), 200);
    };

    return (
        <div className="autocomplete-container">

            {/* add a label to the input box */}
            <label htmlFor="sciName">Enter Species Name</label>
            <div className="dropdown">

                {/* Displays the input box with different functions for change */}
                <input
                    type="text"
                    id="sciName"
                    name="sciName"
                    value={inputValue || ''}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                />

                {/* Displays suggestions from API request after typing 2 letters */}
                {showSuggestions && inputValue.length >= 2 && (
                    <div className="dropdown-content">

                        {/* Maps out all the suggestions in the dropdown window */}
                        {suggestions.map((suggestion) => (
                            
                            <div
                                key={suggestion}
                                className={`dropdown-item ${selectedSuggestion === suggestion ? 'selected' : ''
                                    }`}
                                    
                                onClick={() => handleSelectSuggestion(suggestion)}
                            >
                                {/* add an onclick function when user clicks on the suggestion */}

                                {suggestion}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AutocompleteGBIF;
