"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import GenericSizeSelector from '@/Components/Shop/GenericSizeSelector';

export default function BacklightSizePage() {
    const params = useParams();
    const shape = params.shape || 'portrait';

    return <GenericSizeSelector type="backlight" shape={shape} />;
}
