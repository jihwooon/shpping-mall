import { Injectable, NotFoundException } from '@nestjs/common'
import { Item } from '../domain/item.entity'
import { ItemRepository } from '../domain/item.repository'

@Injectable()
export class ItemReader {
  constructor(private readonly itemRepository: ItemRepository) {}

  async getItem(id: number): Promise<Item> {
    const item = await this.itemRepository.findById(id)

    if (!item) {
      throw new NotFoundException(`${id}에 해당하는 상품을 찾을 수 없습니다.`, {
        cause: new Error(),
        description: 'Not Found',
      })
    }

    return item
  }
}
