import React, { useState } from "react"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import Geocode from "react-geocode";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
// If you want to use the provided css
import 'react-google-places-autocomplete/dist/index.min.css';

export const GOOGLE_MAPS_API_KEY = "AIzaSyBxcuGXRxmHIsiI6tDQDVWIgtGkU-CHZ-4";

Geocode.setApiKey(GOOGLE_MAPS_API_KEY);

const MapLocationSelector = React.memo(({ handleLocationUpdate, defaultLocation, handleExit }) => {

    const [address, setAddress] = useState("");

    const onMarkerDragEnd = (event) => {
        let lat = event.latLng.lat(),
            lng = event.latLng.lng();

        Geocode.fromLatLng(lat, lng).then(
            response => {
                const addr = response.results[0].formatted_address;
                console.log("onMarkerDragEnd, address: " + addr);
                handleLocationUpdate({ address: addr, location: { lng, lat } });
                setAddress(addr);
            },
            error => {
                console.error(error);
            }
        );
    };
    function onAutoCompleteSelect  (event)
    {
        const address = event.description;
        console.log(address);
        console.log("event: " + event);
        setAddress(address);
        let place = Geocode.fromAddress(address).then(response => {
            const { lat, lng } = response.results[0].geometry.location;
            console.log(lat, lng);
            handleLocationUpdate({ address: event.description, location: { lng, lat } });
            handleExit();
          },
          error => {
            console.error(error);
          });
        
    }
    function addressClickHandle() {
        handleExit();
    }
    const MyGoogleMap = (props) => <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: defaultLocation.lat, lng: defaultLocation.lng }}
    >
        <Marker
            draggable
            position={{ lat: defaultLocation.lat, lng: defaultLocation.lng }}
            onDragEnd={onMarkerDragEnd}
        />
    </GoogleMap>;

    const MapWithMarker = withScriptjs(withGoogleMap(MyGoogleMap));

    return (
        <span>
            <div>
            <span onClick={addressClickHandle}>{"<--"}</span>
                <GooglePlacesAutocomplete
                    onSelect={onAutoCompleteSelect}
                    initialValue= {address}
                    
                />
            </div>
          
            <MapWithMarker
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `90%` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                googleMapURL={`https://maps.googleapis.com/maps/api/js?libraries=places&key=${GOOGLE_MAPS_API_KEY}`}
            />
        </span>
    )
});

export default MapLocationSelector;