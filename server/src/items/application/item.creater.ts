import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Item } from '../domain/item.entity'
import { ItemRepository } from '../domain/item.repository'

@Injectable()
export class ItemCreater {
  constructor(private readonly itemRepository: ItemRepository) {}

  async registerItem(items: Item): Promise<number> {
    const id = await this.itemRepository.save(items)

    if (!id) {
      throw new InternalServerErrorException('예기치 못한 서버 오류가 발생했습니다')
    }

    return id
  }
}
