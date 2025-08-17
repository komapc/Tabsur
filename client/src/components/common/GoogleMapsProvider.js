import React from 'react';
import { LoadScript } from '@react-google-maps/api';
import config from '../../config';

const MAPS_LIBRARIES = ['places'];

const GoogleMapsProvider = ({ children }) => {
  // Only render if API key is available
  if (!config.GOOGLE_MAPS_API_KEY) {
    console.warn('Google Maps API key not configured. Maps functionality will be limited.');
    return <>{children}</>;
  }

  return (
    <LoadScript
      googleMapsApiKey={config.GOOGLE_MAPS_API_KEY}
      libraries={MAPS_LIBRARIES}
      onLoad={() => console.log('Google Maps loaded successfully')}
      onError={(error) => console.error('Google Maps failed to load:', error)}
    >
      {children}
    </LoadScript>
  );
};

export default GoogleMapsProvider;
