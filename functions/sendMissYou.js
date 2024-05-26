const { serverless } = require('netlify-serverless-http');
const express = require('express');
const app = express();

let connectedDevices = {};

app.use(express.json());

app.post('/sendMissYou', (req, res) => {
    const { pin } = req.body;
    if (connectedDevices[pin]) {
        io.to(pin).emit('missYou');
        res.status(200).send({ message: 'Miss You signal sent' });
    } else {
        res.status(404).send({ message: 'Device not found' });
    }
});

exports.handler = serverless(app);
