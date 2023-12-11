import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Rectangle, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css";

const QuarterSquareGrid = ({ latitude, longitude, mapWidth, mapHeight }) => {
    // State to manage the map's center
    const [center, setCenter] = useState([-33.9249, 18.4241]);

    useEffect(() => {
        // Round the latitude to the nearest decimal point above
        const lat = Math.ceil(latitude * 10) / 10;

        // Round the longitude to the nearest decimal point below
        const lon = Math.floor(longitude * 10) / 10;

        // Calculate the top-left coordinates based on rounding and adding 0.1
        const topLeft = [lat, lon];

        // Set the map's center to the calculated top-left coordinates
        setCenter(topLeft);

        // Log the calculated coordinates for debugging
    }, [latitude, longitude]);

    return (
        <MapContainer center={center} zoom={10} style={{ width: mapWidth, height: mapHeight}}>
            {/* TileLayer for the map */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Rectangle to highlight the grid area */}
            <Rectangle
                bounds={[center, [center[0] - 0.1, center[1] + 0.1]]}
                fillColor="blue"
                fillOpacity={0.2}
            />

            <NavigateTo center={center}/>

        </MapContainer>
    );
};

// function to navigate the map to the new location
function NavigateTo({ center }) {

    // creates a map reference using react-leaflet
    const map = useMap();
    
    // useEffect that triggers on center change
    useEffect(() => {

        // if center has a value
        if (center) {

            // Navigate the map to the center location
            map.setView(center, map.getZoom());
        }
    }, [center, map]);

    return null;
}

export default QuarterSquareGrid;
