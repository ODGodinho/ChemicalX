import type {
    Page as PageBase,
} from "./Page";

declare module "playwright-core" {
    interface Page extends PageBase {
    }
}
