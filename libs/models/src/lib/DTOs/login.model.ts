import { ApiProperty } from '@nestjs/swagger';

export class LoginModel {
  @ApiProperty({ example: 'johndoe@email.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: '1234', description: 'User password' })
  password: string;
}
