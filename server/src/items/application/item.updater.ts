import { Injectable } from '@nestjs/common'
import { Item } from '../domain/item.entity'
import { ItemRepository } from '../domain/item.repository'
import { ItemNotFoundException } from '../error/item-not-found.exception'
import { ItemUpdatedFailException } from '../error/item-updated-fail.exception'
import { MemberRepository } from '../../members/domain/member.repository'
import { MemberNotFoundException } from '../../members/application/error/member-not-found.exception'

@Injectable()
export class ItemUpdater {
  constructor(private readonly itemRepository: ItemRepository, private readonly memberRepository: MemberRepository) {}

  async updateItem(email: string, itemId: number, items: Item): Promise<boolean> {
    const { itemName, itemDetail, price, stockNumber, itemSellStatus } = items

    const member = await this.memberRepository.findByEmail(email)
    if (!member) {
      throw new MemberNotFoundException('회원 정보를 찾을 수 없습니다')
    }

    const item = await this.itemRepository.findById(itemId)
    if (!item) {
      throw new ItemNotFoundException(`${itemId}에 해당하는 상품을 찾을 수 없습니다.`)
    }

    const updatedItem = await this.itemRepository.update(
      item.id,
      new Item({
        itemName: itemName,
        itemDetail: itemDetail,
        price: price,
        stockNumber: stockNumber,
        sellStatus: itemSellStatus,
      }),
    )
    if (!updatedItem) {
      throw new ItemUpdatedFailException(`해당 상품 변경에 실패했습니다`)
    }

    return updatedItem
  }
}
