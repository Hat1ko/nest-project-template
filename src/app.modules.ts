import {DBLModule, TypeOrmModuleProvider} from "./dbl";

export const ApplicationModules = [
  DBLModule.imports([TypeOrmModuleProvider]),

]
