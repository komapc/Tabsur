import React from 'react';
import { LoadScript } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "AIzaSyB_l00z3A2dNzBA7X2Xag9obkOPwb7FoVw";
const MAPS_LIBRARIES = ['places'];

const GoogleMapsProvider = ({ children }) => {
  return (
    <LoadScript
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      libraries={MAPS_LIBRARIES}
      onLoad={() => console.log('Google Maps loaded successfully')}
      onError={(error) => console.error('Google Maps failed to load:', error)}
    >
      {children}
    </LoadScript>
  );
};

export default GoogleMapsProvider;
