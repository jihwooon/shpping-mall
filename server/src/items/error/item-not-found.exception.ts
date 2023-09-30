import { NotFoundException } from '@nestjs/common'

export class ItemNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message, {
      cause: 'item',
      description: 'ITEM_NOT_FOUND',
    })
  }
}
