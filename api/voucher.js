export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const { amt = 1, pfx = 'VC', qty = 1 } = req.query;

    try {
        const response = await fetch('http://10.0.0.254/admin/api/generateVouchers', {
            method: 'POST',
            headers: {
                'X-TOKEN': '12345',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ amt, pfx, qty, sales: 0, print: 0 })
        });

        const data = await response.json();
        return res.json({ success: true, data });
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}
