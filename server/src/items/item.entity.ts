export class Item {
  id: number

  createTime: Date

  updateTime: Date

  createBy: string

  modifiedBy: string

  detail: string

  name: string

  sellStatus: string

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
    itemSellStatus = '',
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
    itemSellStatus?: string
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
    this.sellStatus = itemSellStatus
    this.stockNumber = stockNumber
    this.price = price
  }
}
