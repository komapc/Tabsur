import React from "react";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';

const BackBarMui = (props) => {
    return (
        <React.Fragment>
            <IconButton aria-label="back" size="medium" onClick={
                (e) => {
                    console.log("back clicked");
                    const hasHistory = props.history.length>2;
                    //console.log("Length: " + hasHistory);
                    hasHistory? props.history.goBack(e) : props.history.push('/');
                }
            }>
                <ArrowBackIcon fontSize="inherit" />
            </IconButton>
        </React.Fragment>
    );
}

export default BackBarMui;