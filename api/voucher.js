export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { amt = 1, pfx = 'VC', qty = 1 } = req.query;

    try {
        const formData = new URLSearchParams({
            amt, pfx, qty, sales: 0, print: 0
        });

        const response = await fetch('http://10.0.0.254/admin/api/generateVouchers', {
            method: 'POST',
            headers: {
                'X-TOKEN': '12345',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });

        const data = await response.json();
        
        return res.status(200).json({
            success: true,
            data: data
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            note: 'Cannot reach MikroTik at 10.0.0.254'
        });
    }
}
