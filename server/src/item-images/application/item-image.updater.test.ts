import { Test, TestingModule } from '@nestjs/testing'
import { MYSQL_CONNECTION } from '../../database/constants'
import { Connection } from 'mysql2/promise'
import { fileMock, filesMock, itemImageMock } from '../../fixture/itemImageFixture'
import { ItemImageRepository } from '../../item-images/domain/item-image.repository'
import { ItemImageUpdater } from './item-image.updater'
import { itemMock } from '../../fixture/itemFixture'

describe('ItemImageUpdater class', () => {
  let itemImageUpdater: ItemImageUpdater
  let connection: Connection

  const ItemImageRepositoryMock = {
    update: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemImageUpdater,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
        {
          provide: ItemImageRepository,
          useValue: ItemImageRepositoryMock,
        },
      ],
    }).compile()

    itemImageUpdater = module.get<ItemImageUpdater>(ItemImageUpdater)
  })

  describe('updateItemImage method', () => {
    context('이미지 파일 정보와이미지 파일 정보가 주어졌을때', () => {
      it('메서드 호출을 검증해야 한다', async () => {
        const spyFn = jest.spyOn(itemImageUpdater, 'updateItemImage').mockImplementation()
        await itemImageUpdater.updateItemImage(itemImageMock(), fileMock())

        expect(spyFn).toHaveBeenCalled()
        expect(spyFn).toBeCalledWith(itemImageMock(), fileMock())
      })
    })
  })

  describe('updateItemImages method', () => {
    context('이미지 파일 정보와 상품 정보가 주어졌을때', () => {
      it('메서드 호출을 검증해야 한다', async () => {
        const spyFn = jest.spyOn(itemImageUpdater, 'updateItemImages').mockImplementation()
        await itemImageUpdater.updateItemImages(filesMock(), itemMock())

        expect(spyFn).toHaveBeenCalled()
        expect(spyFn).toBeCalledWith(filesMock(), itemMock())
      })
    })
  })
})
