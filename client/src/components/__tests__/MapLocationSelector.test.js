import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapLocationSelector from '../meals/MapLocationSelector';

// Mock Google Maps API
jest.mock('@react-google-maps/api', () => ({
  GoogleMap: ({ children, onClick }) => (
    <div data-testid="google-map" onClick={onClick}>
      {children}
    </div>
  ),
  Marker: ({ position, onDragEnd }) => (
    <div 
      data-testid="map-marker" 
      onDragEnd={onDragEnd}
      data-lat={position.lat}
      data-lng={position.lng}
    />
  ),
  LoadScript: ({ children }) => <div data-testid="load-script">{children}</div>
}));

// Mock react-geocode
jest.mock('react-geocode', () => ({
  setApiKey: jest.fn(),
  fromLatLng: jest.fn().mockResolvedValue({
    results: [{ formatted_address: 'Mock Address' }]
  }),
  fromAddress: jest.fn().mockResolvedValue({
    results: [{
      geometry: {
        location: { lat: 40.7128, lng: -74.0060 }
      }
    }]
  })
}));

// Mock react-google-places-autocomplete
jest.mock('react-google-places-autocomplete', () => ({
  __esModule: true,
  default: ({ onSelect }) => (
    <div 
      data-testid="places-autocomplete"
      onClick={() => onSelect({ description: 'Test Address' })}
    />
  )
}));

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn()
};
global.navigator.geolocation = mockGeolocation;

describe('MapLocationSelector', () => {
  const mockProps = {
    defaultLocation: { lat: 40.7128, lng: -74.0060 },
    address: 'Test Address',
    handleLocationUpdate: jest.fn(),
    handleExit: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<MapLocationSelector {...mockProps} />);
    
    expect(screen.getByTestId('load-script')).toBeInTheDocument();
    expect(screen.getByTestId('google-map')).toBeInTheDocument();
    expect(screen.getByTestId('map-marker')).toBeInTheDocument();
  });

  it('displays the correct marker position', () => {
    render(<MapLocationSelector {...mockProps} />);
    
    const marker = screen.getByTestId('map-marker');
    expect(marker).toHaveAttribute('data-lat', '40.7128');
    expect(marker).toHaveAttribute('data-lng', '-74.0060');
  });

  it('calls handleExit when close button is clicked', () => {
    render(<MapLocationSelector {...mockProps} />);
    
    const closeButton = screen.getByAltText('Close map');
    fireEvent.click(closeButton);
    
    expect(mockProps.handleExit).toHaveBeenCalledTimes(1);
  });

  it('handles address selection from autocomplete', async () => {
    render(<MapLocationSelector {...mockProps} />);
    
    const autocomplete = screen.getByTestId('places-autocomplete');
    fireEvent.click(autocomplete);
    
    await waitFor(() => {
      expect(mockProps.handleLocationUpdate).toHaveBeenCalledWith({
        address: 'Test Address',
        location: { lat: 40.7128, lng: -74.0060 }
      });
      expect(mockProps.handleExit).toHaveBeenCalled();
    });
  });

  it('requests geolocation on mount', () => {
    render(<MapLocationSelector {...mockProps} />);
    
    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledTimes(1);
    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function)
    );
  });
});