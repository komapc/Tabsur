import React from "react";
import Geocode from "react-geocode";
import { GoogleMap, Marker, withGoogleMap, withScriptjs } from "react-google-maps";

import attended_u from "../../resources/attended_meal_icon.svg";
import fullUp_u from "../../resources/full_meal_icon.svg";
import hosted_u from "../../resources/my_meal_icon.svg"
import available_u from "../../resources/active_meal_icon.svg"

import attended_t from "../../resources/attended_meal_icon_touched.svg";
import fullUp_t from "../../resources/full_meal_icon_touched.svg";
import hosted_t from "../../resources/my_meal_icon_touched.svg"
import available_t from "../../resources/active_meal_icon_touched.svg"

const attended = [attended_u, attended_t]
const fullUp = [fullUp_u, fullUp_t]
const hosted = [hosted_u, hosted_t]
const available = [available_u, available_t]

//import touched from "../../resources/touched_meal.svg"

export const GOOGLE_MAPS_API_KEY = "AIzaSyBxcuGXRxmHIsiI6tDQDVWIgtGkU-CHZ-4";

Geocode.setApiKey(GOOGLE_MAPS_API_KEY);
const MealMapShow = 
    React.memo(({ meals, defaultLocation, onMarkerClick, onMapClick, userId, selectedMeal }) => {
    const getMealIcon = (meal, userId, selectedMeal) => {
        console.log(`meal: ${JSON.stringify(meal)}`);
        console.log(`selectedMeal = ${JSON.stringify(selectedMeal)}`);
        const isSelected =  meal.id === selectedMeal?1:0;
      
        if (meal.guest_count <= meal.Atendee_count) {
            return fullUp[isSelected];
        }

        if (meal.host_id === userId) {
            return hosted[isSelected];
        }
        if (meal.me > 0 ) {
          return attended[isSelected];
        }
        return available[isSelected];
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
                const markerSize= selectedMeal === meal.id?30:35;
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
            containerElement={<div style={{ height: `100%`, width:`100%` }} />}
            mapElement={<div style={{ height: `100%`, width:`100%` }} />}
            googleMapURL={`https://maps.googleapis.com/maps/api/js?libraries=places&key=${GOOGLE_MAPS_API_KEY}`}
        />
    )
});

export default MealMapShow;