import "dotenv/config";
import {create} from "blueprint-server";
import helloWorld from "./apps/helloWorld";
import session from "./session";

const bp = create({helloWorld}, session);
bp.serve();