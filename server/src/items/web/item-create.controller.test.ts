import { Test, TestingModule } from '@nestjs/testing'
import { ItemCreateController } from './item-create.controller'
import { ItemCreater } from '../application/item.creater'
import { ItemRepository } from '../domain/item.repository'
import { itemMock } from '../../fixture/itemFixture'
import { MYSQL_CONNECTION } from '../../config/database/constants'
import { Connection } from 'mysql2/promise'
import { CreateItemRequest } from '../dto/save-item.dto'
import { InternalServerErrorException } from '@nestjs/common'

describe('ItemController class', () => {
  let itemController: ItemCreateController
  let itemCreater: ItemCreater
  let connection: Connection

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ItemCreateController],
      providers: [
        ItemCreater,
        ItemRepository,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
      ],
    }).compile()

    itemController = app.get<ItemCreateController>(ItemCreateController)
    itemCreater = app.get<ItemCreater>(ItemCreater)
  })

  describe('createItemHandler method', () => {
    const itemRequest: CreateItemRequest = {
      itemName: itemMock().itemName,
      itemDetail: itemMock().itemDetail,
      price: itemMock().price,
      stockNumber: itemMock().stockNumber,
      sellStatus: itemMock().itemSellStatus,
    }
    context('Item 객체가 주어지고 저장을 성공하면', () => {
      beforeEach(() => {
        itemCreater.registerItem = jest.fn().mockResolvedValue(itemMock().id)
      })
      it('id를 리턴해야 한다', async () => {
        const id = await itemController.createItemHandler(itemRequest)

        expect(id).toEqual({
          id: itemMock().id,
        })
      })
    })

    context('Item 객체가 주어지고 저장을 실패하면', () => {
      beforeEach(() => {
        itemCreater.registerItem = jest
          .fn()
          .mockRejectedValue(new InternalServerErrorException('예기치 못한 서버 오류가 발생했습니다'))
      })
      it('InternalServerErrorException를 던져야 한다', async () => {
        expect(itemController.createItemHandler(itemRequest)).rejects.toThrow(
          new InternalServerErrorException('예기치 못한 서버 오류가 발생했습니다'),
        )
      })
    })
  })
})
