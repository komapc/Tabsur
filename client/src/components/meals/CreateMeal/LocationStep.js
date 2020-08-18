import React, { useState } from 'react';
import MapLocationSelector from "./../MapLocationSelector";
import locationIcon from "../../../resources/location_icon.svg"
import { TextField, Grid, Box } from '@material-ui/core';
const LocationStep = props => {
  const [showMap, setMapVisibility] = useState(false);
  const defaultLocationConst = { lng: 34.808, lat: 32.09 };

  const [defaultLocation, updateDefaultLocation] = useState(defaultLocationConst);
  let errors = {};
  const onLocationUpdate = ({ address, location }) => {
    props.update({ "id": "address", "value": address });
    props.update({ "id": "location", "value": location });
    updateDefaultLocation(location);
  };

  const onMapExit = (e) => {
    if (e)
    {
      e.preventDefault();
      e.stopPropagation();
    }
    setMapVisibility(false);
  }

  const onChange = e => {
    props.update(e.target);
    onMapExit();
  };

  const onAddressClickHandle = e => {
    e.target.blur()
    e.preventDefault();
    e.stopPropagation();
    setMapVisibility(true);
  }

  return (
    <>
      {/* Address*/}
      {/* <img className="meal-info-location-icons" src={locationIcon} alt="location" /> */}
      <Grid container  >
        <Box m={2} p={2} width={1}  display={showMap?'none':'block'} onClick={onAddressClickHandle} >
          <TextField width={1} fullWidth
            onChange={onChange}
            value={props.form.address}
            error={props.form.address.trim() === ""}
            id="address"
            label="Location"
            placeholder="Address"
            helperText={props.form.address.trim() == "" ? "Empty" : ""}
        />
        </Box >
        <div className={showMap ? 'createMealMap' : 'createMealMap-hidden'} hidden={!showMap}>
          <MapLocationSelector
            handleLocationUpdate={onLocationUpdate}
            defaultLocation={defaultLocation}
            handleExit={onMapExit}
          />
        </div>
      </Grid>
    </>
  );
};
export default LocationStep;