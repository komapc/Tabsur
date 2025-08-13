import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import Geocode from "react-geocode";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import backArrowIcon from "../../resources/back_arrow.svg";

const GOOGLE_MAPS_API_KEY = "AIzaSyBxcuGXRxmHIsiI6tDQDVWIgtGkU-CHZ-4";
const MAPS_LIBRARIES = ['places'];
const MAP_CONTAINER_STYLE = { height: '90vh', width: '100%' };

Geocode.setApiKey(GOOGLE_MAPS_API_KEY);

const MapLocationSelector = ({ defaultLocation, address, handleLocationUpdate, handleExit }) => {
  const [location, setLocation] = useState(defaultLocation);
  const [currentAddress, setCurrentAddress] = useState(address);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = { 
            lng: position.coords.longitude, 
            lat: position.coords.latitude 
          };
          
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
            })
            .catch(console.error);
        },
        console.error
      );
    }
  }, [handleLocationUpdate]);

  const handleMarkerDrag = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const newLocation = { lng, lat };
    
    Geocode.fromLatLng(lat, lng)
      .then(response => {
        const addr = response.results[0]?.formatted_address;
        if (addr) {
          handleLocationUpdate({ address: addr, location: newLocation });
          setLocation(newLocation);
          setCurrentAddress(addr);
        }
      })
      .catch(console.error);
  };

  const handleAddressSelect = (selected) => {
    const addr = selected.description;
    setCurrentAddress(addr);
    
    Geocode.fromAddress(addr)
      .then(response => {
        const { lat, lng } = response.results[0].geometry.location;
        const newLocation = { lng, lat };
        handleLocationUpdate({ address: addr, location: newLocation });
        setLocation(newLocation);
        handleExit();
      })
      .catch(console.error);
  };

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
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={MAPS_LIBRARIES}>
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
        >
          <Marker
            draggable
            position={location}
            onDragEnd={handleMarkerDrag}
          />
        </GoogleMap>
      </LoadScript>
    </>
  );
};

export default MapLocationSelector;