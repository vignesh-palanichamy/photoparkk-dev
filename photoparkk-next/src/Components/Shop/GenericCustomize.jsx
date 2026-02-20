"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cropper from "react-easy-crop";
import { Upload, X, RotateCw, ZoomIn, ArrowRight, AlertTriangle, Sparkles } from "lucide-react";
import LoadingBar from "../LoadingBar";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";

const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_UPLOAD_SIZE_MB = 10;
const CROP_SIZE = 280;

const GenericCustomize = ({ type, shape }) => {
    const [photoData, setPhotoData] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [productConfig, setProductConfig] = useState(null);

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [lowResWarning, setLowResWarning] = useState(false);

    const fileInputRef = useRef(null);
    const router = useRouter();

    const typeTitle = type.charAt(0).toUpperCase() + type.slice(1);
    const shapeTitle = shape.charAt(0).toUpperCase() + shape.slice(1);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedData = sessionStorage.getItem(`${type}_custom_data`);
            if (storedData) {
                try {
                    const parsed = JSON.parse(storedData);
                    if (parsed.photoData) {
                        setPhotoData(parsed.photoData);
                        if (parsed.configuration?.crop) {
                            const c = parsed.configuration.crop;
                            setCrop(c.crop || { x: 0, y: 0 });
                            setZoom(c.zoom || 1);
                            setRotation(c.rotation || 0);
                        }
                    }
                } catch (e) { }
            }
        }
    }, [type]);

    React.useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await axiosInstance.get(`frames/${type}?shape=${shape}`);
                if (res.data && res.data.length > 0) setProductConfig(res.data[0]);
            } catch (err) {
                console.error("Failed to fetch config", err);
            }
        };
        fetchConfig();
    }, [type, shape]);

    const handleFileUpload = async (file) => {
        if (!file.type.match("image.*")) { toast.error("Please select a valid image"); return; }
        if (file.size > MAX_UPLOAD_SIZE_BYTES) { toast.error(`File too large. Max size is ${MAX_UPLOAD_SIZE_MB}MB.`); return; }

        setIsUploading(true);
        setUploadProgress(0);
        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await axios.post("/api/upload-image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percent);
                },
            });

            const imageUrl = res.data.imageUrl;
            const img = new Image();
            img.onload = () => {
                if (img.width < 1000 || img.height < 1000) {
                    setLowResWarning(true);
                    toast.warn("Low resolution image detected. Print quality might be affected.");
                } else {
                    setLowResWarning(false);
                }
                setPhotoData({ url: imageUrl, name: file.name, size: file.size, type: file.type, width: img.width, height: img.height });
            };
            img.src = imageUrl;
            toast.success("Image uploaded!");
        } catch (error) {
            console.error(error);
            toast.error("Upload failed.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleChange = (e) => { if (e.target.files?.[0]) handleFileUpload(e.target.files[0]); };
    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]); };
    const handleReplaceClick = () => fileInputRef.current.click();
    const handlePreviewClick = () => { setPhotoData(null); setCrop({ x: 0, y: 0 }); setZoom(1); setRotation(0); };
    const onCropComplete = useCallback((_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels), []);

    const handleContinue = () => {
        if (!photoData) { toast.error("Please upload an image first."); return; }
        let existingDetails = {};
        if (typeof window !== "undefined") {
            const stored = sessionStorage.getItem(`${type}_custom_data`);
            if (stored) existingDetails = JSON.parse(stored);
        }
        const orderData = {
            ...existingDetails, type, shape, photoData,
            configuration: { ...(existingDetails.configuration || {}), crop: { crop, zoom, rotation, croppedAreaPixels } }
        };
        sessionStorage.setItem(`${type}_custom_data`, JSON.stringify(orderData));
        router.push(`/shop/${type}/${shape.toLowerCase()}/size`);
    };

    const getAspectRatio = () => {
        switch (shape) {
            case "portrait": return 3 / 4;
            case "landscape": return 4 / 3;
            default: return 1;
        }
    };

    const pageTitle = productConfig ? `Customize ${productConfig.title}` : `Customize Your ${shapeTitle} Frame`;
    const pageDesc = productConfig?.content || `Upload your favourite photo and see it come to life in a beautiful ${typeTitle.toLowerCase()} ${shapeTitle} frame.`;

    return (
        <>
            <style>{`
                /* Site palette: primary #0071e3 | secondary #1d1d1f | primary-light #e6f2ff */

                .gc-page {
                    min-height: 100vh;
                    background: #ffffff;
                    padding-top: 90px;
                    padding-bottom: 80px;
                    font-family: 'Poppins', sans-serif;
                }

                /* ── Breadcrumb ── */
                .gc-breadcrumb {
                    max-width: 900px; margin: 0 auto;
                    padding: 0 24px 28px;
                    display: flex; align-items: center; gap: 8px;
                    font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
                    color: #a3a3a3;
                }
                .gc-breadcrumb-sep { color: #d4d4d4; }
                .gc-breadcrumb-active { color: #0071e3; font-weight: 600; }

                /* ── Header ── */
                .gc-header {
                    max-width: 900px; margin: 0 auto;
                    padding: 0 24px 40px;
                    border-bottom: 1px solid #e5e5e5;
                    margin-bottom: 40px;
                    display: flex; align-items: flex-start; justify-content: space-between; gap: 24px;
                    flex-wrap: wrap;
                }
                .gc-eyebrow {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: #e6f2ff; border: 1px solid #bfdbfe;
                    padding: 5px 14px; border-radius: 4px;
                    font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase;
                    color: #0051a2; font-weight: 600;
                    margin-bottom: 14px;
                }
                .gc-title {
                    font-family: 'Poppins', sans-serif;
                    font-size: clamp(1.6rem, 3.5vw, 2.2rem);
                    font-weight: 700; color: #1d1d1f;
                    line-height: 1.2; letter-spacing: -0.4px;
                    margin-bottom: 10px;
                }
                .gc-title em { font-style: normal; font-weight: 800; color: #0071e3; }
                .gc-desc {
                    font-size: 13px; color: #737373; line-height: 1.75;
                    font-weight: 300; max-width: 480px;
                }
                .gc-step-indicator {
                    display: flex; flex-direction: column; align-items: flex-end; gap: 6px;
                    flex-shrink: 0;
                }
                .gc-step-label {
                    font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
                    color: #a3a3a3; font-weight: 500;
                }
                .gc-step-dots { display: flex; gap: 6px; align-items: center; }
                .gc-dot { width: 6px; height: 6px; border-radius: 50%; }
                .gc-dot.done { background: #0071e3; }
                .gc-dot.active { width: 20px; border-radius: 3px; background: #1d1d1f; }
                .gc-dot.pending { background: #e5e5e5; }

                /* ── Main Card ── */
                .gc-main { max-width: 900px; margin: 0 auto; padding: 0 24px; }
                .gc-card {
                    background: #fff;
                    border: 1px solid #e5e5e5;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
                }

                /* ── Card Header ── */
                .gc-card-header {
                    padding: 20px 28px;
                    background: linear-gradient(135deg, #1d1d1f 0%, #2d2d2f 100%);
                    display: flex; align-items: center; justify-content: space-between;
                }
                .gc-card-header-title {
                    font-family: 'Poppins', sans-serif;
                    font-size: 15px; font-weight: 600; color: #f5f5f7;
                    display: flex; align-items: center; gap: 10px;
                    letter-spacing: 0.1px;
                }
                .gc-card-header-icon {
                    width: 32px; height: 32px; border-radius: 50%;
                    background: rgba(0,113,227,0.2);
                    border: 1px solid rgba(0,113,227,0.4);
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                }
                .gc-card-header-badge {
                    font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
                    color: rgba(245,245,247,0.55); font-family: 'Poppins', sans-serif;
                    font-weight: 500;
                }

                /* ── Upload Zone ── */
                .gc-card-body { padding: 28px; }
                .gc-upload-zone {
                    border: 1.5px dashed;
                    border-radius: 12px;
                    padding: 56px 24px;
                    text-align: center;
                    transition: all 0.3s;
                    cursor: pointer;
                    display: flex; flex-direction: column; align-items: center; gap: 20px;
                }
                .gc-upload-zone.idle {
                    border-color: #e5e5e5;
                    background: #fafafa;
                }
                .gc-upload-zone.idle:hover {
                    border-color: #0071e3;
                    background: #e6f2ff;
                }
                .gc-upload-zone.dragging {
                    border-color: #0071e3;
                    background: #e6f2ff;
                    transform: scale(1.01);
                }
                .gc-upload-icon-wrap {
                    width: 64px; height: 64px; border-radius: 50%;
                    background: #f5f5f7; border: 1px solid #e5e5e5;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.3s;
                }
                .gc-upload-zone.dragging .gc-upload-icon-wrap,
                .gc-upload-zone.idle:hover .gc-upload-icon-wrap {
                    background: #e6f2ff; border-color: #0071e3;
                }
                .gc-upload-title {
                    font-family: 'Poppins', sans-serif;
                    font-size: 17px; font-weight: 600; color: #1d1d1f;
                    margin-bottom: 6px;
                }
                .gc-upload-sub { font-size: 12px; color: #737373; font-weight: 300; }
                .gc-upload-hint {
                    font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
                    color: #a3a3a3; font-weight: 500;
                }
                .gc-browse-btn {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 12px 28px;
                    background: #0071e3;
                    color: #fff;
                    font-size: 11px; font-weight: 600; letter-spacing: 2px;
                    text-transform: uppercase;
                    border: none; border-radius: 6px; cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 4px 16px rgba(0,113,227,0.35);
                }
                .gc-browse-btn:hover {
                    background: #0077ed;
                    box-shadow: 0 8px 24px rgba(0,113,227,0.45);
                    transform: translateY(-1px);
                }
                .gc-browse-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

                /* ── Crop Area ── */
                .gc-crop-wrap {
                    position: relative;
                    height: 420px;
                    border-radius: 12px 12px 0 0;
                    overflow: hidden;
                    background: #1a1a2e;
                }

                /* ── Crop Controls ── */
                .gc-controls {
                    background: #fff;
                    border: 1px solid #e5e5e5;
                    border-top: none;
                    border-radius: 0 0 12px 12px;
                    padding: 14px 24px;
                    display: flex; align-items: center; gap: 24px;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                .gc-ctrl-group { display: flex; align-items: center; gap: 10px; }
                .gc-ctrl-label {
                    font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
                    color: #737373; font-weight: 600; white-space: nowrap;
                }
                .gc-slider {
                    -webkit-appearance: none;
                    width: 140px; height: 3px;
                    background: linear-gradient(90deg, #0071e3, #60a5fa);
                    border-radius: 2px; outline: none; cursor: pointer;
                }
                .gc-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 14px; height: 14px; border-radius: 50%;
                    background: #1d1d1f; border: 2px solid #0071e3;
                    cursor: pointer;
                }
                .gc-reset-btn {
                    font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
                    color: #0071e3; font-weight: 600;
                    background: #e6f2ff; border: 1px solid #bfdbfe;
                    border-radius: 4px; cursor: pointer;
                    padding: 6px 14px; transition: all 0.2s;
                }
                .gc-reset-btn:hover { background: #0071e3; color: #fff; }

                /* ── Low Res Warning ── */
                .gc-low-res-badge {
                    position: absolute; top: 16px; left: 16px; z-index: 20;
                    background: rgba(255,255,255,0.96); backdrop-filter: blur(12px);
                    border: 1px solid rgba(255,170,0,0.3);
                    color: #a05e00; padding: 8px 16px;
                    border-radius: 8px; font-size: 12px; font-weight: 600;
                    display: flex; align-items: center; gap: 8px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                }

                /* ── Footer ── */
                .gc-footer {
                    margin-top: 28px; padding-top: 24px;
                    border-top: 1px solid #f5f5f5;
                    display: flex; align-items: center; justify-content: space-between;
                    gap: 16px; flex-wrap: wrap;
                }
                .gc-remove-btn {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 10px 20px;
                    background: #fff; border: 1px solid #e5e5e5;
                    border-radius: 6px; cursor: pointer;
                    font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase;
                    font-weight: 600; color: #737373;
                    transition: all 0.25s;
                }
                .gc-remove-btn:hover {
                    border-color: #0071e3; color: #0071e3;
                    background: #e6f2ff;
                }
                .gc-continue-btn {
                    display: inline-flex; align-items: center; gap: 10px;
                    padding: 14px 36px;
                    background: #0071e3;
                    color: #fff;
                    font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
                    border: none; border-radius: 6px; cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 4px 20px rgba(0,113,227,0.35);
                }
                .gc-continue-btn:hover {
                    background: #0077ed;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 28px rgba(0,113,227,0.45);
                }
                .gc-no-photo-hint {
                    font-size: 12px; color: #a3a3a3; letter-spacing: 0.5px; font-style: italic;
                    font-family: 'Poppins', sans-serif;
                }

                /* ── Tips Row ── */
                .gc-tips {
                    margin-top: 24px; padding: 18px 22px;
                    background: #e6f2ff; border: 1px solid #bfdbfe;
                    border-radius: 10px;
                    display: flex; gap: 28px; flex-wrap: wrap; align-items: center;
                }
                .gc-tip {
                    display: flex; align-items: center; gap: 8px;
                    font-size: 11px; color: #0051a2; font-weight: 400;
                }
                .gc-tip-dot {
                    width: 4px; height: 4px; border-radius: 50%;
                    background: #0071e3; flex-shrink: 0;
                }

                /* ── Upload Modal ── */
                .gc-modal-overlay {
                    position: fixed; inset: 0;
                    background: rgba(10,15,30,0.7);
                    backdrop-filter: blur(12px);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 50;
                }
                .gc-modal {
                    background: #fff; border-radius: 20px;
                    padding: 40px; width: 360px; text-align: center;
                    box-shadow: 0 32px 80px rgba(0,0,0,0.2);
                    border: 1px solid #e5e5e5;
                }
                .gc-modal-title {
                    font-family: 'Poppins', sans-serif;
                    font-size: 19px; font-weight: 700; color: #1d1d1f;
                    margin-bottom: 8px;
                }
                .gc-modal-sub {
                    font-size: 12px; color: #737373; font-weight: 300; margin-bottom: 28px; line-height: 1.7;
                }
                .gc-progress-track {
                    height: 3px; background: #f5f5f5; border-radius: 2px; overflow: hidden; margin-bottom: 10px;
                }
                .gc-progress-bar {
                    height: 100%;
                    background: linear-gradient(90deg, #0071e3, #60a5fa);
                    border-radius: 2px; transition: width 0.3s;
                }
                .gc-progress-text {
                    font-size: 11px; color: #a3a3a3; letter-spacing: 1px; font-weight: 500;
                }
            `}</style>

            <div className="gc-page">
                <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px" }}>

                    {/* ── Breadcrumb ── */}
                    <div className="gc-breadcrumb" style={{ padding: "0 0 28px" }}>
                        <span>Shop</span>
                        <span className="gc-breadcrumb-sep">›</span>
                        <span>{typeTitle}</span>
                        <span className="gc-breadcrumb-sep">›</span>
                        <span>{shapeTitle}</span>
                        <span className="gc-breadcrumb-sep">›</span>
                        <span className="gc-breadcrumb-active">Customise</span>
                    </div>

                    {/* ── Header ── */}
                    <div className="gc-header" style={{ padding: "0 0 40px" }}>
                        <div>
                            <div className="gc-eyebrow">
                                <Sparkles size={10} color="#0051a2" />
                                {productConfig?.title || `${typeTitle} · ${shapeTitle} Frame`}
                            </div>
                            <h1 className="gc-title">
                                Customise Your <em>{shapeTitle}</em> Frame
                            </h1>
                            <p className="gc-desc">{pageDesc}</p>
                        </div>
                        <div className="gc-step-indicator">
                            <span className="gc-step-label">Step 02 / 03</span>
                            <div className="gc-step-dots">
                                <div className="gc-dot done" />
                                <div className="gc-dot active" />
                                <div className="gc-dot pending" />
                            </div>
                        </div>
                    </div>

                    {/* ── Hidden File Input ── */}
                    <input type="file" ref={fileInputRef} onChange={handleChange} accept="image/*" style={{ display: "none" }} />

                    {/* ── Main Card ── */}
                    <div className="gc-card">
                        <div className="gc-card-header">
                            <div className="gc-card-header-title">
                                <div className="gc-card-header-icon">
                                    <Upload size={14} color="#60a5fa" />
                                </div>
                                {photoData ? "Adjust & Crop Your Photo" : "Upload Your Photo"}
                            </div>
                            <span className="gc-card-header-badge">
                                {photoData ? "Drag to reposition" : `Max ${MAX_UPLOAD_SIZE_MB}MB · JPG, PNG`}
                            </span>
                        </div>

                        <div className="gc-card-body">
                            {!photoData ? (
                                <div
                                    className={`gc-upload-zone ${isDragging ? "dragging" : "idle"}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={handleReplaceClick}
                                >
                                    <div className="gc-upload-icon-wrap">
                                        <Upload size={26} color={isDragging ? "#0071e3" : "#737373"} />
                                    </div>
                                    <div>
                                        <p className="gc-upload-title">Drop your photo here</p>
                                        <p className="gc-upload-sub">or click anywhere to browse your files</p>
                                    </div>
                                    <button
                                        className="gc-browse-btn"
                                        onClick={(e) => { e.stopPropagation(); handleReplaceClick(); }}
                                        disabled={isUploading}
                                    >
                                        <Upload size={12} />
                                        Browse Files
                                    </button>
                                    <span className="gc-upload-hint">
                                        JPG · PNG · WEBP &nbsp;·&nbsp; Max {MAX_UPLOAD_SIZE_MB}MB &nbsp;·&nbsp; Min 1000×1000px recommended
                                    </span>
                                </div>
                            ) : (
                                <>
                                    <div className="gc-crop-wrap">
                                        <Cropper
                                            image={photoData.url}
                                            crop={crop}
                                            zoom={zoom}
                                            rotation={rotation}
                                            aspect={getAspectRatio()}
                                            cropSize={{ width: CROP_SIZE, height: CROP_SIZE / getAspectRatio() }}
                                            onCropChange={setCrop}
                                            onCropComplete={onCropComplete}
                                            onZoomChange={setZoom}
                                            onRotationChange={setRotation}
                                            showGrid={false}
                                            style={{
                                                containerStyle: { background: "#1a1a2e" },
                                                cropAreaStyle: {
                                                    border: "2px solid #0071e3",
                                                    boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
                                                    borderRadius: shape === "round" ? "50%" : "4px",
                                                },
                                            }}
                                        />

                                        {lowResWarning && (
                                            <div className="gc-low-res-badge">
                                                <AlertTriangle size={14} color="#c97a00" />
                                                Low resolution — print quality may be reduced
                                            </div>
                                        )}
                                    </div>

                                    {/* Controls — outside the cropper, below the image */}
                                    <div className="gc-controls">
                                        <div className="gc-ctrl-group">
                                            <ZoomIn size={14} color="#737373" />
                                            <span className="gc-ctrl-label">Zoom</span>
                                            <input type="range" className="gc-slider" min={1} max={3} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
                                        </div>
                                        <div className="gc-ctrl-group">
                                            <RotateCw size={14} color="#737373" />
                                            <span className="gc-ctrl-label">Rotate</span>
                                            <input type="range" className="gc-slider" min={0} max={360} step={1} value={rotation} onChange={(e) => setRotation(Number(e.target.value))} />
                                        </div>
                                        <button className="gc-reset-btn" onClick={() => { setZoom(1); setRotation(0); }}>Reset</button>
                                    </div>
                                </>
                            )}

                        </div>
                    </div>

                    {/* ── Tips ── */}
                    {!photoData && (
                        <div className="gc-tips">
                            {[
                                "Use a high-resolution photo (min. 1000×1000px) for best print quality",
                                "JPEG or PNG formats work best",
                                "Bright, well-lit photos produce the most vivid acrylic prints",
                            ].map((tip, i) => (
                                <div key={i} className="gc-tip">
                                    <div className="gc-tip-dot" />
                                    {tip}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── Footer Actions ── */}
                    <div className="gc-footer">
                        <div>
                            {photoData && (
                                <button className="gc-remove-btn" onClick={handlePreviewClick}>
                                    <X size={13} />
                                    Remove Photo
                                </button>
                            )}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            {!photoData && <span className="gc-no-photo-hint">Upload a photo to continue</span>}
                            {photoData && (
                                <button className="gc-continue-btn" onClick={handleContinue}>
                                    Save & Continue
                                    <ArrowRight size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Upload Loading Modal ── */}
            {isUploading && (
                <div className="gc-modal-overlay">
                    <div className="gc-modal">
                        <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#e6f2ff", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                            <Upload size={20} color="#0071e3" />
                        </div>
                        <p className="gc-modal-title">Uploading your photo…</p>
                        <p className="gc-modal-sub">Optimising your image for crystal-clear HD acrylic printing.</p>
                        <div className="gc-progress-track">
                            <div className="gc-progress-bar" style={{ width: `${uploadProgress}%` }} />
                        </div>
                        <p className="gc-progress-text">{uploadProgress}% complete</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default GenericCustomize;
