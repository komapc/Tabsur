import React, { useState } from 'react';
import MapLocationSelector from "./../MapLocationSelector";
import locationIcon from "../../../resources/location_icon.svg"
const LocationStep = props => {
  const [showMap, setMapVisibility] = useState(0);
  const defaultLocationConst = { lng: 34.808, lat: 32.09 };

  //const defaultLocation = defaultLocationConst;
  const [defaultLocation, updateDefaultLocation] = useState(defaultLocationConst);
  let errors = {};
  //const [state, updateState] = useState({});
  const onLocationUpdate = ({ address, location }) => {
    props.update({ "id": "address", "value": address });
    props.update({ "id": "location", "value": location });
    updateDefaultLocation(location);
  };

  const onMapExit = () => {
    setMapVisibility(false);
  }

  const onChange = e => {
   // updateState({ [e.target.id]: e.target.value });
    props.update(e.target);
    onMapExit();
  };

  const onAddressClickHandle = e => {
    setMapVisibility(true);
  }

  return (
    <span>
      {/* Address*/}
      <div>
        <img className="meal-info-location-icons" src={locationIcon} alt="location" />
        <span className="location-input-field input-field col s12">
          <input
            onChange={onChange}
            onClick={onAddressClickHandle}
            value={props.form.address}
            error={errors.password}
            id="address"
            type="text"
            notched="true"
          />
          <label htmlFor="address" shrink="true">Location</label>
          <span className="red-text">{errors.address}</span>

          {/* <span>{JSON.stringify(props.form.location) }</span> */}
        </span>
      </div>
      <div className={showMap ? 'createMealMap' : 'createMealMap-hidden'}>
        <MapLocationSelector
          handleLocationUpdate={onLocationUpdate}
          defaultLocation={defaultLocation}
          handleExit={onMapExit}
        />
      </div>

    </span>
  );
};
export default LocationStep;