import { Test, TestingModule } from '@nestjs/testing';
import { FoulderService } from './foulder.service';

describe('FoulderService', () => {
  let service: FoulderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoulderService],
    }).compile();

    service = module.get<FoulderService>(FoulderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
