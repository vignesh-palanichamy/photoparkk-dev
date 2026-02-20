"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Sparkles, CheckCircle2, Ruler, ShoppingCart, Loader2,
    Package, Truck, Lock, ArrowLeft, Eye, Star, Check,
    Shield, Layers, Scissors
} from "lucide-react";
import { toast } from "react-toastify";
import * as htmlToImage from 'html-to-image';
import axiosInstance from "@/utils/axiosInstance";

const SIZES = {
    portrait: [
        { label: "12×18 inches", price: 899, width: 12, height: 18 },
        { label: "16×24 inches", price: 1499, width: 16, height: 24 },
        { label: "20×30 inches", price: 2199, width: 20, height: 30 },
        { label: "24×36 inches", price: 2999, width: 24, height: 36 },
    ],
    landscape: [
        { label: "18×12 inches", price: 899, width: 18, height: 12 },
        { label: "24×16 inches", price: 1499, width: 24, height: 16 },
        { label: "30×20 inches", price: 2199, width: 30, height: 20 },
        { label: "36×24 inches", price: 2999, width: 36, height: 24 },
    ],
    square: [
        { label: "12×12 inches", price: 699, width: 12, height: 12 },
        { label: "16×16 inches", price: 1199, width: 16, height: 16 },
        { label: "24×24 inches", price: 1999, width: 24, height: 24 },
    ],
    default: [
        { label: "12×12 inches", price: 799, width: 12, height: 12 },
        { label: "16×16 inches", price: 1299, width: 16, height: 16 },
    ]
};

const THICKNESS_OPTIONS = [
    { label: "Standard", price: 0, value: "standard", desc: "0.75\" depth" },
    { label: "Gallery Wrap", price: 400, value: "gallery", desc: "1.5\" depth" },
];

const EDGE_OPTIONS = [
    { label: "Image Wrap", price: 0, value: "wrap", desc: "Image extends around edges" },
    { label: "Mirror Wrap", price: 200, value: "mirror", desc: "Edges mirror the image" },
    { label: "White Border", price: 0, value: "white", desc: "Clean white edges" },
];

