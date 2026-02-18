'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/utils/axiosInstance";
import { Package, Loader2, Search } from "lucide-react";
import Image from "next/image";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const types = ['acrylic', 'canvas', 'backlight'];
                const promises = types.map(async (type) => {
                    const res = await axiosInstance.get(`frames/${type}`);
                    return res.data.map(item => ({ ...item, type }));
                });

                const results = await Promise.all(promises);
                const merged = results.flat();
                setProducts(merged);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setProducts([]);
                setLoading(false);
            }
        };

        fetchAllProducts();
    }, []);

    const filteredProducts = products.filter((product) =>
        product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.type?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-neutral-50 pt-[120px] pb-8 px-4 min-h-screen font-[Poppins]">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-4 bg-primary rounded-2xl shadow-lg text-white">
                            <Package className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-secondary">
                                Our Collection
                            </h1>
                            <p className="text-neutral-600 mt-2 text-lg">
                                Premium customizable frames for your precious memories
                            </p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-8 max-w-xl">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name or category (e.g. Acrylic)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-neutral-200 rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-secondary shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center h-96 gap-4">
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                        <p className="text-neutral-500 font-medium">Loading our collection...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-xl border border-neutral-100 overflow-hidden">
                        <div className="text-center py-24 px-6">
                            <Package className="w-20 h-20 text-neutral-300 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-secondary mb-3">
                                {searchQuery ? "No matches found" : "Collection empty"}
                            </h3>
                            <p className="text-neutral-500 max-w-md mx-auto">
                                {searchQuery
                                    ? "We couldn't find anything matching your search. Try different keywords or browse by category."
                                    : "Our premium collection is currently being updated. Check back soon!"}
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mb-8 flex items-center justify-between text-neutral-600">
                            <p className="font-medium">
                                Showing {filteredProducts.length} premium product
                                {filteredProducts.length !== 1 ? "s" : ""}
                            </p>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredProducts.map((product, index) => {
                                const firstSize =
                                    product.sizes && product.sizes.length > 0
                                        ? product.sizes[0]
                                        : null;

                                return (
                                    <Link
                                        key={product.id || index}
                                        href={`/shop/${product.type}/${product.shape.toLowerCase()}`}
                                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group flex flex-col h-full border border-neutral-100"
                                    >
                                        {/* Product Image */}
                                        <div className="relative aspect-square overflow-hidden bg-neutral-100">
                                            <img
                                                src={product.image || "https://via.placeholder.com/400?text=No+Image"}
                                                alt={product.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                                <span className="bg-white/90 backdrop-blur-md text-secondary text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider">
                                                    {product.type}
                                                </span>
                                                {product.shape && (
                                                    <span className="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider">
                                                        {product.shape}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-5 flex flex-col flex-1">
                                            <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors min-h-[3.5rem] line-clamp-2">
                                                {product.title}
                                            </h3>

                                            {/* Price */}
                                            <div className="flex items-center gap-2 mb-6">
                                                {firstSize ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-neutral-400 text-xs font-medium">Starting from</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-2xl font-bold text-primary">
                                                                ₹{firstSize.price}
                                                            </span>
                                                            {firstSize.original && firstSize.original > firstSize.price && (
                                                                <span className="text-neutral-400 line-through text-sm">
                                                                    ₹{firstSize.original}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-neutral-400 text-sm italic">
                                                        View for pricing
                                                    </span>
                                                )}
                                            </div>

                                            {/* Action Button */}
                                            <div className="mt-auto">
                                                <div className="w-full py-3 px-4 bg-neutral-50 text-secondary rounded-xl font-bold group-hover:bg-primary group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2 border border-neutral-100 group-hover:border-primary">
                                                    Customize Now
                                                    <Package className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Products;
