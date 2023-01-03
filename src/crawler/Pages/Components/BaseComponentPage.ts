import { type PageEngineInterface } from "../../index";
import { BasePage } from "../BasePage";

export abstract class BaseComponentPage<
    SelectorBaseType,
    PageClassEngine extends PageEngineInterface,
> extends BasePage<SelectorBaseType, PageClassEngine> {

}
