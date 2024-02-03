import * as process from 'process';

export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT, 10) || 3000,
  MONGODB_URL: process.env.MONGODB_URL,

  JWT_CONFIRM_EMAIL_SECRET:
    process.env.JWT_CONFIRM_EMAIL_SECRET || 'secretconfirmemail',
  JWT_CONFIRM_EMAIL_LIFETIME: process.env.JWT_CONFIRM_EMAIL_LIFETIME || '100d',

  JWT_ACCESS_TOKEN_SECRET:
    process.env.JWT_ACCESS_TOKEN_SECRET || 'lakjsdkfgadkaglfasdkgakgkasdhglak',
  JWT_ACCESS_TOKEN_SECRET_LIFETIME:
    process.env.JWT_ACCESS_TOKEN_SECRET_LIFETIME || '200d',

  JWT_REFRESH_TOKEN_SECRET:
    process.env.JWT_REFRESH_TOKEN_SECRET || 'lnblvsntcIFDMHmbm',
  JWT_REFRESH_TOKEN_SECRET_LIFETIME:
    process.env.JWT_REFRESH_TOKEN_SECRET_LIFETIME || '100d',
});
