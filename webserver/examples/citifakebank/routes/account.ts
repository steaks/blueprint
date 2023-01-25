import webserver, {WithQuery} from "../../../index";
import authentication, {WithUser} from "../middleware/authentication";
import {getActivity, getBalance} from "../account";

export const account = webserver.router.router<WithQuery, WithUser>("/account")
  .before(authentication.authenticate)
  .get("/balance", getBalance)
  .get("/activity", getActivity)
  .notFound((p: WithQuery) => ({...p, data: "NOT FOUND", statusCode: 404}));