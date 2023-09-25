import { ItemStatusEnum } from './item-status.enum'
import { Member } from '../../members/domain/member.entity'
export class Item {
  id: number

  createTime: Date

  updateTime: Date

  createBy: string

  modifiedBy: string

  itemDetail: string

  itemName: string

  itemSellStatus: ItemStatusEnum

  stockNumber: number

  price: number

  member: Member

  constructor({
    id = 0,
    createTime = new Date(),
    updateTime = new Date(),
    createBy = '',
    modifiedBy = '',
    itemDetail = '',
    itemName = '',
    sellStatus = ItemStatusEnum.SELL,
    stockNumber = 0,
    price = 0,
    member = new Member({}),
  }: {
    id?: number
    createTime?: Date
    updateTime?: Date
    createBy?: string
    modifiedBy?: string
    itemDetail?: string
    itemName?: string
    sellStatus?: ItemStatusEnum
    stockNumber?: number
    price?: number
    member?: Member
  }) {
    this.id = id
    this.createTime = createTime
    this.updateTime = updateTime
    this.createBy = createBy
    this.modifiedBy = modifiedBy
    this.itemDetail = itemDetail
    this.itemName = itemName
    this.itemSellStatus = sellStatus
    this.stockNumber = stockNumber
    this.price = price
    this.member = member
  }
}
