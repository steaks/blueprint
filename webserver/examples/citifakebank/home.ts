import webserver, {WithQuery} from "../../index";

const home = webserver.router.router("")
  .get("/", (p: WithQuery) => ({
    ...p,
    data: `
        <h1>CitiFakeBank</h1>
        <div>This is a fake banking webserver designed to illustrate the value of blueprint.</div>
        <h2>About the bank</h2>
        <a href='/about/team'>about/team</a><br/>
        <a href='/about/history'>about/history</a>
        <h2>Your Account</h2>
        <div><a href='/account/balance?token=stevenstoken'>account/balance</a><i>&nbsp;&nbsp;(requires authentication)</i></div>
        <div><a href='/account/activity?token=stevenstoken'>account/activity</a><i>&nbsp;&nbsp;(requires authentication)</i></div>`,
    statusCode: 200
  }))
  .notFound((p: WithQuery) => ({...p, data: "NOT FOUND", statusCode: 404}));

export default home;
