export default () => ({
  port: (process.env.PORT && parseInt(process.env.PORT, 10)) || 3000,
  clientBaseUrl: process.env.CLIENT_BASE_URL || '',
  email: {
    service: process.env.SMTP_SERVICE,
    user: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
  },
  jwt: {
    access: {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    },
    refresh: {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    },
  },
  cookies: {
    secret: process.env.COOKIES_SECRET,
  },
});
