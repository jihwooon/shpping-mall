import { Injectable } from '@nestjs/common'
import { Item } from '../domain/item.entity'
import { ItemRepository } from '../domain/item.repository'

@Injectable()
export class ItemCreater {
  constructor(private readonly itemRepository: ItemRepository) {}

  async registerItem(items: Item): Promise<void> {
    await this.itemRepository.save(items)
  }
}
