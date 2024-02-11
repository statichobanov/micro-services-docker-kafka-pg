import { ApiProperty } from '@nestjs/swagger';

export class ProductModel {
  @ApiProperty({ example: 1, description: 'Product identifier' })
  id: number;

  @ApiProperty({ example: 'Laptop', description: "Product's name" })
  name: string;

  @ApiProperty({ example: 100, description: "Product's value" })
  value: number;

  @ApiProperty({ example: 10, description: "Product's amount" })
  amount: number;
}
