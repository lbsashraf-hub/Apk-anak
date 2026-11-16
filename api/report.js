const express = require('express');
const app = express();

app.use(express.json());

let devices = {};

app.post('/api/report', (req, res) => {
    const { device_id, lat, lng, battery } = req.body;
    if (device_id) {
        if (!devices[device_id]) {
            devices[device_id] = { command: 'normal' };
        }
        devices[device_id].lat = lat;
        devices[device_id].lng = lng;
        devices[device_id].battery = battery;
        devices[device_id].last_update = new Date();
    }
    res.json({ status: 'success', command: devices[device_id]?.command || 'normal' });
});

module.exports = app;
