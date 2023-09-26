import { Test, TestingModule } from '@nestjs/testing'
import { ItemRepository } from '../domain/item.repository'
import { itemMock } from '../../fixture/itemFixture'
import { NotFoundException } from '@nestjs/common'
import { ItemDetailController } from './item-detail.controller'
import { ItemReader } from '../application/item.reader'
import { MYSQL_CONNECTION } from '../../config/database/constants'
import { Connection } from 'mysql2/promise'
import { ItemResponse } from '../dto/detail-item.dto'
import { JwtProvider } from '../../jwt/jwt.provider'

describe('ItemController class', () => {
  let itemController: ItemDetailController
  let itemReader: ItemReader
  let connection: Connection

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ItemDetailController],
      providers: [
        ItemReader,
        ItemRepository,
        JwtProvider,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
      ],
    }).compile()

    itemController = app.get<ItemDetailController>(ItemDetailController)
    itemReader = app.get<ItemReader>(ItemReader)
  })

  describe('getItemHandler method', () => {
    context('id가 주어지면', () => {
      beforeEach(() => {
        itemReader.getItem = jest.fn().mockImplementation(() => itemMock())
      })
      it('저장된 객체 정보를 리턴해야 한다', async () => {
        const itemInfoResponse: ItemResponse = {
          id: itemMock().id,
          itemName: itemMock().itemName,
          itemDetail: itemMock().itemDetail,
          price: itemMock().price,
          stockNumber: itemMock().stockNumber,
          sellStatus: itemMock().itemSellStatus,
        }

        const item = await itemController.getItemHandler(itemMock().id)

        expect(item).toEqual(itemInfoResponse)
      })
    })

    context('잘못된 id가 주어지면', () => {
      const not_found_id = (itemMock().id = 99999)
      beforeEach(() => {
        itemReader.getItem = jest
          .fn()
          .mockRejectedValue(new NotFoundException(`${not_found_id}에 해당하는 상품을 찾을 수 없습니다.`))
      })

      it('NotFoundException을 던져야 한다', async () => {
        expect(itemController.getItemHandler(not_found_id)).rejects.toThrow(
          new NotFoundException(`${not_found_id}에 해당하는 상품을 찾을 수 없습니다.`),
        )
      })
    })
  })
})
