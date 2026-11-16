const express = require('express');
const app = express();

app.use(express.json());

// Memory sementara untuk menyimpan data perangkat
let devices = {};

// Endpoint untuk laporan dari anak & terima perintah
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

// Endpoint untuk Orang Tua mengubah perintah (lock/ring/normal)
app.get('/api/control', (req, res) => {
    const { device_id, cmd } = req.query;
    if (devices[device_id] && cmd) {
        devices[device_id].command = cmd;
        return res.json({ status: 'ok', message: `Command ${cmd} sent` });
    }
    res.status(404).json({ error: 'Device not found' });
});

// Endpoint untuk melihat data di admin.html
app.get('/api/status', (req, res) => {
    res.json(devices);
});

module.exports = app;
