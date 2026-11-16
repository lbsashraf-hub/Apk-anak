let devices = {};

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { device_id, lat, lng, battery, cmd } = req.query;
    const targetDevice = device_id || 'hp-anak-01';

    // Jika admin mengirim perintah (misal: cmd=lock atau ring)
    if (cmd) {
        if (!devices[targetDevice]) devices[targetDevice] = {};
        devices[targetDevice].command = cmd;
        return res.status(200).json({ success: true, command: cmd });
    }

    // Jika HP anak mengirim laporan GPS & Baterai
    if (lat && lng) {
        if (!devices[targetDevice]) devices[targetDevice] = { command: 'normal' };
        devices[targetDevice].lat = parseFloat(lat);
        devices[targetDevice].lng = parseFloat(lng);
        devices[targetDevice].battery = battery || '100';
        devices[targetDevice].lastSeen = Date.now();

        return res.status(200).json({ 
            success: true, 
            command: devices[targetDevice].command || 'normal' 
        });
    }

    // Default GET untuk Dashboard Admin (melihat status semua perangkat)
    return res.status(200).json({ success: true, devices });
}
