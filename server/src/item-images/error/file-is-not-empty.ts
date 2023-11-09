import { BadRequestException } from '@nestjs/common'

export class FileIsNotEmpty extends BadRequestException {
  constructor(message: string) {
    super(message, {
      cause: 'file',
      description: 'FIlE_IS_NOT_EMPTY',
    })
  }
}
