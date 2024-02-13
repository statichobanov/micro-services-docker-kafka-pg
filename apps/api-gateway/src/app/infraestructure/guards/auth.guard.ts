import { CanActivate, ExecutionContext, Inject, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate, OnModuleInit {
  constructor(@Inject(`KAFKA_CLIENT`) private readonly kafkaClient: ClientKafka) {}

  /**
   * Determines if the current request is authorized by validating the JWT token.
   *
   * @param context The execution context of the current request.
   * @returns A promise resolving to a boolean indicating if the request is authorized.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Constructs and sends a verification message to the 'user-events' topic.
      const message = JSON.stringify({ type: 'verify', data: token });
      const payload = await lastValueFrom(this.kafkaClient.send('user-events', message));
      // Attach user details to request for further use.
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Token validation failed');
    }
    return true;
  }

  /**
   * Extracts the JWT token from the Authorization header of the request.
   *
   * @param request The incoming HTTP request.
   * @returns The extracted token, if present.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  /**
   * Initializes the Kafka client subscription to the 'user-events' topic.
   */
  onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('user-events');
  }
}
