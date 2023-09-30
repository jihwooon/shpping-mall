import { Test, TestingModule } from '@nestjs/testing'
import {
  CanActivate,
  ForbiddenException,
  INestApplication,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common'
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
import { when } from 'jest-when'
import { ItemNotFoundException } from '../src/items/error/item-not-found.exception'
import { ItemUpdatedFailException } from '../src/items/error/item-updated-fail.exception'

describe('ItemUpdateController (e2e)', () => {
  let app: INestApplication
  let connection: Connection

  const RolesGuardMock: CanActivate = {
    canActivate: jest.fn(() => true),
  }

  const ItemUpdaterMock = {
    updateItem: jest.fn(),
  }

  const JwtProviderMock = {
    validateToken: jest.fn(),
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ItemCreateController, ItemDetailController, ItemUpdateController],
      providers: [
        ItemRepository,
        ItemCreater,
        ItemReader,
        MemberRepository,
        JwtAuthGuard,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
        {
          provide: JwtProvider,
          useValue: JwtProviderMock,
        },
        {
          provide: ItemUpdater,
          useValue: ItemUpdaterMock,
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue(RolesGuardMock)
      .compile()

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
    const updateItemRequest: UpdateItemRequest = {
      itemName: itemMock().itemName,
      itemDetail: itemMock().itemDetail,
      sellStatus: itemMock().itemSellStatus,
      price: itemMock().price,
      stockNumber: itemMock().stockNumber,
    }

    beforeEach(() => {
      when(ItemUpdaterMock.updateItem)
        .calledWith(itemMock().id, expect.anything())
        .mockImplementation(() => true)
      when(RolesGuardMock.canActivate).mockResolvedValue(true)
      when(JwtProviderMock.validateToken).calledWith(jwtTokenFixture().accessToken).mockResolvedValue(userMock().email)
    })

    context('상품 id와 상품 정보가 주어지고 변경에 성공하면', () => {
      it('200 OK를 응답해야 한다', async () => {
        const { status } = await request(app.getHttpServer())
          .patch(`/items/${itemMock().id}`)
          .send(updateItemRequest)
          .set('Authorization', 'Bearer ' + jwtTokenFixture().accessToken)

        expect(status).toEqual(200)
      })
    })

    context('찾을 수 없는 상품 id이 주어지고 변경 된 상품이 주어지면', () => {
      const not_found_id = (itemMock().id = 9999)
      beforeEach(() => {
        when(ItemUpdaterMock.updateItem)
          .calledWith(not_found_id, expect.anything())
          .mockImplementation(() => {
            throw new ItemNotFoundException(`${not_found_id}에 해당하는 상품을 찾을 수 없습니다`)
          })
      })

      it('404 ItemNotFound를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch(`/items/${not_found_id}`)
          .send(updateItemRequest)
          .set('Authorization', 'Bearer ' + jwtTokenFixture().accessToken)

        expect(status).toEqual(404)
        expect(body).toEqual({
          error: 'ITEM_NOT_FOUND',
          message: `${not_found_id}에 해당하는 상품을 찾을 수 없습니다`,
          statusCode: 404,
        })
      })
    })

    context('상품 id와 상품 정보가 주어지고 변경에 실패하면', () => {
      beforeEach(() => {
        when(ItemUpdaterMock.updateItem)
          .calledWith(itemMock().id, expect.anything())
          .mockImplementation(() => {
            throw new ItemUpdatedFailException(`해당 상품 변경에 실패했습니다`)
          })
      })
      it('500 InternalServerErrorException를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch(`/items/${itemMock().id}`)
          .send(updateItemRequest)
          .set('Authorization', 'Bearer ' + jwtTokenFixture().accessToken)

        expect(status).toEqual(500)
        expect(body).toEqual({ error: 'ITEM_UPDATED_FAIL', message: '해당 상품 변경에 실패했습니다', statusCode: 500 })
      })
    })

    context('상품 id와 상품 정보가 주어지고 권한 접근을 실패하면', () => {
      beforeEach(() => {
        when(RolesGuardMock.canActivate).mockImplementation(() => {
          throw new ForbiddenException('접근 할 수 없는 권한입니다')
        })
      })

      it('403 Forbidden를 응답해야 한다', async () => {
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

    context('상품 id와 상품 정보가 주어지고 토큰을 찾을 수 없으면', () => {
      it('403 Forbidden를 응답해야 한다', async () => {
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

        expect(status).toEqual(403)
        expect(body).toEqual({ error: 'Forbidden', message: '요청에서 인증 토큰을 찾을 수 없습니다', statusCode: 403 })
      })
    })

    context('상품 id와 상품 정보가 주어지고 토큰이 인증되지 않으면', () => {
      when(JwtProviderMock.validateToken)
        .calledWith(jwtTokenFixture().invalidToken)
        .mockImplementation(() => {
          throw new UnauthorizedException('인증 할 수 없는 token 입니다')
        })
      it('401 Unauthorized를 응답해야 한다', async () => {
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
          .set('Authorization', 'Bearer ' + jwtTokenFixture().invalidToken)

        expect(status).toEqual(401)
        expect(body).toEqual({ error: 'Unauthorized', message: '인증 할 수 없는 token 입니다', statusCode: 401 })
      })
    })

    context('상풍명을 누락하면', () => {
      it('400 Bad Request를 응답해야 한다', async () => {
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
      it('400 Bad Request를 응답해야 한다', async () => {
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
      it('400 Bad Request를 응답해야 한다', async () => {
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
      it('400 Bad Request를 응답해야 한다', async () => {
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
