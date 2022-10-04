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

const authenticate = (request: WithQuery): WithUser | End<BResponse> => {
  const foo = request.query.token as string || "";
  const user = sessions[foo];
  if (user) {
    return {...request, user};
  } else {
    return blueprint.end({...request, statusCode: 401, data: "Not Authenticated"});
  }
};

export default {
  authenticate
};
