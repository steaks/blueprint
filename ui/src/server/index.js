#! /usr/bin/env node
const cors = require('cors');

const express = require('express');
const app = express();
const port = 3001;

app.use(cors());

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, async () => {
    console.log(`Example app listening on port ${port}`)
});
