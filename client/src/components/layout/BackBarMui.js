import React from "react";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';

const BackBar = (props) => {
    return (
        <React.Fragment>
            <IconButton aria-label="back" size="large" color="primary">
                <ArrowBackIcon fontSize="inherit" onClick={props.history.goBack} />
            </IconButton>
        </React.Fragment>
    );
}

export default BackBar;