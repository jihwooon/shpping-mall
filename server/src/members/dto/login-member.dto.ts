import { IsNotEmpty, IsString, Contains } from 'class-validator'

export class LoginMemberDto {
  @IsNotEmpty({ message: '이메일은 필수 입력 값입니다.' })
  @Contains('@', { message: '올바른 이메일 형식을 입력하세요.' })
  @IsString()
  email: string

  @IsNotEmpty({ message: '비밀번호는 필수 입력 값입니다.' })
  password: string
}
