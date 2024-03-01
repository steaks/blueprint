import "dotenv/config";
import {create} from "blueprint-server";
import session from "./session";
import helloWorld from "./apps/helloWorld";

const bp = create({helloWorld}, session);
bp.serve();