import { Test, TestingModule } from '@nestjs/testing'
import {
  CanActivate,
  ForbiddenException,
  INestApplication,
  NotFoundException,
  UnauthorizedException,
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
import { MemberRepository } from '../src/members/domain/member.repository'
import { userMock } from '../src/fixture/memberFixture'
import { JwtAuthGuard } from '../src/config/auth/guards/jwt-auth.guard'
import { jwtTokenFixture } from '../src/fixture/jwtTokenFixture'
import { JwtProvider } from '../src/jwt/jwt.provider'
import { RolesGuard } from '../src/config/auth/guards/role-auth.guard'
import { when } from 'jest-when'

describe('ItemDetailController (e2e)', () => {
  let app: INestApplication
  let connection: Connection

  const RolesGuardMock: CanActivate = {
    canActivate: jest.fn(() => true),
  }

  const ItemReaderMock = {
    getItem: jest.fn(),
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
        ItemUpdater,
        MemberRepository,
        JwtAuthGuard,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
        {
          provide: ItemReader,
          useValue: ItemReaderMock,
        },
        {
          provide: JwtProvider,
          useValue: JwtProviderMock,
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue(RolesGuardMock)
      .compile()

    app = moduleFixture.createNestApplication()

    await app.init()
  })

  describe('GET /items/:id', () => {
    beforeEach(() => {
      when(ItemReaderMock.getItem).mockResolvedValue(itemMock())
      when(JwtProviderMock.validateToken).mockResolvedValue(userMock().email)
    })
    context('상품 id가 주어지고 요청을 성공하면', () => {
      it('200 OK를 응답해야 한다', async () => {
        const itemResponse = {
          id: itemMock().id + '',
          itemName: itemMock().itemName,
          itemDetail: itemMock().itemDetail,
          price: itemMock().price,
          stockNumber: itemMock().stockNumber,
          sellStatus: itemMock().itemSellStatus,
        }
        const { status, body } = await request(app.getHttpServer())
          .get(`/items/${itemMock().id}`)
          .set('Authorization', 'Bearer ' + jwtTokenFixture().accessToken)

        expect(status).toEqual(200)
        expect(body).toEqual(itemResponse)
      })
    })

    context('상품 id가 주어지고 요청을 실패하면', () => {
      const not_found_id = (itemMock().id = 9999)
      beforeEach(() => {
        when(ItemReaderMock.getItem).mockImplementation(() => {
          throw new NotFoundException(`${not_found_id}에 해당하는 상품을 찾을 수 없습니다.`)
        })
      })

      it('404 Item Not Found를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer())
          .get(`/items/${not_found_id}`)
          .set('Authorization', 'Bearer ' + jwtTokenFixture().accessToken)

        expect(status).toEqual(404)
        expect(body).toEqual({
          error: 'Not Found',
          message: '9999에 해당하는 상품을 찾을 수 없습니다.',
          statusCode: 404,
        })
      })
    })

    context('상품 id가 주어지고 권한 접근을 실패하면', () => {
      beforeEach(() => {
        when(RolesGuardMock.canActivate).mockImplementation(() => {
          throw new ForbiddenException('접근 할 수 없는 권한입니다')
        })
      })
      it('403 Forbidden을 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer())
          .get(`/items/${itemMock().id}`)
          .set('Authorization', 'Bearer ' + jwtTokenFixture().accessToken)

        expect(status).toEqual(403)
        expect(body).toEqual({ error: 'Forbidden', message: '접근 할 수 없는 권한입니다', statusCode: 403 })
      })
    })

    context('상품 id가 주어지고 토큰을 찾을 수 없으면', () => {
      when(JwtProviderMock.validateToken)
        .calledWith(jwtTokenFixture().invalidToken)
        .mockImplementation(() => {
          throw new UnauthorizedException('인증 할 수 없는 token 입니다')
        })
      it('403 Forbidden을 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer()).get(`/items/${itemMock().id}`)

        expect(status).toEqual(403)
        expect(body).toEqual({ error: 'Forbidden', message: '요청에서 인증 토큰을 찾을 수 없습니다', statusCode: 403 })
      })
    })

    context('상품 id가 주어지고 토큰이 인증되지 않으면', () => {
      it('401 Unauthorized를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer())
          .get(`/items/${itemMock().id}`)
          .set('Authorization', 'Bearer ' + jwtTokenFixture().invalidToken)

        expect(status).toEqual(401)
        expect(body).toEqual({ error: 'Unauthorized', message: '인증 할 수 없는 token 입니다', statusCode: 401 })
      })
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
