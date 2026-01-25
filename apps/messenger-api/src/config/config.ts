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
  cookie: {
    secret: process.env.COOKIE_SECRET,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  },
  token: {
    passwordTtl:
      process.env.TOKEN_PASSWORD_TTL &&
      parseInt(process.env.TOKEN_PASSWORD_TTL, 10),
    emailTtl:
      process.env.TOKEN_EMAIL_TTL && parseInt(process.env.TOKEN_EMAIL_TTL, 10),
  },
});
