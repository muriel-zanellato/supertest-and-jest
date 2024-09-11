require('dotenv').config();
module.exports = {
  mongoURI: process.env.DB_PROD,
  PORT: process.env.PORT,
  appURL: process.env.appURL,
  jwtSecret: process.env.JWT_SECRET,
};
