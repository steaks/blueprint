import router from "./module";
import serve from "./webserver";

export {BRequest, BResponse} from "./webserver";

export default {
  serve,
  routes: router.routes,
  modules: router.modules
};
