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
}
