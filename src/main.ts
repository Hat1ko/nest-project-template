import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {ValidationPipe} from "@nestjs/common"
import * as bodyParser from 'body-parser'
declare const module: any

async function bootstrap() {
  const appOptions = { cors: true, bodyParser: false }
  const app = await NestFactory.create(AppModule, appOptions)

  app.useGlobalPipes(new ValidationPipe())

  app.setGlobalPrefix('api')


  app.use(bodyParser.json({ limit: '10mb' }))
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }))

  await app.listen(3000)

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}
bootstrap();
