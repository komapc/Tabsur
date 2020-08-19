const express = require('express');
const AWS = require('aws-sdk');
const fs = require('fs');
const keys = require("../../config/keys");
const fileType = require('file-type');
const bluebird = require('bluebird');
const multiparty = require('multiparty');
const router = express.Router();

const pgConfig = require("./../dbConfig.js");
let currentConfig = pgConfig.pgConfigProduction;

if (process.env.NODE_ENV === "debug") {
  currentConfig = pgConfig.pgConfigLocal;
}
const { Client } = require("pg");

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
  console.log(`uploadFile, bucket: ${JSON.stringify(params.Bucket)}`)
  return s3.upload(params).promise();
};

insertImageIntoDB = async (imageName, uploader) => {
  console.log(`Inserting image ${imageName} from user [${uploader}]`);
  const client = new Client(currentConfig);

  client.connect();
  const query = `INSERT INTO images (path, status, uploader)
  VALUES($1, 1, $2) RETURNING id`;
  console.log(`connected running [${query}]`);

  var  result = "-2"; 
  return await client.query(query,
    [imageName, Number(uploader)])
    .then(res => {
      console.log(`image inserted, id=${JSON.stringify(res.rows[0])}.`);
      result = res.rows[0].id;
      return result;
    })
    .catch(e => {
      
      console.error(`Inserting image into db failed; exception catched: ${e}`);
      //response.status(500).json(e);
      result = -1;
      return result;
    })
    .finally(()=>client.end());
};

//POST route
router.post("/upload", async (request, response) => {
  const form = new multiparty.Form();
  console.log("Uploading: " + JSON.stringify(form));
  form.parse(request, (error, fields, files) => {
    if (error) {
      console.log("parsing error: " + JSON.stringify(fields));
      throw new Error(error);
    }
    console.log("parsed: " + JSON.stringify(fields));
    console.log("Uploading file: " + JSON.stringify(files));
    const path = files.file[0].path;
    const buffer = fs.readFileSync(path);
    const type = "jpeg"//await fileType(buffer);
    const timestamp = Date.now().toString();
    const fileName = `images/${timestamp}-lg`;
    const uploader = fields.uploader;
    var res = uploadFile(buffer, fileName, type);
    console.log("uploadFile result: " + JSON.stringify(res));
    const ress = insertImageIntoDB(fileName, uploader)
      .then((insertedImageID) => {
        console.log(`then result: ${insertedImageID}`);

        console.log(`insertImageIntoDB [${insertedImageID}]`)
        console.log(`send file [${fileName}], res: [${JSON.stringify(insertedImageID)}]`);
        return response.status(200).json(insertedImageID);
      })
      .catch((error) => {
        console.error(`Uploading error:${JSON.stringify(error)}`);
        return response.status(400).send(error);
      });
  });
});

router.put('/:imageId', function (req, response, next) {
  console.log(`Putting ${JSON.stringify(req.params.imageId)}`);
  return response.status(401).send("Not supported");
});


router.get('/:imageId', function (req, res, next) {
  console.log(`Getting [${JSON.stringify(req.params.imageId)}]`);
  var params = { Bucket: keys.S3_BUCKET, Key: `images/${req.params.imageId}` };
  s3.getObject(params, function (err, data) {
    if (!data) {
      console.error(`params ${JSON.stringify(params)}`);
      res.status(404).send("empty data");
      return;
    }
    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    res.write(data.Body, 'binary');
    //todo: resize
    res.end(null, 'binary');
  });
});

//get images for a user AKA gallery
router.get('/gallery/:userId', function (req, response, next) {
  console.log(`Get images for a user from user [${req.params.userId}]`);
  const client = new Client(currentConfig);

  client.connect();
  const query = `SELECT i.path FROM images as i
  INNER JOIN users as u
  ON u.id=i.uploader
  WHERE u.id=$1`;
  console.log(`connected running [${query}]`);
  return client.query(query, [req.params.userId])
    .then(data => {
      // return response.status(201).json(user);
      console.log(`data: ${JSON.stringify(data.rows)}`);
      return response.json(data.rows);
    })
    .catch(err => {
      console.error(`getting images failed:  ${err}`);
      return response.status(500).json(err);
    })
    .finally()
    {
      client.end();
    }

});

module.exports = router;