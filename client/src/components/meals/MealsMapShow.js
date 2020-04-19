import React from "react";
import Geocode from "react-geocode";
import { GoogleMap, Marker, withGoogleMap, withScriptjs } from "react-google-maps";
import attended from "../../resources/attended.svg";
import fullUp from "../../resources/full_up.svg";
import hosted from "../../resources/host_meal.svg"
import available from "../../resources/available_meal.svg"
import touched from "../../resources/touched_meal.svg"

export const GOOGLE_MAPS_API_KEY = "AIzaSyBxcuGXRxmHIsiI6tDQDVWIgtGkU-CHZ-4";

Geocode.setApiKey(GOOGLE_MAPS_API_KEY);
const MealsMapShow = React.memo(({ meals, defaultLocation, onMarkerClick, onMapClick, userId, selectedMeal }) => {
    const getMealIcon = (meal, userId, selectedMeal) => {
        console.log(JSON.stringify(meal));
        console.log(selectedMeal);
       
        if (meal.guest_count <= meal.Atendee_count) {
            return fullUp;
        }

        if (meal.host_id === userId) {
            return hosted;
        }
        if (meal.me > 0 ) {
          return attended;
        }
        return (meal.id === selectedMeal)?
             touched: available;
    }
    // const shouldComponentUpdate = (nextProps,nextState) =>{
    //     return false;
    // }
    const MyGoogleMap = (props) =>

        <GoogleMap
            defaultZoom={8}
            defaultCenter={{ lat: defaultLocation.lat, lng: defaultLocation.lng }}
            onClick={() => onMapClick(this)}
        >

            {meals.map(meal => {
               
                const icon = getMealIcon(meal, userId, selectedMeal);
                const markerSize= selectedMeal === meal.id?30:22;
                return <div name="marker" key={meal.id} className="marker-style" title="meal marker">
                    <Marker
                        position={{ lat: meal.location.y, lng: meal.location.x }}
                        onClick={() => onMarkerClick(meal)}
                        icon={
                            {
                                url: icon,
                                scaledSize: { width: markerSize, height: markerSize, widthUnit: "px" }
                            }}
                    />
                </div>
            }
            )}

        </GoogleMap>;

    const MapWithMarker = withScriptjs(withGoogleMap(MyGoogleMap));



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