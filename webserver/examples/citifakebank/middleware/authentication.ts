import {BRequest} from "../../../webserver";

interface User {
  readonly username: string;
  readonly password: string;
}

const sessions: Record<string, User> = {
  "stevenstoken": {username: "steven", password: "foobar"}
};

export type WithUser = BRequest & {
  readonly user: User;
}

const authenticate = (request: BRequest): WithUser => {
  const token = request.query.token as string || "";
  const user = sessions[token];
  if (user) {
    return {...request, user};
  } else {
    throw new Error("Not authorized"); //blueprint.end({...request, statusCode: 401, data: "Not Authenticated"});
  }
};

export default {
  authenticate
};
