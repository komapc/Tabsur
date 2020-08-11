import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import backButton from "../../resources/back_button.svg";
const BackButton = (props) => {
    const onClick = () =>
    {
        const hasHistory = props.history.length>2;
        console.log("Length: " + hasHistory);
        hasHistory? props.history.goBack() : props.history.push('/');
    }
    return (

        <>
            <img width="20px"
                alt="back"
                onClick={onClick}
                src={backButton}
            />
        </>
    );
}

export default withRouter(BackButton);