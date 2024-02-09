import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { message: string } {
    Logger.log('Welcome to catalog-list endpoint');
    return { message: 'Product catalog list success' };
  }

  handleUserLoggedInEvent(message) {
    const { userId, username } = JSON.parse(message.value);

    console.log(
      `User ${username} (ID: ${userId}) logged in. Updating product catalog.`
    );
  }
}
