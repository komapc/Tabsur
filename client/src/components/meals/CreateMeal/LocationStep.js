
import React, { useState, useEffect } from 'react';
import MapLocationSelector from "./../MapLocationSelector";
import locationIcon from "../../../resources/location_icon.svg"
const LocationStep = props => {

  const update = (e) => {
    props.update(e.target);
  };
  const [showMap, setMapVisibility] = useState(0);
  const defaultLocationConst = { lng: 34.808, lat: 32.09 };

  const location = defaultLocationConst;
  const defaultLocation = defaultLocationConst;
  let errors = {};
  const [state, updateState] = useState({
  });
  const onLocationUpdate = ({ address, location }) => {
    // alert(JSON.stringify("Location: " + JSON.stringify(location)));
    // updateState({ address: address, location: location });
    
    const e = {"id":"address", "value":address}; 
    // alert(JSON.stringify(e));
    // update(1234, e);
    // //update({id:"location", "value":location});
  };

  const onMapExit = (e) => {
    setMapVisibility(false);
  }

  const onChange = e => {
   // alert(JSON.stringify(e.target.id, e.target.value));
    // updateState(e.target.id, e.target.value);
    update(e.target);
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

          <span  >{props.form.location}</span>
        </span>
      </div>
      <div className={showMap ? 'createMealMap' : 'createMealMap-hidden'}>
        <MapLocationSelector
          handleLocationUpdate={onLocationUpdate}
          // address={this.state.address}
          defaultLocation={defaultLocation}
          handleExit={onMapExit}
        />
      </div>

    </span>
  );
};
export default LocationStep;
