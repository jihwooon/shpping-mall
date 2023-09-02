import { Injectable } from '@nestjs/common'
import { Item } from './item.entity'
import { ItemRepository } from './item.repository'

@Injectable()
export class ItemService {
  constructor(private readonly itemRepository: ItemRepository) {}

  async registerItem(items: Item): Promise<void> {
    await this.itemRepository.save(items)
  }
}
