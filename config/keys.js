require('dotenv').config();

module.exports = {
  google: process.env.GOOGLE_API_KEY,
  facebook_id: process.env.FACEBOOK_APP_ID,
  AWS_KEY: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET: process.env.AWS_SECRET_ACCESS_KEY,
  S3_BUCKET: process.env.S3_BUCKET,
  secretOrKey: process.env.JWT_SECRET
};
