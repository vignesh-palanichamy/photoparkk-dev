'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Import images
import AcrylicImage from '@/assets/CustomizePage/AcrylicBanner.jpg'; // Verify path
import CanvasImage from '@/assets/CustomizePage/CanvasWallBanner.webp'; // Verify path
import BacklightImage from '@/assets/frontend_assets/BacklightPhotoFrames/BacklightBanner.jpeg'; // Verify path

const CategoryShowcase = ({
    type,
    variant,
    title,
    description,
    badgeColor,
    accentColor,
}) => {
    // Map type to image and link
    const contentMap = {
        acrylic: {
            image: AcrylicImage,
            link: '/frames/acrylic', // Adjust route specific to your app structure
            badge: 'Best Seller',
        },
        canvas: {
            image: CanvasImage,
            link: '/frames/canvas',
            badge: 'Trending',
        },
        backlight: {
            image: BacklightImage,
            link: '/frames/backlight',
            badge: 'New Arrival',
        },
    };

    const currentContent = contentMap[type] || contentMap.acrylic;
    const isReversed = type === 'canvas'; // Alternate layout for visual interest

    return (
        <section className="py-16 md:py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 md:gap-16`}>

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex-1 space-y-6 text-center md:text-left"
                    >
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white ${badgeColor}`}>
                            {currentContent.badge}
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                            {title}
                        </h2>

                        <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto md:mx-0">
                            {description}
                        </p>

                        <div className="pt-4 flex justify-center md:justify-start">
                            <Link href={currentContent.link} className={`group inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gray-900 text-white font-semibold transition-all hover:bg-gray-800 hover:shadow-lg hover:-translate-y-1`}>
                                Shop Now
                                <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${accentColor}`} />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Image Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 w-full"
                    >
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl group">
                            <Image
                                src={currentContent.image}
                                alt={title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                priority={type === 'acrylic'}
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default CategoryShowcase;
