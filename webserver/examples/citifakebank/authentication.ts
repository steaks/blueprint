import {BResponse, WithQuery} from "../../webserver";
import blueprint, {End} from "blueprint";

interface User {
  readonly username: string;
  readonly password: string;
}

const sessions: Record<string, User> = {
  "stevenstoken": {username: "steven", password: "foobar"}
};

export type WithUser = WithQuery & {
  readonly user: User;
}

const authenticate = (q: WithQuery): WithUser | End<BResponse> => {
  const foo = q.query.token as string || "";
  const user = sessions[foo];
  if (user) {
    return {...q, user};
  } else {
    return blueprint.end({...q, statusCode: 401, data: "Not Authenticated"});
  }
};

export default {
  authenticate
};
