import React, { useState } from 'react';
import MapLocationSelector from "./../MapLocationSelector";
import { TextField, Grid, Box } from '@mui/material';
const LocationStep = props => {
  const [showMap, setMapVisibility] = useState(false);
  const [address, setAddress] = useState(props.location);
  const defaultLocationConst = { lng: 34.808, lat: 32.09 };

  const [defaultLocation, updateDefaultLocation] = useState(defaultLocationConst);
  const onLocationUpdate = ({ address, location }) => {
    props.update({ "id": "address", "value": address });
    props.update({ "id": "location", "value": location });
    console.log(`onLocationUpdate: ${address}; location: ${JSON.stringify(location)}`);
    setAddress(address);
    updateDefaultLocation(location);
  };

  const onMapExit = (e) => {
    console.log(`Exit map clicked: ${showMap}.`);
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setMapVisibility(false);
  };

  const onChange = e => {
    props.update(e.target);
    onMapExit();
  };

  const onAddressClickHandle = e => {
    e.target.blur();
    e.preventDefault();
    e.stopPropagation();
    setMapVisibility(true);
  };

  return (
    <>
      {/* Address*/}
      {/* <img className="meal-info-location-icons" src={locationIcon} alt="location" /> */}
      <Grid container>
        <h3 style={{ marginLeft: "40px" }} display={showMap ? 'none' : 'block'} >Meal Location</h3>
        <Box m={2} p={2} width={1} display={showMap ? 'none' : 'block'} onClick={onAddressClickHandle} >
          <TextField width={1} fullWidth variant="outlined"
            onChange={onChange}
            value={props.form.address}
            error={props.form.address.trim() === ""}
            id="address"
            label="Location"
            placeholder="Address"
            helperText={props.form.address.trim() === "" ? "Empty" : ""}
          />
        </Box >
        <div className={'createMealMap'} hidden={!showMap}>
          <MapLocationSelector
            handleLocationUpdate={onLocationUpdate}
            defaultLocation={defaultLocation}
            address={address}
            handleExit={onMapExit}
            zoom={10}
          />
        </div>
      </Grid>
    </>
  );
};
export default LocationStep;