import { BadRequestException } from '@nestjs/common'

export class TokenExpiredException extends BadRequestException {
  constructor(message: string) {
    super(message, {
      cause: 'token',
      description: 'TOKEN_EXPIRED',
    })
  }
}
