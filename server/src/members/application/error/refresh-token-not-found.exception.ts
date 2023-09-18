import { NotFoundException } from '@nestjs/common'

export class RefreshTokenNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message, {
      cause: 'token',
      description: 'REFRESH_TOKEN_NOT_EXITED',
    })
  }
}
