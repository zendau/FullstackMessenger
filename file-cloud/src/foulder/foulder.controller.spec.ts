import { Test, TestingModule } from '@nestjs/testing';
import { FoulderController } from './foulder.controller';
import { FoulderService } from './foulder.service';

describe('FoulderController', () => {
  let controller: FoulderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoulderController],
      providers: [FoulderService],
    }).compile();

    controller = module.get<FoulderController>(FoulderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
