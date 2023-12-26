require('./main.css')

import { io } from 'socket.io-client';

const socket = io();

const Client = {};

socket.on('connected', function (PlayerId) {
    Client.Id = PlayerId;
    console.log(Client.Id);
});
