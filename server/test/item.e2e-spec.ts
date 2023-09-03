import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, NotFoundException } from '@nestjs/common'
import * as request from 'supertest'
import { ItemModule } from '../src/items/item.module'
import { ItemService } from '../src/items/application/item.service'
import { ItemStatusEnum } from '../src/items/domain/item-status.enum'
import { ItemRepository } from '../src/items/domain/item.repository'
import { DatabaseModule } from '../src/config/database/database.module'

describe('ItemController (e2e)', () => {
  let app: INestApplication
  let itemService: ItemService
  const RESPONSE = {
    id: 1,
    itemName: 'New Balance 530 Steel Grey',
    itemDetail: 'M990WT6',
    price: 130000,
    stockNumber: 10,
    sellStatus: ItemStatusEnum.SELL,
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ItemModule, DatabaseModule],
      providers: [ItemService, ItemRepository],
    }).compile()

    itemService = moduleFixture.get<ItemService>(ItemService)
    app = moduleFixture.createNestApplication()
    await app.init()
  })

  describe('GET /:id', () => {
    const ID = 1
    const NOT_FOUND_ID = 9999
    context('id 요청을 하면', () => {
      beforeEach(() => {
        itemService.getItem = jest.fn().mockImplementation(() => RESPONSE)
      })

      it('상태코드 200을 응답한다', async () => {
        const response = await request(app.getHttpServer()).get(`/items/${ID}`)

        expect(response.status).toEqual(200)
        expect(response.body.id).toEqual(1)
        expect(response.body.price).toEqual(130000)
        expect(response.body.itemName).toEqual('New Balance 530 Steel Grey')
        expect(response.body.itemDetail).toEqual('M990WT6')
        expect(response.body.stockNumber).toEqual(10)
        expect(response.body.sellStatus).toEqual('SELL')
      })
    })

    context('잘못된 id 요청을 하면', () => {
      beforeEach(() => {
        itemService.getItem = jest
          .fn()
          .mockRejectedValue(new NotFoundException(`${NOT_FOUND_ID}에 해당하는 상품을 찾을 수 없습니다.`))
      })
      it('상태코드 404를 응답한다', async () => {
        const response = await request(app.getHttpServer()).get(`/items/${NOT_FOUND_ID}`)

        expect(response.status).toEqual(404)
      })
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
