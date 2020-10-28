import React from "react";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';

const BackBarMui = (props) => {
    const handleClick = (e) => {
        console.log("back clicked");
        const hasHistory = props.history.length > 2;
        hasHistory ? props.history.goBack(e) : props.history.push('/');
    }
    return (
        <IconButton aria-label="back" size="medium" onClick={handleClick} className={props.className}>
            <ArrowBackIcon />
        </IconButton >
    );
}

export default BackBarMui;