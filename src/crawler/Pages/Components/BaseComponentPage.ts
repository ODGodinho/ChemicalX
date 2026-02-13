import type { PageEngineInterface } from "../../index";
import { BasePage } from "../BasePage";

export abstract class BaseComponentPage<
    PageClassEngine extends PageEngineInterface,
> extends BasePage<PageClassEngine> {

}
