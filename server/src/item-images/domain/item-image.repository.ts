import { Connection, ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { Inject } from '@nestjs/common'
import { MYSQL_CONNECTION } from '../../database/constants'
import { ItemImage } from './item-image.entity'

export class ItemImageRepository {
  constructor(
    @Inject(MYSQL_CONNECTION)
    private connection: Connection,
  ) {}

  async save(itemImage: ItemImage): Promise<number> {
    const [{ insertId }] = await this.connection.execute<ResultSetHeader>(
      `INSERT INTO item_image (item_image_id, image_name, image_url, is_rep_image, original_image_name, item_id, create_time, update_time, create_by, modified_by) VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        itemImage.id,
        itemImage.imageName,
        itemImage.imageUrl,
        itemImage.isRepresentImage,
        itemImage.originalImageName,
        itemImage.item.id,
        itemImage.createTime,
        itemImage.updateTime,
        itemImage.createBy,
        itemImage.modifiedBy,
      ],
    )

    if (insertId === 0) {
      return undefined
    }

    return insertId
  }

  async update(id: number, itemImage: ItemImage): Promise<boolean> {
    const [ok] = await this.connection.execute<ResultSetHeader>(
      `UPDATE item_image SET image_name = ?, image_url = ?, original_image_name = ?, update_time = ?, modified_by = ? WHERE item_image_id = ?`,
      [
        itemImage.imageName,
        itemImage.imageUrl,
        itemImage.originalImageName,
        itemImage.updateTime,
        itemImage.modifiedBy,
        id,
      ],
    )

    return ok.affectedRows === 1
  }

  async findByItemOrderByItemImageIdAsc(id: number): Promise<ItemImage[]> {
    const [rows] = await this.connection.execute<RowDataPacket[]>(
      `SELECT item_image_id, image_name, image_url, is_rep_image, original_image_name, create_time, update_time, create_by, modified_by, item_id FROM item_image WHERE item_id = ? ORDER BY item_image_id ASC`,
      [id],
    )

    return (rows ?? []).map((row) => ({
      id: row['item_image_id'],
      imageName: row['image_name'],
      imageUrl: row['image_url'],
      isRepresentImage: row['is_req_image'],
      originalImageName: row['original_image_name'],
      createTime: row['create_time'],
      updateTime: row['update_time'],
      createBy: row['create_by'],
      modifiedBy: row['modified_by'],
      item: row['item_id'],
    }))
  }
}
