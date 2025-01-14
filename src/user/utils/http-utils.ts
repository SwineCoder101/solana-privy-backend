// src/utils/http-utils.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export const ok = <T extends object>(body: T): any => {
  return { status: 'success', data: body };
};

export const badRequest = <T extends object>(body: T): any => {
  throw new HttpException(body, HttpStatus.BAD_REQUEST);
};

export const unauthorized = <T extends object>(body: T): any => {
  throw new HttpException(body, HttpStatus.UNAUTHORIZED);
};
