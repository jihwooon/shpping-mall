import { Injectable } from '@nestjs/common'
import { Item } from '../domain/item.entity'
import { ItemRepository } from '../domain/item.repository'
import { ItemNotFoundException } from '../error/item-not-found.exception'
import { ItemUpdatedFailException } from '../error/item-updated-fail.exception'
import { MemberRepository } from '../../members/domain/member.repository'
import { MemberNotFoundException } from '../../members/application/error/member-not-found.exception'
import { ItemImageUpdater } from '../../item-images/application/item-image.updater'

@Injectable()
export class ItemUpdater {
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly memberRepository: MemberRepository,
    private readonly itemImageUpdater: ItemImageUpdater,
  ) {}

  async updateItem(email: string, itemId: number, items: Item, files: Express.Multer.File[]): Promise<boolean> {
    const { itemName, itemDetail, price, stockNumber, itemSellStatus } = items

    const member = await this.memberRepository.findByEmail(email)
    if (!member) {
      throw new MemberNotFoundException('회원 정보를 찾을 수 없습니다')
    }

    const item = await this.itemRepository.findById(itemId)
    if (!item) {
      throw new ItemNotFoundException(`${item.id}에 해당하는 상품을 찾을 수 없습니다.`)
    }

    await this.itemImageUpdater.updateItemImages(files, item)

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
