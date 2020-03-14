import React from "react"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import {GOOGLE_MAPS_API_KEY} from "./Map";

const MyGoogleMap = (props) => <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}
>
    {props.isMarkerShown && <Marker
        draggable
        position={{ lat: -34.397, lng: 150.644 }}
        onClick={props.onMarkerClick}
        // onDragEnd={this.onMarkerDragEnd}
    />}
</GoogleMap>;

const MapWithMarker = withScriptjs(withGoogleMap(MyGoogleMap));

export class MapLocationSelector extends React.PureComponent {
    state = {
        isMarkerShown: false,
    };

    componentDidMount() {
        this.delayedShowMarker()
    }

    delayedShowMarker = () => {
        setTimeout(() => {
            this.setState({ isMarkerShown: true })
        }, 3000)
    };

    handleMarkerClick = () => {
        this.setState({ isMarkerShown: false })
        this.delayedShowMarker()
    };

    render() {
        return (
            <MapWithMarker
                isMarkerShown={this.state.isMarkerShown}
                onMarkerClick={this.handleMarkerClick}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `90%` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                googleMapURL={`https://maps.googleapis.com/maps/api/js?libraries=places&key=${GOOGLE_MAPS_API_KEY}`}
            />
        )
    }
}