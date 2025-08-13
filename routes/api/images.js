const express = require('express');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const keys = require('../../config/keys');
// const fileType = require('file-type');
const multiparty = require('multiparty');
const insertImageIntoDB = require('./utility.js');
const router = express.Router();
const pool = require('../db.js');
const { authenticateJWT } = require('../authenticateJWT.js');
// create S3 instance with v3 SDK;
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: keys.AWS_KEY,
    secretAccessKey: keys.AWS_SECRET
  }
});
// abstracts function to upload a file returning a promise;
const uploadFile = async (buffer, name) => {
  const params = {
    ACL: 'public-read',
    Body: buffer,
    Bucket: keys.S3_BUCKET,
    ContentType: 'image/jpeg',
    Key: `${name}.jpeg`
  };
  console.log(`uploadFile, bucket: ${JSON.stringify(params.Bucket)}`);
  const command = new PutObjectCommand(params);
  return s3Client.send(command);
};
//POST route;
router.post('/upload', authenticateJWT, async (request, response) => {
  const form = new multiparty.Form();
  console.log('Uploading: ' + JSON.stringify(form));
  return form.parse(request, async (error, fields, files) => {
    if (error) {
      console.error('parsing error: ' + JSON.stringify(fields));
      throw new Error(error);
    }
    console.log(`parsed: ${JSON.stringify(fields)}`);
    console.log(`Uploading file: ${JSON.stringify(files)}`);
    const path = files.file[0].path;
    const buffer = fs.readFileSync(path);
    const type = 'jpeg'; //await fileType(buffer);
    const timestamp = Date.now().toString();
    const fileName = `images/${timestamp}-lg`;
    const uploader = fields.uploader;
    return await uploadFile(buffer, fileName, type)
      .then(async res => {
        console.log('uploadFile result: ' + JSON.stringify(res));
        return insertImageIntoDB(fileName, uploader)
          .then((insertedImageID) => {
            console.log(`insertImageIntoDB [${insertedImageID}]`);
            console.log(`send file [${fileName}], res: [${JSON.stringify(insertedImageID)}]`);
            return response.status(200).json(insertedImageID);
          })
          .catch((error) => {
            console.error(`Uploading error:${JSON.stringify(error)}`);
            return response.status(400).send(error);
          });
      })
      .catch(error => {
        console.error(`/upload error: ${JSON.stringify(error)}`);
        return error;
      });
  });
});
router.put('/:imageId', function (req, response) {
  console.log(`Putting ${JSON.stringify(req.params.imageId)}`);
  return response.status(401).send('Not supported');
});
router.get('/:imageId', async function (req, res) {
  console.log(`Getting [${JSON.stringify(req.params.imageId)}]`);
  const params = { Bucket: keys.S3_BUCKET, Key: `images/${req.params.imageId}` };
  const command = new GetObjectCommand(params);
  try {
    const data = await s3Client.send(command);
    if (!data) {
      console.error(`params ${JSON.stringify(params)}`);
      res.status(404).send('empty data');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    // Convert stream to buffer for v3;
    const chunks = [];
    data.Body.on('data', chunk => chunks.push(chunk));
    data.Body.on('end', () => {
      const buffer = Buffer.concat(chunks);
      res.write(buffer, 'binary');
      res.end(null, 'binary');
    });
  } catch (err) {
    console.error(`S3 getObject error: ${JSON.stringify(err)}`);
    res.status(404).send('Image not found');
  }
});
//get images for a user AKA gallery;
router.get('/gallery/:userId', async function (req, response) {
  console.log(`Get images for a user [${req.params.userId}]`);
  const client = await pool.connect();
  const query = `SELECT i.path, i.id FROM images as i
  INNER JOIN users as u
  ON u.id=i.uploader
  WHERE u.id=$1`;
  //console.log(`connected running [${query}]`);
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
    .finally(() => {
      client.release();
    });
});
//get avatar;
router.get('/avatar/:userId', async function (req, response) {
  if (req.params.userId === undefined || req.params.userId === 'undefined') {  // TODO: is number bigger than 0
    return response.status(400);
  }
  console.log(`Get an avatar for user [${req.params.userId}]`);
  const client = await pool.connect();
  const query = `SELECT path, status FROM user_images
  INNER JOIN images ON user_images.image_id = images.id
  WHERE user_images.user_id = $1`;
  console.log(`connected running [${query}]`);
  return client.query(query, [req.params.userId])
    .then(data => {
      console.log(`data: ${JSON.stringify(data.rows)}`);
      if (data && data.rows && data.rows[0]) {
        return response.json(data.rows[0].path);
      }
      return response.status(200).json(null);
    })
    .catch(err => {
      console.error(`getting images failed:  ${err}`);
      return response.status(500).json(err);
    })
    .finally(() => {
      client.release();
    });
});
/// utils;
module.exports = router;