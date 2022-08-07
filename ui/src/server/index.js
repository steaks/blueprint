#! /usr/bin/env node
const handler = require('serve-handler');
const http = require('http');


const server = http.createServer((request, response) => {
    // You pass two more arguments for config and middleware
    // More details here: https://github.com/vercel/serve-handler#options
    return handler(request, response, {public: "./node_modules/blueprint-ui/build"});
});

server.listen(3000, () => {
    console.log('Running at http://localhost:3000');
});

const express = require('express');
const app = express();
const port = 3000;


app.get("*", (req, res) => {
    console.log("HERE");
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
