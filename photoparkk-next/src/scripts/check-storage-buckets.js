const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key is missing in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBuckets() {
    console.log('Checking Supabase Storage Buckets...');
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
        console.error('Error listing buckets:', error.message);
        return;
    }

    if (data && data.length > 0) {
        console.log('Found buckets:');
        data.forEach(bucket => {
            console.log(`- ${bucket.name} (Public: ${bucket.public})`);
        });
    } else {
        console.log('No buckets found in this Supabase project.');
    }
}

checkBuckets();
