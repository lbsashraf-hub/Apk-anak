let devices = {};

export default function handler(req, res) {
    // Izinkan akses lintas domain (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        const { device_id, lat, lng, battery } = req.body || {};
        
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

    // Jika diakses via GET (untuk mengecek data dari admin/browser)
    return res.status(200).json({ status: 'active', devices });
}
