import { doQuery } from '../../config/db.config'
import {
  RowDataPacket,
  ResultSetHeader,
} from 'mysql2/promise'
import Product from './product.entity'

export default class productRepository {
  async save(product: Product): Promise<void> {
    await doQuery((connection) =>
      connection.execute(
        `INSERT INTO product (productId, categoryId, productName, size,recentPrice, buyPrice, sellPrice, productInfo, imageUrl) VALUES (?,?,?,?,?,?,?,?,?)`,
        [
          product.productId,
          product.categoryId,
          product.productName,
          product.size,
          product.buyPrice,
          product.sellPrice,
          product.productInfo,
          product.imageUrl,
        ],
      ),
    )
  }

  async findById(id: number): Promise<Product | null> {
    const [rows] = await doQuery((connect) =>
      connect.execute<RowDataPacket[]>(
        `SELECT * FROM product WHERE productId = ?`,
        [id],
      ),
    )

    const [row] = rows ?? []

    if (!row) {
      return null
    }

    return {
      productId: row['productId'],
      categoryId: row['categoryId'],
      productName: row['productName'],
      size: row['size'],
      recentPrice: row['recentPrice'],
      buyPrice: row['buyPrice'],
      sellPrice: row['sellPrice'],
      productInfo: row['productInfo'],
      imageUrl: row['imageUrl'],
    }
  }

  async findAll(): Promise<Product[]> {
    const [rows] = await doQuery((connect) =>
      connect.execute<RowDataPacket[]>(
        `SELECT * FROM product`,
        [],
      ),
    )

    return [rows ?? []].map((row) => ({
      productId: row['productId'],
      categoryId: row['categoryId'],
      productName: row['productName'],
      size: row['size'],
      recentPrice: row['recentPrice'],
      buyPrice: row['buyPrice'],
      sellPrice: row['sellPrice'],
      productInfo: row['productInfo'],
      imageUrl: row['imageUrl'],
    }))
  }

  async update(
    id: number,
    product: Product,
  ): Promise<boolean> {
    const [rows] = await doQuery((connect) =>
      connect.execute<ResultSetHeader>(
        `UPDATE product SET productName = ? WHERE product = ?`,
        [product.productName, product.imageUrl, id],
      ),
    )

    return rows.affectedRows === 1
  }

  async deleteById(id: number): Promise<void> {
    await doQuery((connect) =>
      connect.execute(
        `DELETE FROM product WHERE productId = ?`,
        [id],
      ),
    )
  }
}
