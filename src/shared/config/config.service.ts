import * as dotenv from 'dotenv'
import { readFileSync } from 'fs'
import { Entities } from '../../dbl'

import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { IConfigService } from '../../core/interfaces/other'

export class ConfigService implements IConfigService {
  private readonly envConfig: Record<string, string>

  constructor(filePath: string) {
    this.envConfig = dotenv.parse(readFileSync('./' + filePath))
  }

  get(key: string): string {
    return this.envConfig[key]
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getOrDef(key: string, def: any): any {
    if (this.get(key)) {
      return this.get(key)
    } else {
      return def
    }
  }

  getPostgresConfig(): TypeOrmModuleOptions {
    return {
      type: this.getOrDef('DB_TYPE', 'postgres'),
      host: this.getOrDef('DB_HOST', 'strangeproject-postgres'),
      port: this.getOrDef('DB_PORT', 5432),
      username: this.getOrDef('DB_USERNAME', 'postgres'),
      password: this.getOrDef('DB_PASSWORD', 'postgres'),
      database: this.getOrDef('DB_DATABASE', 'strangeproject'),
      synchronize: this.getOrDef('DB_SYNC', true),
      keepConnectionAlive: true,
      entities: Entities,
    }
  }

  getAdminPanelUrl(): string {
    return this.get('ADMIN_PANEL_URL') || `http://0.0.0.0:3000`
  }

  getErrorCode(key: string): number {
    switch (key) {
      case 'unique_violation':
        return 23505
      default:
        return null
    }
  }
}
