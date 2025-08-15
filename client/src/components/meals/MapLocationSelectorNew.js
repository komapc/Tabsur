/* global google */
import React, { Component } from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import PlacesAutocomplete from "react-places-autocomplete";

class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address: "" };
    this.placesService = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleChange = (address) => {
    this.setState({ address });
  };

  handleSelect = (address, placeId) => {
    this.setState({ address });

    const request = {
      placeId: placeId,
      fields: ["name", "geometry"]
    };
    this.placesService.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.props.onPlaceChanged(place);
      }
    });
  };

  render() {
    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className="autocomplete-container">
            <input
              {...getInputProps({
                placeholder: "Search Places ...",
                className: "location-search-input"
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: "#fafafa", cursor: "pointer" }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };
                return (
                  <div key=''
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}

class MapLocationSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = { places: [] };
    this.showPlace = this.showPlace.bind(this);
    this.mapRef = React.createRef();
  }

  showPlace(place) {
    this.setState((prevState) => ({
      places: [...prevState.places, place]
    }));
    this.mapRef.current.map.setCenter(place.geometry.location);
  }

  render() {
    return (
      <div className="map-container">
        <LocationSearchInput onPlaceChanged={this.showPlace} />
        <Map
          ref={this.mapRef}
          google={this.props.google}
          className={"map"}
          zoom={4}
          initialCenter={this.props.center}
        >
          {this.state.places.map((place, i) => {
            return <Marker key={i} position={place.geometry.location} />;
          })}
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  libraries: ["places"]
})(MapLocationSelector);