import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, NotFoundException, ValidationPipe, ForbiddenException } from '@nestjs/common'
import * as request from 'supertest'
import { ItemCreater } from '../src/items/application/item.creater'
import { ItemReader } from '../src/items/application/item.reader'
import { ItemUpdater } from '../src/items/application/item.updater'
import { itemMock } from '../src/fixture/itemFixture'
import { ItemUpdateController } from '../src/items/web/item-update.controller'
import { ItemDetailController } from '../src/items/web/item-detail.controller'
import { ItemCreateController } from '../src/items/web/item-create.controller'
import { ItemRepository } from '../src/items/domain/item.repository'
import { MYSQL_CONNECTION } from '../src/config/database/constants'
import { Connection } from 'mysql2/promise'
import { UpdateItemRequest } from '../src/items/dto/update-item.dto'
import { MemberRepository } from '../src/members/domain/member.repository'
import { JwtAuthGuard } from '../src/config/auth/guards/jwt-auth.guard'
import { JwtProvider } from '../src/jwt/jwt.provider'
import { RolesGuard } from '../src/config/auth/guards/role-auth.guard'
import { jwtTokenFixture } from '../src/fixture/jwtTokenFixture'
import { userMock } from '../src/fixture/memberFixture'

describe('ItemCreateController (e2e)', () => {
  let app: INestApplication
  let connection: Connection
  let itemUpdater: ItemUpdater
  let jwtProvider: JwtProvider
  let rolesGuard: RolesGuard

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ItemCreateController, ItemDetailController, ItemUpdateController],
      providers: [
        ItemRepository,
        ItemCreater,
        ItemReader,
        ItemUpdater,
        MemberRepository,
        JwtProvider,
        JwtAuthGuard,
        RolesGuard,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
      ],
    }).compile()

    jwtProvider = moduleFixture.get<JwtProvider>(JwtProvider)
    itemUpdater = moduleFixture.get<ItemUpdater>(ItemUpdater)
    rolesGuard = moduleFixture.get<RolesGuard>(RolesGuard)

    app = moduleFixture.createNestApplication()

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )

    await app.init()
  })

  describe('PATCH /items/:id', () => {
    beforeEach(() => {
      itemUpdater.updateItem = jest.fn().mockImplementation(() => true)
      jwtProvider.validateToken = jest.fn().mockResolvedValue(userMock().email)
      rolesGuard.canActivate = jest.fn().mockResolvedValue(true)
    })

    context('회원 id와 상품 정보가 주어지고 변경에 성공하면', () => {
      it('상태코드 200을 응답한다', async () => {
        const updateItemRequest: UpdateItemRequest = {
          itemName: itemMock().itemName,
          itemDetail: itemMock().itemDetail,
          sellStatus: itemMock().itemSellStatus,
          price: itemMock().price,
          stockNumber: itemMock().stockNumber,
        }
        const { status } = await request(app.getHttpServer())
          .patch(`/items/${itemMock().id}`)
          .send(updateItemRequest)
          .set('Authorization', 'Bearer ' + jwtTokenFixture().accessToken)

        expect(status).toEqual(200)
      })
    })

    context('회원 id와 상품 정보가 주어지고 변경에 실패하면', () => {
      const not_found_id = (itemMock().id = 9999)
      beforeEach(() => {
        itemUpdater.updateItem = jest
          .fn()
          .mockRejectedValue(new NotFoundException(`${not_found_id}에 해당하는 상품을 찾을 수 없습니다.`))
      })

      it('상태코드 404을 응답해야 한다', async () => {
        const updateItemRequest: UpdateItemRequest = {
          itemName: itemMock().itemName,
          itemDetail: itemMock().itemDetail,
          sellStatus: itemMock().itemSellStatus,
          price: itemMock().price,
          stockNumber: itemMock().stockNumber,
        }
        const { status, body } = await request(app.getHttpServer())
          .patch(`/items/${not_found_id}`)
          .send(updateItemRequest)
          .set('Authorization', 'Bearer ' + jwtTokenFixture().accessToken)

        expect(status).toEqual(404)
        expect(body).toEqual({
          error: 'Not Found',
          message: '9999에 해당하는 상품을 찾을 수 없습니다.',
          statusCode: 404,
        })
      })
    })

    context('회원 id와 상품 정보가 주어지고 권한 접근을 실패하면', () => {
      beforeEach(() => {
        rolesGuard.canActivate = jest.fn().mockRejectedValue(new ForbiddenException('접근 할 수 없는 권한입니다'))
      })

      it('상태코드 403을 응답해야 한다', async () => {
        const updateItemRequest: UpdateItemRequest = {
          itemName: itemMock().itemName,
          itemDetail: itemMock().itemDetail,
          sellStatus: itemMock().itemSellStatus,
          price: itemMock().price,
          stockNumber: itemMock().stockNumber,
        }
        const { status, body } = await request(app.getHttpServer())
          .patch(`/items/${itemMock().id}`)
          .send(updateItemRequest)
          .set('Authorization', 'Bearer ' + jwtTokenFixture().accessToken)

        expect(status).toEqual(403)
        expect(body).toEqual({ error: 'Forbidden', message: '접근 할 수 없는 권한입니다', statusCode: 403 })
      })
    })

    context('상풍명을 누락하면', () => {
      it('상태코드 400를 응답해야 한다', async () => {
        const not_found_itemName = (itemMock().itemName = '')
        const updateItemRequest: UpdateItemRequest = {
          itemName: not_found_itemName,
          itemDetail: itemMock().itemDetail,
          sellStatus: itemMock().itemSellStatus,
          price: itemMock().price,
          stockNumber: itemMock().stockNumber,
        }
        const { status, body } = await request(app.getHttpServer())
          .patch(`/items/${itemMock().id}`)
          .send(updateItemRequest)
          .set('Authorization', 'Bearer ' + jwtTokenFixture().accessToken)

        expect(status).toEqual(400)
        expect(body).toEqual({
          error: 'Bad Request',
          message: ['상품명은 필수 입력 값입니다.'],
          statusCode: 400,
        })
      })
    })

    context('상품 상세를 누락하면', () => {
      it('상태코드 400를 응답해야 한다', async () => {
        const not_found_itemDetail = (itemMock().itemDetail = '')
        const updateItemRequest: UpdateItemRequest = {
          itemName: itemMock().itemName,
          itemDetail: not_found_itemDetail,
          sellStatus: itemMock().itemSellStatus,
          price: itemMock().price,
          stockNumber: itemMock().stockNumber,
        }
        const { status, body } = await request(app.getHttpServer())
          .patch(`/items/${itemMock().id}`)
          .send(updateItemRequest)
          .set('Authorization', 'Bearer ' + jwtTokenFixture().accessToken)

        expect(status).toEqual(400)
        expect(body).toEqual({
          error: 'Bad Request',
          message: ['상품 상세는 필수 입력 값입니다.'],
          statusCode: 400,
        })
      })
    })

    context('가격를 누락하면', () => {
      it('상태코드 400를 응답해야 한다', async () => {
        const not_found_price = (itemMock().price = undefined)
        const updateItemRequest: UpdateItemRequest = {
          itemName: itemMock().itemName,
          itemDetail: itemMock().itemDetail,
          sellStatus: itemMock().itemSellStatus,
          price: not_found_price,
          stockNumber: itemMock().stockNumber,
        }

        const { status, body } = await request(app.getHttpServer())
          .patch(`/items/${itemMock().id}`)
          .send(updateItemRequest)
          .set('Authorization', 'Bearer ' + jwtTokenFixture().accessToken)

        expect(status).toEqual(400)
        expect(body).toEqual({
          error: 'Bad Request',
          message: ['price must be a number conforming to the specified constraints', '가격은 필수 입력 값입니다.'],
          statusCode: 400,
        })
      })
    })

    context('재고를 누락하면', () => {
      it('상태코드 400를 응답해야 한다', async () => {
        const not_found_stockName = (itemMock().stockNumber = undefined)
        const updateItemRequest: UpdateItemRequest = {
          itemName: itemMock().itemName,
          itemDetail: itemMock().itemDetail,
          sellStatus: itemMock().itemSellStatus,
          price: itemMock().price,
          stockNumber: not_found_stockName,
        }
        const { status, body } = await request(app.getHttpServer())
          .patch(`/items/${itemMock().id}`)
          .send(updateItemRequest)
          .set('Authorization', 'Bearer ' + jwtTokenFixture().accessToken)

        expect(status).toEqual(400)
        expect(body).toEqual({
          error: 'Bad Request',
          message: [
            'stockNumber must be a number conforming to the specified constraints',
            '재고는 필수 입력 값입니다.',
          ],
          statusCode: 400,
        })
      })
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
