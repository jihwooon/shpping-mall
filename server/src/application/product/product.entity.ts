export default class Product {
  productId: number

  categoryId: number

  productName: string

  size: string

  recentPrice: number

  buyPrice: number

  sellPrice: number

  productInfo: string

  imageUrl: string

  constructor({
    productId = 0,
    categoryId = 0,
    productName = '',
    size = '',
    recentPrice = 0,
    buyPrice: buyPrice = 0,
    sellPrice = 0,
    productInfo = '',
    imageUrl = '',
  }: {
    productId?: number
    categoryId?: number
    productName?: string
    size?: string
    recentPrice?: number
    buyPrice?: number
    sellPrice?: number
    productInfo?: string
    imageUrl?: string
  }) {
    this.productId = productId
    this.categoryId = categoryId
    this.productName = productName
    this.size = size
    this.recentPrice = recentPrice
    this.buyPrice = buyPrice
    this.sellPrice = sellPrice
    this.productInfo = productInfo
    this.imageUrl = imageUrl
  }
}

export interface ProductListItem {
    productId?: number
    categoryId?: number
    productName?: string
    size?: string
    recentPrice?: number
    buyPrice?: number
    sellPrice?: number
    productInfo?: string
    imageUrl?: string
}
