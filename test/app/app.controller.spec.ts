import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../src/app/app.controller.js';
import { AppService } from '../../src/app/app.service.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService]
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHealth()).toBe('Hello World!');
    });
  });
});
