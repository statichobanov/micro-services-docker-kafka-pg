import { ApiProperty } from '@nestjs/swagger';
import { OrderModel } from './order.model';

export class UserModel {
  @ApiProperty({ example: 1, description: 'User identifier' })
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  name: string;

  @ApiProperty({ example: '0982345POIJSDF0', description: 'User password encrypted' })
  password: string;

  @ApiProperty({ example: 'johndoe@email.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: [], description: 'User orders list' })
  orders: OrderModel[];
}
