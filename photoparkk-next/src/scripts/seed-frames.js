const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const PRODUCT_CONFIGS = {
    acrylic: [
        {
            shape: "Portrait",
            title: "Portrait Acrylic Frame",
            content: "Premium Portrait Acrylic Frame with stunning clarity.",
            image: "/assets/frontend_assets/About/machine2.jpg",
            thickness: ["3mm", "5mm", "8mm"],
            sizes: [
                { label: "8x10", price: 499, original: 699, width: 8, height: 10 },
                { label: "12x16", price: 699, original: 899, width: 12, height: 16 },
                { label: "16x20", price: 899, original: 1199, width: 16, height: 20 },
                { label: "20x30", price: 1999, original: 2499, width: 20, height: 30 },
            ]
        },
        {
            shape: "Landscape",
            title: "Landscape Acrylic Frame",
            content: "Premium Landscape Acrylic Frame for your wide memories.",
            image: "/assets/frontend_assets/About/machine2.jpg",
            thickness: ["3mm", "5mm", "8mm"],
            sizes: [
                { label: "10x8", price: 499, original: 699, width: 10, height: 8 },
                { label: "16x12", price: 699, original: 899, width: 16, height: 12 },
                { label: "20x16", price: 899, original: 1199, width: 20, height: 16 },
                { label: "30x20", price: 1999, original: 2499, width: 30, height: 20 },
            ]
        },
        {
            shape: "Square",
            title: "Square Acrylic Frame",
            content: "Symmetric Square Acrylic Frame.",
            image: "/assets/frontend_assets/About/machine2.jpg",
            thickness: ["3mm", "5mm", "8mm"],
            sizes: [
                { label: "8x8", price: 399, original: 599, width: 8, height: 8 },
                { label: "12x12", price: 699, original: 899, width: 12, height: 12 },
                { label: "16x16", price: 999, original: 1299, width: 16, height: 16 },
                { label: "24x24", price: 1999, original: 2499, width: 24, height: 24 },
            ]
        },
        {
            shape: "Round",
            title: "Round Acrylic Frame",
            content: "Elegant Round Acrylic Frame.",
            image: "/assets/frontend_assets/About/machine2.jpg",
            thickness: ["3mm", "5mm", "8mm"],
            sizes: [
                { label: "8x8", price: 449, original: 649, width: 8, height: 8 },
                { label: "12x12", price: 749, original: 949, width: 12, height: 12 },
                { label: "16x16", price: 1099, original: 1399, width: 16, height: 16 },
                { label: "24x24", price: 2199, original: 2699, width: 24, height: 24 },
            ]
        },
        {
            shape: "Hexagon",
            title: "Hexagon Acrylic Frame",
            content: "Unique Hexagon Acrylic Frame.",
            image: "/assets/frontend_assets/About/machine2.jpg",
            thickness: ["3mm", "5mm", "8mm"],
            sizes: [
                { label: "8x8", price: 449, original: 649, width: 8, height: 8 },
                { label: "12x12", price: 749, original: 949, width: 12, height: 12 },
                { label: "16x16", price: 1099, original: 1399, width: 16, height: 16 },
            ]
        },
        {
            shape: "Love",
            title: "Love/Heart Acrylic Frame",
            content: "Heart Shaped Acrylic Frame for your loved ones.",
            image: "/assets/frontend_assets/About/machine2.jpg",
            thickness: ["3mm", "5mm", "8mm"],
            sizes: [
                { label: "8x8", price: 499, original: 699, width: 8, height: 8 },
                { label: "12x12", price: 799, original: 999, width: 12, height: 12 },
                { label: "16x16", price: 1199, original: 1499, width: 16, height: 16 },
            ]
        }
    ],
    canvas: [
        {
            shape: "Portrait",
            title: "Portrait Canvas Frame",
            content: "Classic Portrait Canvas Print.",
            image: "/assets/frontend_assets/About/machine4.jpg",
            thickness: "Wooden Stretch",
            sizes: [
                { label: "8x10", price: 399, original: 599, width: 8, height: 10 },
                { label: "12x16", price: 599, original: 799, width: 12, height: 16 },
                { label: "16x20", price: 799, original: 1099, width: 16, height: 20 },
            ]
        },
        {
            shape: "Landscape",
            title: "Landscape Canvas Frame",
            content: "Beautiful Landscape Canvas Print.",
            image: "/assets/frontend_assets/About/machine4.jpg",
            thickness: "Wooden Stretch",
            sizes: [
                { label: "10x8", price: 399, original: 599, width: 10, height: 8 },
                { label: "16x12", price: 599, original: 799, width: 16, height: 12 },
                { label: "20x16", price: 799, original: 1099, width: 20, height: 16 },
            ]
        },
        {
            shape: "Square",
            title: "Square Canvas Frame",
            content: "Modern Square Canvas Print.",
            image: "/assets/frontend_assets/About/machine4.jpg",
            thickness: "Wooden Stretch",
            sizes: [
                { label: "8x8", price: 299, original: 499, width: 8, height: 8 },
                { label: "12x12", price: 549, original: 749, width: 12, height: 12 },
                { label: "16x16", price: 849, original: 1149, width: 16, height: 16 },
            ]
        }
    ],
    backlight: [
        {
            shape: "Portrait",
            title: "Portrait Backlight Frame",
            content: "Glowing Portrait Backlight Frame.",
            image: "/assets/frontend_assets/About/machine3.jpg",
            thickness: ["5mm", "8mm"],
            sizes: [
                { label: "8x10", price: 999, original: 1499, width: 8, height: 10 },
                { label: "12x16", price: 1499, original: 1999, width: 12, height: 16 },
                { label: "16x20", price: 1999, original: 2999, width: 16, height: 20 },
            ]
        },
        {
            shape: "Landscape",
            title: "Landscape Backlight Frame",
            content: "Glowing Landscape Backlight Frame.",
            image: "/assets/frontend_assets/About/machine3.jpg",
            thickness: ["5mm", "8mm"],
            sizes: [
                { label: "10x8", price: 999, original: 1499, width: 10, height: 8 },
                { label: "16x12", price: 1499, original: 1999, width: 16, height: 12 },
                { label: "20x16", price: 1999, original: 2999, width: 20, height: 16 },
            ]
        },
        {
            shape: "Square",
            title: "Square Backlight Frame",
            content: "Symmetric Square Backlight Frame.",
            image: "/assets/frontend_assets/About/machine3.jpg",
            thickness: ["5mm", "8mm"],
            sizes: [
                { label: "8x8", price: 899, original: 1399, width: 8, height: 8 },
                { label: "12x12", price: 1399, original: 1899, width: 12, height: 12 },
                { label: "16x16", price: 1899, original: 2799, width: 16, height: 16 },
            ]
        }
    ]
};

async function seedFrames() {
    console.log('🚀 Seeding Frame Products...');

    const tables = {
        acrylic: 'acrylic_customize',
        canvas: 'canvas_customize',
        backlight: 'backlight_customize'
    };

    for (const [key, products] of Object.entries(PRODUCT_CONFIGS)) {
        const tableName = tables[key];
        console.log(`\nCategory: ${key} (${tableName})`);

        for (const product of products) {
            // Check if exists
            const { data: existing } = await supabase
                .from(tableName)
                .select('id')
                .eq('shape', product.shape)
                .single();

            if (existing) {
                console.log(`- ${product.title} (${product.shape}) already exists. Updating...`);
                const { error } = await supabase
                    .from(tableName)
                    .update(product)
                    .eq('shape', product.shape);
                if (error) console.error(`  ❌ Update failed:`, error.message);
            } else {
                console.log(`- ${product.title} (${product.shape}) inserting...`);
                const { error } = await supabase
                    .from(tableName)
                    .insert([product]);
                if (error) console.error(`  ❌ Insert failed:`, error.message);
            }
        }
    }

    console.log('\n✨ Frame seeding complete!');
}

seedFrames().catch(console.error);
