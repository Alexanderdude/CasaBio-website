import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Fieldguide.css';

function Fieldguide() {

    // declare variables
    const [fieldguides, setFieldgiudes] = useState([]);
    const [iNatSearchTerm, setINatSearchTerm] = useState('oak');

    useEffect(() => {

        //iNat get common names and pictures of species. 
        const getInatAPI = () => {
            
            // Define the URL for the iNaturalist API to retrieve common names
            const url = 'https://api.inaturalist.org/v1/taxa/autocomplete';

            // Parameters for the request
            const params = {
                q: iNatSearchTerm, // Provide the search term here
                per_page: 1,  // Number of results per page
            };

            // Make the GET request using Axios
            axios.get(url, { params })
                .then(response => {
                    console.log(response.data.results);
                })
                .catch(error => {
                    // Handle any errors that may occur
                    console.error('Error:', error);
                });
        };



        // Call the getInatAPI function when the component mounts
        getInatAPI();
    }, []);

    //need to use scientifc name on GBIF to extract species key, then use key to get the location data from GBIF.

    //need to get list of taxa from Casabio API( specifically the descriptions and latin eyymologies)

    return (
        <div>

            {/* New section for displaying field Guide rows */}
            <div className="image-rows">
                {fieldguides.map((row, index) => (
                    <div
                        className={`image-row`}
                        key={index}
                    >
                        <img src={row.imageUrl} alt={'SCIENTIFIC NAME'} className="image" />
                        <div className="text-content">
                            <h3>SCIENTIFIC NAME</h3>
                            <p>common name:</p>
                            <p>description:</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Fieldguide;
