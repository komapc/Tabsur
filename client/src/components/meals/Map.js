import React from 'react'
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker } from "react-google-maps";
import Autocomplete from 'react-google-autocomplete';
import Geocode from "react-geocode";

const GOOGLE_MAPS_API_KEY = "AIzaSyBxcuGXRxmHIsiI6tDQDVWIgtGkU-CHZ-4";

Geocode.setApiKey(GOOGLE_MAPS_API_KEY);
// Geocode.enableDebug();
class Map extends React.Component {
  constructor(props) {
    super(props);
    this.map = React.createRef();

    this.state = {
      address: this.props.address,
      city: '',
      area: '',
      state: '',
      center: {
        lat: this.props.center.lat,
        lng: this.props.center.lng
      },
      markerPosition: {
        lat: this.props.center.lat,
        lng: this.props.center.lng
      },
      google: this.props.google,
      zoom: this.props.zoom,
    };

    Geocode.fromAddress(this.state.address).then(
        response => {
          const { lat, lng } = response.results[0].geometry.location;
          console.log(lat, lng);
          this.setState({markerPosition: {lat, lng}});
        },
        error => {
          console.error(error);
        }
    );
    Geocode.fromLatLng(this.state.center.lat, this.state.center.lng).then(
      response => {
        if ((!response.results) || (response.results.length === 0)) {
          return;
        }
        const address = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = this.getCity(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray);

        this.setState({
          address: (address) ? address : '',
          area: (area) ? area : '',
          city: (city) ? city : '',
          state: (state) ? state : '',
        })
      },
      error => {
        console.error(error);
      }
    );
  }

  componentWillReceiveProps(nextProps) {
    Geocode.fromAddress(this.state.address).then(
        response => {
          const { lat, lng } = response.results[0].geometry.location;
          console.log(lat, lng);
          this.setState({markerPosition: {lat, lng}, address: this.props.address});
        },
        error => {
          console.error(error);
        }
    );
  }

    /**
    * Component should only update ( meaning re-render ), when the user selects the address, or drags the pin
    *
    * @param nextProps
    * @param nextState
    * @return {boolean}
    */
  shouldComponentUpdate(nextProps, nextState) {
    if (
     this.state.markerPosition.lat !== this.props.center.lat ||
     this.state.address !== nextState.address ||
     this.state.city !== nextState.city ||
     this.state.area !== nextState.area ||
     this.state.state !== nextState.state
    ) {
     return true
    } else if (this.props.center.lat === nextProps.center.lat) {
     return false
    }
  }
  /**
    * Get the city and set the city input value to the one selected
    *
    * @param addressArray
    * @return {string}
    */
  getCity = (addressArray) => {
    let city = '';
    if (!addressArray) {
      return "Unknown city"
    }
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0] && 'administrative_area_level_2' === addressArray[i].types[0]) {
        city = addressArray[i].long_name;
        return city;
      }
    }
  };
  /**
    * Get the area and set the area input value to the one selected
    *
    * @param addressArray
    * @return {string}
    */
  getArea = (addressArray) => {
    let area = '';
    if (!addressArray) {
      return "Unknown area"
    }
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0]) {
        for (let j = 0; j < addressArray[i].types.length; j++) {
          if ('sublocality_level_1' === addressArray[i].types[j] || 'locality' === addressArray[i].types[j]) {
            area = addressArray[i].long_name;
            return area;
          }
        }
      }
    }
  };
  /**
    * Get the address and set the address input value to the one selected
    *
    * @param addressArray
    * @return {string}
    */
  getState = (addressArray) => {
    let state = '';
    if (!addressArray) {
      return "Unknown area"
    }
    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if (addressArray[i].types[0] && 'administrative_area_level_1' === addressArray[i].types[0]) {
          state = addressArray[i].long_name;
          return state;
        }
      }
    }
  };
  /**
    * And function for city,state and address input
    * @param event
    */
  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  /**
    * This Event triggers when the marker window is closed
    *
    * @param event
    */
  onInfoWindowClose = (event) => {
  };
  /**
    * When the user types an address in the search box
    * @param place
    */
  onPlaceSelected = (place) => {
    if (!place || !place.geometry) {
      return;
    }

    const address = place.formatted_address,
      addressArray = place.address_components,
      city = this.getCity(addressArray),
      area = this.getArea(addressArray),
      state = this.getState(addressArray),
      latValue = place.geometry.location.lat(),
      lngValue = place.geometry.location.lng();
    // Set these values in the state.
    this.setState({
      address: (address) ? address : '',
      area: (area) ? area : '',
      city: (city) ? city : '',
      state: (state) ? state : '',
      markerPosition: {
        lat: latValue,
        lng: lngValue
      },
      center: {
        lat: latValue,
        lng: lngValue
      },
    })
  };
  /**
    * When the marker is dragged you get the lat and long using the functions available from event object.
    * Use geocode to get the address, city, area and state from the lat and lng positions.
    * And then set those values in the state.
    *
    * @param event
    */
  onMarkerDragEnd = (event) => {
    console.log('event', event);
    let newLat = event.latLng.lat(),
      newLng = event.latLng.lng(),
      addressArray = [];

    const zoom = this.map.current.getZoom();
    const center = this.map.current.getCenter();
    console.debug('zzz',center.lat(), center.lng())
    this.setState({
      zoom,
      center: {lat: center.lat(), lng: center.lng()},
      markerPosition: {lat: newLat, lng: newLng},
    });

    Geocode.fromLatLng(newLat, newLng).then(
      response => {
        const address = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = this.getCity(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray);

         this.props.handleLocationUpdate({address, area, city, state});
         this.setState({
            address: (address) ? address : '',
            area: (area) ? area : '',
            city: (city) ? city : '',
            state: (state) ? state : '',
         })
      },
      error => {
        console.error(error);
      }
    );
  };

  render() {
    const MealsMap = <GoogleMap google={this.props.google}
                          defaultZoom={this.state.zoom}
                          defaultCenter={{lat: this.state.center.lat, lng: this.state.center.lng}}
                          center={this.state.center}
                          zoom={this.state.zoom}
                          ref={this.map}
    >

      {/* For Auto complete Search Box */}
      <Autocomplete

          onPlaceSelected={this.onPlaceSelected}
          //types={['(regions)']}
      />

      {/* InfoWindow on top of marker */}
      <InfoWindow
          onClose={this.onInfoWindowClose}
          position={{lat: (this.state.markerPosition.lat + 0.0018), lng: this.state.markerPosition.lng}}
      >
        <div>
          <span>{this.state.address}</span>
        </div>
      </InfoWindow>
      {/*Marker*/}
      <Marker
          draggable={true}
          onDragEnd={this.onMarkerDragEnd}
          position={{lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng}}/>
    </GoogleMap>;

    const AsyncMap = withScriptjs(
      withGoogleMap(
        props => (
          MealsMap
        )
      )
    );
    let map;
    if (this.props.center.lat !== undefined) {
      map =

        <AsyncMap
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`}
          loadingElement={
            <div style={{ height: `100%` }} />
          }
          containerElement={
            <div style={{ height: this.props.height }} />
          }
          mapElement={
            <div style={{ height: `100%` }} />
          }
        />

    } else {
      map = <div style={{ height: this.props.height }} />
    }
    return (map)
  }
}
export default Map