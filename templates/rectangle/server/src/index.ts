import "dotenv/config";
import {create} from "blueprint-server";
import session from "./session";
import myApp from "./apps/myApp";

const bp = create({myApp}, session);
bp.serve();