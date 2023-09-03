import { ItemStatusEnum } from '../domain/item-status.enum'

export class ItemInfoRequest {
  id: number

  itemName: string

  itemDetail: string

  price: number

  stockNumber: number

  sellStatus: ItemStatusEnum
}
