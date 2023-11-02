import { ArgumentsHost, Catch, ExceptionFilter, HttpException, InternalServerErrorException } from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = (exception as HttpException).getStatus()

    if (!exception) {
      exception = new InternalServerErrorException()
    }

    response.status(status).json({
      source: exception.cause,
      path: request.url,
      timestamp: new Date().toISOString(),
      response: exception.getResponse(),
    })
  }
}
