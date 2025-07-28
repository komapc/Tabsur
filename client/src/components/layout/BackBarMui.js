import React from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';

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