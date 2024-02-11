import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication.module';

@Module({
  imports: [AuthenticationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
