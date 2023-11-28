import {ExceptionFilter,Catch,ArgumentsHost,HttpException,HttpStatus,} from '@nestjs/common';
import * as fs from 'fs';
  
@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.BAD_REQUEST) {
      const errors = exception.getResponse()['message'];
      const file = request.file ? request.file.path : undefined;
      if (file !== undefined && fs.existsSync(file)) {
        try {
          fs.unlinkSync(file);
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }
      else
        errors.push("No image was selected!");

      // Send a response to the client
      response.status(status).json({
        statusCode: status,
        path: request.url,
        message: exception.message,
        errors: errors
      });
    } else {
      // For other types of exceptions, forward them as they are
      response.status(status).json({
        statusCode: status,
        path: request.url,
        message: exception.message,
      });

      // Propagate the exception to ensure proper handling of non-validation errors
      throw exception;
    }
  }
}