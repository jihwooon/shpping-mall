import { ItemStatusEnum } from '../domain/item-status.enum'

export class ItemInfoResponse {
  id: number

  itemName: string

  itemDetail: string

  price: number

  stockNumber: number

  sellStatus: ItemStatusEnum

  constructor({
    id,
    itemName,
    itemDetail,
    price,
    stockNumber,
    sellStatus = ItemStatusEnum.SELL,
  }: {
    id: number
    itemName: string
    itemDetail: string
    price: number
    stockNumber: number
    sellStatus: ItemStatusEnum
  }) {
    this.id = id
    this.itemName = itemName
    this.itemDetail = itemDetail
    this.price = price
    this.stockNumber = stockNumber
    this.sellStatus = sellStatus
  }
}
