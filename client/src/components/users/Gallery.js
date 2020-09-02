import React, { Component, useState } from "react";
import { getUserImages } from "../../actions/userActions"

import config from "../../config";
const Gallery = (id) => {
  const [images, setImages] = useState([]);

  getUserImages(id)
  .then(res => {
    const data = res.data;
    console.log(data);
    return setImages(data);
  })
  .catch(err => {
    console.error(err);
    return err;
  });
  return <span>

      {/* Under Construction : ${JSON.stringify(images)} */}

     {images.map(image => {
         const path =`${config.SERVER_HOST}/api/${image.path}.undefined`;
          return <img width="50vw" height="50vw" src={path} key={image.id} />
        })
      }
    </span>
}
export default Gallery;