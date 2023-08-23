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

  constructor(
    productId?: number,
    categoryId?: number,
    productName?: string,
    size?: string,
    recentPrice?: number,
    buyPrice?: number,
    sellPrice?: number,
    productInfo?: string,
    imageUrl?: string,
  ) {
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
