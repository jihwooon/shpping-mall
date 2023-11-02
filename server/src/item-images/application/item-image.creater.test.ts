import { Test, TestingModule } from '@nestjs/testing'
import { itemMock } from '../../fixture/itemFixture'
import { MYSQL_CONNECTION } from '../../database/constants'
import { Connection } from 'mysql2/promise'
import { fileMock, filesMock, itemImageMock } from '../../fixture/itemImageFixture'
import { ItemImageCreater } from './item-image.creater'
import { ItemImageRepository } from '../../item-images/domain/item-image.repository'
import { ItemRepository } from '../../items/domain/item.repository'

describe('ItemImageCreater class', () => {
  let itemImageCreater: ItemImageCreater
  let connection: Connection

  const ItemRepositoryMock = {
    save: jest.fn(),
    findById: jest.fn(),
  }

  const ItemImageRepositoryMock = {
    save: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemImageCreater,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
        {
          provide: ItemRepository,
          useValue: ItemRepositoryMock,
        },
        {
          provide: ItemImageRepository,
          useValue: ItemImageRepositoryMock,
        },
      ],
    }).compile()

    itemImageCreater = module.get<ItemImageCreater>(ItemImageCreater)
  })

  describe('saveItemImage method', () => {
    context('상품 id와 이미지 파일 정보, 대표이미지가 주어졌을때', () => {
      it('메서드 호출을 검증해야 한다', async () => {
        const spyFn = jest.spyOn(itemImageCreater, 'saveItemImage').mockImplementation()
        await itemImageCreater.saveItemImage(itemMock().id, fileMock(), itemImageMock().isRepresentImage)

        expect(spyFn).toHaveBeenCalled()
        expect(spyFn).toBeCalledWith(itemMock().id, fileMock(), itemImageMock().isRepresentImage)
      })
    })
  })

  describe('saveItemImages method', () => {
    context('상품 id와 여러개의 이미지 파일이 주어졌을때', () => {
      it('메서드 호출을 검증해야 한다', async () => {
        const spyFn = jest.spyOn(itemImageCreater, 'saveItemImages').mockImplementation()
        await itemImageCreater.saveItemImages(itemMock().id, filesMock())

        expect(spyFn).toHaveBeenCalled()
        expect(spyFn).toBeCalledWith(itemMock().id, filesMock())
      })
    })
  })
})
