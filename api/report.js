let devices = {};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        let body = req.body;
        
        // Pastikan body ter-parse jika dikirim sebagai string
        if (typeof body === 'string') {
            try {
                body = JSON.parse(body);
            } catch (e) {
                body = {};
            }
        }

        const { device_id, lat, lng, battery } = body || {};
        
        if (device_id) {
            if (!devices[device_id]) {
                devices[device_id] = { command: 'normal' };
            }
            devices[device_id].lat = lat;
            devices[device_id].lng = lng;
            devices[device_id].battery = battery;
            devices[device_id].last_update = new Date();
        }
        
        return res.status(200).json({ 
            status: 'success', 
            command: devices[device_id]?.command || 'normal' 
        });
    }

    return res.status(200).json({ status: 'active', devices });
}
