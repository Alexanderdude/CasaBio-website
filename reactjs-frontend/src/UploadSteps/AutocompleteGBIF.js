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
    const [isIdentified, setIsIdentified] = useState('Unidentified');
    const [specifiedKingdom, setSpecifiedKingdom] = useState('Plantae'); // "Animalia"

    //useEffect to update inputvalue when the onValueSet changes
    useEffect(() => {

        setInputValue(onValueSet);

    }, [onValueSet]);

    // Effect to fetch suggestions from GBIF API based on input value
    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://api.gbif.org/v1/species/suggest?q=${inputValue}&limit=5`
                );

                // Extract and trim the name from suggestion data
                const uniqueNames = new Set();
                const fetchedSuggestions = response.data.reduce((acc, item) => {
                    const species = item.canonicalName;

                    // Check if the name is unique before adding to suggestions
                    if (!uniqueNames.has(species)) {
                        uniqueNames.add(species);
                        acc.push(species);
                    }

                    return acc;
                }, []);

                setSuggestions(fetchedSuggestions);
            } catch (error) {
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

            // Filter results based on the specified kingdom
            const filteredResults = detailedInfo.results.filter(result => result.kingdom === specifiedKingdom);

            if (filteredResults.length > 0) {
                const firstResult = filteredResults[0];
                onUpdateClassKing(firstResult.class, firstResult.kingdom);
            }
        } catch (error) {
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

    // changes the identifed values
    const handleIdentifiedChange = () => {
        setIsIdentified((prevStatus) =>
            prevStatus === 'Identified' ? 'Unidentified' : 'Identified'
        );
    };

    useEffect(() => {
        // Your side effect logic based on the value of isIdentified
        if (isIdentified === 'Unidentified') {
            onUpdateScientificName('Unidentified')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isIdentified]); // Run the effect whenever isIdentified changes

    // changes the Kingdom values
    const handleKingdomChange = () => {
        setSpecifiedKingdom((prevStatus) =>
            prevStatus === 'Plantae' ? 'Animalia' : 'Plantae'
        );
    };

    return (
        <div className="autocomplete-container">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ marginRight: '20px' }}>
                    <label>
                        Identified
                        <input
                            type="checkbox"
                            checked={isIdentified === 'Identified'}
                            onChange={handleIdentifiedChange}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Unidentified
                        <input
                            type="checkbox"
                            checked={isIdentified === 'Unidentified'}
                            onChange={handleIdentifiedChange}
                        />
                    </label>
                </div>
            </div>
            {isIdentified === 'Identified' && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ marginRight: '20px' }}>
                        <label>
                            Animalia
                            <input
                                type="checkbox"
                                checked={specifiedKingdom === 'Animalia'}
                                onChange={handleKingdomChange}
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            Plantae
                            <input
                                type="checkbox"
                                checked={specifiedKingdom === 'Plantae'}
                                onChange={handleKingdomChange}
                            />
                        </label>
                    </div>
                </div>
            )}
            {isIdentified === 'Identified' && (
                <>
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
                </>
            )}
        </div>
    );
};

export default AutocompleteGBIF;
