
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
  let address = "";
  const onLocationUpdate = ({ address, location }) => {
    //this.setState({ address, location })
  };

  const onMapExit = (e) => {
    setMapVisibility( false);
  }

  const onChange = e => {
    //  this.setState({ [e.target.id]: e.target.value });
  };


  const onAddressClickHandle = e => {
    setMapVisibility( true);
  }

  return (
    <span>
      {/* <div className="wizard-container">

      <label>Location</label>
      <input type='text' className='form-control' id="location"
        onChange={update} />
    </div> */}
      {/* Address*/}
      <div>
        <img className="meal-info-location-icons" src={locationIcon} alt="location" />
        <span className="location-input-field input-field col s12">
          <input
            onChange={onChange}
            onClick={onAddressClickHandle}
            value={address}
            error={errors.password}
            id="address"
            type="text"
            notched="true"
          />
          <label htmlFor="address" shrink="true">Location</label>
          <span className="red-text">{errors.address}</span>
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
