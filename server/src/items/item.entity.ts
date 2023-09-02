import { ItemStatusEnum } from './item-status.enum'
export class Item {
  id: number

  createTime: Date

  updateTime: Date

  createBy: string

  modifiedBy: string

  detail: string

  name: string

  sellStatus: ItemStatusEnum

  stockNumber: number

  price: number

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
  }) {
    this.id = id
    this.createTime = createTime
    this.updateTime = updateTime
    this.createBy = createBy
    this.modifiedBy = modifiedBy
    this.detail = itemDetail
    this.name = itemName
    this.sellStatus = sellStatus
    this.stockNumber = stockNumber
    this.price = price
  }
}
