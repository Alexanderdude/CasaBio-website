//import different Libraries and modules
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import Search from './Search';
import L from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import axios from 'axios';
import _ from 'lodash';

//import marker icon from Leaflet 
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';


//create the MapModal function being used on UploadStep3
function MapModal({ show, onClose, longitudeInput, latitudeInput, accuracyInput, onUpdateLatLng, onHandleTowProCou }) {
    
    //define default variables positioned on Cape Town
    const [defCenter, setDefCenter] = useState([-33.9249, 18.4241]);
    // eslint-disable-next-line
    const [defZoom, setDefZoom] = useState(10);
    const [sliderValue, setSliderValue] = useState(1);
      
    useEffect(() => {
        // Update defCenter only if longitudeInput and latitudeInput are not empty
        if (longitudeInput !== '' && latitudeInput !== '') {
            setDefCenter([latitudeInput, longitudeInput]);
        }
    }, [longitudeInput, latitudeInput]);


    //function to change the accuracy slider value
    const handleSliderChange = (event) => {
        //sets the slider value as the user slides the slider under the map container
        setSliderValue(parseInt(event.target.value, 10));
    };

    // Function to update latitude, longitude, and accuracy
    const updateLatLng = (lat, lng, acc) => {
        // Call the parent component's update function
        onUpdateLatLng(lat, lng, acc);
    };

    //function to update Town, Province and Country
    const handleTowProCou = (tow, pro, cou) => {
        //call the parant component's update function
        onHandleTowProCou(tow, pro, cou);
    };


    return (
        <Modal show={show} onHide={onClose}>
            {/* Create Modal popup with functions to close and display */}
            <Modal.Header closeButton>
                {/* Adds a default Modal close button */}
                <Modal.Title>Map with Accuracy</Modal.Title>
                {/* Modal Title */}
            </Modal.Header>
            <Modal.Body>
                <div>
                    <MapContainer center={defCenter} zoom={defZoom} style={{ height: '60vh '}}>
                        {/* Displays the Leaflet map container with the declared position variables */}

                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        /> {/* Adds the leaflet map to the map container */}

                        <CustomMarker sliderValue={sliderValue} updateLatLng={updateLatLng} handleTowProCou={handleTowProCou} />
                        {/* Adds the custom marker function to the Map container */}

                        <Search provider={new OpenStreetMapProvider()} />
                        {/* This provides the Autocomplete search function imported from Search.js */}

                    </MapContainer>

                    {/* adds a slider under the map container */}
                    <div className="slider-container">
                        <input
                            type="range"
                            min={1}
                            max={1000}
                            value={sliderValue}
                            onChange={handleSliderChange}
                            className="slider"
                        />
                        {/* adds a text indicating the radius of the slider in meters */}
                        <span className="slider-value">{sliderValue} m</span>
                    </div>
                </div>
                <Button onClick={onClose}>
                    Submit
                </Button>
            </Modal.Body>
        </Modal>
    );
}

//Custommarker function that displays the marker when a user clicks on the map
function CustomMarker({ sliderValue, updateLatLng, handleTowProCou }) {
    const [markerPosition, setMarkerPosition] = useState(null);
    const [circleRadius, setCircleRadius] = useState(null);

    // Create a memoized function for handleMarkerClick
    // eslint-disable-next-line react-hooks/exhaustive-deps 
    const handleMarkerClick = useCallback(
        _.throttle((clickedPosition) => {
            // Fetch address data using OpenStreetMap Nominatim API
            axios
                .get(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${clickedPosition.lat}&lon=${clickedPosition.lng}`
                )
                .then((response) => {
                    const { address } = response.data;

                    // Call the parent component's function to update town, province, and country
                    handleTowProCou(
                        address.city || address.town, // Use city if available, otherwise use town
                        address.state, // Province or state
                        address.country // Country
                    );
                })
                .catch((error) => {
                    console.error('Error fetching address data:', error);
                });
        }, 2000), // Throttle for 2 seconds

        [handleTowProCou]
    );

    useEffect(() => {
        // Check if markerPosition is available and sliderValue changes
        if (markerPosition !== null && sliderValue !== null) {
            // Update circleRadius based on sliderValue
            setCircleRadius(sliderValue);
        }
    }, [sliderValue, markerPosition]);

    // Use useMemo to create the throttled version of handleMarkerClick
    const throttledHandleMarkerClick = useMemo(
        () => _.throttle(handleMarkerClick, 2000),
        [handleMarkerClick]
    );

    //use the react-leaflet library to create a mapEvent
    useMapEvents({
        //declares that it is using an onClick event
        click: (event) => {
            //sets a variable for the clicked position
            const clickedPosition = event.latlng;
            //updates the markerPosition Variable
            setMarkerPosition(clickedPosition);
            // Call throttled function to handle marker click
            throttledHandleMarkerClick(clickedPosition);
        }
    });

    useEffect(() => {
        // Check if markerPosition is available
        if (markerPosition) {
            // Update latitude, longitude, and accuracy using parent component's function
            updateLatLng(markerPosition.lat, markerPosition.lng, sliderValue);
        }
    }, [markerPosition, sliderValue, updateLatLng]);

    //returns the markerPosition to the map container function
    return markerPosition ? (
        <>
            {/* Display the marker if markerPosition is set */}
            <Marker position={markerPosition} icon={L.icon({
                iconUrl: markerIconUrl,
                iconAnchor: [12, 41], // Center of the icon
                popupAnchor: [0, -41] // Anchor point for popup
            })}>
                {/* Displays the marker at the markerPosition coords.
                This also positions the icon image above and centered to the markerPosition */}
                <Popup>
                    Marker at <br /> Lat: {markerPosition.lat.toFixed(6)} <br /> Lng: {markerPosition.lng.toFixed(6)}
                </Popup>
                {/* This displays custom text when a user clicks on the marker (gives the coords) */}
            </Marker>

            {/* Display the circle if both markerPosition and circleRadius are set */}
            {circleRadius && (
                <Circle
                    center={markerPosition}
                    radius={circleRadius}
                    fillColor="blue"
                    fillOpacity={0.2}
                />
            )}
        </>
    ) : null;
}

export default MapModal;
