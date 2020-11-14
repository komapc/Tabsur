const express = require('express');
const AWS = require('aws-sdk');
const fs = require('fs');
const keys = require("../../config/keys");
const fileType = require('file-type');
const bluebird = require('bluebird');
const multiparty = require('multiparty');
const router = express.Router();
const pool = require("../db.js");

// configure the keys for accessing AWS
AWS.config.update({
  accessKeyId: keys.AWS_KEY,//process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// configure AWS to work with promises
AWS.config.setPromisesDependency(bluebird);

// create S3 instance
const s3 = new AWS.S3();

// abstracts function to upload a file returning a promise
const uploadFile = async (buffer, name, type) => {
  type.ext = "jpeg";
  type.mime = "image/jpeg";
  const params = {
    ACL: 'public-read',
    Body: buffer,
    Bucket: keys.S3_BUCKET,
    ContentType: type.mime,
    Key: `${name}.${type.ext}`
  };
  console.log(`uploadFile, bucket: ${JSON.stringify(params.Bucket)}`);
  return s3.upload(params).promise();
};

/// utils

const insertImageIntoDB = async (imagePath, uploader) => {
  console.log(`Inserting image [${JSON.stringify(imagePath)}]`);
  //console.log(`Inserting image [${JSON.stringify(imagePath)}] from user [${JSON.stringify(uploader)}]`);
  if (isNaN(uploader) || imagePath === "")
  {
    console.error(`Cannot insert image: empty data ${imagePath} / ${uploader}.`);
    return -3;
  }
  const client = await pool.connect();
  const query = `INSERT INTO images (path, status, uploader)
  VALUES($1, 1, $2) RETURNING id`;
  console.log(`connected running [${query}]`);

  var  result = "-2"; 
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