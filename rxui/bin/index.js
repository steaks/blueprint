#! /usr/bin/env node

const express = require('express');
const path = require('path');
const app = express();
const port = 3001;

const blueprintPath = process.argv[2] || ".blueprint";

const root = process.cwd();
const sheetsDirectory = path.join(root, blueprintPath, "/build");
const staticDirectory = path.join(root, "node_modules/@blueprint/rxui/build/static");
const indexPath = path.join(root, "node_modules/@blueprint/rxui/build/index.html");

app.use("/static", express.static(staticDirectory));
app.use("/sheets", express.static(sheetsDirectory));

app.get("*", (req, res) => {
    res.sendFile(indexPath);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
