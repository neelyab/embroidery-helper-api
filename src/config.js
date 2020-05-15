module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    CLIENT_ORIGIN: 'https://embroidery-helper.now.sh/',
    DB_URL: process.env.DB_URL || 'postgresql://dunder_mifflin:paper@localhost/embroidery_helper',
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY
  }