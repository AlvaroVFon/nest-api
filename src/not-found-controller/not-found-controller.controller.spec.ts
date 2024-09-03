import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundControllerController } from './not-found-controller.controller';

describe('NotFoundControllerController', () => {
  let controller: NotFoundControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotFoundControllerController],
    }).compile();

    controller = module.get<NotFoundControllerController>(NotFoundControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
