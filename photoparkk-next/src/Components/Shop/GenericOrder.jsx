
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaShoppingCart, FaPhoneAlt, FaTruck, FaLock, FaWhatsapp } from "react-icons/fa";
import { BsPatchCheckFill } from "react-icons/bs";
import {
    Sparkles,
    Package,
    Ruler,
    Box,
    CheckCircle2,
    Loader2,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

// Combined Configuration for all types and shapes
const PRODUCT_CONFIGS = {}; // Now fetched from API

const COMMON_HIGHLIGHTS = [
    "High-Quality Finish & Durable Material",
    "Perfect for Home Decor & Gifting",
    "Customizable with Your Photo",
    "Secure Packaging for Safe Delivery",
    "Eco-Friendly Printing Process",
    "Crafted with Precision & Love",
    "Easy to Hang or Display",
    "Multiple Sizes & Thickness Options",
    "Premium quality materials",
    "Edge-to-edge printing",
];

const GenericOrder = ({ type, shape }) => {
    const router = useRouter();
    const [photoData, setPhotoData] = useState(null);
    const [productConfig, setProductConfig] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedThickness, setSelectedThickness] = useState("3mm");
    const [quantity, setQuantity] = useState(1);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const init = async () => {
            if (typeof window !== "undefined") {
                const storedData = sessionStorage.getItem(`${type}_custom_data`);
                if (storedData) {
                    const parsed = JSON.parse(storedData);
                    setPhotoData(parsed.photoData);
                } else {
                    toast.error("No customization data found. Please upload an image first.");
                    router.push(`/shop/${type}/${shape}`);
                    return;
                }

                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    try {
                        const parsedUser = JSON.parse(storedUser);
                        setUserId(parsedUser._id || parsedUser.id);
                    } catch (err) {
                        console.error("Failed to parse user:", err);
                    }
                }
            }

            // Fetch product detail from API
            try {
                const res = await axiosInstance.get(`frames/${type}?shape=${shape}`);
                if (res.data && res.data.length > 0) {
                    const product = res.data[0];
                    setProductConfig(product);
                    if (product.sizes && product.sizes.length > 0) {
                        setSelectedSize(product.sizes[0]);
                    }
                    if (product.thickness && Array.isArray(product.thickness) && product.thickness.length > 0) {
                        setSelectedThickness(product.thickness[0]);
                    } else if (typeof product.thickness === 'string') {
                        setSelectedThickness(product.thickness);
                    }
                } else {
                    toast.error("Product configuration not found.");
                }
            } catch (err) {
                console.error("Failed to fetch product config:", err);
                toast.error("Failed to load product details.");
            }
        };

        init();
    }, [type, shape, router]);

    const handleAddToCart = async () => {
        if (!selectedSize || quantity < 1) {
            toast.error("Please complete all selections.");
            return;
        }

        if (!userId) {
            toast.error("Please log in to add items to cart.");
            router.push("/login");
            return;
        }

        setLoading(true);
        try {
            const cartData = {
                userId,
                productType: `${type.charAt(0).toUpperCase() + type.slice(1)}Customizedata`,
                title: productConfig?.title || `${typeTitle} Frame`,
                image: photoData?.url,
                size: selectedSize.label,
                thickness: type === 'acrylic' ? selectedThickness : undefined,
                price: selectedSize.price,
                quantity,
                totalAmount: selectedSize.price * quantity,
                uploadedImageUrl: photoData?.url,
            };

            await axiosInstance.post("/cart", cartData);
            toast.success("Item added to cart successfully!");
            router.push("/cart");
        } catch (error) {
            console.error("Add to cart failed", error);
            toast.error("Failed to add to cart.");
        } finally {
            setLoading(false);
        }
    };

    if (!photoData || !productConfig) return <div className="min-h-screen flex text-center items-center justify-center"><Loader2 className="animate-spin" /> Loading...</div>;

    const borderWidth = type === 'acrylic' ? (selectedThickness === '8mm' ? "16px" : selectedThickness === '5mm' ? "12px" : "8px") : "8px";
    const aspectRatio = selectedSize ? (selectedSize.width / selectedSize.height) : 1;
    const typeTitle = type.charAt(0).toUpperCase() + type.slice(1);
    const shapeTitle = shape.charAt(0).toUpperCase() + shape.slice(1);

    const renderSimplePreview = () => {
        let containerClass = "relative w-full overflow-hidden shadow-2xl transition-all duration-500 bg-white";
        let style = {
            borderWidth: borderWidth,
            borderStyle: "solid",
            borderColor: type === 'backlight' ? "#facc15" : "#1f2937",
            padding: "4px",
        };

        const s = shape.toLowerCase();
        if (s === 'portrait' || s === 'landscape' || s === 'square') {
            style.aspectRatio = aspectRatio;
            containerClass += " rounded-2xl";
        } else if (s === 'round') {
            style.aspectRatio = "1/1";
            containerClass += " rounded-full";
        } else if (s === 'hexagon') {
            style.aspectRatio = "1/1";
            style.clipPath = "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)";
        } else if (s === 'love') {
            return (
                <div className="heart-frame-container scale-75">
                    <div className="heart-border"></div>
                    <div className="heart-frame">
                        <img src={photoData.url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                </div>
            )
        }

        if (type === 'backlight') {
            style.boxShadow = "0 0 30px rgba(255, 223, 0, 0.6)";
        }

        return (
            <div className={containerClass} style={style}>
                <img src={photoData.url} alt="Preview" className="w-full h-full object-cover rounded-lg" />
            </div>
        );
    }

    return (
        <div className="bg-neutral-50 pt-[120px] pb-8 px-4 font-[Poppins]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-full mb-4">
                        <Sparkles className="w-5 h-5" />
                        <span className="font-semibold">{typeTitle} {shapeTitle} Frame</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-3">
                        Complete Your Order
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Live Frame Preview */}
                    <div className="order-2 lg:order-1">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-200 sticky top-24">
                            <div className="bg-primary px-6 py-4">
                                <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                                    <Package className="w-6 h-6" />
                                    Live Frame Preview
                                </h2>
                            </div>
                            <div className={`p-8 flex items-center justify-center min-h-[400px] ${type === 'backlight' ? 'bg-neutral-900' : ''}`}>
                                <div className="w-full max-w-md mx-auto relative flex justify-center">
                                    {renderSimplePreview()}

                                    {selectedSize && (
                                        <>
                                            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-neutral-700 bg-white px-2 py-1 rounded shadow-md border border-neutral-200 z-10">
                                                {selectedSize.height}"
                                            </div>
                                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-neutral-700 bg-white px-2 py-1 rounded shadow-md border border-neutral-200 z-10">
                                                {selectedSize.width}"
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customization */}
                    <div className="order-1 lg:order-2">
                        <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
                            <div className="bg-primary px-6 py-4">
                                <h2 className="text-xl font-bold text-white">
                                    {productConfig.title}
                                </h2>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Price */}
                                <div className="flex items-end gap-3">
                                    <div className="text-4xl font-bold text-primary">
                                        ₹{selectedSize?.price || 0}
                                    </div>
                                    {selectedSize?.original && (
                                        <div className="flex flex-col mb-1">
                                            <span className="text-lg text-neutral-400 line-through">
                                                ₹{selectedSize.original}
                                            </span>
                                            <span className="text-xs font-bold text-success">
                                                Save ₹{selectedSize.original - selectedSize.price}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Size Selector */}
                                <div>
                                    <label className="block text-lg font-semibold text-secondary mb-3 flex items-center gap-2">
                                        <Ruler className="w-5 h-5 text-primary" />
                                        Select Size
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {productConfig.sizes.map((sizeObj, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedSize(sizeObj)}
                                                className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${selectedSize?.label === sizeObj.label
                                                    ? "bg-primary text-white border-primary shadow-lg scale-105"
                                                    : "bg-white text-secondary border-neutral-300 hover:border-primary hover:shadow-md"
                                                    }`}
                                            >
                                                <div className="font-bold">{sizeObj.label}</div>
                                                <div className="text-xs mt-1 opacity-80">
                                                    ₹{sizeObj.price}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Thickness Selector */}
                                {productConfig.thickness && Array.isArray(productConfig.thickness) && productConfig.thickness.length > 0 && (
                                    <div>
                                        <label className="block text-lg font-semibold text-secondary mb-3 flex items-center gap-2">
                                            <Box className="w-5 h-5 text-primary" />
                                            Select Thickness
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {productConfig.thickness.map((thick, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setSelectedThickness(thick)}
                                                    className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${selectedThickness === thick
                                                        ? "bg-primary text-white border-primary shadow-lg scale-105"
                                                        : "bg-white text-secondary border-neutral-300 hover:border-primary hover:shadow-md"
                                                        }`}
                                                >
                                                    {thick}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Add to Cart Button */}
                                <div className="space-y-4 pt-4 border-t border-neutral-200">
                                    <div className="flex items-center gap-4">
                                        <label className="text-lg font-medium text-neutral-700">Quantity:</label>
                                        <div className="flex items-center border-2 border-neutral-200 rounded-lg overflow-hidden">
                                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 font-bold">-</button>
                                            <input type="number" min="1" value={quantity} readOnly className="w-16 px-2 py-2 text-center font-bold focus:outline-none" />
                                            <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 font-bold">+</button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={loading || !selectedSize}
                                        className="w-full bg-primary hover:bg-primary-hover text-white px-6 py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                <span>Adding to Cart...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaShoppingCart size={22} />
                                                <span>Add to Cart</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <div className="flex items-center gap-2 text-neutral-600 text-sm">
                                        <FaTruck className="text-primary" /> 4-7 Days Delivery
                                    </div>
                                    <div className="flex items-center gap-2 text-neutral-600 text-sm">
                                        <FaLock className="text-primary" /> Secure Payment
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Highlights */}
                        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
                            <div className="bg-primary px-6 py-4">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <CheckCircle2 className="w-6 h-6" /> Product Highlights
                                </h3>
                            </div>
                            <div className="p-6">
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                                    {COMMON_HIGHLIGHTS.map((h, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                                            <BsPatchCheckFill className="text-primary mt-1 flex-shrink-0" /> {h}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Support section */}
                        <div className="mt-8 bg-success-light rounded-2xl p-6 border border-success/20">
                            <h3 className="text-xl font-bold text-success mb-2">Need Help?</h3>
                            <p className="text-neutral-700 mb-4">Questions about sizes or custom designs? Contact our team!</p>
                            <div className="flex flex-wrap gap-4">
                                <button className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg font-semibold hover:bg-success/90 transition-colors">
                                    <FaWhatsapp /> WhatsApp Us
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-white text-success border border-success rounded-lg font-semibold hover:bg-success-light transition-colors">
                                    <FaPhoneAlt /> Call Support
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenericOrder;
