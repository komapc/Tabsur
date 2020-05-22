
import React, { useState, useEffect } from 'react';
import wizard_done from "../../../resources/wizard/wizard_done.svg";


const ImageStep = props => {
  const update = (e) => {
    props.update(e.target);
  };

  const submit = (e) => {
    props.submit(e);
  };
  const getImage = e => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      //this.setState({ file });
    }
  };
  return (
    <div className="wizard-container">
      <label>Upload image</label>
      <input type='text' className='form-control' id="image"
        onChange={(e) => { update(e) }} />

      <React.Fragment>

        <input
          id='upload-image'
          type='file'
          accept='image/*'
          onChange={getImage}
        />
        {/* <form onSubmit={update}>
          <button id='file-upload-button'>Upload</button>
        </form> */}
      </React.Fragment>

      <div>
        <img width="30px" src={wizard_done} alt="submit" onClick={(e) => { submit(e) }} />
      </div>
    </div>
  );
};
export default ImageStep;
