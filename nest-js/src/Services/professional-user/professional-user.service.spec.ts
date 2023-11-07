import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionalUserService } from './professional-user.service';

describe('ProfessionalUserService', () => {
  let service: ProfessionalUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfessionalUserService],
    }).compile();

    service = module.get<ProfessionalUserService>(ProfessionalUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
