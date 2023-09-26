import { Test, TestingModule } from '@nestjs/testing'
import { ItemUpdateController } from './item-update.controller'
import { ItemUpdater } from '../application/item.updater'
import { ItemRepository } from '../domain/item.repository'
import { MYSQL_CONNECTION } from '../../config/database/constants'
import { Connection } from 'mysql2/promise'
import { itemMock } from '../../fixture/itemFixture'
import { NotFoundException } from '@nestjs/common'
import { UpdateItemRequest } from '../dto/update-item.dto'
import { JwtProvider } from '../../jwt/jwt.provider'

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
        JwtProvider,
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
    const updateItem: UpdateItemRequest = {
      itemName: itemMock().itemName,
      itemDetail: itemMock().itemDetail,
      price: itemMock().price,
      sellStatus: itemMock().itemSellStatus,
      stockNumber: itemMock().stockNumber,
    }
    context('회원 id와 상품 정보가 주어지고 변경에 성공하면', () => {
      beforeEach(() => {
        itemUpdater.updateItem = jest.fn().mockImplementation(() => true)
      })
      it('true를 리턴해야 한다', async () => {
        const updatedItem = await itemController.updateItemHandler(itemMock().id, updateItem)

        expect(updatedItem).toEqual(true)
      })
    })

    context('회원 id와 상품 정보가 주어지고 변경에 실패하면', () => {
      const not_found_id = (itemMock().id = 9999)
      beforeEach(() => {
        itemUpdater.updateItem = jest
          .fn()
          .mockRejectedValue(new NotFoundException(`${not_found_id}에 해당하는 상품을 찾을 수 없습니다.`))
      })

      it('NotFoundException을 던져야 한다', async () => {
        expect(itemController.updateItemHandler(not_found_id, updateItem)).rejects.toThrow(
          new NotFoundException(`${not_found_id}에 해당하는 상품을 찾을 수 없습니다.`),
        )
      })
    })
  })
})
