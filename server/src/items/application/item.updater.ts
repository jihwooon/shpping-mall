import { Injectable, NotFoundException } from '@nestjs/common'
import { Item } from '../domain/item.entity'
import { ItemRepository } from '../domain/item.repository'

@Injectable()
export class ItemUpdater {
  constructor(private readonly itemRepository: ItemRepository) {}

  async updateItem(id: number, items: Item): Promise<boolean> {
    const updatedItem = await this.itemRepository.update(id, items)

    if (!updatedItem) {
      throw new NotFoundException(`${id}에 해당하는 상품 변경을 실패했습니다.`, {
        cause: new Error(),
        description: 'Not Found',
      })
    }
    return updatedItem
  }
}
