import {diagram} from "blueprint-server";
import helloWorld from "./apps/helloWorld";
import session from "./session";

diagram({helloWorld}, session);