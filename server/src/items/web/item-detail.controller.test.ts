import { Test, TestingModule } from '@nestjs/testing'
import { ItemRepository } from '../domain/item.repository'
import { GET_RESPONSE, ITEMS } from '../../fixture/itemFixture'
import { NotFoundException } from '@nestjs/common'
import { ItemDetailController } from './item-detail.controller'
import { ItemReader } from '../application/item.reader'
import { MYSQL_CONNECTION } from '../../config/database/constants'
import { Connection } from 'mysql2/promise'

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
    const ID = 1
    const NOT_FOUND_ID = 9999
    context('id가 주어지면', () => {
      beforeEach(() => {
        itemReader.getItem = jest.fn().mockImplementation(() => ITEMS)
      })
      it('저장된 객체 정보를 리턴해야 한다', async () => {
        const item = await itemController.getItemHandler(ID)

        expect(item).toEqual(GET_RESPONSE)
      })
    })

    context('잘못된 id가 주어지면', () => {
      beforeEach(() => {
        itemReader.getItem = jest
          .fn()
          .mockRejectedValue(new NotFoundException(`${NOT_FOUND_ID}에 해당하는 상품을 찾을 수 없습니다.`))
      })

      it('NotFoundException을 던져야 한다', async () => {
        expect(itemController.getItemHandler(NOT_FOUND_ID)).rejects.toThrow(
          new NotFoundException(`${NOT_FOUND_ID}에 해당하는 상품을 찾을 수 없습니다.`),
        )
      })
    })
  })
})
