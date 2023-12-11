//imports different Libraries 
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { GeoSearchControl } from 'leaflet-geosearch';

//create the autocomple search function used on MapModal.js
const Search = (props) => {
    //declare variables
    const map = useMap();
    const { provider } = props;

    //creates a useEffect when the user starts searching in the search box
    useEffect(() => {
        //provides the search results and does not place a marker at that position
        const searchControl = new GeoSearchControl({
            provider,
            showMarker: false,
        }); 

        //adds the searchControl to the leaflet map
        map.addControl(searchControl);

        //removes the searchControl 
        return () => map.removeControl(searchControl);
    }, [provider, map]);

    return null;
};

export default Search;
