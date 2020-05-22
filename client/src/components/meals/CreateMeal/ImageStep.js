
import React, { useState, useEffect } from 'react';
const ImageStep = props => {
  const update = (e) => {
    props.update(e.target);
  };

  const submit = (e) => {
    props.submit(e);
  };

  return (
    <div className="wizard-container">
      <label>Upload image</label>
      {/* <input type='text' className='form-control' id="image"
        onChange={(e) => { update(e) }} /> */}

<React.Fragment>
        <h1>Upload an image to AWS S3 bucket</h1>
        <input
          id='upload-image'
          type='file'
          accept='image/*'
          onChange={this.getImage}
        />
        <p>{this.state.message}</p>
        <form onSubmit={this.uploadFile}>
          <button id='file-upload-button'>Upload</button>
        </form>
      </React.Fragment>


      <button onClick={(e) => { submit(e) }}>submit</button>
    </div>
  );
};
export default ImageStep;
