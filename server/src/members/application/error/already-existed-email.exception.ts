import { BadRequestException } from '@nestjs/common'

export class AlreadyExistedEmailException extends BadRequestException {
  constructor(message: string) {
    super(message, {
      cause: 'email',
      description: 'DUPLICATED_EMAIL',
    })
  }
}
