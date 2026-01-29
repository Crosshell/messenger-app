import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch()
export class WsExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();

    let error: unknown;
    let message: string | string[];

    if (exception instanceof WsException) {
      error = exception.getError();
      message = exception.message;
    } else if (exception instanceof HttpException) {
      const response = exception.getResponse();
      error = response;

      if (typeof response === 'string') {
        message = response;
      } else if ('message' in response) {
        message = response.message as string | string[];
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      error = exception.message;
      message = exception.message;
    } else {
      console.error(exception);
      error = 'Internal Server Error';
      message = 'Something went wrong';
    }

    const emitMessage = Array.isArray(message) ? message[0] : message;

    client.emit('exception', {
      status: 'error',
      message: emitMessage,
      details: error,
    });
  }
}
