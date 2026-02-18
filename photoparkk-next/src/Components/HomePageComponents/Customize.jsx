'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Wand2, Upload, CheckCircle } from 'lucide-react';

// Using a placeholder image if specific customize image isn't perfect, but portrait seems relevant
import CustomizeImage from '@/assets/CustomizePage/Portrait.jpg';

const steps = [
    {
        icon: <Upload className="w-6 h-6" />,
        title: 'Upload Photo',
        desc: 'Choose your best memory.'
    },
    {
        icon: <Wand2 className="w-6 h-6" />,
        title: 'Customize',
        desc: 'Select size, frame & shape.'
    },
    {
        icon: <CheckCircle className="w-6 h-6" />,
        title: 'Order',
        desc: 'We deliver to your door.'
    }
];

const Customize = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <div className="grid md:grid-cols-2 items-center">

                        {/* Content Side */}
                        <div className="p-8 md:p-16 lg:p-20 text-white space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="text-blue-400 font-bold tracking-wider uppercase text-sm mb-2 block">
                                    Custom Made
                                </span>
                                <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                                    Create Your Own Masterpiece
                                </h2>
                                <p className="text-gray-300 text-lg mb-8">
                                    Turn your digital photos into stunning physical art. Our easy-to-use customization tool lets you preview your frame in real-time.
                                </p>

                                {/* Steps Mini Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                                    {steps.map((step, idx) => (
                                        <div key={idx} className="flex flex-col items-start">
                                            <div className="bg-white/10 p-3 rounded-lg mb-3 text-blue-400">
                                                {step.icon}
                                            </div>
                                            <h4 className="font-bold text-white">{step.title}</h4>
                                            <p className="text-sm text-gray-400">{step.desc}</p>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href="/customize"
                                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full transition-all hover:shadow-lg hover:shadow-blue-900/50 hover:-translate-y-1"
                                >
                                    Start Customizing Now
                                </Link>
                            </motion.div>
                        </div>

                        {/* Image Side */}
                        <div className="relative h-96 md:h-full min-h-[500px]">
                            <Image
                                src={CustomizeImage}
                                alt="Customizing a frame"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-transparent to-transparent md:bg-gradient-to-t" />
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Customize;
