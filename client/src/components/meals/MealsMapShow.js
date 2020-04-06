import React from "react"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import Geocode from "react-geocode";

export const GOOGLE_MAPS_API_KEY = "AIzaSyBxcuGXRxmHIsiI6tDQDVWIgtGkU-CHZ-4";

Geocode.setApiKey(GOOGLE_MAPS_API_KEY);
const MealsMapShow = React.memo(({meals, defaultLocation, onMarkerClick}) => {
    const MyGoogleMap = (props) => 
     
    <GoogleMap
        defaultZoom={8}
        defaultCenter={{lat: defaultLocation.lat, lng: defaultLocation.lng}}
    >

    {meals.map(meal =>
        <div key={meal.id}>
            <Marker 
                position={{lat: meal.location.y, lng:meal.location.x}} 
                onClick={()=>onMarkerClick(meal, this)}
                />
        </div>
        )} 

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

export default MealsMapShow;