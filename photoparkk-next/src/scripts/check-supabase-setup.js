const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key is missing in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProjectSetup() {
    console.log('--- Checking Supabase Project Setup ---');

    // 1. Check Buckets
    console.log('\n[1] Checking Storage Buckets...');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
        console.error('Error listing buckets:', bucketError.message);
    } else if (buckets && buckets.length > 0) {
        console.log('Found buckets:');
        buckets.forEach(b => console.log(`- ${b.name} (Public: ${b.public})`));
    } else {
        console.log('❌ No storage buckets found.');
    }

    // 2. Check Tables
    console.log('\n[2] Checking Tables (via simple selects)...');
    const tables = ['users', 'new_arrivals', 'special_offers', 'cart_items', 'orders'];

    for (const table of tables) {
        const { error } = await supabase.from(table).select('*', { count: 'exact', head: true }).limit(1);
        if (error) {
            console.log(`❌ Table '${table}': ${error.message}`);
        } else {
            console.log(`✅ Table '${table}': Exists and accessible`);
        }
    }

    // 3. Try creating bucket (likely to fail but good to know)
    if (!buckets || !buckets.find(b => b.name === 'photos')) {
        console.log('\n[3] Attempting to create "photos" bucket...');
        const { data: newBucket, error: createError } = await supabase.storage.createBucket('photos', {
            public: true,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
            fileSizeLimit: 5242880 // 5MB
        });

        if (createError) {
            console.log(`❌ Failed to create bucket automatically: ${createError.message}`);
            console.log('   (Note: This usually requires a Service Role Key or Dashbaord intervention)');
        } else {
            console.log('✅ Successfully created "photos" bucket!');
        }
    }
}

checkProjectSetup();
