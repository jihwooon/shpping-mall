import { ItemStatusEnum } from '../item-status.enum'

export class ItemInfoDTO {
  id: number

  itemName: string

  itemDetail: string

  price: number

  stockNumber: number

  sellStatus: ItemStatusEnum
}
