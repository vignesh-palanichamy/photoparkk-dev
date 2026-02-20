"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import GenericCustomize from '../../../../Components/Shop/GenericCustomize';

export default function CanvasCustomizePage() {
    const params = useParams();
    const shape = params.shape || 'portrait';

    return <GenericCustomize type="canvas" shape={shape} />;
}
