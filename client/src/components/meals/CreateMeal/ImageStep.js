import React, { useState } from 'react';
import wizard_done from "../../../resources/wizard/wizard_done.svg";

import axios from 'axios';
import config from "../../../config";

const ImageStep = props => {
 
  const [state, updateState] = useState({ });

  const submit = (e) => {
    props.submit(e);
  };
  const getImage = e => {
    const files = e.target.files;
    const file=URL.createObjectURL(files[0]);
    //debugger;
    console.log("Path: " + JSON.stringify(file));
    
    updateState({ "file": file });

    submitFile(e,files[0] );
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
      <img width="50px" height="50px" src={state.file} alt="Uploaded"/>
      <label>Upload image</label>
      {/* <input type='text' className='form-control' id="image"
        onChange={(e) => { update(e) }} /> */}

      <React.Fragment>

        <input
          id='upload-image'
          type='file'
          accept='image/*'
          onChange={getImage}
        />
      </React.Fragment>

      <div>
        <img width="30px" src={wizard_done} alt="submit" onClick={(e) => { submit(e) }} />
      </div>
    </div>
  );
};
export default ImageStep;
