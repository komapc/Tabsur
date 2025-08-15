import React, { useState } from 'react';

import Geocode from "react-geocode";
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

import attended_u from "../../resources/map/attended_meal_icon.svg";
import fullUp_u from "../../resources/map/full_meal_icon.svg";
import hosted_u from "../../resources/map/my_meal_icon.svg"
import available_u from "../../resources/map/active_meal_icon.svg";

import attended_t from "../../resources/map/attended_meal_icon_touched.svg";
import fullUp_t from "../../resources/map/full_meal_icon_touched.svg";
import hosted_t from "../../resources/map/my_meal_icon_touched.svg";
import available_t from "../../resources/map/active_meal_icon_touched.svg";

import myLocation from "../../resources/map/my_location.svg";
import blueCircle from "../../resources/map/bluecircle.png";

const attended = [attended_u, attended_t];
const fullUp = [fullUp_u, fullUp_t];
const hosted = [hosted_u, hosted_t];
const available = [available_u, available_t];

export const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

Geocode.setApiKey(GOOGLE_MAPS_API_KEY);
const MealMapShow =
    React.memo(
        ({ meals, defaultLocation, onMarkerClick, onMapClick, userId, selectedMeal }) => {
            const getMealIcon = (meal, userId, isSelected) => {
                const selectedIndex = isSelected ? 1 : 0;
                console.log(`meal: ${JSON.stringify(meal)}`);
                console.log(`selectedMeal = ${selectedIndex}`);

                if (meal.guest_count <= meal.Atendee_count) {
                    return fullUp[selectedIndex];
                }

                if (meal.host_id === userId) {
                    return hosted[selectedIndex];
                }
                if (meal.me > 0) {
                    return attended[selectedIndex];
                }
                return available[selectedIndex];
            };

            const MyGoogleMap = (props) => {
                const google = window.google;
                const [position, setPosition] = useState(defaultLocation);
                const myOptions = {
                    zoom: 8,
                    mapTypeControlOptions: {
                        //style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                        //position: google.maps.ControlPosition.TOP_CENTER,

                        mapTypeIds: []
                    }, // here´s the array of controls
                    disableDefaultUI: true, // a way to quickly hide all controls
                    mapTypeControl: true,
                    scaleControl: true,
                    zoomControl: true,

                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                const findMe = () => {
                    setPosition({ ...defaultLocation });
                    console.log(position);
                }


                return <GoogleMap
                    defaultZoom={8}
                    defaultCenter={{ lat: defaultLocation.lat, lng: defaultLocation.lng }}
                    onClick={() => onMapClick(this)}
                    center={{ lat: position.lat, lng: position.lng }}
                    options={myOptions}
                >

                    {meals.map(meal => {
                        const isSelected = selectedMeal === meal.id;
                        const icon = getMealIcon(meal, userId, isSelected);
                        const markerSize = isSelected ? 40 : 30;
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

                    <Marker
                        icon={blueCircle}
                        position={defaultLocation} />
                    <img src={myLocation} alt='here'
                        onClick={() => { findMe() }} style={{ position: "fixed", right: "33px", top: "55px" }} />

                </GoogleMap>;
            }
            const MapWithMarker = LoadScript(MyGoogleMap);

            return (
                <MapWithMarker
                    yesIWantToUseGoogleMapApiInternals
                    loadingElement={<div style={{ height: `100vw` }} />}
                    containerElement={<div style={{ height: `100%`, width: `100vw` }} />}
                    mapElement={<div style={{ height: `100%`, width: `100vw` }} />}
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?libraries=places&key=${GOOGLE_MAPS_API_KEY}`}
                />
            )
        }
    );

export default MealMapShow;