import { ItemStatusEnum } from '../domain/item-status.enum'

export class ItemResponse {
  id: number

  itemName: string

  itemDetail: string

  price: number

  stockNumber: number

  sellStatus: ItemStatusEnum
}
