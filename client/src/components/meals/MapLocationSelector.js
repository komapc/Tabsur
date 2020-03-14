import React from "react"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import Geocode from "react-geocode";

export const GOOGLE_MAPS_API_KEY = "AIzaSyBxcuGXRxmHIsiI6tDQDVWIgtGkU-CHZ-4";

Geocode.setApiKey(GOOGLE_MAPS_API_KEY);

const MapLocationSelector = React.memo(({handleLocationUpdate, defaultLocation}) => {
    const onMarkerDragEnd = (event) => {
        let lat = event.latLng.lat(),
            lng = event.latLng.lng();

        // TODO: Move outside

        Geocode.fromLatLng(lat, lng).then(
            response => {
                const address = response.results[0].formatted_address;
                handleLocationUpdate({address, location: {lng, lat}});
            },
            error => {
                console.error(error);
            }
        );
    };

    const MyGoogleMap = (props) => <GoogleMap
        defaultZoom={8}
        defaultCenter={{lat: defaultLocation.lat, lng: defaultLocation.lng}}
    >
        <Marker
            draggable
            position={{lat: defaultLocation.lat, lng: defaultLocation.lng}}
            onDragEnd={onMarkerDragEnd}
        />
    </GoogleMap>;

    const MapWithMarker = withScriptjs(withGoogleMap(MyGoogleMap));

    return (
        <MapWithMarker
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `90%` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            googleMapURL={`https://maps.googleapis.com/maps/api/js?libraries=places&key=${GOOGLE_MAPS_API_KEY}`}
        />
    )
});

export default MapLocationSelector;