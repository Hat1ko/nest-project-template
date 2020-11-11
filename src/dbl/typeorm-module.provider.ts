import { TypeOrmModule } from '@nestjs/typeorm'
import { CONFIG_SERVICE } from '../core/providers/providers.const'
import { IConfigService } from '../core/interfaces/other'

export const TypeOrmModuleProvider = TypeOrmModule.forRootAsync({
    inject: [CONFIG_SERVICE],
    useFactory: async (config: IConfigService) => config.getPostgresConfig(),
})
