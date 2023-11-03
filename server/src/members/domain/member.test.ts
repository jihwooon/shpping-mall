import { Member } from './member.entity'
import { userMock } from '../../../fixture/memberFixture'
import { Role } from './member-role.enum'
import { MemberType } from './member-type.enum'

describe('Member', () => {
  let member: Member

  context('Member 객체가 주어지면', () => {
    it('Member 값을 리턴해야 한다', () => {
      member = new Member(userMock())

      expect(member).toEqual({
        memberId: 1,
        email: 'abc@email.com',
        memberName: '홍길동',
        memberType: MemberType.GENERAL,
        password: '$2b$10$nEU5CvDwcTwsMfZeiRv6UeYxh.Zp796RXh170vrRVPP.w0en8696K',
        refreshToken: 'eyJhbGciOiJI',
        tokenExpirationTime: new Date('2023-09-01T23:10:00.009Z'),
        role: Role.USER,
        createTime: new Date('2023-09-01T23:10:00.009Z'),
        updateTime: new Date('2023-09-01T23:10:00.009Z'),
        createBy: '홍길동',
        modifiedBy: '김철수',
      })
    })
  })

  context('Member 객체에 빈 값이 주어지면', () => {
    it('default 값을 리턴해야 한다', () => {
      member = new Member({})

      expect(member.memberId).toEqual(0)
      expect(member.email).toEqual('')
      expect(member.memberName).toEqual('')
      expect(member.memberType).toEqual('GENERAL')
      expect(member.password).toEqual('')
      expect(member.refreshToken).toEqual('')
      expect(member.role).toEqual('USER')
      expect(member.createBy).toEqual('')
      expect(member.modifiedBy).toEqual('')
    })
  })
})
