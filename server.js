const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'dist')));
http.listen(port, function () {
    console.log(`server on! http://localhost:${port}`)
});

io.on('connection', function (socket) {
    console.log('user connected: ', socket.id);
    socket.on('disconnect', function () {
        console.log('user disconnected: ', socket.id);
    });
    socket.on('send message', function (name, text) {
        var msg = name + ' : ' + text;
        console.log(msg);
        io.emit('receive message', msg);
    });
});