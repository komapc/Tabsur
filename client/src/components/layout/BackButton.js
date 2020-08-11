import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import backButton from "../../resources/back_button.svg";
const BackButton = (props) => {
    const onClick = () =>
    {
        props.history.goBack();
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