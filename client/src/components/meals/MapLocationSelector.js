import React, { useState }  from "react"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import Geocode from "react-geocode";

export const GOOGLE_MAPS_API_KEY = "AIzaSyBxcuGXRxmHIsiI6tDQDVWIgtGkU-CHZ-4";

Geocode.setApiKey(GOOGLE_MAPS_API_KEY);

const MapLocationSelector = React.memo(({handleLocationUpdate, defaultLocation}) => {

    const [address, setAddress] = useState("drag & drop the marker");

    const onMarkerDragEnd = (event) => {
        let lat = event.latLng.lat(),
            lng = event.latLng.lng();

        // TODO: Move outside

        Geocode.fromLatLng(lat, lng).then(
            response => {
                const addr = response.results[0].formatted_address;
                handleLocationUpdate({addr, location: {lng, lat}});
                setAddress(addr);
            },
            error => {
                console.error(error);
            }
        );
    };
    function  addressClickHandle()
    {
        alert(1);
    }
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
        <span>
            <span onClick={addressClickHandle}>
                {address}
            </span>
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