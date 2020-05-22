
import React, { useState, useEffect } from 'react';
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
      {/* <input type='text' className='form-control' id="image"
        onChange={(e) => { update(e) }} /> */}

      <React.Fragment>
       
        <input
          id='upload-image'
          type='file'
          accept='image/*'
          onChange={getImage}
        />
        <p>{"state.message"}</p>
        <form onSubmit={update}>
          <button id='file-upload-button'>Upload</button>
        </form>
      </React.Fragment>


      <button onClick={(e) => { submit(e) }}>submit</button>
    </div>
  );
};
export default ImageStep;
