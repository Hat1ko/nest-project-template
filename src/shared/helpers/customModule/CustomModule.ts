import { DynamicModule, Module, Type } from '@nestjs/common'

export interface ICustomModuleProperties {
  public?: any[]
  private?: any[]
  imports?: any[]
  controllers?: any[]
}

const parseCustomModuleProperties = (properties: ICustomModuleProperties) => ({
  imports: properties.imports || [],
  controllers: properties.controllers || [],
  providers: [...(properties.private || []), ...(properties.public || [])],
  exports: [...(properties.public || []).map(module => module.provide || module)],
})

interface ICustomDynamicModuleProperties extends ICustomModuleProperties {
  module: Type<any>
}

const parseCustomDynamicModuleProperties = (properties: ICustomDynamicModuleProperties) => ({
  module: properties.module,
  ...parseCustomModuleProperties(properties),
})

export const CustomModule = (moduleProperties: ICustomModuleProperties) =>
  Module(parseCustomModuleProperties(moduleProperties))

export class CustomDynamicModule {
  static forRoot(module: ICustomModuleProperties): DynamicModule {
    return parseCustomDynamicModuleProperties({
      ...module,
      module: this,
    })
  }

  static imports(imports: any[]): DynamicModule {
    return this.forRoot({
      imports,
    })
  }
}
