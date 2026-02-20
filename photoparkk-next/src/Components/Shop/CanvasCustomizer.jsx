"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cropper from "react-easy-crop";
import {
    Upload, ZoomIn, RotateCw, Sparkles, Ruler, ShoppingCart,
    Loader2, Package, Truck, Lock, CheckCircle2, ChevronRight,
    AlertTriangle, X, Shield, Star, Check, Eye, Image as ImageIcon
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import * as htmlToImage from 'html-to-image';

const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_UPLOAD_SIZE_MB = 10;

const SIZES = {
    portrait: [
        { label: "12×18\"", price: 899, width: 12, height: 18 },
        { label: "16×24\"", price: 1499, width: 16, height: 24 },
        { label: "20×30\"", price: 2199, width: 20, height: 30 },
        { label: "24×36\"", price: 2999, width: 24, height: 36 },
    ],
    landscape: [
        { label: "18×12\"", price: 899, width: 18, height: 12 },
        { label: "24×16\"", price: 1499, width: 24, height: 16 },
        { label: "30×20\"", price: 2199, width: 30, height: 20 },
        { label: "36×24\"", price: 2999, width: 36, height: 24 },
    ],
    square: [
        { label: "12×12\"", price: 699, width: 12, height: 12 },
        { label: "16×16\"", price: 1199, width: 16, height: 16 },
        { label: "24×24\"", price: 1999, width: 24, height: 24 },
    ],
    default: [
        { label: "12×12\"", price: 799, width: 12, height: 12 },
        { label: "16×16\"", price: 1299, width: 16, height: 16 },
    ]
};

const WRAP_OPTIONS = [
    { label: "Image Wrap", value: "wrap", price: 0, desc: "Image extends around edges" },
    { label: "Mirror Wrap", value: "mirror", price: 200, desc: "Edges mirror the image" },
    { label: "White Border", value: "white", price: 0, desc: "Clean white edges" },
];

const CanvasCustomizer = ({ shape }) => {
    const router = useRouter();
    const type = "canvas";
    const shapeTitle = shape.charAt(0).toUpperCase() + shape.slice(1);

    // Upload & Crop
    const [photoData, setPhotoData] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [lowResWarning, setLowResWarning] = useState(false);
    const [showCropModal, setShowCropModal] = useState(false);
    const fileInputRef = useRef(null);
    const previewRef = useRef(null);

    // Product
    const [frameConfig, setFrameConfig] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedWrap, setSelectedWrap] = useState(WRAP_OPTIONS[0]);
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);

    const shapeKey = ["portrait", "landscape", "square"].includes(shape) ? shape : "default";
    const availableSizes = frameConfig?.sizes || SIZES[shapeKey] || SIZES.default;

    useEffect(() => {
        (async () => {
            try {
                const res = await axiosInstance.get(`frames/${type}?shape=${shape}`);
                if (res.data?.length > 0) {
                    setFrameConfig(res.data[0]);
                    if (res.data[0].sizes?.length > 0 && !selectedSize) setSelectedSize(res.data[0].sizes[0]);
                }
            } catch (err) { console.error(err); }
        })();
    }, [type, shape]);

    useEffect(() => { if (!selectedSize && availableSizes.length > 0) setSelectedSize(availableSizes[0]); }, [availableSizes]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            try { const u = JSON.parse(localStorage.getItem("user")); if (u) setUserId(u.id || u._id); } catch (e) { }
        }
    }, []);

    useEffect(() => {
        if (!selectedSize) return;
        setTotalPrice((selectedSize.price + selectedWrap.price) * quantity);
    }, [selectedSize, selectedWrap, quantity]);

    // Upload
    const handleFileUpload = async (file) => {
        if (!file.type.match("image.*")) { toast.error("Please select a valid image"); return; }
        if (file.size > MAX_UPLOAD_SIZE_BYTES) { toast.error(`File too large. Max ${MAX_UPLOAD_SIZE_MB}MB.`); return; }
        setIsUploading(true); setUploadProgress(0);
        const fd = new FormData(); fd.append("image", file);
        try {
            const res = await axios.post("/api/upload-image", fd, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (p) => setUploadProgress(Math.round((p.loaded * 100) / p.total)),
            });
            const url = res.data.imageUrl;
            const img = new Image();
            img.onload = () => {
                setLowResWarning(img.width < 1000 || img.height < 1000);
                setPhotoData({ url, name: file.name, size: file.size, type: file.type, width: img.width, height: img.height });
                setShowCropModal(true);
            };
            img.src = url;
            toast.success("Photo uploaded!");
        } catch (e) { console.error(e); toast.error("Upload failed."); }
        finally { setIsUploading(false); }
    };

    const handleChange = (e) => { if (e.target.files?.[0]) handleFileUpload(e.target.files[0]); };
    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]); };
    const onCropComplete = useCallback((_, px) => setCroppedAreaPixels(px), []);

    const getAspectRatio = () => {
        switch (shape) { case "portrait": return 3 / 4; case "landscape": return 4 / 3; default: return 1; }
    };

    // Crop helper
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
        if (photoData?.url && croppedAreaPixels) getCroppedImg(photoData.url, croppedAreaPixels, rotation).then(setCroppedImageUrl);
    }, [photoData, croppedAreaPixels, rotation, getCroppedImg]);

    const handleCropDone = () => {
        setShowCropModal(false);
    };

    // Wall preview capture
    const generateWallPreview = async () => {
        if (!previewRef.current) return null;
        try { return await htmlToImage.toBlob(previewRef.current, { quality: 0.95, pixelRatio: 2, backgroundColor: '#f5f5f5', filter: (n) => !(n.hasAttribute && n.hasAttribute('data-html2canvas-ignore')) }); }
        catch (e) { return null; }
    };

    // Add to cart
    const handleAddToCart = async () => {
        if (!photoData) { toast.error("Please upload a photo first."); return; }
        if (!selectedSize) { toast.error("Please select a size."); return; }
        if (!userId) { toast.error("Please log in to add items to cart."); return; }
        setLoading(true);
        try {
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
                userId, productId: frameConfig?.id || "canvas-default", productType: 'Canvascustomizedata',
                title: `Canvas ${shapeTitle} Frame`, image: finalUrl, size: selectedSize.label,
                thickness: 'standard', edge: selectedWrap.value, frameType: 'none', frameColor: null,
                price: totalPrice / quantity, quantity, totalAmount: totalPrice,
                uploadedImageUrl: photoData?.url,
                customizationDetails: { crop: { crop, zoom, rotation, croppedAreaPixels }, wrap: selectedWrap, originalName: photoData?.name }
            });
            toast.success("Added to Cart!"); router.push("/cart");
        } catch (e) { console.error(e); toast.error("Failed to add to cart."); }
        finally { setLoading(false); }
    };

    // Calculate frame size for wall preview
    const getFrameStyle = () => {
        if (!selectedSize) return { height: '35%', aspectRatio: '3/4' };
        const scale = Math.min(selectedSize.height / 40, 1);
        return {
            height: `${Math.max(25, scale * 65)}%`,
            aspectRatio: `${selectedSize.width} / ${selectedSize.height}`,
            maxHeight: '70%',
        };
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

                .cvz { font-family: 'Poppins', sans-serif; background: #f8f8f6; min-height: 100vh; padding-top: 100px; padding-bottom: 80px; }
                .cvz-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

                /* Breadcrumb */
                .cvz-bread { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #a3a3a3; margin-bottom: 28px; }
                .cvz-bread a { color: #737373; text-decoration: none; transition: color 0.2s; }
                .cvz-bread a:hover { color: #0071e3; }
                .cvz-bread-now { color: #1d1d1f; font-weight: 600; }

                /* Main Grid */
                .cvz-grid { display: grid; grid-template-columns: 1fr 380px; gap: 36px; align-items: start; }
                @media (max-width: 960px) { .cvz-grid { grid-template-columns: 1fr; } }

                /* ═══════════════════════════════════════════ */
                /* LEFT: WALL PREVIEW — THE HERO              */
                /* ═══════════════════════════════════════════ */
                .cvz-left { position: sticky; top: 110px; }

                .cvz-wall-card {
                    border-radius: 20px; overflow: hidden;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
                    border: 1px solid #e8e8e8;
                    background: #fff;
                }

                /* Wall Scene */
                .cvz-wall-scene {
                    position: relative;
                    height: 480px;
                    overflow: hidden;
                    background: #f5f0eb;
                }
                .cvz-wall-bg {
                    position: absolute; inset: 0;
                    width: 100%; height: 100%;
                    object-fit: cover;
                }
                .cvz-wall-overlay {
                    position: absolute; inset: 0;
                    background: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 50%);
                    pointer-events: none;
                }

                /* Canvas frame on wall */
                .cvz-wall-frame-area {
                    position: absolute;
                    top: 4%; left: 50%;
                    transform: translateX(-50%);
                    height: 58%;
                    display: flex; align-items: center; justify-content: center;
                    z-index: 10;
                }
                .cvz-wall-frame {
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }
                /* Canvas depth effect — 3D look */
                .cvz-wall-frame::before {
                    content: '';
                    position: absolute; inset: -6px;
                    background: #f5f0e8;
                    border-radius: 2px;
                    box-shadow:
                        4px 4px 0 0 #d4c9b8,
                        5px 5px 0 0 #c4b9a8,
                        6px 6px 0 0 #b4a998,
                        0 12px 40px rgba(0,0,0,0.25),
                        0 4px 12px rgba(0,0,0,0.1);
                    z-index: -1;
                }
                .cvz-wall-frame img {
                    width: 100%; height: 100%;
                    object-fit: cover; display: block;
                    border-radius: 1px;
                }
                /* Shadow on wall behind frame */
                .cvz-wall-shadow {
                    position: absolute;
                    width: 80%; height: 20px;
                    bottom: -15px; left: 10%;
                    background: radial-gradient(ellipse, rgba(0,0,0,0.15) 0%, transparent 70%);
                    filter: blur(6px);
                }

                /* Empty state: Upload prompt on wall */
                .cvz-wall-empty {
                    position: absolute; inset: 0; z-index: 15;
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    cursor: pointer; transition: all 0.3s;
                }
                .cvz-wall-empty:hover .cvz-wall-empty-card { transform: scale(1.02); box-shadow: 0 12px 40px rgba(0,0,0,0.12); }

                .cvz-wall-empty-card {
                    background: rgba(255,255,255,0.92); backdrop-filter: blur(16px);
                    border-radius: 20px; padding: 36px 44px; text-align: center;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
                    border: 1px solid rgba(255,255,255,0.8);
                    transition: all 0.3s; display: flex; flex-direction: column;
                    align-items: center; gap: 12px; max-width: 320px;
                }
                .cvz-wall-empty-icon {
                    width: 56px; height: 56px; border-radius: 50%;
                    background: linear-gradient(135deg, #e6f2ff, #f0f7ff);
                    border: 1px solid #d0e5ff;
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 4px;
                }
                .cvz-wall-empty-h { font-size: 17px; font-weight: 700; color: #1d1d1f; letter-spacing: -0.3px; }
                .cvz-wall-empty-p { font-size: 13px; color: #888; line-height: 1.5; }
                .cvz-wall-empty-btn {
                    padding: 12px 32px; background: #0071e3; color: #fff; border: none;
                    border-radius: 10px; font-size: 13px; font-weight: 600;
                    cursor: pointer; transition: all 0.2s;
                    box-shadow: 0 4px 16px rgba(0,113,227,0.3);
                }
                .cvz-wall-empty-btn:hover { background: #005ec4; transform: translateY(-1px); }
                .cvz-wall-empty-hint { font-size: 10px; color: #bbb; }

                /* Badges on wall */
                .cvz-wall-tag {
                    position: absolute; z-index: 20;
                    background: rgba(255,255,255,0.88); backdrop-filter: blur(10px);
                    padding: 6px 14px; border-radius: 20px; font-size: 11px;
                    font-weight: 600; color: #555;
                    display: flex; align-items: center; gap: 6px;
                    border: 1px solid rgba(255,255,255,0.6);
                    box-shadow: 0 2px 10px rgba(0,0,0,0.06);
                }
                .cvz-wall-tag-tl { top: 14px; left: 14px; }
                .cvz-wall-tag-tr { top: 14px; right: 14px; }
                .cvz-wall-tag-size { background: rgba(0,113,227,0.1); color: #0071e3; border-color: rgba(0,113,227,0.15); }

                /* Footer bar under wall */
                .cvz-wall-footer {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 14px 20px; border-top: 1px solid #f0f0f0;
                    background: #fff;
                }
                .cvz-wall-footer-left { display: flex; align-items: center; gap: 10px; }
                .cvz-wall-footer-btn {
                    display: flex; align-items: center; gap: 6px;
                    padding: 8px 16px; border: 1px solid #e5e5e5; border-radius: 8px;
                    background: #fff; font-size: 12px; font-weight: 600; color: #666;
                    cursor: pointer; transition: all 0.2s;
                }
                .cvz-wall-footer-btn:hover { border-color: #0071e3; color: #0071e3; }
                .cvz-wall-footer-btn.blue { background: #f0f7ff; border-color: #d0e5ff; color: #0071e3; }
                .cvz-wall-footer-btn.blue:hover { background: #0071e3; color: #fff; }

                /* ═══════════════════════════════════════════ */
                /* RIGHT: OPTIONS PANEL                        */
                /* ═══════════════════════════════════════════ */
                .cvz-opts {
                    background: #fff; border-radius: 20px; overflow: hidden;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.04); border: 1px solid #e8e8e8;
                }
                .cvz-opts-head { padding: 24px 24px 20px; border-bottom: 1px solid #f5f5f5; }
                .cvz-opts-badge {
                    display: inline-flex; align-items: center; gap: 6px;
                    font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
                    color: #0071e3; font-weight: 600;
                    background: #f0f7ff; border: 1px solid #d0e5ff;
                    padding: 4px 12px; border-radius: 4px; margin-bottom: 10px;
                }
                .cvz-opts-h1 { font-size: 22px; font-weight: 700; color: #1d1d1f; letter-spacing: -0.5px; margin-bottom: 4px; }
                .cvz-opts-sub { font-size: 13px; color: #888; line-height: 1.6; }
                .cvz-opts-body { padding: 20px 24px 24px; }

                /* Section title */
                .cvz-sec { font-size: 12px; font-weight: 700; color: #1d1d1f; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; text-transform: uppercase; letter-spacing: 0.3px; }
                .cvz-sec svg { color: #0071e3; }

                /* Size Pills */
                .cvz-sizes { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px; }
                .cvz-size {
                    position: relative; padding: 14px 16px; border-radius: 12px;
                    border: 2px solid #f0f0f0; background: #fff; cursor: pointer;
                    text-align: left; transition: all 0.25s;
                }
                .cvz-size:hover { border-color: #c0d8f5; }
                .cvz-size.on { border-color: #0071e3; background: #f4f9ff; }
                .cvz-size-name { font-size: 14px; font-weight: 700; color: #1d1d1f; }
                .cvz-size-price { font-size: 12px; color: #0071e3; font-weight: 600; margin-top: 2px; }
                .cvz-size-check { position: absolute; top: 10px; right: 10px; }

                /* Wrap Options */
                .cvz-wraps { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
                .cvz-wrap {
                    flex: 1; min-width: 90px; padding: 12px; border-radius: 10px;
                    border: 2px solid #f0f0f0; cursor: pointer; text-align: center;
                    transition: all 0.25s; background: #fff;
                }
                .cvz-wrap:hover { border-color: #c0d8f5; }
                .cvz-wrap.on { border-color: #0071e3; background: #f4f9ff; }
                .cvz-wrap-name { font-size: 12px; font-weight: 600; color: #1d1d1f; }
                .cvz-wrap-desc { font-size: 10px; color: #999; margin-top: 3px; }

                .cvz-hr { height: 1px; background: #f0f0f0; margin: 16px 0; }

                /* Quantity */
                .cvz-qty-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
                .cvz-qty-label { font-size: 13px; font-weight: 600; color: #555; }
                .cvz-qty-box { display: flex; align-items: center; border: 1px solid #e5e5e5; border-radius: 10px; overflow: hidden; }
                .cvz-qty-btn { width: 38px; height: 38px; border: none; background: #fafafa; cursor: pointer; font-size: 16px; font-weight: 600; color: #555; transition: background 0.2s; }
                .cvz-qty-btn:hover { background: #f0f7ff; color: #0071e3; }
                .cvz-qty-val { width: 40px; text-align: center; font-size: 14px; font-weight: 700; color: #1d1d1f; border-left: 1px solid #e5e5e5; border-right: 1px solid #e5e5e5; line-height: 38px; }

                /* Price */
                .cvz-price-row { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 16px; }
                .cvz-price-lbl { font-size: 13px; color: #888; }
                .cvz-price-sub { font-size: 11px; color: #bbb; }
                .cvz-price-big { font-size: 32px; font-weight: 800; color: #0071e3; letter-spacing: -1px; }

                /* CTA */
                .cvz-cart-btn {
                    width: 100%; padding: 16px; background: #0071e3; color: #fff; border: none; border-radius: 12px;
                    font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.3s;
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    box-shadow: 0 6px 20px rgba(0,113,227,0.3);
                }
                .cvz-cart-btn:hover { background: #005ec4; transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,113,227,0.4); }
                .cvz-cart-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
                .cvz-secure { text-align: center; font-size: 11px; color: #bbb; margin-top: 10px; display: flex; align-items: center; justify-content: center; gap: 6px; }

                /* Trust */
                .cvz-trust { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 16px; }
                .cvz-trust-item {
                    display: flex; flex-direction: column; align-items: center; gap: 6px;
                    padding: 14px 8px; background: #fff; border-radius: 12px;
                    border: 1px solid #ebebeb; text-align: center;
                }
                .cvz-trust-item svg { color: #0071e3; }
                .cvz-trust-item span { font-size: 10px; font-weight: 600; color: #555; line-height: 1.3; }

                /* Info cards */
                .cvz-info { margin-top: 48px; padding-top: 40px; border-top: 1px solid #ebebeb; }
                .cvz-info-h3 { font-size: 18px; font-weight: 700; color: #1d1d1f; margin-bottom: 20px; }
                .cvz-info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
                @media (max-width: 768px) { .cvz-info-grid { grid-template-columns: 1fr; } }
                .cvz-info-card { padding: 24px; background: #fff; border-radius: 16px; border: 1px solid #ebebeb; }
                .cvz-info-ic { width: 40px; height: 40px; border-radius: 10px; background: #f0f7ff; border: 1px solid #d0e5ff; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
                .cvz-info-card h4 { font-size: 14px; font-weight: 700; color: #1d1d1f; margin-bottom: 6px; }
                .cvz-info-card p { font-size: 12px; color: #888; line-height: 1.7; }

                /* ═══ CROP MODAL ═══ */
                .cvz-crop-overlay {
                    position: fixed; inset: 0; z-index: 100;
                    background: rgba(0,0,0,0.6); backdrop-filter: blur(8px);
                    display: flex; align-items: center; justify-content: center;
                    padding: 20px;
                }
                .cvz-crop-modal {
                    background: #fff; border-radius: 20px; width: 100%;
                    max-width: 600px; overflow: hidden;
                    box-shadow: 0 24px 64px rgba(0,0,0,0.2);
                }
                .cvz-crop-header {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 18px 24px; border-bottom: 1px solid #f0f0f0;
                }
                .cvz-crop-header h3 { font-size: 16px; font-weight: 700; color: #1d1d1f; display: flex; align-items: center; gap: 8px; }
                .cvz-crop-close {
                    width: 32px; height: 32px; border-radius: 8px; border: none;
                    background: #f5f5f5; cursor: pointer; display: flex;
                    align-items: center; justify-content: center; color: #666;
                    transition: all 0.2s;
                }
                .cvz-crop-close:hover { background: #e5e5e5; }
                .cvz-crop-area { position: relative; height: 380px; background: #111; }
                .cvz-crop-controls {
                    display: flex; align-items: center; justify-content: center; gap: 24px;
                    padding: 14px 24px; background: #fafafa; border-top: 1px solid #f0f0f0;
                }
                .cvz-ctrl { display: flex; align-items: center; gap: 8px; }
                .cvz-ctrl-lbl { font-size: 11px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
                .cvz-slider {
                    -webkit-appearance: none; width: 110px; height: 4px;
                    background: #e0e0e0; border-radius: 2px; outline: none; cursor: pointer;
                }
                .cvz-slider::-webkit-slider-thumb {
                    -webkit-appearance: none; width: 16px; height: 16px;
                    border-radius: 50%; background: #0071e3; cursor: pointer;
                }
                .cvz-crop-footer {
                    display: flex; align-items: center; justify-content: flex-end; gap: 10px;
                    padding: 16px 24px; border-top: 1px solid #f0f0f0;
                }
                .cvz-crop-reset {
                    padding: 10px 20px; border: 1px solid #e5e5e5; border-radius: 8px;
                    background: #fff; font-size: 12px; font-weight: 600; color: #666;
                    cursor: pointer; transition: all 0.2s;
                }
                .cvz-crop-reset:hover { border-color: #0071e3; color: #0071e3; }
                .cvz-crop-done {
                    padding: 10px 28px; background: #0071e3; color: #fff; border: none;
                    border-radius: 8px; font-size: 13px; font-weight: 600;
                    cursor: pointer; transition: all 0.2s;
                    box-shadow: 0 4px 12px rgba(0,113,227,0.25);
                }
                .cvz-crop-done:hover { background: #005ec4; }
                .cvz-lowres {
                    position: absolute; top: 10px; left: 10px; z-index: 20;
                    background: rgba(255,255,255,0.95); border: 1px solid #f5deb3;
                    padding: 6px 14px; border-radius: 8px; font-size: 11px;
                    font-weight: 600; color: #a36b00;
                    display: flex; align-items: center; gap: 6px;
                }

                /* Upload Modal */
                .cvz-modal-bg {
                    position: fixed; inset: 0; background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(8px); display: flex; align-items: center;
                    justify-content: center; z-index: 100;
                }
                .cvz-modal {
                    background: #fff; border-radius: 20px; padding: 40px;
                    width: 340px; text-align: center;
                    box-shadow: 0 24px 64px rgba(0,0,0,0.15);
                }
                .cvz-modal h3 { font-size: 16px; font-weight: 700; color: #1d1d1f; margin-bottom: 6px; }
                .cvz-modal p { font-size: 12px; color: #888; margin-bottom: 20px; }
                .cvz-prog-track { height: 4px; background: #f0f0f0; border-radius: 2px; overflow: hidden; margin-bottom: 8px; }
                .cvz-prog-bar { height: 100%; background: linear-gradient(90deg, #0071e3, #60a5fa); border-radius: 2px; transition: width 0.3s; }
                .cvz-prog-txt { font-size: 11px; color: #bbb; }
            `}</style>

            <div className="cvz">
                <div className="cvz-inner">

                    {/* Breadcrumb */}
                    <div className="cvz-bread">
                        <a href="/">Home</a> <ChevronRight size={12} />
                        <a href="/shop/canvas">Canvas</a> <ChevronRight size={12} />
                        <span className="cvz-bread-now">{shapeTitle} Canvas</span>
                    </div>

                    <input type="file" ref={fileInputRef} onChange={handleChange} accept="image/*" style={{ display: "none" }} />

                    <div className="cvz-grid">

                        {/* ═══ LEFT: WALL PREVIEW ═══ */}
                        <div className="cvz-left">
                            <div className="cvz-wall-card">
                                <div className="cvz-wall-scene" ref={previewRef}>
                                    {/* Room background */}
                                    <img className="cvz-wall-bg" src="/interior-wall.jpg" alt="Room" />
                                    <div className="cvz-wall-overlay" />

                                    {/* Badges */}
                                    <div data-html2canvas-ignore="true" className="cvz-wall-tag cvz-wall-tag-tl">
                                        <Eye size={12} color="#0071e3" /> Wall Preview
                                    </div>
                                    {selectedSize && croppedImageUrl && (
                                        <div data-html2canvas-ignore="true" className="cvz-wall-tag cvz-wall-tag-tr cvz-wall-tag-size">
                                            <Ruler size={12} /> {selectedSize.label}
                                        </div>
                                    )}

                                    {/* No photo → Upload prompt */}
                                    {!croppedImageUrl && (
                                        <div className="cvz-wall-empty"
                                            onClick={() => fileInputRef.current?.click()}
                                            onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                                            <div className="cvz-wall-empty-card">
                                                <div className="cvz-wall-empty-icon">
                                                    <Upload size={24} color="#0071e3" />
                                                </div>
                                                <p className="cvz-wall-empty-h">Upload Your Photo</p>
                                                <p className="cvz-wall-empty-p">See how your photo looks as a canvas print on your wall</p>
                                                <button className="cvz-wall-empty-btn" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                                                    Choose Photo
                                                </button>
                                                <span className="cvz-wall-empty-hint">JPG · PNG · Max {MAX_UPLOAD_SIZE_MB}MB</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Photo uploaded → Canvas on wall */}
                                    {croppedImageUrl && (
                                        <div className="cvz-wall-frame-area">
                                            <div className="cvz-wall-frame" style={getFrameStyle()}>
                                                <img src={croppedImageUrl} alt="Your Canvas" />
                                                <div className="cvz-wall-shadow" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer bar */}
                                <div className="cvz-wall-footer">
                                    <div className="cvz-wall-footer-left">
                                        {croppedImageUrl ? (
                                            <>
                                                <button className="cvz-wall-footer-btn" onClick={() => { setPhotoData(null); setCroppedImageUrl(null); }}>
                                                    <X size={13} /> Remove
                                                </button>
                                                <button className="cvz-wall-footer-btn blue" onClick={() => setShowCropModal(true)}>
                                                    <ImageIcon size={13} /> Edit Crop
                                                </button>
                                            </>
                                        ) : (
                                            <span style={{ fontSize: 12, color: '#bbb' }}>Upload a photo to see the preview</span>
                                        )}
                                    </div>
                                    {croppedImageUrl && (
                                        <button className="cvz-wall-footer-btn" onClick={() => fileInputRef.current?.click()}>
                                            <Upload size={13} /> Change Photo
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ═══ RIGHT: OPTIONS ═══ */}
                        <div>
                            <div className="cvz-opts">
                                <div className="cvz-opts-head">
                                    <div className="cvz-opts-badge"><Sparkles size={10} /> Canvas Print</div>
                                    <h1 className="cvz-opts-h1">{shapeTitle} Canvas Frame</h1>
                                    <p className="cvz-opts-sub">Premium cotton canvas, hand-stretched on solid wood bars. Ready to hang.</p>
                                </div>

                                <div className="cvz-opts-body">
                                    {/* Sizes */}
                                    <div className="cvz-sec"><Ruler size={14} /> Select Size</div>
                                    <div className="cvz-sizes">
                                        {availableSizes.map((s, i) => (
                                            <div key={i} className={`cvz-size ${selectedSize?.label === s.label ? 'on' : ''}`} onClick={() => setSelectedSize(s)}>
                                                <div className="cvz-size-name">{s.label}</div>
                                                <div className="cvz-size-price">₹{s.price}</div>
                                                {selectedSize?.label === s.label && <CheckCircle2 size={16} color="#0071e3" className="cvz-size-check" />}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Edge */}
                                    <div className="cvz-sec"><Sparkles size={14} /> Edge Finish</div>
                                    <div className="cvz-wraps">
                                        {WRAP_OPTIONS.map((w, i) => (
                                            <div key={i} className={`cvz-wrap ${selectedWrap.value === w.value ? 'on' : ''}`} onClick={() => setSelectedWrap(w)}>
                                                <div className="cvz-wrap-name">{w.label}</div>
                                                <div className="cvz-wrap-desc">{w.desc}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="cvz-hr" />

                                    {/* Qty */}
                                    <div className="cvz-qty-row">
                                        <span className="cvz-qty-label">Quantity</span>
                                        <div className="cvz-qty-box">
                                            <button className="cvz-qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                                            <span className="cvz-qty-val">{quantity}</span>
                                            <button className="cvz-qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="cvz-price-row">
                                        <div>
                                            <div className="cvz-price-lbl">Total Price</div>
                                            {quantity > 1 && <div className="cvz-price-sub">₹{totalPrice / quantity} × {quantity}</div>}
                                        </div>
                                        <div className="cvz-price-big">₹{totalPrice}</div>
                                    </div>

                                    {/* CTA */}
                                    <button className="cvz-cart-btn" onClick={handleAddToCart} disabled={loading || !selectedSize || !photoData}>
                                        {loading ? <Loader2 className="animate-spin" size={18} /> : <ShoppingCart size={18} />}
                                        {!photoData ? "Upload Photo to Continue" : "Add to Cart"}
                                    </button>
                                    <div className="cvz-secure"><Lock size={11} /> Secure checkout · Free shipping over ₹999</div>
                                </div>
                            </div>

                            <div className="cvz-trust">
                                <div className="cvz-trust-item"><Shield size={18} /><span>Quality Guarantee</span></div>
                                <div className="cvz-trust-item"><Truck size={18} /><span>Free Shipping</span></div>
                                <div className="cvz-trust-item"><Package size={18} /><span>Safe Packaging</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="cvz-info">
                        <h3 className="cvz-info-h3">About Our Canvas Prints</h3>
                        <div className="cvz-info-grid">
                            <div className="cvz-info-card">
                                <div className="cvz-info-ic"><Star size={18} color="#0071e3" /></div>
                                <h4>Premium Canvas</h4>
                                <p>400gsm poly-cotton blend for a rich, textured finish with vibrant colours.</p>
                            </div>
                            <div className="cvz-info-card">
                                <div className="cvz-info-ic"><Package size={18} color="#0071e3" /></div>
                                <h4>Solid Wood Frame</h4>
                                <p>Kiln-dried pine stretcher bars keep your canvas taut and warp-free for years.</p>
                            </div>
                            <div className="cvz-info-card">
                                <div className="cvz-info-ic"><Check size={18} color="#0071e3" /></div>
                                <h4>Ready to Hang</h4>
                                <p>Comes with sawtooth hangers attached. Just unbox and hang on your wall.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ CROP MODAL ═══ */}
            {showCropModal && photoData && (
                <div className="cvz-crop-overlay">
                    <div className="cvz-crop-modal">
                        <div className="cvz-crop-header">
                            <h3><ImageIcon size={16} color="#0071e3" /> Adjust Your Photo</h3>
                            <button className="cvz-crop-close" onClick={handleCropDone}><X size={16} /></button>
                        </div>
                        <div className="cvz-crop-area">
                            <Cropper
                                image={photoData.url} crop={crop} zoom={zoom}
                                rotation={rotation} aspect={getAspectRatio()}
                                onCropChange={setCrop} onCropComplete={onCropComplete}
                                onZoomChange={setZoom} onRotationChange={setRotation}
                                showGrid={false}
                                style={{
                                    containerStyle: { background: "#111" },
                                    cropAreaStyle: { border: "2px solid #0071e3", boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)", borderRadius: "4px" },
                                }}
                            />
                            {lowResWarning && (
                                <div className="cvz-lowres"><AlertTriangle size={13} /> Low resolution</div>
                            )}
                        </div>
                        <div className="cvz-crop-controls">
                            <div className="cvz-ctrl">
                                <ZoomIn size={14} color="#888" />
                                <span className="cvz-ctrl-lbl">Zoom</span>
                                <input type="range" className="cvz-slider" min={1} max={3} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
                            </div>
                            <div className="cvz-ctrl">
                                <RotateCw size={14} color="#888" />
                                <span className="cvz-ctrl-lbl">Rotate</span>
                                <input type="range" className="cvz-slider" min={0} max={360} step={1} value={rotation} onChange={(e) => setRotation(Number(e.target.value))} />
                            </div>
                        </div>
                        <div className="cvz-crop-footer">
                            <button className="cvz-crop-reset" onClick={() => { setZoom(1); setRotation(0); }}>Reset</button>
                            <button className="cvz-crop-done" onClick={handleCropDone}>Done</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Progress Modal */}
            {isUploading && (
                <div className="cvz-modal-bg">
                    <div className="cvz-modal">
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f0f7ff', border: '1px solid #d0e5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                            <Upload size={20} color="#0071e3" />
                        </div>
                        <h3>Uploading photo…</h3>
                        <p>Preparing your image for printing.</p>
                        <div className="cvz-prog-track"><div className="cvz-prog-bar" style={{ width: `${uploadProgress}%` }} /></div>
                        <p className="cvz-prog-txt">{uploadProgress}%</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default CanvasCustomizer;
