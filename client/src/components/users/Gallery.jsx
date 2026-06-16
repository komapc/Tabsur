import React, { useState, useEffect } from "react";
import { getUserImages } from "../../actions/userActions";

import config from "../../config";

const Gallery = (props) => {
  const [images, setImages] = useState([]);
  
  useEffect(() => {
    console.log(`useEffect called ${props.id}.`);
    getUserImages(props.id)
    .then(res => {
      const data = res.data;
      console.log(`Data: ${JSON.stringify(data)}`); 
      setImages(data);
      
    })
    .catch(err => {
      console.error(err);
    });
  }, [props.id]);

  
  return <>

     {/* Under Construction : {JSON.stringify(images)}  */}
     {images.map(image => {
         const path =`${config.SERVER_HOST}/api/${image.path}.undefined`;
          return <img width="50vw" height="50vw" src={path} key={image.id} alt={image.id}/>
        })
      }
    </>
}
export default Gallery;