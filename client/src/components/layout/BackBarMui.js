import React from "react";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';

const BackBar = (props) => {
    return (
        <React.Fragment>
            <IconButton aria-label="back" size="medium" color="primary" onClick={props.history.goBack} >
                <ArrowBackIcon fontSize="inherit" />
            </IconButton>
        </React.Fragment>
    );
}

export default BackBar;