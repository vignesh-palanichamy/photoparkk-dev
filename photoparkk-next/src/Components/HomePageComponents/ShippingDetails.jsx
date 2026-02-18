'use client';

import React from 'react';
import { Truck, ShieldCheck, RefreshCcw, CreditCard } from 'lucide-react';
import Image from 'next/image';

// Import Payment Icons
// Assuming files exist as per previous `ls` command in `src/assets/ShippingDetails`:
// bank.png, bhimIcon.png, googlePay.png, mastercard.png, paytm.png, visa.png
// I need to import them correctly. 
// Note: If imports fail, I will use static array or just icons.

import BankIcon from '@/assets/ShippingDetails/bank.png';
import BhimIcon from '@/assets/ShippingDetails/bhimIcon.png';
import GPayIcon from '@/assets/ShippingDetails/googlePay.png';
import MasterCardIcon from '@/assets/ShippingDetails/mastercard.png';
import PaytmIcon from '@/assets/ShippingDetails/paytm.png';
import VisaIcon from '@/assets/ShippingDetails/visa.png';

const features = [
    {
        icon: <Truck className="w-10 h-10 text-blue-600" />,
        title: "Free Shipping",
        description: "On all orders above ₹999 across India."
    },
    {
        icon: <ShieldCheck className="w-10 h-10 text-blue-600" />,
        title: "Secure Packaging",
        description: "Damage-proof packaging for safe delivery."
    },
    {
        icon: <RefreshCcw className="w-10 h-10 text-blue-600" />,
        title: "Easy Returns",
        description: "Hassle-free replacements for damaged items."
    },
    {
        icon: <CreditCard className="w-10 h-10 text-blue-600" />,
        title: "Secure Payments",
        description: "100% secure payment gateway."
    }
];

const paymentMethods = [
    { name: 'Visa', src: VisaIcon },
    { name: 'Mastercard', src: MasterCardIcon },
    { name: 'Google Pay', src: GPayIcon },
    { name: 'PhonePe', src: BhimIcon }, // Using BHIM as generic UPI/PhonePe placeholder if needed
    { name: 'Paytm', src: PaytmIcon },
    { name: 'Bank Transfer', src: BankIcon },
];

const ShippingDetails = () => {
    return (
        <section className="py-16 border-t border-gray-100 bg-white">
            <div className="container mx-auto px-4 md:px-6">

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="mb-4 p-3 bg-blue-50 rounded-full">
                                {feature.icon}
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-500">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* Payment Methods */}
                <div className="border-t border-gray-100 pt-10">
                    <p className="text-center text-gray-400 text-sm font-semibold uppercase tracking-widest mb-6">
                        We Accept
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100">
                        {paymentMethods.map((method, idx) => (
                            <div key={idx} className="relative h-8 w-12 md:h-10 md:w-16">
                                <Image
                                    src={method.src}
                                    alt={method.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ShippingDetails;
