import { Test, TestingModule } from '@nestjs/testing';
import { AnalyzerService } from '../../src/analyzer/analyzer.service.js';

describe('AnalyzerService', () => {
  let service: AnalyzerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyzerService]
    }).compile();

    service = module.get<AnalyzerService>(AnalyzerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
