import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const serverConfig = config.get('server') // config에서 서버를 가져욤
  const port = serverConfig.port;
  // 3000번 포트에서 실행됨
  await app.listen(port);
  Logger.log(`Application running no part ${port}`) // 3000번 포트에서 실행된다고 로그가 뜬다.
}
bootstrap();
