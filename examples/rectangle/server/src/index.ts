import "dotenv/config";
import {create} from "blueprint-server";
import session from "./session";
import myApp from "./apps/myApp";

const bp = create({myApp}, session);
bp.serve();
//From scratch
// const bp = create({myApp}, session);
// e.use(bp.express.path, bp.express.app);
// bp.io.serve(e); //if you don't have a websocket already built
// io.of(bp.io.namespace).on('connection', bp.io.onConnection) //if you do have a websocket already built

//
// //With exiting express server and/or web socket setup
// const e = express();
// e.use(express.json());
// const server = e.listen();
//
// const bp = create({myApp}, session);
// e.use(bp.express.path, bp.express.app);
// io.of(bp.io.namespace).on('connection', bp.io.onConnection);

