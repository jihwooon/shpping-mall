import { Test, TestingModule } from '@nestjs/testing'
import { ItemUpdateController } from './item-update.controller'
import { ItemUpdater } from '../application/item.updater'
import { ItemRepository } from '../domain/item.repository'
import { MYSQL_CONNECTION } from '../../config/database/constants'
import { Connection } from 'mysql2/promise'
import { UPDATE_REQUEST } from '../../fixture/itemFixture'
import { NotFoundException } from '@nestjs/common'

describe('ItemUpdateController class', () => {
  let itemController: ItemUpdateController
  let itemUpdater: ItemUpdater
  let connection: Connection

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ItemUpdateController],
      providers: [
        ItemUpdater,
        ItemRepository,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
      ],
    }).compile()

    itemController = app.get<ItemUpdateController>(ItemUpdateController)
    itemUpdater = app.get<ItemUpdater>(ItemUpdater)
  })

  describe('updateItemHandler method', () => {
    const ID = 1
    const NOT_FOUND_ID = 9999
    context('it와 변경 된 Item 객체가 주어지면', () => {
      beforeEach(() => {
        itemUpdater.updateItem = jest.fn().mockImplementation(() => true)
      })
      it('true를 리턴해야 한다', async () => {
        const updatedItem = await itemController.updateItemHandler(ID, UPDATE_REQUEST)

        expect(updatedItem).toEqual(true)
      })
    })

    context('잘못된 id와 변경 된 Item 객체가 주어지면', () => {
      beforeEach(() => {
        itemUpdater.updateItem = jest
          .fn()
          .mockRejectedValue(new NotFoundException(`${NOT_FOUND_ID}에 해당하는 상품을 찾을 수 없습니다.`))
      })

      it('NotFoundException을 던져야 한다', async () => {
        expect(itemController.updateItemHandler(NOT_FOUND_ID, UPDATE_REQUEST)).rejects.toThrow(
          new NotFoundException(`${NOT_FOUND_ID}에 해당하는 상품을 찾을 수 없습니다.`),
        )
      })
    })
  })
})
