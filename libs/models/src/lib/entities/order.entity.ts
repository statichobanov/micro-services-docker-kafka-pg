import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];

  @Column('date')
  date: Date;

  @ManyToOne(() => User, (user) => user.orders)
  user: number;

  @Column('decimal')
  total: number;
}
