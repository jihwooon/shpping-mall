import { Test, TestingModule } from '@nestjs/testing'
import { ItemCreateController } from './item-create.controller'
import { ItemCreater } from '../application/item.creater'
import { ItemRepository } from '../domain/item.repository'
import { itemMock } from '../../fixture/itemFixture'
import { MYSQL_CONNECTION } from '../../config/database/constants'
import { Connection } from 'mysql2/promise'
import { CreateItemRequest } from '../dto/save-item.dto'
import { InternalServerErrorException } from '@nestjs/common'
import { JwtProvider } from '../../jwt/jwt.provider'
import { when } from 'jest-when'
import { userMock } from '../../fixture/memberFixture'

describe('ItemController class', () => {
  let itemController: ItemCreateController
  let connection: Connection

  const requestMock = {
    user: {
      email: userMock().email,
    },
  } as unknown as Request

  const ItemCreaterMock = {
    registerItem: jest.fn(),
  }

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ItemCreateController],
      providers: [
        ItemRepository,
        JwtProvider,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
        {
          provide: ItemCreater,
          useValue: ItemCreaterMock,
        },
      ],
    }).compile()

    itemController = app.get<ItemCreateController>(ItemCreateController)
  })

  describe('createItemHandler method', () => {
    const itemRequest: CreateItemRequest = {
      itemName: itemMock().itemName,
      itemDetail: itemMock().itemDetail,
      price: itemMock().price,
      stockNumber: itemMock().stockNumber,
      sellStatus: itemMock().itemSellStatus,
    }
    beforeEach(() => {
      when(ItemCreaterMock.registerItem).mockResolvedValue(itemMock().id)
    })
    context('상품 정보가 주어지고 저장을 성공하면', () => {
      it('id를 리턴해야 한다', async () => {
        const id = await itemController.createItemHandler(itemRequest, requestMock)

        expect(id).toEqual({
          id: itemMock().id,
        })
      })
    })

    context('상품 정보가 주어지고 저장을 실패하면', () => {
      beforeEach(() => {
        when(ItemCreaterMock.registerItem).mockImplementation(() => {
          throw new InternalServerErrorException('예기치 못한 서버 오류가 발생했습니다')
        })
      })
      it('InternalServerErrorException를 던져야 한다', async () => {
        expect(itemController.createItemHandler(itemRequest, requestMock)).rejects.toThrow(
          new InternalServerErrorException('예기치 못한 서버 오류가 발생했습니다'),
        )
      })
    })
  })
})
