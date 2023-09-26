import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Item } from '../domain/item.entity'
import { ItemRepository } from '../domain/item.repository'
import { MemberRepository } from '../../members/domain/member.repository'
import { MemberNotFoundException } from '../../members/application/error/member-not-found.exception'

@Injectable()
export class ItemCreater {
  constructor(private readonly itemRepository: ItemRepository, private readonly memberRepository: MemberRepository) {}

  async registerItem(items: Item, email: string): Promise<number> {
    const member = await this.memberRepository.findByEmail(email)
    if (!member) {
      throw new MemberNotFoundException('회원 정보를 찾을 수 없습니다')
    }

    const item = new Item({
      itemName: items.itemName,
      itemDetail: items.itemDetail,
      price: items.price,
      stockNumber: items.stockNumber,
      sellStatus: items.itemSellStatus,
      member: member,
    })

    const id = await this.itemRepository.save(item)

    if (!id) {
      throw new InternalServerErrorException('예기치 못한 서버 오류가 발생했습니다')
    }

    return id
  }
}
