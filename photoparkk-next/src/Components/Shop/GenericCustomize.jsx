
"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Upload, X, Image, Eye, Sparkles, CheckCircle2 } from "lucide-react";
import LoadingBar from "../LoadingBar";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";

const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_UPLOAD_SIZE_MB = 10;

const GenericCustomize = ({ type, shape }) => {
    // type: "acrylic", "canvas", "backlight"
    // shape: "portrait", "landscape", "square", "love", "hexagon", "round"
    const [photoData, setPhotoData] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [productConfig, setProductConfig] = useState(null);
    const fileInputRef = useRef(null);
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const shapeTitle = shape.charAt(0).toUpperCase() + shape.slice(1);
    const typeTitle = type.charAt(0).toUpperCase() + type.slice(1);

    React.useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await axiosInstance.get(`frames/${type}?shape=${shape}`);
                if (res.data && res.data.length > 0) {
                    setProductConfig(res.data[0]);
                }
            } catch (err) {
                console.error("Failed to fetch config", err);
            }
        };
        fetchConfig();
    }, [type, shape]);

    const handleFileUpload = async (file) => {
        if (!file.type.match("image.*")) {
            toast.error("Please select a valid image");
            return;
        }

        if (file.size > MAX_UPLOAD_SIZE_BYTES) {
            toast.error(
                `File size should be less than ${MAX_UPLOAD_SIZE_MB}MB. Your file is ${(
                    file.size /
                    (1024 * 1024)
                ).toFixed(1)}MB.`
            );
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        const formData = new FormData();
        formData.append("image", file);
        try {
            const res = await axios.post("/api/upload-image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                },
            });

            const imageUrl = res.data.imageUrl;
            setPhotoData({
                url: imageUrl,
                name: file.name,
                size: file.size,
                type: file.type,
            });
            toast.success("Image uploaded successfully!");
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("Image upload failed. Please try again.");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleChange = (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleReplaceClick = () => {
        fileInputRef.current.click();
    };

    const handleRemovePhoto = () => {
        setPhotoData(null);
    };

    const handlePreviewClick = () => {
        if (!photoData) {
            toast.error("Please upload a photo first.");
            return;
        }
        // Store data for the order page
        sessionStorage.setItem(`${type}_custom_data`, JSON.stringify({
            shape,
            photoData
        }));
        router.push(`/shop/${type}/${shape.toLowerCase()}/order`);
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + " bytes";
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
        else return (bytes / 1048576).toFixed(1) + " MB";
    };

    // Helper to render the shape preview
    const renderShapePreview = () => {
        const s = shape.toLowerCase();

        if (!photoData) {
            return (
                <div className={`relative bg-white rounded-2xl overflow-hidden shadow-2xl border-8 border-neutral-secondary flex flex-col items-center justify-center text-neutral-400 ${getAspectRatioClass(s)}`}>
                    <div className="p-4 bg-neutral-200 rounded-full mb-4">
                        <Image className="w-12 h-12" />
                    </div>
                    <p className="text-lg font-medium mb-2">
                        No image selected
                    </p>
                    <p className="text-sm text-center px-4">
                        Upload a photo to see your {type} {shapeTitle} preview
                    </p>
                </div>
            );
        }

        if (s === 'love') {
            return (
                <div className="heart-frame-container">
                    <div className="heart-border"></div>
                    <div className="heart-frame">
                        <img src={photoData.url} alt="Love Preview" />
                    </div>
                </div>
            );
        }

        let containerClass = "relative w-full overflow-hidden shadow-2xl border-8 border-neutral-secondary bg-white";
        let imgClass = "w-full h-full object-cover";

        if (s === 'portrait') containerClass += " mask-portrait";
        else if (s === 'landscape') containerClass += " mask-landscape";
        else if (s === 'square') containerClass += " mask-square aspect-square";
        else if (s === 'hexagon') containerClass += " mask-hexagon aspect-square";
        else if (s === 'round') containerClass += " rounded-full aspect-square";

        // Backlight effect
        if (type === 'backlight') {
            containerClass += " shadow-[0_0_30px_rgba(255,223,0,0.6)] border-4 border-yellow-500/50";
        }

        return (
            <div className={containerClass}>
                <img src={photoData.url} alt={`${shapeTitle} Preview`} className={imgClass} />
            </div>
        );
    };

    const getAspectRatioClass = (s) => {
        if (s === 'portrait') return 'aspect-[3/4]';
        if (s === 'landscape') return 'aspect-[4/3]';
        return 'aspect-square';
    }

    return (
        <div className="bg-neutral-50 pt-[120px] pb-8 px-4 font-[Poppins]">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-full mb-4">
                        <Sparkles className="w-5 h-5" />
                        <span className="font-semibold">{productConfig?.title || `${typeTitle} ${shapeTitle} Frame`}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-3">
                        {productConfig ? `Customize ${productConfig.title}` : `Customize Your ${typeTitle} ${shapeTitle}`}
                    </h1>
                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                        {productConfig?.content || `Upload your favorite photo and see it come to life in a beautiful ${typeTitle.toLowerCase()} frame`}
                    </p>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleChange}
                    accept="image/*"
                    className="hidden"
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Upload Section */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-200 order-2 lg:order-1">
                        <div className="bg-primary px-6 py-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Image className="w-6 h-6" />
                                Upload Your Photo
                            </h2>
                        </div>
                        {/* Same Upload UI as AcrylicCustomize */}
                        <div className="p-6">
                            {!photoData ? (
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${isDragging
                                        ? "border-primary bg-primary-light scale-[1.02]"
                                        : "border-neutral-300 hover:border-primary hover:bg-neutral-50"
                                        }`}
                                >
                                    <div className="flex flex-col items-center justify-center space-y-6">
                                        <div
                                            className={`p-4 rounded-full transition-all ${isDragging
                                                ? "bg-primary-light scale-110"
                                                : "bg-neutral-100"
                                                }`}
                                        >
                                            <Image
                                                className={`w-12 h-12 transition-colors ${isDragging ? "text-primary" : "text-neutral-500"
                                                    }`}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-neutral-700 mb-2">
                                                Drag and drop your photo here
                                            </p>
                                            <p className="text-sm text-neutral-500 mb-4">or</p>
                                            <button
                                                onClick={handleReplaceClick}
                                                disabled={isUploading}
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                                            >
                                                <Upload className="w-5 h-5" />
                                                Browse Files
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>PNG, JPG, GIF up to 10MB</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="p-2 bg-success-light rounded-lg flex-shrink-0">
                                                <CheckCircle2 className="w-5 h-5 text-success" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-secondary truncate">
                                                    {photoData.name}
                                                </p>
                                                <p className="text-sm text-neutral-500">
                                                    {formatFileSize(photoData.size)}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleRemovePhoto}
                                            className="p-2 rounded-lg text-neutral-400 hover:text-error hover:bg-error-light transition-colors flex-shrink-0 ml-2"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="relative w-full aspect-square bg-white rounded-xl overflow-hidden border-2 border-neutral-200 shadow-inner">
                                        <img
                                            src={photoData.url}
                                            alt="Uploaded preview"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>

                                    <button
                                        onClick={handleReplaceClick}
                                        disabled={isUploading}
                                        className="w-full py-3 px-4 bg-secondary text-white rounded-lg hover:bg-secondary transition-all duration-300 font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                    >
                                        <Upload className="w-5 h-5" />
                                        Replace Photo
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-200 order-1 lg:order-2">
                        <div className="bg-primary px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Eye className="w-6 h-6" />
                                    Live Preview
                                </h2>
                                <button
                                    onClick={handlePreviewClick}
                                    disabled={!photoData}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${photoData
                                        ? "bg-white text-primary hover:bg-neutral-50 shadow-lg hover:shadow-xl transform hover:scale-105"
                                        : "bg-white/20 text-white/50 cursor-not-allowed"
                                        }`}
                                >
                                    Proceed to Order
                                </button>
                            </div>
                        </div>

                        <div className={`p-8 flex items-center justify-center bg-gray-100 min-h-[400px] ${type === 'backlight' ? 'bg-neutral-900' : ''}`}>
                            <div className="relative w-full max-w-sm">
                                {renderShapePreview()}
                                {photoData && (
                                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border border-neutral-200 z-10 w-max">
                                        <span className="text-sm font-medium text-neutral-700">
                                            {shapeTitle} Frame
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isUploading && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-80">
                        <p className="mb-2 font-semibold">Uploading...</p>
                        <LoadingBar progress={uploadProgress} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default GenericCustomize;
