const axios = require('axios');

async function testApi() {
    try {
        const types = ['acrylic', 'canvas', 'backlight'];
        for (const type of types) {
            console.log(`Testing: /api/frames/${type}`);
            const res = await axios.get(`http://localhost:3000/api/frames/${type}`);
            console.log(`Status: ${res.status}`);
            console.log(`Count: ${Array.isArray(res.data) ? res.data.length : 'NOT AN ARRAY'}`);
            if (Array.isArray(res.data) && res.data.length > 0) {
                console.log(`First Item:`, res.data[0].title);
            }
            console.log('---');
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

testApi();
