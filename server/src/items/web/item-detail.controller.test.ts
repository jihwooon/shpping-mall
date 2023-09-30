import { Test, TestingModule } from '@nestjs/testing'
import { ItemRepository } from '../domain/item.repository'
import { itemMock } from '../../fixture/itemFixture'
import { ItemDetailController } from './item-detail.controller'
import { ItemReader } from '../application/item.reader'
import { MYSQL_CONNECTION } from '../../config/database/constants'
import { Connection } from 'mysql2/promise'
import { ItemResponse } from '../dto/detail-item.dto'
import { JwtProvider } from '../../jwt/jwt.provider'
import { when } from 'jest-when'
import { ItemNotFoundException } from '../error/item-not-found.exception'

describe('ItemController class', () => {
  let itemController: ItemDetailController
  let connection: Connection

  const ItemReaderMock = {
    getItem: jest.fn(),
  }

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ItemDetailController],
      providers: [
        ItemRepository,
        JwtProvider,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
        {
          provide: ItemReader,
          useValue: ItemReaderMock,
        },
      ],
    }).compile()

    itemController = app.get<ItemDetailController>(ItemDetailController)
  })

  describe('getItemHandler method', () => {
    beforeEach(() => {
      when(ItemReaderMock.getItem).calledWith(itemMock().id).mockResolvedValue(itemMock())
    })
    context('상품 id가 주어지고 요청을 성공하면', () => {
      it('상품 정보를 리턴해야 한다', async () => {
        const itemInfoResponse: ItemResponse = {
          id: itemMock().id,
          itemName: itemMock().itemName,
          itemDetail: itemMock().itemDetail,
          price: itemMock().price,
          stockNumber: itemMock().stockNumber,
          sellStatus: itemMock().itemSellStatus,
        }

        const item = await itemController.getItemHandler(String(itemMock().id))

        expect(item).toEqual(itemInfoResponse)
      })
    })

    context('상품 id가 주어지고 요청을 실패하면', () => {
      const not_found_id = (itemMock().id = 99999)
      beforeEach(() => {
        when(ItemReaderMock.getItem)
          .calledWith(not_found_id)
          .mockRejectedValue(new ItemNotFoundException(`${not_found_id}에 해당하는 상품을 찾을 수 없습니다.`))
      })
      it('ItemNotFoundException을 던져야 한다', async () => {
        expect(itemController.getItemHandler(String(not_found_id))).rejects.toThrow(
          new ItemNotFoundException(`${not_found_id}에 해당하는 상품을 찾을 수 없습니다.`),
        )
      })
    })
  })
})
