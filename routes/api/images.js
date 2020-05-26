const express = require('express');
const AWS = require('aws-sdk');
const fs = require('fs');
const keys = require("../../config/keys");
const fileType = require('file-type');
const bluebird = require('bluebird');
const multiparty = require('multiparty');
const router = express.Router();
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
const uploadFile = (buffer, name, type) => {
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


// Define POST route
router.post("/upload", async (request, response) => {
  console.log("Uploading: " + request.formData);
  const form = new multiparty.Form();
  console.log("parsing form: " + JSON.stringify(form));
  form.parse(request, async (error, fields, files) => {
    if (error) {
      console.log("parsing error: " + JSON.stringify(fields));
      throw new Error(error);
    }
    try {
      console.log("Uploading file: " + JSON.stringify(files));
      const path = files.file[0].path;
      const buffer = fs.readFileSync(path);
      const type = "jpeg"//await fileType(buffer);
      const timestamp = Date.now().toString();
      const fileName = `images/${timestamp}-lg`;
      const data =
        uploadFile(buffer, fileName, type)
          .then(res => {

            console.log("send file:6 " + res);

            return response.status(200).send(data);
          })
          .error(error => {
            console.log("uploadFile error: " + JSON.stringify(error));
            return response.status(400).send(error);
          }
          )
    }
    catch (error) {
      console.log("Uploading error: " + JSON.stringify(error));
      return response.status(400).send(error);
    }
  });
});

router.get('/:imageId', function (req, res, next) {
  // ACL: 'public-read',
  //   Body: buffer,
  //   Bucket: "images.dining.philosophers.com",
  //   ContentType: type.mime,
  //   Key: `${name}.${type.ext}`
  console.log("Getting   " + JSON.stringify(req.params.imageId ));
  var params = { Bucket: keys.S3_BUCKET, Key: "images/"+req.params.imageId };
  s3.getObject(params, function(err, data) {
      if (!data)
      {
        res.status(404).send("empty data");
        return;
      }
      res.writeHead(200, {'Content-Type': 'image/jpeg'});
      res.write(data.Body, 'binary');
      res.end(null, 'binary');
  });
});


module.exports = router;