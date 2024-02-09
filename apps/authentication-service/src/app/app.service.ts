import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async authentication() {
    console.log('Login route hit');
    return 'Login successful';
  }
}
