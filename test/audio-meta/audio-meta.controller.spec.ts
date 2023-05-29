import { Test, TestingModule } from '@nestjs/testing';
import { AudioMetaController } from '../../src/audio-meta/audio-meta.controller';
import { AudioMetaService } from '../../src/audio-meta/audio-meta.service';

describe('AudioMetaController', () => {
  let controller: AudioMetaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AudioMetaController],
      providers: [AudioMetaService]
    }).compile();

    controller = module.get<AudioMetaController>(AudioMetaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
