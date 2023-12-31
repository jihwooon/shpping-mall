import { Connection, ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { Item } from './item.entity'
import { Inject } from '@nestjs/common'
import { MYSQL_CONNECTION } from '../../database/constants'

export class ItemRepository {
  constructor(
    @Inject(MYSQL_CONNECTION)
    private connection: Connection,
  ) {}

  async save(items: Item): Promise<number> {
    const [{ insertId }] = await this.connection.execute<ResultSetHeader>(
      `INSERT INTO item (item_id, item_name, item_detail, item_price, item_sell_status, stock_number, create_time, update_time, create_by, modified_by, member_id ) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [
        items.id,
        items.itemName,
        items.itemDetail,
        items.price,
        items.itemSellStatus,
        items.stockNumber,
        items.createTime,
        items.updateTime,
        items.createBy,
        items.modifiedBy,
        items.member.memberId,
      ],
    )

    if (insertId === 0) {
      return undefined
    }

    return insertId
  }

  async findById(id: number): Promise<Item | undefined> {
    const [rows] = await this.connection.execute<RowDataPacket[]>(
      `SELECT item_id, item_name, item_detail, item_price, item_sell_status, stock_number, create_time, update_time, create_by, modified_by, member_id FROM item WHERE item_id = ?`,
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
      price: row['item_price'],
      itemSellStatus: row['item_sell_status'],
      stockNumber: row['stock_number'],
      createTime: row['create_time'],
      updateTime: row['update_time'],
      createBy: row['create_by'],
      modifiedBy: row['modified_by'],
      member: row['member_id'],
    }
  }

  async update(id: number, items: Item): Promise<boolean> {
    const [ok] = await this.connection.execute<ResultSetHeader>(
      `UPDATE item SET item_name = ?, item_detail = ?, item_price = ?, item_sell_status = ?, stock_number = ?, update_time = ?, modified_by = ? WHERE item_id = ?`,
      [
        items.itemName,
        items.itemDetail,
        items.price,
        items.itemSellStatus,
        items.stockNumber,
        items.updateTime,
        items.modifiedBy,
        id,
      ],
    )

    return ok.affectedRows === 1
  }
}
