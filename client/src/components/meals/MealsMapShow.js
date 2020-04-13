import React from "react"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import Geocode from "react-geocode";

import attend from "../../resources/attended.svg"
import fullUp from "../../resources/full_up.svg"
import touched from "../../resources/touched_meal.svg"
import myMeal from "../../resources/my_meal.svg"
export const GOOGLE_MAPS_API_KEY = "AIzaSyBxcuGXRxmHIsiI6tDQDVWIgtGkU-CHZ-4";

Geocode.setApiKey(GOOGLE_MAPS_API_KEY);
const AnyReactComponent = ({ text }) => <div>{text}</div>;
const MealsMapShow = React.memo(({meals, defaultLocation, onMarkerClick, onMapClick}) => {
    const MyGoogleMap = (props) => 
     
    <GoogleMap
        defaultZoom={8}
        defaultCenter={{lat: defaultLocation.lat, lng: defaultLocation.lng}}
        onClick={()=>onMapClick(this)}
    >

    {meals.map(meal =>
        <div name="marker" key={meal.id} className="marker-style" title="meal-marker">
             <Marker 
                position={{lat: meal.location.y, lng:meal.location.x}} 
                onClick={()=>onMarkerClick(meal, this)}
                icon={{url: attend, scaledSize:{width:22,height:22, widthUnit:"px"}}}
                /> 
        </div>
        )} 

    </GoogleMap>;

    const MapWithMarker = withScriptjs(withGoogleMap(MyGoogleMap));

    // getMealIcon = (meal) =>
    // {
    //   if (meal.guest_count <= meal.Atendee_count) {
    //     return fullUp;
    //   }
  
    //   if (meal.host_id == this.props.auth.user.id) {
    //     return myMeal;
    //   }
    //   return attend;
    // }
  
    return (
        <MapWithMarker
        yesIWantToUseGoogleMapApiInternals
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `90%` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            googleMapURL={`https://maps.googleapis.com/maps/api/js?libraries=places&key=${GOOGLE_MAPS_API_KEY}`}
        />
    )
});

export default MealsMapShow;