import { Item } from '../../items/domain/item.entity'

export class ItemImage {
  id: number

  createTime: Date

  updateTime: Date

  createBy: string

  modifiedBy: string

  imageName: string

  imageUrl: string

  isRepresentImage: boolean

  originalImageName: string

  item: Item

  constructor({
    id = 0,
    createTime = new Date(),
    updateTime = new Date(),
    createBy = '',
    modifiedBy = '',
    imageName = '',
    imageUrl = '',
    isRepresentImage = false,
    originalImageName = '',
    item = new Item({}),
  }: {
    id?: number
    createTime?: Date
    updateTime?: Date
    createBy?: string
    modifiedBy?: string
    imageName?: string
    imageUrl?: string
    isRepresentImage?: boolean
    originalImageName?: string
    item?: Item
  }) {
    this.id = id
    this.createTime = createTime
    this.updateTime = updateTime
    this.createBy = createBy
    this.modifiedBy = modifiedBy
    this.imageName = imageName
    this.imageUrl = imageUrl
    this.isRepresentImage = isRepresentImage
    this.originalImageName = originalImageName
    this.item = item
  }
}
