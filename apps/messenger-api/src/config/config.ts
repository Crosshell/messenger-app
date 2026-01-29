export default () => ({
  port: (process.env.PORT && parseInt(process.env.PORT, 10)) || 3000,
  clientBaseUrl: process.env.CLIENT_BASE_URL || '',
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT && parseInt(process.env.EMAIL_PORT, 10),
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
    from: process.env.EMAIL_FROM || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn:
      process.env.JWT_EXPIRES_IN && parseInt(process.env.JWT_EXPIRES_IN),
  },
  cookie: {
    refreshToken: {
      secret: process.env.COOKIE_SECRET,
      httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.COOKIE_SAME_SITE,
      path: '/',
      maxAge:
        process.env.TOKEN_REFRESH_TTL &&
        parseInt(process.env.TOKEN_REFRESH_TTL, 10),
    },
    secret: process.env.COOKIE_SECRET,
  },
  token: {
    passwordTtl:
      process.env.TOKEN_PASSWORD_TTL &&
      parseInt(process.env.TOKEN_PASSWORD_TTL, 10),
    emailTtl:
      process.env.TOKEN_EMAIL_TTL && parseInt(process.env.TOKEN_EMAIL_TTL, 10),
    refreshTtl:
      process.env.TOKEN_REFRESH_TTL &&
      parseInt(process.env.TOKEN_REFRESH_TTL, 10),
    maxRefreshTokens:
      process.env.MAX_REFRESH_TOKENS &&
      parseInt(process.env.MAX_REFRESH_TOKENS, 10),
  },
});
