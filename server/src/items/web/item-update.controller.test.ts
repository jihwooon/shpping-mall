import { Test, TestingModule } from '@nestjs/testing'
import { ItemUpdateController } from './item-update.controller'
import { ItemUpdater } from '../application/item.updater'
import { ItemRepository } from '../domain/item.repository'
import { MYSQL_CONNECTION } from '../../config/database/constants'
import { Connection } from 'mysql2/promise'
import { itemMock } from '../../fixture/itemFixture'
import { UpdateItemRequest } from '../dto/update-item.dto'
import { JwtProvider } from '../../jwt/jwt.provider'
import { when } from 'jest-when'
import { userMock } from '../../fixture/memberFixture'
import { filesMock } from '../../fixture/itemImageFixture'

describe('ItemUpdateController class', () => {
  let itemController: ItemUpdateController
  let connection: Connection

  const ItemUpdaterMock = {
    updateItem: jest.fn(),
  }

  const requestMock = {
    user: {
      email: userMock().email,
    },
  } as unknown as Request

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ItemUpdateController],
      providers: [
        ItemRepository,
        JwtProvider,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
        {
          provide: ItemUpdater,
          useValue: ItemUpdaterMock,
        },
      ],
    }).compile()

    itemController = app.get<ItemUpdateController>(ItemUpdateController)
  })

  describe('updateItemHandler method', () => {
    const updateItem: UpdateItemRequest = {
      itemName: itemMock().itemName,
      itemDetail: itemMock().itemDetail,
      price: itemMock().price,
      sellStatus: itemMock().itemSellStatus,
      stockNumber: itemMock().stockNumber,
    }
    beforeEach(() => {
      when(ItemUpdaterMock.updateItem)
        .calledWith(itemMock().id, expect.anything())
        .mockImplementation(() => true)
    })
    context('상품 정보와 상품 id가 주어지고 변경에 성공하면', () => {
      it('true를 리턴해야 한다', async () => {
        const updatedItem = await itemController.updateItemHandler(
          String(itemMock().id),
          filesMock(),
          requestMock,
          updateItem,
        )

        expect(updatedItem).toEqual(undefined)
      })
    })

    context('상품 정보가 주어지고 상품 id가 올바르지 않으면', () => {
      it('undefined를 리턴해야 한다', async () => {
        const not_found_id = (itemMock().id = 9999)
        const updatedItem = await itemController.updateItemHandler(
          String(not_found_id),
          filesMock(),
          requestMock,
          updateItem,
        )

        expect(updatedItem).toEqual(undefined)
      })
    })
  })
})
