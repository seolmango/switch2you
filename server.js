const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, "src")));

const port = process.env.PORT || 3000;
http.listen(port, function () {
    console.log(`server on!: http://localhost:${port}`);
});