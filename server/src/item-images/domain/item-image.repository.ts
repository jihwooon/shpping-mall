import { Connection, ResultSetHeader } from 'mysql2/promise'
import { Inject } from '@nestjs/common'
import { MYSQL_CONNECTION } from '../../config/database/constants'
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
}
