import { ConfigService } from './config.service'
import { CONFIG_SERVICE } from '../../core/providers/providers.const'

export const ConfigServiceProvider = {
  provide: CONFIG_SERVICE,
  useValue: new ConfigService(`${process.env.NODE_ENV || 'development'}.env`),
}
