import { Global } from '@nestjs/common'
import { ConfigServiceProvider } from './config-service.provider'
import {CustomDynamicModule, CustomModule} from "../helpers/customModule";

@Global()
@CustomModule({
  public: [ConfigServiceProvider],
})
export class ConfigModule extends CustomDynamicModule {}
