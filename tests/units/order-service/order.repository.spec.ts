import { Test } from '@nestjs/testing';
import { OrderRepository } from '../../../apps/order-service/src/app/infraestructure/repositories/order.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../../../libs/models/src/lib/entities/order.entity';
import { Repository } from 'typeorm';

// Mock del repositorio de TypeORM para Order
const mockOrderRepository = () => ({
  save: jest.fn(),
});

// Mock para el cliente Kafka
const mockClientKafka = () => ({
  emit: jest.fn(),
});

const clientKafkaMock = mockClientKafka();

describe('OrderRepository', () => {
  let orderRepository: OrderRepository;
  let orderRepositoryMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OrderRepository,
        { provide: getRepositoryToken(Order), useFactory: mockOrderRepository },
        { provide: `KAFKA_CLIENT`, useValue: clientKafkaMock },
      ],
    }).compile();

    orderRepository = module.get<OrderRepository>(OrderRepository);
    orderRepositoryMock = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  describe('createOrder', () => {
    it('should successfully create an order and emit an event', async () => {
      const mockOrder = new Order();
      mockOrder.id = 1;
      mockOrder.products = [];
      mockOrder.total = 100;

      orderRepositoryMock.save.mockResolvedValue(mockOrder);

      const result = await orderRepository.createOrder(mockOrder);

      expect(result).toEqual(mockOrder);
      expect(orderRepositoryMock.save).toHaveBeenCalledWith(mockOrder);
      expect(clientKafkaMock.emit).toHaveBeenCalledWith(
        'order-events',
        JSON.stringify({ type: 'order-created', data: mockOrder })
      );
    });

    it('should handle errors', async () => {
      orderRepositoryMock.save.mockRejectedValue(new Error('Some error'));
      await expect(orderRepository.createOrder(new Order())).rejects.toThrow('Some error');
    });
  });
});
