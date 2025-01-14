// src/utils/jwt-utils.ts
import { decodeJwt, JWTPayload, jwtVerify, SignJWT } from 'jose';
import { CHAIN } from '@tonconnect/ui-react';

const JWT_SECRET_KEY = 'your_secret_key';

export type AuthToken = {
  address: string;
  network: CHAIN;
};

export type PayloadToken = {
  payload: string;
};

const buildCreateToken = <T extends JWTPayload>(expirationTime: string) => {
  return async (payload: T): Promise<string> => {
    const encoder = new TextEncoder();
    const key = encoder.encode(JWT_SECRET_KEY);
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expirationTime)
      .sign(key);
  };
};

export const createAuthToken = buildCreateToken<AuthToken>('1Y');
export const createPayloadToken = buildCreateToken<PayloadToken>('15m');

export const verifyToken = async (
  token: string,
): Promise<JWTPayload | null> => {
  const encoder = new TextEncoder();
  const key = encoder.encode(JWT_SECRET_KEY);
  try {
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch (e) {
    return null;
  }
};

const buildDecodeToken = <T extends JWTPayload>() => {
  return (token: string): T | null => {
    try {
      return decodeJwt(token) as T;
    } catch (e) {
      return null;
    }
  };
};

export const decodeAuthToken = buildDecodeToken<AuthToken>();
export const decodePayloadToken = buildDecodeToken<PayloadToken>();
