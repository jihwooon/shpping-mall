import { Test, TestingModule } from '@nestjs/testing'
import { ItemCreateController } from './item-create.controller'
import { ItemCreater } from '../application/item.creater'
import { ItemRepository } from '../domain/item.repository'
import { itemMock } from '../../fixture/itemFixture'
import { MYSQL_CONNECTION } from '../../config/database/constants'
import { Connection } from 'mysql2/promise'
import { CreateItemRequest } from '../dto/save-item.dto'

describe('ItemController class', () => {
  let itemController: ItemCreateController
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
  })

  describe('createItemHandler method', () => {
    context('Item 객체가 주어지면', () => {
      it('해당 메서드 호출을 검증해야 한다', async () => {
        const itemRequest: CreateItemRequest = {
          itemName: itemMock().itemName,
          itemDetail: itemMock().itemDetail,
          price: itemMock().price,
          stockNumber: itemMock().stockNumber,
          sellStatus: itemMock().itemSellStatus,
        }
        const spyFn = jest.spyOn(itemController, 'createItemHandler').mockImplementation()
        await itemController.createItemHandler(itemRequest)

        expect(spyFn).toHaveBeenCalled()
        expect(spyFn).toBeCalledWith(itemRequest)
      })
    })
  })
})
