// prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// function transformBigIntsToNumbers<T>(data: T): T {
//   if (data === null || data === undefined) {
//     return data;
//   }

//   if (typeof data === 'bigint') {
//     return Number(data) as any;
//   }

//   if (Array.isArray(data)) {
//     return data.map(transformBigIntsToNumbers) as any;
//   }

//   if (typeof data === 'object') {
//     return Object.fromEntries(
//       Object.entries(data).map(([key, value]) => [
//         key,
//         transformBigIntsToNumbers(value),
//       ]),
//     ) as any;
//   }

//   return data;
// }

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();

    // this.$use(async (params, next) => {
    //   const result = await next(params);
    //   return transformBigIntsToNumbers(result);
    // });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
