'use client';

import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { Loader2, Plus, Edit, Trash2, X, Save } from "lucide-react";
import { toast } from "react-toastify";

const DEFAULT_FIELDS = ['title', 'content', 'image', 'thickness', 'stock', 'sizes'];
const DEFAULT_JSON_FIELDS = ['sizes'];

const ProductManager = ({
    apiEndpoint,
    title,
    allowedFields = DEFAULT_FIELDS,
    jsonFields = DEFAULT_JSON_FIELDS,
    canAdd = true,
    canDelete = true
}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Initial State builder
    const getInitialState = () => {
        const state = {};
        allowedFields.forEach(f => {
            state[f] = "";
        });
        // Set defaults
        if (state.stock !== undefined) state.stock = "In Stock";
        if (state.thickness !== undefined) state.thickness = "5mm";
        return state;
    };

    const [formData, setFormData] = useState(getInitialState());

    // Store JSON strings for json fields
    const [jsonInputs, setJsonInputs] = useState({});

    useEffect(() => {
        fetchProducts();
    }, [apiEndpoint]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(apiEndpoint);
            setProducts(res.data);
        } catch (error) {
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        const newData = {};
        const newJson = {};

        allowedFields.forEach(f => {
            if (jsonFields.includes(f)) {
                newData[f] = product[f] || []; // Keep object/array
                newJson[f] = JSON.stringify(product[f] || [], null, 2);
            } else {
                newData[f] = product[f] || "";
            }
        });

        setFormData(newData);
        setJsonInputs(newJson);
        setShowModal(true);
    };

    const handleAdd = () => {
        if (!canAdd) return;
        setEditingProduct(null);
        setFormData(getInitialState());

        const newJson = {};
        jsonFields.forEach(f => {
            if (f === 'sizes') newJson[f] = '[\n  {"label": "12x8", "price": 999}\n]';
            else if (f === 'thickness') newJson[f] = '["3mm", "5mm"]';
            else newJson[f] = '[]';
        });
        setJsonInputs(newJson);

        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!canDelete) return;
        if (!confirm("Delete this product?")) return;
        try {
            await axiosInstance.delete(`${apiEndpoint}/${id}`);
            toast.success("Deleted successfully");
            fetchProducts();
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData };

            // Parse JSON fields
            for (const f of jsonFields) {
                if (allowedFields.includes(f)) {
                    try {
                        payload[f] = JSON.parse(jsonInputs[f]);
                    } catch (e) {
                        toast.error(`Invalid JSON for ${f}`);
                        return;
                    }
                }
            }

            // Clean payload to only allowed fields
            const cleanPayload = {};
            allowedFields.forEach(key => {
                if (payload[key] !== undefined) cleanPayload[key] = payload[key];
            });

            if (editingProduct) {
                await axiosInstance.put(`${apiEndpoint}/${editingProduct.id}`, cleanPayload);
                toast.success("Updated successfully");
            } else {
                await axiosInstance.post(apiEndpoint, cleanPayload);
                toast.success("Created successfully");
            }
            setShowModal(false);
            fetchProducts();
        } catch (error) {
            console.error(error);
            toast.error("Operation failed");
        }
    };

    // Check if field exists
    const has = (f) => allowedFields.includes(f);
    const isJson = (f) => jsonFields.includes(f);

    return (
        <div className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-secondary">{title}</h2>
                {canAdd && (
                    <button
                        onClick={handleAdd}
                        className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-hover transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Product
                    </button>
                )}
            </div>

            {loading ? (
                <Loader2 className="animate-spin mx-auto text-neutral-400" />
            ) : products.length === 0 ? (
                <div className="text-center text-neutral-500 py-8">No products found</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-50 text-neutral-600 text-sm font-semibold">
                            <tr>
                                <th className="p-3 rounded-l-lg">Image</th>
                                <th className="p-3">Title</th>
                                {has('sizes') && <th className="p-3">Price Range</th>}
                                {has('stock') && <th className="p-3">Stock</th>}
                                {has('shape') && <th className="p-3">Shape</th>}
                                <th className="p-3 rounded-r-lg text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {products.map(p => (
                                <tr key={p.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                                    <td className="p-3">
                                        <div className="w-12 h-12 bg-neutral-100 rounded overflow-hidden">
                                            {p.image && <img src={p.image} alt={p.title} className="w-full h-full object-cover" />}
                                        </div>
                                    </td>
                                    <td className="p-3 font-medium text-secondary">{p.title}</td>
                                    {has('sizes') && (
                                        <td className="p-3 text-neutral-600">
                                            {p.sizes && Array.isArray(p.sizes) && p.sizes.length > 0
                                                ? `₹${p.sizes[0].price || 0}` // Simplified
                                                : 'N/A'}
                                        </td>
                                    )}
                                    {has('stock') && (
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${p.stock === 'In Stock' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {p.stock}
                                            </span>
                                        </td>
                                    )}
                                    {has('shape') && (<td className="p-3">{p.shape}</td>)}
                                    <td className="p-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleEdit(p)} className="p-2 text-primary hover:bg-primary/10 rounded"><Edit className="w-4 h-4" /></button>
                                            {canDelete && (
                                                <button onClick={() => handleDelete(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 border-b border-neutral-200 flex justify-between items-center sticky top-0 bg-white">
                                <h3 className="font-bold text-lg">{editingProduct ? "Edit Product" : "Add Product"}</h3>
                                <button type="button" onClick={() => setShowModal(false)}><X className="w-6 h-6" /></button>
                            </div>

                            <div className="p-6 space-y-4">
                                {has('title') && (
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Title</label>
                                        <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none" />
                                    </div>
                                )}

                                {has('content') && (
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Content/Description</label>
                                        <textarea required value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none h-24" />
                                    </div>
                                )}

                                {has('image') && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">Image</label>
                                        <div className="flex gap-2">
                                            <input
                                                required
                                                type="text"
                                                value={formData.image}
                                                onChange={e => setFormData({ ...formData, image: e.target.value })}
                                                className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
                                                placeholder="https://... or upload below"
                                            />
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files[0];
                                                        if (!file) return;

                                                        const upFormData = new FormData();
                                                        upFormData.append("image", file);

                                                        toast.info("Uploading image...");
                                                        try {
                                                            const res = await axiosInstance.post("upload-image", upFormData, {
                                                                headers: { "Content-Type": "multipart/form-data" },
                                                            });
                                                            setFormData({ ...formData, image: res.data.imageUrl });
                                                            toast.success("Image uploaded!");
                                                        } catch (err) {
                                                            console.error(err);
                                                            const errMsg = err.response?.data?.message || "Upload failed";
                                                            toast.error(errMsg);
                                                        }
                                                    }}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                                <button type="button" className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm font-medium border border-neutral-300">
                                                    Upload
                                                </button>
                                            </div>
                                        </div>
                                        {formData.image && (
                                            <div className="mt-2 w-32 h-32 border rounded-lg overflow-hidden bg-neutral-50">
                                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    {has('thickness') && (
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Thickness {isJson('thickness') ? '(JSON)' : ''}</label>
                                            {isJson('thickness') ? (
                                                <input type="text" value={jsonInputs.thickness} onChange={e => setJsonInputs({ ...jsonInputs, thickness: e.target.value })} className="w-full border rounded-lg p-2 font-mono text-xs" />
                                            ) : (
                                                <input type="text" value={formData.thickness} onChange={e => setFormData({ ...formData, thickness: e.target.value })} className="w-full border rounded-lg p-2" />
                                            )}
                                        </div>
                                    )}
                                    {has('shape') && (
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Shape</label>
                                            <input type="text" value={formData.shape} onChange={e => setFormData({ ...formData, shape: e.target.value })} className="w-full border rounded-lg p-2" placeholder="Square, Round..." />
                                        </div>
                                    )}
                                    {has('stock') && (
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Stock</label>
                                            <select value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} className="w-full border rounded-lg p-2">
                                                <option value="In Stock">In Stock</option>
                                                <option value="Out of Stock">Out of Stock</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {has('sizes') && isJson('sizes') && (
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Sizes (JSON Config)</label>
                                        <p className="text-xs text-neutral-400 mb-2">Example: {'[{"label": "12x8", "price": 999}]'}</p>
                                        <textarea
                                            value={jsonInputs.sizes}
                                            onChange={e => setJsonInputs({ ...jsonInputs, sizes: e.target.value })}
                                            className="w-full border rounded-lg p-2 font-mono text-xs h-32 bg-neutral-50"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t bg-neutral-50 flex justify-end gap-3 rounded-b-xl">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-white text-neutral-600">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover flex items-center gap-2">
                                    <Save className="w-4 h-4" /> Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManager;
