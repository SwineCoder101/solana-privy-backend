import { registerAs } from '@nestjs/config';

export default registerAs('privy', () => ({
  appId: process.env.PRIVY_APP_ID,
  appSecret: process.env.PRIVY_APP_SECRET,
  authorizationSigningKey: process.env.PRIVY_AUTHORIZATION_SIGNING_KEY,
  jwksUrl: process.env.PRIVY_JWKS_URL,
  clientId: process.env.PRIVY_CLIENT_ID,
})); 