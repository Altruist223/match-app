const { serverless } = require('netlify-serverless-http');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

let connectedDevices = {};

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

exports.handler = serverless(app);
