import {diagram} from "blueprint-server";
import userProfile from "./apps/userProfile";
import session from "./session";

diagram({userProfile}, session);