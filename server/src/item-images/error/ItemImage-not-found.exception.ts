import { NotFoundException } from '@nestjs/common'

export class ItemImageNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message, {
      cause: 'itemImage',
      description: 'ITEMIMAGE_NOT_FOUND',
    })
  }
}
