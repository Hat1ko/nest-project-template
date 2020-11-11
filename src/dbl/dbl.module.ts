import {Global} from "@nestjs/common";
import {CustomDynamicModule, CustomModule} from "../shared/helpers/customModule";
import {DBLService} from "./dbl.service";

@Global()
@CustomModule({
    imports: [],
    public: [
        DBLService,
    ],
})
export class DBLModule extends CustomDynamicModule {}
