import { UnauthorizedException } from '@nestjs/common'

export class NotAccessTokenTypeException extends UnauthorizedException {
  constructor(message: string) {
    super(message, {
      cause: 'token',
      description: 'NOT_ACCESS_TOKEN_TYPE',
    })
  }
}
