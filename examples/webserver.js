"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var blueprint_1 = require("blueprint");
var headersParser = function (request) { return console.log("PARSE HEADERS"); };
var queryStringParser = function (request) { return console.log("PARSE QUERY STRING"); };
var bodyParser = function (request) { return console.log("PARSE BODY"); };
var cookieParser = function (request) { return console.log("PARSE COOKIES"); };
var logger = function (request) { return console.log("LOG"); };
var authentication = function (request) { return console.log("AUTHENTICATION"); };
var compress = function () { return console.log("COMPRESS"); };
var before = (function () {
    var input = blueprint_1.default.input();
    var headersParserO = blueprint_1.default.operator(headersParser, input);
    var queryStringParserO = blueprint_1.default.operator(queryStringParser, input);
    var bodyParserO = blueprint_1.default.operator(bodyParser, input);
    var cookieParserO = blueprint_1.default.operator(cookieParser, input);
    var loggerO = blueprint_1.default.operator(logger, input);
    var authenticationO = blueprint_1.default.operator(authentication, input);
    return blueprint_1.default.graph("before", input, headersParserO, queryStringParserO, bodyParserO, cookieParserO, loggerO, authenticationO);
})();
var after = (function () {
    var input = blueprint_1.default.input();
    var compressO = blueprint_1.default.operator(compress);
    return blueprint_1.default.graph("after", input, compressO);
})();
var get = function (request) { return request.method === "GET"; };
var post = function (request) { return request.method === "POST"; };
var foo = function (request) { return request.path === "/foo"; };
var bar = function (request) { return request.path === "/foo"; };
var baz = function (request) { return request.path === "/foo"; };
var doFoo = function (request) { return console.log("DO FOO"); };
var doBar = function (request) { return console.log("DO BAR"); };
var doBaz = function (request) { return console.log("DO BAZ"); };
var notFound = function (request) { return console.log("404"); };
var gets = (function () {
    var input = blueprint_1.default.input();
    var getRoutes = blueprint_1.default
        .branch("routes", input)
        .case(foo, doFoo)
        .case(bar, doBar)
        .case(baz, doBaz)
        .default(notFound);
    return blueprint_1.default.graph("gets", input, getRoutes);
})();
var posts = (function () {
    var input = blueprint_1.default.input();
    var postRoutes = blueprint_1.default
        .branch("routes", input)
        .case(foo, doFoo)
        .case(bar, doBar)
        .case(baz, doBaz)
        .default(notFound);
    return blueprint_1.default.graph("gets", input, postRoutes);
})();
var routes = (function () {
    var input = blueprint_1.default.input();
    return blueprint_1.default
        .branch("methods", input)
        .case(get, gets)
        .case(post, posts)
        .default(notFound);
})();
var app = (function () {
    var input = blueprint_1.default.input();
    return blueprint_1.default.graph("webserver", input, blueprint_1.default.operator(before, input), routes, blueprint_1.default.operator(after));
})();
var webserver = blueprint_1.default.serialize.sheet("webserver", [app]);
exports.default = webserver;
