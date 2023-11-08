import { Test, TestingModule } from '@nestjs/testing';
import { FranchiseUserController } from './franchise-user.controller';

describe('FranchiseUserController', () => {
  let controller: FranchiseUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FranchiseUserController],
    }).compile();

    controller = module.get<FranchiseUserController>(FranchiseUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
