const express = require('express');
const pool = require('../db.js');

/// utils

const insertImageIntoDB = async (imagePath, uploader) => {
  console.log(`Inserting image [${JSON.stringify(imagePath)}]`);
  //console.log(`Inserting image [${JSON.stringify(imagePath)}] from user [${JSON.stringify(uploader)}]`);
  if (isNaN(uploader) || imagePath === '')
  {
    console.error(`Cannot insert image: empty data ${imagePath} / ${uploader}.`);
    return -3;
  }
  const client = await pool.connect();
  const query = `INSERT INTO images (path, status, uploader)
  VALUES($1, 1, $2) RETURNING id`;
  console.log(`connected running [${query}]`);

  let  result = '-2';
  return client.query(query,
    [imagePath, Number(uploader)])
    .then(res => {
      console.log(`insertImageIntoDB: image inserted, id=${JSON.stringify(res.rows[0])}.`);
      result = res.rows[0].id;
      return result;
    })
    .catch(e => {
      console.error(`Inserting image into db failed; exception catched: ${e}`);
      //response.status(500).json(e);
      result = -1;
      return result;
    })
    .finally(()=>client.release());
};


module.exports = insertImageIntoDB;