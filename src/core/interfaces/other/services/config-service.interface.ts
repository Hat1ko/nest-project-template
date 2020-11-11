import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { RedisModuleOptions } from 'nestjs-redis'

export interface IConfigService {
  /**
   * Method for get config row from .env file
   * if .env file not have this row throw Exception
   * @param key
   */
  get(key: string): string

  /**
   * Method for get config row from .env file
   * If .env file not have this row return def param
   * @param key
   * @param def
   */
  getOrDef(key: string, def: any): string | number

  /**
   * Method return config for connect to postgres
   */
  getPostgresConfig(): TypeOrmModuleOptions

  /**
   * Return url for fron-end path of admin-panel
   */
  getAdminPanelUrl(): string

}
