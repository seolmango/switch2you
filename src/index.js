require('./main.css')


const Client = {};

socket.on('connected', function (PlayerId) {
    Client.Id = PlayerId;
    console.log(Client.Id);
});