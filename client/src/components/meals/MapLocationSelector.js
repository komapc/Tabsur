import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import Geocode from "react-geocode";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import backArrowIcon from "../../resources/back_arrow.svg";
import { Alert, Box, Typography, Button } from '@mui/material';

// Make API key configurable - in production this should come from environment variables
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "AIzaSyBxcuGXRxmHIsiI6tDQDVWIgtGkU-CHZ-4";
const MAPS_LIBRARIES = ['places'];
const MAP_CONTAINER_STYLE = { height: '90vh', width: '100%' };

// Only set API key if it's available
if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== "YOUR_API_KEY_HERE") {
  Geocode.setApiKey(GOOGLE_MAPS_API_KEY);
}

const MapLocationSelector = ({ defaultLocation, address, handleLocationUpdate, handleExit }) => {
  const [location, setLocation] = useState(defaultLocation);
  const [currentAddress, setCurrentAddress] = useState(address);
  const [mapError, setMapError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [billingError, setBillingError] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = { 
            lng: position.coords.longitude, 
            lat: position.coords.latitude 
          };
          
          if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== "YOUR_API_KEY_HERE") {
            Geocode.fromLatLng(coords.lat, coords.lng)
              .then(response => {
                const addr = response.results[0]?.formatted_address;
                if (addr) {
                  handleLocationUpdate({ 
                    defaultLocation: coords, 
                    address: addr, 
                    location: coords 
                  });
                }
                setIsLoading(false);
              })
              .catch(error => {
                console.warn("Geocoding error:", error);
                if (error.message && error.message.includes("billing")) {
                  setBillingError(true);
                }
                setIsLoading(false);
              });
          } else {
            setIsLoading(false);
          }
        },
        (error) => {
          console.warn("Geolocation error:", error);
          setIsLoading(false);
        }
      );
    }
  }, [handleLocationUpdate]);

  const handleMarkerDrag = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const newLocation = { lng, lat };
    
    if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== "YOUR_API_KEY_HERE") {
      Geocode.fromLatLng(lat, lng)
        .then(response => {
          const addr = response.results[0]?.formatted_address;
          if (addr) {
            handleLocationUpdate({ address: addr, location: newLocation });
            setLocation(newLocation);
            setCurrentAddress(addr);
          }
        })
        .catch(error => {
          console.warn("Geocoding error:", error);
          if (error.message && error.message.includes("billing")) {
            setBillingError(true);
          }
          // Still update location even if geocoding fails
          handleLocationUpdate({ location: newLocation });
          setLocation(newLocation);
        });
    } else {
      // Update location without geocoding if API key is not available
      handleLocationUpdate({ location: newLocation });
      setLocation(newLocation);
    }
  };

  const handleAddressSelect = (selected) => {
    const addr = selected.description;
    setCurrentAddress(addr);
    
    if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== "YOUR_API_KEY_HERE") {
      Geocode.fromAddress(addr)
        .then(response => {
          const { lat, lng } = response.results[0].geometry.location;
          const newLocation = { lng, lat };
          handleLocationUpdate({ address: addr, location: newLocation });
          setLocation(newLocation);
          handleExit();
        })
        .catch(error => {
          console.warn("Geocoding error:", error);
          if (error.message && error.message.includes("billing")) {
            setBillingError(true);
            setMapError("Google Maps API billing is not enabled. Please contact your administrator.");
          } else {
            setMapError("Could not get coordinates for this address. Please try dragging the marker manually.");
          }
        });
    } else {
      setMapError("Google Maps API key not configured. Please contact support.");
    }
  };

  const onMapLoad = (map) => {
    // Map loaded successfully
    setMapError(null);
    setBillingError(false);
  };

  const onMapError = (error) => {
    console.error("Google Maps error:", error);
    if (error.message && error.message.includes("billing")) {
      setBillingError(true);
      setMapError("Google Maps API billing is not enabled. Please contact your administrator.");
    } else {
      setMapError("Failed to load Google Maps. Please check your internet connection.");
    }
  };

  // Check if API key is properly configured
  const isApiKeyValid = GOOGLE_MAPS_API_KEY && 
                       GOOGLE_MAPS_API_KEY !== "YOUR_API_KEY_HERE" && 
                       GOOGLE_MAPS_API_KEY.length > 20;

  if (!isApiKeyValid) {
    return (
      <Box p={2}>
        <Alert severity="warning">
          <Typography variant="body2">
            Google Maps API key is not properly configured. Location selection will be limited.
            Please contact your administrator to configure the Google Maps API key.
          </Typography>
        </Alert>
        <Box mt={2}>
          <Typography variant="h6">Manual Location Input</Typography>
          <Typography variant="body2">
            You can still manually enter your address in the text field above.
          </Typography>
        </Box>
      </Box>
    );
  }

  if (billingError) {
    return (
      <Box p={2}>
        <Alert severity="error">
          <Typography variant="body2">
            Google Maps API billing is not enabled for this project. 
            Location selection features are currently unavailable.
          </Typography>
        </Alert>
        <Box mt={2}>
          <Typography variant="h6">Manual Location Input</Typography>
          <Typography variant="body2">
            You can still manually enter your address in the text field above.
          </Typography>
          <Button 
            variant="outlined" 
            onClick={handleExit}
            sx={{ mt: 2 }}
          >
            Continue with Manual Input
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <div className="autocomplete-bar">
        <img 
          onClick={handleExit}
          className="autocomplete-icon" 
          src={backArrowIcon} 
          alt="Close map" 
        />
      </div>
      
      {mapError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {mapError}
        </Alert>
      )}

      <LoadScript 
        googleMapsApiKey={GOOGLE_MAPS_API_KEY} 
        libraries={MAPS_LIBRARIES}
        onError={onMapError}
      >
        <div className="autocomplete-bar">
          <GooglePlacesAutocomplete 
            className="autocomplete-span"
            onSelect={handleAddressSelect}
            initialValue={currentAddress}
            query={{ language: 'en' }}
          />
        </div>
        <GoogleMap
          zoom={10}
          center={defaultLocation}
          mapContainerStyle={MAP_CONTAINER_STYLE}
          onLoad={onMapLoad}
        >
          {/* Note: Using deprecated Marker API - will need migration in future */}
          {/* TODO: Migrate to google.maps.marker.AdvancedMarkerElement when available */}
        </GoogleMap>
      </LoadScript>
    </>
  );
};

export default MapLocationSelector;