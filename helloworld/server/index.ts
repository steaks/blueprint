import {serve} from "@blueprint/rx";
import shop from "./apps/shop";
import hangOrBang from "./apps/hangOrBang";
import session from "./session";

serve({shop, hangOrBang}, session);