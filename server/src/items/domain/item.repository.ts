import { Connection, RowDataPacket } from 'mysql2/promise'
import { Item } from './item.entity'
import { Inject } from '@nestjs/common'
import { MYSQL_CONNECTION } from '../../config/database/constants'
import { Repository } from 'src/config/database/repository'

export class ItemRepository implements Repository<Item, number> {
  constructor(
    @Inject(MYSQL_CONNECTION)
    private connection: Connection,
  ) {}

  async save(items: Item): Promise<void> {
    await this.connection.execute(
      `INSERT INTO item (item_id, item_name, item_detail, item_price, item_sell_status, stock_number, create_time) VALUES (?,?,?,?,?,?,?)`,
      [
        items.id,
        items.itemName,
        items.itemDetail,
        items.price,
        items.itemSellStatus,
        items.stockNumber,
        items.createTime,
      ],
    )
  }

  async findById(id: number): Promise<Item | undefined> {
    const [rows] = await this.connection.execute<RowDataPacket[]>(
      `SELECT item_id, item_name, item_detail, item_price, item_sell_status, stock_number, create_time, update_time, create_by, modified_by FROM item WHERE item_id = ?`,
      [id],
    )

    const [row] = rows ?? []

    if (!row) {
      return undefined
    }

    return {
      id: row['item_id'],
      itemName: row['item_name'],
      itemDetail: row['item_detail'],
      price: row['price'],
      itemSellStatus: row['item_sell_status'],
      stockNumber: row['stock_number'],
      createTime: row['create_time'],
      updateTime: row['update_time'],
      createBy: row['create_by'],
      modifiedBy: row['modified_by'],
    }
  }
}
