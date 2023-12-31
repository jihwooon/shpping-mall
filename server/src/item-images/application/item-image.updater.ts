import { Injectable } from '@nestjs/common'
import { ItemImageRepository } from '../domain/item-image.repository'
import { Item } from '../../items/domain/item.entity'
import { ItemImage } from '../domain/item-image.entity'
import { existsSync, unlink } from 'fs'
import { ItemImageNotFoundException } from '../error/ItemImage-not-found.exception'

@Injectable()
export class ItemImageUpdater {
  constructor(private readonly itemImageRepository: ItemImageRepository) {}

  async updateItemImages(files: Express.Multer.File[], items: Item) {
    const { id } = items

    const itemImages = await this.itemImageRepository.findByItemOrderByItemImageIdAsc(id)
    if (!itemImages || itemImages.length === 0) {
      throw new ItemImageNotFoundException(`${id}에 해당하는 이미지를 찾을 수 없습니다.`)
    }

    files.map((file, i) => {
      this.updateItemImage(itemImages[i], { ...file })
    })
  }

  async updateItemImage(imageImage: ItemImage, file: Express.Multer.File) {
    const { id, imageUrl } = imageImage
    const { filename, path, originalname } = file

    if (existsSync(imageUrl)) {
      unlink(imageUrl, (err) => {
        if (err) {
          throw new Error('파일 삭제를 실패했습니다')
        }
      })
    }

    await this.itemImageRepository.update(
      id,
      new ItemImage({
        imageName: filename,
        imageUrl: path,
        originalImageName: originalname,
      }),
    )
  }
}
