import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Item } from '../domain/item.entity'
import { ItemRepository } from '../domain/item.repository'
import { MemberRepository } from '../../members/domain/member.repository'
import { MemberNotFoundException } from '../../members/application/error/member-not-found.exception'
import { ItemImageService } from '../../item-images/application/item-image.service'

@Injectable()
export class ItemCreater {
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly memberRepository: MemberRepository,
    private readonly itemImageService: ItemImageService,
  ) {}

  async registerItem(items: Item, email: string, files: Express.Multer.File[]): Promise<number> {
    const { itemName, itemDetail, price, stockNumber, itemSellStatus } = items

    const member = await this.memberRepository.findByEmail(email)
    if (!member) {
      throw new MemberNotFoundException('회원 정보를 찾을 수 없습니다')
    }

    const savedId = await this.itemRepository.save(
      new Item({
        itemName: itemName,
        itemDetail: itemDetail,
        price: price,
        stockNumber: stockNumber,
        sellStatus: itemSellStatus,
        member: member,
      }),
    )
    await this.itemImageService.saveItemImages(savedId, files)

    if (!savedId) {
      throw new InternalServerErrorException('예기치 못한 서버 오류가 발생했습니다')
    }

    return savedId
  }
}
