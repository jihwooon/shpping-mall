import { Connection } from 'mysql2/promise'
import { Item } from './item.entity'
import { Inject } from '@nestjs/common'
import { MYSQL_CONNECTION } from '../config/database/constants'
import { Repository } from 'src/config/database/repository'

export class ItemRepository implements Repository<Item, number> {
  constructor(
    @Inject(MYSQL_CONNECTION)
    private connection: Connection,
  ) {}

  async save(items: Item): Promise<void> {
    await this.connection.execute(
      `INSERT INTO item (id, name, detail, price, sellStatus, stockNumber,createTime) VALUES (?,?,?,?,?,?,?)`,
      [items.id, items.name, items.detail, items.price, items.sellStatus, items.stockNumber, items.createTime],
    )
  }

  async findById(id: number): Promise<Item | undefined> {
    const [rows] = await this.connection.execute(
      `SELECT id, name, detail, price, sellStatus, stockNumber, createTime, updateTime, createBy, modifiedBy FROM item where id = ?`,
      [id],
    )

    const row = rows ?? []

    if (!row) {
      return undefined
    }

    return {
      id: row['id'],
      name: row['name'],
      detail: row['detail'],
      price: row['price'],
      sellStatus: row['sellStatus'],
      stockNumber: row['stockNumber'],
      createTime: row['createTime'],
      updateTime: row['updateTime'],
      createBy: row['createBy'],
      modifiedBy: row['modifiedBy'],
    }
  }
}
