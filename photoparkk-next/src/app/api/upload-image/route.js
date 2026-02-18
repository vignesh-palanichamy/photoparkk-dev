
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('image');

        if (!file) {
            console.error("No image file in formData");
            return NextResponse.json({ message: "No image file provided" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();

        // Generate a unique file name
        const fileExt = file.name ? file.name.split('.').pop() : 'jpg';
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('photos')
            .upload(filePath, arrayBuffer, {
                contentType: file.type,
                upsert: false
            });

        if (error) {
            console.error("Supabase Storage Error Details:", JSON.stringify(error, null, 2));

            if (error.message?.includes('bucket not found')) {
                return NextResponse.json({
                    message: "Supabase storage bucket 'photos' not found. Please create it in your dashboard."
                }, { status: 500 });
            }
            return NextResponse.json({ message: error.message || "Storage upload failed" }, { status: 500 });
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('photos')
            .getPublicUrl(filePath);

        return NextResponse.json({ imageUrl: publicUrl });

    } catch (error) {
        console.error("Upload Error (Catch Block):", error);
        return NextResponse.json({ message: `Image upload failed: ${error.message}` }, { status: 500 });
    }
}
