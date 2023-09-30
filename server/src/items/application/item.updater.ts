import { Injectable } from '@nestjs/common'
import { Item } from '../domain/item.entity'
import { ItemRepository } from '../domain/item.repository'
import { ItemNotFoundException } from '../error/item-not-found.exception'
import { ItemUpdatedFailException } from '../error/item-updated-fail.exception'

@Injectable()
export class ItemUpdater {
  constructor(private readonly itemRepository: ItemRepository) {}

  async updateItem(id: number, items: Item): Promise<boolean> {
    const item = await this.itemRepository.findById(id)
    if (!item) {
      throw new ItemNotFoundException(`${id}에 해당하는 상품을 찾을 수 없습니다.`)
    }

    const updatedItem = await this.itemRepository.update(item.id, items)
    if (!updatedItem) {
      throw new ItemUpdatedFailException(`해당 상품 변경에 실패했습니다`)
    }

    return updatedItem
  }
}
