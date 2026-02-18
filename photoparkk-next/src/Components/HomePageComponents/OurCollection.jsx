'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Frame, Image as ImageIcon, Lightbulb } from 'lucide-react';

const collections = [
    {
        id: 'acrylic',
        title: 'Acrylic Frames',
        icon: <Frame className="w-8 h-8" />,
        description: 'Modern, sleek, and high-definition clarity.',
        link: '/frames/acrylic',
        color: 'bg-blue-50 text-blue-600',
    },
    {
        id: 'canvas',
        title: 'Canvas Prints',
        icon: <ImageIcon className="w-8 h-8" />,
        description: 'Classic texture for an artistic touch.',
        link: '/frames/canvas',
        color: 'bg-orange-50 text-orange-600',
    },
    {
        id: 'backlight',
        title: 'Backlit Frames',
        icon: <Lightbulb className="w-8 h-8" />,
        description: 'Illuminated memories that glow.',
        link: '/frames/backlight',
        color: 'bg-purple-50 text-purple-600',
    },
];

const OurCollection = () => {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Collection</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        choose from our premium range of custom frames designed to elevate your space.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {collections.map((item, index) => (
                        <Link href={item.link} key={item.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all border border-gray-100 h-full flex flex-col items-center text-center group cursor-pointer"
                            >
                                <div className={`p-4 rounded-full mb-6 ${item.color} group-hover:scale-110 transition-transform`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-500 mb-6">{item.description}</p>
                                <span className="text-sm font-semibold text-gray-900 group-hover:underline decoration-2 underline-offset-4">
                                    View Collection
                                </span>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OurCollection;
