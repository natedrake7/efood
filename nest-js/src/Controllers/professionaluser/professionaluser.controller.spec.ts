import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionaluserController } from './professionaluser.controller';

describe('ProfessionaluserController', () => {
  let controller: ProfessionaluserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessionaluserController],
    }).compile();

    controller = module.get<ProfessionaluserController>(ProfessionaluserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
