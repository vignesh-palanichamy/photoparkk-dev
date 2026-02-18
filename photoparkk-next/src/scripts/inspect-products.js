const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectProducts() {
    const categories = ['new_arrivals', 'special_offers', 'acrylic_customize', 'canvas_customize', 'backlight_customize'];

    for (const cat of categories) {
        console.log(`\n--- Category: ${cat} ---`);
        const { data, error } = await supabase.from(cat).select('*');
        if (error) {
            console.error(`Error fetching ${cat}:`, error.message);
        } else {
            console.log(`Count: ${data.length}`);
            data.forEach(p => {
                console.log(`- ID: ${p.id} | Title: ${p.title} | Shape: ${p.shape || 'N/A'}`);
            });
        }
    }
}

inspectProducts();
