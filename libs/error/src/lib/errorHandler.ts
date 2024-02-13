import { HttpException, HttpStatus, Logger } from '@nestjs/common';

export class ErrorHandler {
  static handleError(errorMsg: string, errorCode: HttpStatus, errorTrace?: string) {
    Logger.error(errorMsg, errorTrace, 'CustomErrorHandler');

    switch (errorCode) {
      case HttpStatus.BAD_REQUEST:
        throw new HttpException(errorMsg, HttpStatus.BAD_REQUEST);
      case HttpStatus.UNAUTHORIZED:
        throw new HttpException(errorMsg, HttpStatus.UNAUTHORIZED);
      case HttpStatus.FORBIDDEN:
        throw new HttpException(errorMsg, HttpStatus.FORBIDDEN);
      case HttpStatus.INTERNAL_SERVER_ERROR:
      default:
        throw new HttpException(errorMsg, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
