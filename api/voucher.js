export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-TOKEN');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Get parameters
    const { amt = 1, pfx = 'VC', qty = 1, sales = 0, print = 0 } = req.query;

    try {
        // Build form data
        const formData = new URLSearchParams({ amt, pfx, qty, sales, print });

        // Call MikroTik API
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
            hint: 'Check if MikroTik (10.0.0.254) is accessible from Vercel'
        });
    }
}
