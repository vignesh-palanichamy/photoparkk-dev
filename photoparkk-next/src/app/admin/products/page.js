'use client';

import React, { useState, Suspense } from "react";
import ProductManager from "@/components/admin/ProductManager";
import { Package, Loader2 } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const ProductsContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Get default tab from URL or fallback
    const defaultTab = searchParams.get('tab') || 'newarrival';
    const [activeTab, setActiveTab] = useState(defaultTab);

    // Sync state with URL if changed internally
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        const params = new URLSearchParams(searchParams);
        params.set('tab', tab);
        router.replace(`${pathname}?${params.toString()}`);
    };

    const TAB_CLASSES = (tab) => `px-6 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${activeTab === tab
        ? "border-primary text-primary"
        : "border-transparent text-neutral-500 hover:text-neutral-700"
        }`;

    // Field Configs
    const DEFAULT_FIELDS = ['title', 'content', 'image', 'thickness', 'stock', 'sizes'];
    const DEFAULT_JSON = ['sizes'];

    const ACRYLIC_FIELDS = ['title', 'content', 'image', 'shape', 'sizes', 'thickness', 'stock'];
    const ACRYLIC_JSON = ['sizes', 'thickness'];

    const CANVAS_FIELDS = ['title', 'content', 'image', 'shape', 'sizes', 'thickness', 'stock'];
    const CANVAS_JSON = ['sizes'];

    const BACKLIGHT_FIELDS = ['title', 'content', 'image', 'shape', 'sizes', 'thickness', 'stock'];
    const BACKLIGHT_JSON = ['sizes', 'thickness'];

    return (
        <div className="w-full space-y-8">
            <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center text-success">
                    <Package className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-secondary">Product Management</h1>
                    <p className="text-neutral-500">Manage your product catalog, prices and inventory.</p>
                </div>
            </div>

            <div className="flex border-b border-neutral-200 overflow-x-auto">
                <button onClick={() => handleTabChange("newarrival")} className={TAB_CLASSES("newarrival")}>New Arrivals</button>
                <button onClick={() => handleTabChange("specialoffer")} className={TAB_CLASSES("specialoffer")}>Special Offers</button>
                <button onClick={() => handleTabChange("acrylic")} className={TAB_CLASSES("acrylic")}>Acrylic</button>
                <button onClick={() => handleTabChange("canvas")} className={TAB_CLASSES("canvas")}>Canvas</button>
                <button onClick={() => handleTabChange("backlight")} className={TAB_CLASSES("backlight")}>Backlight</button>
            </div>

            <div className="min-h-[400px]">
                {activeTab === "newarrival" && (
                    <ProductManager
                        apiEndpoint="newarrivals"
                        title="New Arrivals"
                        allowedFields={DEFAULT_FIELDS}
                        jsonFields={DEFAULT_JSON}
                    />
                )}
                {activeTab === "specialoffer" && (
                    <ProductManager
                        apiEndpoint="specialoffers"
                        title="Special Offers"
                        allowedFields={DEFAULT_FIELDS}
                        jsonFields={DEFAULT_JSON}
                    />
                )}
                {activeTab === "acrylic" && (
                    <ProductManager
                        apiEndpoint="frames/acrylic"
                        title="Acrylic Frames"
                        allowedFields={ACRYLIC_FIELDS}
                        jsonFields={ACRYLIC_JSON}
                    />
                )}
                {activeTab === "canvas" && (
                    <ProductManager
                        apiEndpoint="frames/canvas"
                        title="Canvas Frames"
                        allowedFields={CANVAS_FIELDS}
                        jsonFields={CANVAS_JSON}
                    />
                )}
                {activeTab === "backlight" && (
                    <ProductManager
                        apiEndpoint="frames/backlight"
                        title="Backlight Frames"
                        allowedFields={BACKLIGHT_FIELDS}
                        jsonFields={BACKLIGHT_JSON}
                    />
                )}
            </div>
        </div>
    );
};

const AdminProductsPage = () => {
    return (
        <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>}>
            <ProductsContent />
        </Suspense>
    );
};

export default AdminProductsPage;
