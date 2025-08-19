import React, { useState } from "react";
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import { Box, Typography, Button, Alert, Paper } from '@mui/material';

import Geocode from "react-geocode";
import attended_u from "../../resources/map/attended_meal_icon.svg";
import fullUp_u from "../../resources/map/full_meal_icon.svg";
import hosted_u from "../../resources/map/my_meal_icon.svg"
import available_u from "../../resources/map/active_meal_icon.svg";

import attended_t from "../../resources/map/attended_meal_icon_touched.svg";
import fullUp_t from "../../resources/map/full_meal_icon_touched.svg";
import hosted_t from "../../resources/map/my_meal_icon_touched.svg";
import available_t from "../../resources/map/active_meal_icon_touched.svg";

import myLocation from "../../resources/map/my_location.svg";
// Removed unused imports to prevent linter errors

const attended = [attended_u, attended_t];
const fullUp = [fullUp_u, fullUp_t];
const hosted = [hosted_u, hosted_t];
const available = [available_u, available_t];

export const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// Only set Geocode API key if it exists
if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'your_google_maps_api_key_here') {
    Geocode.setApiKey(GOOGLE_MAPS_API_KEY);
}

const MealMapShow =
    React.memo(
        ({ meals, defaultLocation, onMarkerClick, onMapClick, userId, selectedMeal }) => {
            const [mapError, setMapError] = useState(null);

            // Check if API key is properly configured
            const isApiKeyValid = GOOGLE_MAPS_API_KEY && 
                                GOOGLE_MAPS_API_KEY !== 'your_google_maps_api_key_here' && 
                                GOOGLE_MAPS_API_KEY !== '';

            const getMealIcon = (meal, userId, isSelected) => {
                const selectedIndex = isSelected ? 1 : 0;
                console.log(`meal: ${JSON.stringify(meal)}`);
                console.log(`selectedMeal = ${selectedIndex}`);

                if (meal.guest_count <= meal.Atendee_count) {
                    return fullUp[selectedIndex];
                }

                if (meal.host_id === userId) {
                    return hosted[selectedIndex];
                }
                if (meal.me > 0) {
                    return attended[selectedIndex];
                }
                return available[selectedIndex];
            };

            // Fallback component when API key is missing
            const MapFallback = () => (
                <Paper elevation={3} sx={{ p: 3, m: 2, textAlign: 'center' }}>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        <Typography variant="h6" component="div">
                            🗺️ Map View Unavailable
                        </Typography>
                        <Typography variant="body2">
                            Google Maps API key is not configured. Please set the REACT_APP_GOOGLE_MAPS_API_KEY environment variable.
                        </Typography>
                    </Alert>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        To enable the map view:
                    </Typography>
                    <Box component="ul" sx={{ textAlign: 'left', display: 'inline-block' }}>
                        <li>Create a <code>.env</code> file in the client directory</li>
                        <li>Add: <code>REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key</code></li>
                        <li>Restart the development server</li>
                    </Box>
                    <Button 
                        variant="outlined" 
                        sx={{ mt: 2 }}
                        onClick={() => window.open('https://developers.google.com/maps/documentation/javascript/get-api-key', '_blank')}
                    >
                        Get Google Maps API Key
                    </Button>
                </Paper>
            );

            const MyGoogleMap = (props) => {
                const google = window.google;
                const [position, setPosition] = useState(defaultLocation);
                const [mapLoadError, setMapLoadError] = useState(null);

                const myOptions = {
                    zoom: 8,
                    mapTypeControlOptions: {
                        mapTypeIds: []
                    },
                    disableDefaultUI: true,
                    mapTypeControl: true,
                    scaleControl: true,
                    zoomControl: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                const findMe = () => {
                    setPosition({ ...defaultLocation });
                    console.log(position);
                }

                const handleMapLoadError = (error) => {
                    console.error('Map load error:', error);
                    setMapLoadError(error);
                    setMapError('Failed to load Google Maps');
                };

                if (mapLoadError) {
                    return (
                        <Paper elevation={3} sx={{ p: 3, m: 2, textAlign: 'center' }}>
                            <Alert severity="error">
                                <Typography variant="h6">Map Loading Error</Typography>
                                <Typography variant="body2">
                                    Failed to load Google Maps. Please check your internet connection and API key.
                                </Typography>
                            </Alert>
                        </Paper>
                    );
                }

                return (
                    <GoogleMap
                        defaultZoom={8}
                        defaultCenter={{ lat: defaultLocation.lat, lng: defaultLocation.lng }}
                        onClick={(e) => onMapClick && onMapClick(e)}
                        center={{ lat: position.lat, lng: position.lng }}
                        options={myOptions}
                        onError={handleMapLoadError}
                    >
                        {meals.map(meal => {
                            const isSelected = selectedMeal === meal.id;
                            const icon = getMealIcon(meal, userId, isSelected);
                            const markerSize = isSelected ? 40 : 30;
                            return (
                                <div name="marker" key={meal.id} className="marker-style" title="meal marker">
                                    <Marker
                                        position={{ lat: meal.location.y, lng: meal.location.x }}
                                        onClick={() => onMarkerClick(meal)}
                                        icon={{
                                            url: icon,
                                            scaledSize: new window.google.maps.Size(markerSize, markerSize)
                                        }}
                                    />
                                </div>
                            );
                        })}

                        <Marker
                            position={{ lat: position.lat, lng: position.lng }}
                            icon={{
                                url: myLocation,
                                scaledSize: new window.google.maps.Size(30, 30)
                            }}
                        />
                    </GoogleMap>
                );
            };

            // If API key is not valid, show fallback
            if (!isApiKeyValid) {
                return <MapFallback />;
            }

            return (
                <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                    <MyGoogleMap />
                </LoadScript>
            );
        }
    );

export default MealMapShow;