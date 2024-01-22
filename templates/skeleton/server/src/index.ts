import "dotenv/config";
import {create} from "blueprint-server";
import session from "./session";

const bp = create({}, session);
bp.serve();