import React from "react"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import Geocode from "react-geocode";

export const GOOGLE_MAPS_API_KEY = "AIzaSyBxcuGXRxmHIsiI6tDQDVWIgtGkU-CHZ-4";

Geocode.setApiKey(GOOGLE_MAPS_API_KEY);

const MapLocationSelector = React.memo(({handleLocationUpdate, lng, lat}) => {
    const onMarkerDragEnd = (event) => {
        let newLat = event.latLng.lat(),
            newLng = event.latLng.lng();

        // TODO: Move outside

        Geocode.fromLatLng(newLat, newLng).then(
            response => {
                const address = response.results[0].formatted_address;

                handleLocationUpdate({address});
            },
            error => {
                console.error(error);
            }
        );
    };

    const MyGoogleMap = (props) => <GoogleMap
        defaultZoom={8}
        defaultCenter={{lat, lng}}
    >
        <Marker
            draggable
            position={{lat, lng}}
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