'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        question: "What is the difference between Acrylic and Glass/Canvas?",
        answer: "Acrylic is lighter, shatter-resistant, and offers superior optical clarity compared to standard glass. It enhances colors and gives a modern, frameless 3D floating effect that canvas or traditional glass frames cannot match."
    },
    {
        question: "Do you offer custom sizes?",
        answer: "Yes! We offer a wide range of standard sizes, but our customization tool allows you to select specific shapes like Hexagon, Round, Square, and more to fit your unique space perfectly."
    },
    {
        question: "How long does shipping take?",
        answer: "Typically, orders are processed and crafted within 2-3 business days. Shipping usually takes an additional 3-5 business days depending on your location within India."
    },
    {
        question: "Is mounting hardware included?",
        answer: "Absolutely. All our frames come with premium mounting hardware included, making it easy to hang your masterpiece right out of the box."
    },
    {
        question: "What if my frame arrives damaged?",
        answer: "We package our frames with extreme care. However, if damage occurs during transit, simply contact our support team within 24 hours of delivery with photos, and we will arrange a replacement free of charge."
    }
];

const Faq = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                    <p className="text-gray-600">Got questions? We've got answers.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                                className="flex items-center justify-between w-full p-6 text-left"
                            >
                                <span className="font-semibold text-lg text-gray-900">{faq.question}</span>
                                <div className={`p-2 rounded-full transition-colors ${openIndex === index ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                    {openIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                </div>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 pb-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-50 mt-2">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Faq;
