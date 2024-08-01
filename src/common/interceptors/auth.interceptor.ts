import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { catchError, switchMap } from 'rxjs/operators';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  private authApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authApiUrl = this.configService.get<string>('AUTH_API_URL');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token not found');
    }

    const token = authHeader.split(' ')[1];

    return this.httpService
      .get(this.authApiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        switchMap((response: AxiosResponse) => {
          const user = response.data;
          request.user = user;
          if (
            request.body &&
            request.body.userId &&
            request.body.userId !== user.id
          ) {
            throw new UnauthorizedException(
              'You are not authorized to perform this action',
            );
          }

          return next.handle();
        }),
        catchError((err) => {
          return throwError(new UnauthorizedException('Invalid token'));
        }),
      );
  }
}
