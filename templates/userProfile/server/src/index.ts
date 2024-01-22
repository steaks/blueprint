import "dotenv/config";
import {create} from "blueprint-server";
import userProfile from "./apps/userProfile";
import session from "./session";

const bp = create({userProfile}, session);
bp.serve();