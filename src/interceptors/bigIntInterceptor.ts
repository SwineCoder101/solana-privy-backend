import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BigIntInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => this.bigIntToString(data)), // Apply BigInt to string conversion to the response
    );
  }

  bigIntToString(obj: any): any {
    if (obj === null || obj === undefined) return obj;

    // Check if it's a BigInt and convert it
    if (typeof obj === 'bigint') {
      return obj.toString();
    }

    // Leave Date objects untouched
    if (obj instanceof Date) {
      return obj; // Don't alter Date fields
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.bigIntToString(item));
    }

    if (typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        acc[key] = this.bigIntToString(obj[key]);
        return acc;
      }, {} as any);
    }

    return obj;
  }
}
