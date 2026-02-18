const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    const tables = ['acrylic_customize', 'canvas_customize', 'backlight_customize'];

    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*');
        console.log(`Table: ${table}`);
        if (error) {
            console.error(`Error fetching ${table}:`, error.message);
        } else {
            console.log(`Count: ${data.length}`);
            if (data.length > 0) {
                console.log(`First Item Keys:`, Object.keys(data[0]));
                console.log(`First Item Data:`, JSON.stringify(data[0], null, 2));
            }
        }
        console.log('---');
    }
}

checkData();
