const config = {
 app: {
  port: 3000,
  SMTP_HOST:'',
  SMTP_PORT:'',
  SMTP_EMAIL:'',
  SMTP_PASSWORD:'',
  FROM_EMAIL:'',
  FROM_NAME:'',
 },
 DB: {
   URI: 'mongodb+srv://admin:admin@devserver-8jnix.mongodb.net/test?retryWrites=true&w=majority'
 },
 JWT: {
  jwtSecret: '1337abc',
  jwtExpire: '30d',
  jwtCookieExpire: '30',
 }
};

module.exports = config;