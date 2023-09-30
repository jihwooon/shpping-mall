import { InternalServerErrorException } from '@nestjs/common'

export class ItemUpdatedFailException extends InternalServerErrorException {
  constructor(message: string) {
    super(message, {
      cause: 'item',
      description: 'ITEM_UPDATED_FAIL',
    })
  }
}
