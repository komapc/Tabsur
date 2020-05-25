import React, { useState, useEffect } from 'react';
import wizard_done from "../../../resources/wizard/wizard_done.svg";

const ImageStep = props => {
 
  const [state, updateState] = useState({
  });

  const submit = (e) => {
    props.submit(e);
  };
  const getImage = e => {
    //alert(JSON.stringify(e.target.files[0].name));
    //var url = reader.readAsDataURL(file);
    
    const files = e.target.files;
    const file=URL.createObjectURL(files[0]);
    //debugger;
    console.log("Path: " + JSON.stringify(file));
    
      updateState({ "file": file });
      //this.setState({ file });
    
  };

  return (
    <div className="wizard-container">
      <img width="50px" height="50px" src={state.file} alt="Uploaded image"/>
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
