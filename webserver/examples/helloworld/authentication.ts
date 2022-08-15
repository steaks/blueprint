import {BResponse, WithQuery} from "../../webserver";
import users ,{User}from "./database";
import blueprint, {End} from "blueprint";
import * as crypto from "crypto";

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

const login = async (q: WithQuery): Promise<[string, User]> => {
  const user = await users.find(q.query.username as string);
  if (user && user.password && user.password === q.query.password) {
    const token = crypto.randomUUID();
    sessions[token] = user;
    return [token, user];
  }
  throw new Error("User not found");
};

const register = async (q: WithQuery): Promise<[string, User]> => {
  const user = await users.create(q.query.username as string, q.query.password as string);
  const token = crypto.randomUUID();
  sessions[token] = user;
  return [token, user];
};

export default {
  authenticate,
  login,
  register
};
