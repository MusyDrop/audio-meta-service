import { Test, TestingModule } from '@nestjs/testing';
import { AudioMetaService } from '../../src/audio-meta/audio-meta.service';

describe('AudioMetaService', () => {
  let service: AudioMetaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AudioMetaService],
    }).compile();

    service = module.get<AudioMetaService>(AudioMetaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
