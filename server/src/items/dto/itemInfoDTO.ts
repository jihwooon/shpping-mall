import { ItemStatusEnum } from '../item-status.enum'

export class ItemInfoDTO {
  id: number

  name: string

  detail: string

  price: number

  stockNumber: number

  sellStatus: ItemStatusEnum
}
