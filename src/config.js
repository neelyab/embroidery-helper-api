module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://dunder_mifflin:paper@localhost/embroidery_helper',
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY,
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'https://embroidery-helper.now.sh/'
}