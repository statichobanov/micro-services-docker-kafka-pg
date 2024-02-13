import { CanActivate, ExecutionContext, Inject, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate, OnModuleInit {
  constructor(
    @Inject(`KAFKA_CLIENT`)
    private readonly kafkaClient: ClientKafka
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const message = JSON.stringify({
        type: 'verify',
        data: token,
      });
      const payload = await lastValueFrom(this.kafkaClient.send('user-events', message));
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('user-events');
  }
}
