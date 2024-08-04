import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/user/setConfirmCode (POST)', async (done) => {
    return request(app.getHttpServer())
      .post('/user/setConfirmCode')
      .send({
        email: 'test@mail.com',
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toBe('true');

        done();
      });
  });
});
