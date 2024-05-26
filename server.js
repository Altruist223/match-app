const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let connectedDevices = {};

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('register', (pin) => {
        connectedDevices[pin] = socket.id;
        socket.join(pin);
        console.log(`Device registered with PIN: ${pin}`);
    });

    socket.on('sendMissYou', (pin) => {
        if (connectedDevices[pin]) {
            io.to(pin).emit('missYou');
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        for (let pin in connectedDevices) {
            if (connectedDevices[pin] === socket.id) {
                delete connectedDevices[pin];
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
