import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import axios from 'axios';
import config from "../../../config";
import placeholder from "../../../resources/wizard/image_placeholder.png"
const ImageStep = props => {

  const [state, updateState] = useState({ "file": placeholder });

  const getImage = e => {
    const files = e.target.files;
    const file = URL.createObjectURL(files[0]);
    //debugger;
    console.log("Path: " + JSON.stringify(file));

    updateState({ "file": file });

    submitFile(e, files[0]);
    //this.setState({ file });
  };

  const submitFile = (event, files) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', files);
    axios.post(`${config.SERVER_HOST}/api/images/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      alert(response);
    }).catch(error => {
      alert("error: " + error);
    });
  }

  return (

    <div className="wizard-container">
      <div className="wizard-image-placeholder-containter">
        <img className="wizard-image-placeholder" src={state.file} alt="Uploaded" />
      </div>

      <Button
        variant="flat"
        component="label"
      >
        Choose File <input
          type="file" accept="image/*"
          style={{ display: "none" }}
          onChange={getImage}
        />
      </Button>

      <div>
        {/* <img width="30px" src={wizard_done} alt="submit" onClick={(e) => { submit(e) }} /> */}
      </div>
    </div>
  );
};
export default ImageStep;
