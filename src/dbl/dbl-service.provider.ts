import { DBLService } from './dbl.service'
import { DBL_SERVICE } from '../core/providers/providers.const'

export const DBLServiceProvider = {
    provide: DBL_SERVICE,
    useClass: DBLService,
}
