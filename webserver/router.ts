import blueprint, {AsyncParams} from "blueprint";
import {WithUrl} from "./index";

interface Router {
  readonly get: (path: string, func: AsyncParams<WithUrl, any, any, any>) => Router;
  readonly post: (path: string, func: AsyncParams<WithUrl, any, any, any>) => Router;
}