export default function CanvasSizePage() {
    const params = useParams();
    const router = useRouter();
    const shape = params.shape || "portrait";
    const type = "canvas";
    const shapeTitle = shape.charAt(0).toUpperCase() + shape.slice(1);

    const [editorData, setEditorData] = useState(null);
    const [frameConfig, setFrameConfig] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedThickness, setSelectedThickness] = useState(THICKNESS_OPTIONS[0]);
    const [selectedEdge, setSelectedEdge] = useState(EDGE_OPTIONS[0]);
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);
    const previewRef = useRef(null);

    const shapeKey = ["portrait", "landscape", "square"].includes(shape) ? shape : "default";
    const availableSizes = frameConfig?.sizes || SIZES[shapeKey] || SIZES.default;

    // Fetch frame config
    useEffect(() => {
        (async () => {
            try {
                const res = await axiosInstance.get(`frames/${type}?shape=${shape}`);
                if (res.data?.length > 0) {
                    setFrameConfig(res.data[0]);
                }
            } catch (err) { console.error(err); }
        })();
    }, [type, shape]);

    // Load session data
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedData = sessionStorage.getItem(`${type}_custom_data`);
            if (storedData) {
                try {
                    const parsed = JSON.parse(storedData);
                    if (parsed.photoData) {
                        setEditorData(parsed);
                    } else {
                        router.push(`/shop/${type}/${shape}`);
                    }
                } catch (e) {
                    router.push(`/shop/${type}/${shape}`);
                }
            } else {
                router.push(`/shop/${type}/${shape}`);
            }
            try {
                const u = JSON.parse(localStorage.getItem("user"));
                if (u) setUserId(u.id || u._id);
            } catch (e) { }
        }
    }, [type, shape, router]);

    // Auto-select first size when available sizes change (from DB or fallback)
    useEffect(() => {
        if (availableSizes.length > 0 && !availableSizes.find(s => s.label === selectedSize?.label)) {
            setSelectedSize(availableSizes[0]);
        }
    }, [availableSizes]);

    // Calculate price
    useEffect(() => {
        if (!selectedSize) return;
        setTotalPrice((selectedSize.price + selectedThickness.price + selectedEdge.price) * quantity);
    }, [selectedSize, selectedThickness, selectedEdge, quantity]);

    // Crop image for preview
    const getCroppedImg = useCallback(async (src, pixelCrop, rot = 0) => {
        const image = new Image(); image.crossOrigin = "anonymous"; image.src = src;
        const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d');
        await new Promise((r) => { image.onload = r; });
        const max = Math.max(image.width, image.height);
        const safe = 2 * ((max / 2) * Math.sqrt(2));
        canvas.width = safe; canvas.height = safe;
        ctx.translate(safe / 2, safe / 2); ctx.rotate((rot * Math.PI) / 180);
        ctx.translate(-safe / 2, -safe / 2);
        ctx.drawImage(image, safe / 2 - image.width * 0.5, safe / 2 - image.height * 0.5);
        const data = ctx.getImageData(0, 0, safe, safe);
        canvas.width = pixelCrop.width; canvas.height = pixelCrop.height;
        ctx.putImageData(data, -safe / 2 + image.width * 0.5 - pixelCrop.x, -safe / 2 + image.height * 0.5 - pixelCrop.y);
        return new Promise((resolve) => { canvas.toBlob((b) => { if (b) resolve(URL.createObjectURL(b)); }, 'image/jpeg'); });
    }, []);

    useEffect(() => {
        if (editorData?.photoData?.url && editorData?.configuration?.crop?.croppedAreaPixels) {
            const { croppedAreaPixels, rotation } = editorData.configuration.crop;
            getCroppedImg(editorData.photoData.url, croppedAreaPixels, rotation).then(setCroppedImageUrl);
        }
    }, [editorData, getCroppedImg]);

    // Wall preview capture
    const generateWallPreview = async () => {
        if (!previewRef.current) return null;
        try {
            return await htmlToImage.toBlob(previewRef.current, {
                quality: 0.95, pixelRatio: 2, backgroundColor: '#f5f5f5',
                filter: (n) => !(n.hasAttribute && n.hasAttribute('data-html2canvas-ignore'))
            });
        } catch (e) { return null; }
    };

    // Add to cart
    const handleAddToCart = async () => {
        if (!selectedSize || !editorData) return;
        if (!userId) { toast.error("Please log in to add items to cart."); return; }
        setLoading(true);
        try {
            const { photoData } = editorData;
            if (!frameConfig?.id) { toast.error("Product configuration missing."); setLoading(false); return; }

            let blob = await generateWallPreview();
            if (!blob && croppedImageUrl) blob = await fetch(croppedImageUrl).then(r => r.blob());
            let finalUrl = photoData?.url;
            if (blob) {
                try {
                    const f = new File([blob], `canvas-${Date.now()}.png`, { type: blob.type });
                    const fd = new FormData(); fd.append("image", f);
                    const r = await axiosInstance.post("/upload-image", fd, { headers: { "Content-Type": "multipart/form-data" } });
                    if (r.data?.imageUrl) finalUrl = r.data.imageUrl;
                } catch (e) { }
            }
            await axiosInstance.post("/cart", {
                userId, productId: frameConfig.id, productType: 'Canvascustomizedata',
                title: `Canvas ${shapeTitle} Frame`, image: finalUrl, size: selectedSize.label,
                thickness: selectedThickness.value, edge: selectedEdge.value,
                frameType: 'none', frameColor: null,
                price: totalPrice / quantity, quantity, totalAmount: totalPrice,
                uploadedImageUrl: photoData?.url,
                customizationDetails: {
                    crop: editorData.configuration?.crop, thickness: selectedThickness,
                    edge: selectedEdge, originalName: photoData?.name
                }
            });
            toast.success("Added to Cart!"); router.push("/cart");
        } catch (e) { console.error(e); toast.error("Failed to add to cart."); }
        finally { setLoading(false); }
    };

    const getFrameStyle = () => {
        if (!selectedSize) return { width: '260px', aspectRatio: '3/4' };
        // Scale frame to fit nicely in the wall scene
        const maxW = 360;
        const maxH = 340;
        const aspect = selectedSize.width / selectedSize.height;
        let w, h;
        if (aspect >= 1) {
            w = maxW; h = maxW / aspect;
            if (h > maxH) { h = maxH; w = maxH * aspect; }
        } else {
            h = maxH; w = maxH * aspect;
            if (w > maxW) { w = maxW; h = maxW / aspect; }
        }
        return { width: `${w}px`, height: `${h}px` };
    };

    if (!editorData) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins, sans-serif' }}>
            <Loader2 className="animate-spin" size={24} style={{ marginRight: 8 }} /> Loading...
        </div>
    );

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

                .cs { font-family: 'Poppins', sans-serif; background: #f8f8f6; min-height: 100vh; padding-top: 100px; padding-bottom: 80px; }
                .cs-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

                /* Header */
                .cs-header { display: flex; align-items: center; gap: 14px; margin-bottom: 28px; }
                .cs-back {
                    width: 40px; height: 40px; border-radius: 12px; border: 1px solid #e5e5e5;
                    background: #fff; cursor: pointer; display: flex; align-items: center;
                    justify-content: center; color: #666; transition: all 0.2s;
                }
                .cs-back:hover { border-color: #0071e3; color: #0071e3; }
                .cs-step { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #0071e3; font-weight: 600; }
                .cs-title { font-size: 22px; font-weight: 700; color: #1d1d1f; letter-spacing: -0.5px; }

                /* Grid */
                .cs-grid { display: grid; grid-template-columns: 1fr 380px; gap: 36px; align-items: start; }
                @media (max-width: 960px) { .cs-grid { grid-template-columns: 1fr; } }

                /* ═══ LEFT: WALL PREVIEW ═══ */
                .cs-left { position: sticky; top: 110px; }
                .cs-wall {
                    border-radius: 20px; overflow: hidden;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
                    border: 1px solid #e8e8e8; background: #fff;
                }
                .cs-wall-scene {
                    position: relative; height: 520px; overflow: hidden;
                    background: #d5d5d0;
                    background-image:
                        radial-gradient(ellipse at 35% 25%, rgba(255,255,255,0.18) 0%, transparent 55%),
                        radial-gradient(ellipse at 80% 75%, rgba(0,0,0,0.05) 0%, transparent 45%);
                }
                /* Concrete / plaster texture */
                .cs-wall-scene::before {
                    content: ''; position: absolute; inset: 0; z-index: 1;
                    opacity: 0.6; pointer-events: none;
                    background-image:
                        repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.012) 1px, rgba(0,0,0,0.012) 2px),
                        repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.008) 2px, rgba(0,0,0,0.008) 3px);
                }
                /* Grain overlay */
                .cs-wall-scene::after {
                    content: ''; position: absolute; inset: 0; z-index: 2;
                    background:
                        radial-gradient(circle at 20% 80%, rgba(0,0,0,0.02) 0%, transparent 40%),
                        radial-gradient(circle at 70% 20%, rgba(255,255,255,0.04) 0%, transparent 35%),
                        radial-gradient(circle at 50% 50%, rgba(0,0,0,0.015) 0%, transparent 60%);
                    pointer-events: none;
                }

                /* Canvas frame on wall */
                .cs-frame-area {
                    position: absolute; top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    display: flex; align-items: center; justify-content: center; z-index: 5;
                }
                .cs-frame-wrap {
                    position: relative;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }
                /* 3D Canvas: front face */
                .cs-frame {
                    position: relative;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.15);
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .cs-frame img {
                    width: 100%; height: 100%; object-fit: cover; display: block;
                }
                /* Right side depth */
                .cs-depth-right {
                    position: absolute; top: 8px; right: -14px;
                    width: 14px; bottom: -8px;
                    background: linear-gradient(90deg, #3a3a3a 0%, #2a2a2a 40%, #1a1a1a 100%);
                    transform: skewY(-40deg);
                    transform-origin: top left;
                }
                .cs-depth-right::after {
                    content: ''; position: absolute; inset: 0;
                    background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 50%);
                }
                /* Bottom side depth */
                .cs-depth-bottom {
                    position: absolute; left: 8px; bottom: -14px;
                    height: 14px; right: -8px;
                    background: linear-gradient(180deg, #2c2c2c 0%, #1c1c1c 60%, #111 100%);
                    transform: skewX(-40deg);
                    transform-origin: top left;
                }
                .cs-depth-bottom::after {
                    content: ''; position: absolute; inset: 0;
                    background: linear-gradient(90deg, rgba(255,255,255,0.05) 0%, transparent 40%);
                }
                /* Frame shadow on wall */
                .cs-frame-shadow {
                    position: absolute; width: 90%; height: 30px;
                    bottom: -30px; left: 5%;
                    background: radial-gradient(ellipse, rgba(0,0,0,0.25) 0%, transparent 65%);
                    filter: blur(10px);
                }

                /* Dimension lines */
                .cs-dims {
                    position: absolute; top: 0; left: 0; width: 100%; pointer-events: none; z-index: 10;
                }
                .cs-dim-top {
                    position: absolute; top: -36px; left: 50%; transform: translateX(-50%);
                    display: flex; align-items: center; gap: 8px; white-space: nowrap;
                }
                .cs-dim-line {
                    width: 50px; height: 0; border-top: 1.5px dashed #444;
                }
                .cs-dim-label {
                    font-size: 14px; font-weight: 700; color: #333;
                    font-family: 'Poppins', sans-serif; letter-spacing: -0.3px;
                }

                /* Edit button */
                .cs-edit-btn {
                    position: absolute; top: -36px; right: 0; z-index: 15;
                    display: flex; align-items: center; gap: 5px;
                    padding: 6px 14px; background: #fff; border: 1px solid #ddd;
                    border-radius: 8px; font-size: 12px; font-weight: 600; color: #555;
                    cursor: pointer; transition: all 0.2s;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                }
                .cs-edit-btn:hover { border-color: #0071e3; color: #0071e3; }
                .cs-edit-btn svg { color: #0071e3; }

                /* Tags */
                .cs-tag {
                    position: absolute; z-index: 20;
                    background: rgba(255,255,255,0.88); backdrop-filter: blur(10px);
                    padding: 6px 14px; border-radius: 20px; font-size: 11px;
                    font-weight: 600; color: #555;
                    display: flex; align-items: center; gap: 6px;
                    border: 1px solid rgba(255,255,255,0.6);
                    box-shadow: 0 2px 10px rgba(0,0,0,0.06);
                }
                .cs-tag-tl { top: 14px; left: 14px; }
                .cs-tag-tr { top: 14px; right: 14px; background: rgba(0,113,227,0.1); color: #0071e3; border-color: rgba(0,113,227,0.15); }

                /* Wall footer */
                .cs-wall-foot {
                    padding: 12px 20px; border-top: 1px solid #f0f0f0;
                    display: flex; align-items: center; gap: 12px; background: #fff;
                }
                .cs-wall-foot-dim {
                    display: flex; align-items: center; gap: 6px;
                    font-size: 12px; font-weight: 600; color: #555;
                }
                .cs-wall-foot-dim svg { color: #0071e3; }
                .cs-wall-foot-depth {
                    font-size: 11px; color: #999; margin-left: auto;
                    display: flex; align-items: center; gap: 4px;
                }

                /* Trust row */
                .cs-trust { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 16px; }
                .cs-trust-item {
                    display: flex; flex-direction: column; align-items: center; gap: 6px;
                    padding: 14px 8px; background: #fff; border-radius: 12px;
                    border: 1px solid #ebebeb; text-align: center;
                }
                .cs-trust-item svg { color: #0071e3; }
                .cs-trust-item span { font-size: 10px; font-weight: 600; color: #555; line-height: 1.3; }

                /* ═══ RIGHT: OPTIONS ═══ */
                .cs-opts {
                    background: #fff; border-radius: 20px; overflow: hidden;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.04); border: 1px solid #e8e8e8;
                }
                .cs-opts-body { padding: 24px; }

                .cs-sec {
                    font-size: 12px; font-weight: 700; color: #1d1d1f;
                    margin-bottom: 10px; display: flex; align-items: center; gap: 8px;
                    text-transform: uppercase; letter-spacing: 0.3px;
                }
                .cs-sec svg { color: #0071e3; }

                /* Size Grid */
                .cs-sizes { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px; }
                .cs-size {
                    position: relative; padding: 14px 16px; border-radius: 12px;
                    border: 2px solid #f0f0f0; background: #fff; cursor: pointer;
                    text-align: left; transition: all 0.25s;
                }
                .cs-size:hover { border-color: #c0d8f5; }
                .cs-size.on { border-color: #0071e3; background: #f4f9ff; }
                .cs-size-name { font-size: 14px; font-weight: 700; color: #1d1d1f; }
                .cs-size-price { font-size: 12px; color: #0071e3; font-weight: 600; margin-top: 2px; }
                .cs-size-check { position: absolute; top: 10px; right: 10px; }

                /* Thickness */
                .cs-thick { display: flex; gap: 8px; margin-bottom: 20px; }
                .cs-thick-item {
                    flex: 1; padding: 14px; border-radius: 12px;
                    border: 2px solid #f0f0f0; cursor: pointer; text-align: center;
                    transition: all 0.25s; background: #fff;
                }
                .cs-thick-item:hover { border-color: #c0d8f5; }
                .cs-thick-item.on { border-color: #0071e3; background: #f4f9ff; }
                .cs-thick-name { font-size: 13px; font-weight: 600; color: #1d1d1f; }
                .cs-thick-desc { font-size: 10px; color: #999; margin-top: 2px; }
                .cs-thick-price { font-size: 11px; color: #0071e3; font-weight: 600; margin-top: 4px; }

                /* Edge */
                .cs-edges { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
                .cs-edge {
                    flex: 1; min-width: 90px; padding: 12px; border-radius: 10px;
                    border: 2px solid #f0f0f0; cursor: pointer; text-align: center;
                    transition: all 0.25s; background: #fff;
                }
                .cs-edge:hover { border-color: #c0d8f5; }
                .cs-edge.on { border-color: #0071e3; background: #f4f9ff; }
                .cs-edge-name { font-size: 12px; font-weight: 600; color: #1d1d1f; }
                .cs-edge-desc { font-size: 10px; color: #999; margin-top: 3px; }

                .cs-hr { height: 1px; background: #f0f0f0; margin: 16px 0; }

                /* Qty */
                .cs-qty-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
                .cs-qty-label { font-size: 13px; font-weight: 600; color: #555; }
                .cs-qty-box { display: flex; align-items: center; border: 1px solid #e5e5e5; border-radius: 10px; overflow: hidden; }
                .cs-qty-btn { width: 38px; height: 38px; border: none; background: #fafafa; cursor: pointer; font-size: 16px; font-weight: 600; color: #555; transition: background 0.2s; }
                .cs-qty-btn:hover { background: #f0f7ff; color: #0071e3; }
                .cs-qty-val { width: 40px; text-align: center; font-size: 14px; font-weight: 700; color: #1d1d1f; border-left: 1px solid #e5e5e5; border-right: 1px solid #e5e5e5; line-height: 38px; }

                /* Price */
                .cs-price-row { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 16px; }
                .cs-price-lbl { font-size: 13px; color: #888; }
                .cs-price-sub { font-size: 11px; color: #bbb; }
                .cs-price-big { font-size: 32px; font-weight: 800; color: #0071e3; letter-spacing: -1px; }

                /* CTA */
                .cs-cart-btn {
                    width: 100%; padding: 16px; background: #0071e3; color: #fff; border: none; border-radius: 12px;
                    font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.3s;
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    box-shadow: 0 6px 20px rgba(0,113,227,0.3);
                }
                .cs-cart-btn:hover { background: #005ec4; transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,113,227,0.4); }
                .cs-cart-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
                .cs-secure { text-align: center; font-size: 11px; color: #bbb; margin-top: 10px; display: flex; align-items: center; justify-content: center; gap: 6px; }

                /* Info */
                .cs-info { margin-top: 48px; padding-top: 40px; border-top: 1px solid #ebebeb; }
                .cs-info-h3 { font-size: 18px; font-weight: 700; color: #1d1d1f; margin-bottom: 20px; }
                .cs-info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
                @media (max-width: 768px) { .cs-info-grid { grid-template-columns: 1fr; } }
                .cs-info-card { padding: 24px; background: #fff; border-radius: 16px; border: 1px solid #ebebeb; }
                .cs-info-ic { width: 40px; height: 40px; border-radius: 10px; background: #f0f7ff; border: 1px solid #d0e5ff; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
                .cs-info-card h4 { font-size: 14px; font-weight: 700; color: #1d1d1f; margin-bottom: 6px; }
                .cs-info-card p { font-size: 12px; color: #888; line-height: 1.7; }
            `}</style>

            <div className="cs">
                <div className="cs-inner">

                    {/* Header */}
                    <div className="cs-header">
                        <button className="cs-back" onClick={() => router.back()}>
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <div className="cs-step">Step 2 of 2</div>
                            <h1 className="cs-title">Select Size & Finishes</h1>
                        </div>
                    </div>

                    <div className="cs-grid">

                        {/* ═══ LEFT: WALL PREVIEW ═══ */}
                        <div className="cs-left">
                            <div className="cs-wall">
                                <div className="cs-wall-scene" ref={previewRef}>

                                    <div className="cs-frame-area">
                                        <div className="cs-frame-wrap" style={getFrameStyle()}>
                                            {/* Dimension lines + label */}
                                            <div data-html2canvas-ignore="true" className="cs-dims">
                                                <div className="cs-dim-top">
                                                    <div className="cs-dim-line" />
                                                    <span className="cs-dim-label">
                                                        {selectedSize ? `${selectedSize.width}×${selectedSize.height} Canvas Frame` : 'Canvas Frame'}
                                                    </span>
                                                    <div className="cs-dim-line" />
                                                </div>
                                            </div>

                                            {/* Edit button */}
                                            <button data-html2canvas-ignore="true" className="cs-edit-btn" onClick={() => router.back()}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                Edit Again
                                            </button>

                                            {/* 3D Canvas Frame */}
                                            <div className="cs-frame">
                                                <img src={croppedImageUrl || editorData?.photoData?.url} alt="Your Canvas" />
                                            </div>
                                            {/* 3D depth sides */}
                                            <div className="cs-depth-right" />
                                            <div className="cs-depth-bottom" />
                                            <div className="cs-frame-shadow" />
                                        </div>
                                    </div>
                                </div>

                                <div className="cs-wall-foot">
                                    <div className="cs-wall-foot-dim">
                                        <Ruler size={14} />
                                        {selectedSize ? `${selectedSize.width}" × ${selectedSize.height}"` : '—'}
                                    </div>
                                    <div className="cs-wall-foot-depth">
                                        <Layers size={12} />
                                        {selectedThickness.label} · {selectedEdge.label}
                                    </div>
                                </div>
                            </div>

                            <div className="cs-trust">
                                <div className="cs-trust-item"><Shield size={18} /><span>Quality Guarantee</span></div>
                                <div className="cs-trust-item"><Truck size={18} /><span>Free Shipping</span></div>
                                <div className="cs-trust-item"><Package size={18} /><span>Safe Packaging</span></div>
                            </div>
                        </div>

                        {/* ═══ RIGHT: OPTIONS ═══ */}
                        <div>
                            <div className="cs-opts">
                                <div className="cs-opts-body">

                                    {/* Sizes */}
                                    <div className="cs-sec"><Ruler size={14} /> Select Size</div>
                                    <div className="cs-sizes">
                                        {availableSizes.map((s, i) => (
                                            <div key={i} className={`cs-size ${selectedSize?.label === s.label ? 'on' : ''}`} onClick={() => setSelectedSize(s)}>
                                                <div className="cs-size-name">{s.label}</div>
                                                <div className="cs-size-price">₹{s.price}</div>
                                                {selectedSize?.label === s.label && <CheckCircle2 size={16} color="#0071e3" className="cs-size-check" />}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Thickness */}
                                    <div className="cs-sec"><Layers size={14} /> Canvas Depth</div>
                                    <div className="cs-thick">
                                        {THICKNESS_OPTIONS.map((t, i) => (
                                            <div key={i} className={`cs-thick-item ${selectedThickness.value === t.value ? 'on' : ''}`} onClick={() => setSelectedThickness(t)}>
                                                <div className="cs-thick-name">{t.label}</div>
                                                <div className="cs-thick-desc">{t.desc}</div>
                                                <div className="cs-thick-price">{t.price === 0 ? 'Included' : `+ ₹${t.price}`}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Edge */}
                                    <div className="cs-sec"><Scissors size={14} /> Edge Finish</div>
                                    <div className="cs-edges">
                                        {EDGE_OPTIONS.map((e, i) => (
                                            <div key={i} className={`cs-edge ${selectedEdge.value === e.value ? 'on' : ''}`} onClick={() => setSelectedEdge(e)}>
                                                <div className="cs-edge-name">{e.label}</div>
                                                <div className="cs-edge-desc">{e.desc}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="cs-hr" />

                                    {/* Qty */}
                                    <div className="cs-qty-row">
                                        <span className="cs-qty-label">Quantity</span>
                                        <div className="cs-qty-box">
                                            <button className="cs-qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                                            <span className="cs-qty-val">{quantity}</span>
                                            <button className="cs-qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="cs-price-row">
                                        <div>
                                            <div className="cs-price-lbl">Total Price</div>
                                            {quantity > 1 && <div className="cs-price-sub">₹{totalPrice / quantity} × {quantity}</div>}
                                        </div>
                                        <div className="cs-price-big">₹{totalPrice}</div>
                                    </div>

                                    {/* CTA */}
                                    <button className="cs-cart-btn" onClick={handleAddToCart} disabled={loading || !selectedSize}>
                                        {loading ? <Loader2 className="animate-spin" size={18} /> : <ShoppingCart size={18} />}
                                        Add to Cart
                                    </button>
                                    <div className="cs-secure"><Lock size={11} /> Secure checkout · Free shipping over ₹999</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="cs-info">
                        <h3 className="cs-info-h3">About Our Canvas Prints</h3>
                        <div className="cs-info-grid">
                            <div className="cs-info-card">
                                <div className="cs-info-ic"><Star size={18} color="#0071e3" /></div>
                                <h4>Premium Canvas</h4>
                                <p>400gsm poly-cotton blend for a rich, textured finish with vibrant colours.</p>
                            </div>
                            <div className="cs-info-card">
                                <div className="cs-info-ic"><Package size={18} color="#0071e3" /></div>
                                <h4>Solid Wood Frame</h4>
                                <p>Kiln-dried pine stretcher bars keep your canvas taut and warp-free for years.</p>
                            </div>
                            <div className="cs-info-card">
                                <div className="cs-info-ic"><Check size={18} color="#0071e3" /></div>
                                <h4>Ready to Hang</h4>
                                <p>Comes with sawtooth hangers attached. Just unbox and hang on your wall.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
