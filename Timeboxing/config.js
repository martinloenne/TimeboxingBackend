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
   URI: ''
 },
 JWT: {
  jwtSecret: '',
  jwtExpire: '30d',
  jwtCookieExpire: '30',
 }
};

module.exports = config;
