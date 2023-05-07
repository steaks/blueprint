import webserver from "../../index";
import home from "./modules/home";
import about from "./modules/about";
import account from "./modules/account";

webserver.serve([
    about,
    account,
    home,
]);