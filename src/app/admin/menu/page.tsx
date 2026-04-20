"use client";
// UI Update: Added Update button and cleaned up tabs

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { useRestaurant } from "@/components/restaurant-provider";
import { Category, SubCategory, Product } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Image as ImageIcon, Upload, X, Search, Rocket, CheckCircle2, ExternalLink, Copy, Globe, GripVertical, Settings2, ListPlus, ChevronDown, ChevronUp, MoreVertical, ArrowUpDown, UtensilsCrossed } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Reorder, AnimatePresence, motion } from "framer-motion";
import { ProductVariation, ProductVariationOption } from "@/types";

export default function AdminMenuPage() {
    const { draftData, updateDraftData, publishDraft } = useRestaurant();
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [isSubCategoryDialogOpen, setIsSubCategoryDialogOpen] = useState(false);
    const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
    const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [expandedCategoryIds, setExpandedCategoryIds] = useState<string[]>([]);
    const [isSorting, setIsSorting] = useState(false);

    // Category State
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryName, setCategoryName] = useState("");

    // Sub-category State
    const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
    const [subCategoryName, setSubCategoryName] = useState("");
    const [parentCategoryIdForSub, setParentCategoryIdForSub] = useState<string>("");

    // Product State
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(draftData.categories[0]?.id || "");
    const [productForm, setProductForm] = useState<{
        name: string;
        description: string;
        price: string;
        imageUrl: string;
        variations: ProductVariation[];
        subCategoryId: string;
    }>({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        variations: [],
        subCategoryId: "",
    });

    // Image upload state
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [imageMode, setImageMode] = useState<"upload" | "search">("upload");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchAbortRef = useRef<AbortController | null>(null);
    // Auto-search effect when product name changes
    useEffect(() => {
        // Only trigger if we have a name, dialog is open, and it's long enough
        if (!isProductDialogOpen || !productForm.name || productForm.name.trim().length <= 3) return;

        const delayDebounceFn = setTimeout(() => {
            const category = draftData.categories.find(c => c.id === selectedCategoryId);
            const contextQuery = category ? `${productForm.name} ${category.name}` : productForm.name;
            
            setSearchQuery(productForm.name);
            
            // Auto switch to search mode if no image is selected yet
            if (!productForm.imageUrl) {
                setImageMode("search");
            }
            
            performImageSearch(contextQuery);
        }, 1000); // 1s debounce to be more deliberate

        return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productForm.name, isProductDialogOpen, selectedCategoryId]);

    const readFileAsDataUrl = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    const handleFileSelect = useCallback(async (file: File) => {
        if (!file.type.startsWith("image/")) return;
        const dataUrl = await readFileAsDataUrl(file);
        setProductForm(prev => ({ ...prev, imageUrl: dataUrl }));
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    }, [handleFileSelect]);

    const resetImageState = () => {
        setImageMode("upload");
        setIsDragging(false);
        setSearchQuery("");
        setSearchResults([]);
    };

    const handleSaveCategory = () => {
        if (!categoryName.trim()) return;

        let newCategories = [...draftData.categories];
        if (editingCategory) {
            newCategories = newCategories.map(c =>
                c.id === editingCategory.id ? { ...c, name: categoryName } : c
            );
        } else {
            const newId = `cat-${Date.now()}`;
            newCategories.push({
                id: newId,
                restaurantId: "1",
                name: categoryName,
                orderIndex: newCategories.length
            });
            if (!selectedCategoryId) setSelectedCategoryId(newId);
        }

        updateDraftData({ categories: newCategories });
        setIsCategoryDialogOpen(false);
        setCategoryName("");
        setEditingCategory(null);
    };

    const handleSaveSubCategory = () => {
        if (!subCategoryName.trim() || !parentCategoryIdForSub) return;

        let newCategories = [...draftData.categories];
        newCategories = newCategories.map(cat => {
            if (cat.id !== parentCategoryIdForSub) return cat;

            const currentSubs = cat.subCategories || [];
            let newSubs = [...currentSubs];

            if (editingSubCategory) {
                newSubs = newSubs.map(s => s.id === editingSubCategory.id ? { ...s, name: subCategoryName } : s);
            } else {
                newSubs.push({
                    id: `sub-${Date.now()}`,
                    name: subCategoryName,
                    orderIndex: newSubs.length
                });
            }

            return { ...cat, subCategories: newSubs };
        });

        updateDraftData({ categories: newCategories });
        setIsSubCategoryDialogOpen(false);
        setSubCategoryName("");
        setEditingSubCategory(null);
    };

    const handleDeleteSubCategory = (catId: string, subId: string) => {
        if (confirm("Bu alt kategoriyi silmek istediğinize emin misiniz?")) {
            let newCategories = [...draftData.categories];
            newCategories = newCategories.map(cat => {
                if (cat.id !== catId) return cat;
                return {
                    ...cat,
                    subCategories: (cat.subCategories || []).filter(s => s.id !== subId)
                };
            });

            // Also unassign products from this sub-category
            const newProducts = draftData.products.map(p => 
                p.subCategoryId === subId ? { ...p, subCategoryId: undefined } : p
            );

            updateDraftData({ categories: newCategories, products: newProducts });
        }
    };

    const handleDeleteCategory = (id: string) => {
        if (confirm("Bu kategoriyi silmek istediğinize emin misiniz? İçindeki ürünler de silinebilir.")) {
            updateDraftData({
                categories: draftData.categories.filter(c => c.id !== id),
                products: draftData.products.filter(p => p.categoryId !== id)
            });
            if (selectedCategoryId === id) {
                setSelectedCategoryId(draftData.categories.length > 1 ? draftData.categories[0].id : "");
            }
        }
    };

    const handleSaveProduct = () => {
        if (!productForm.name || !productForm.price || !selectedCategoryId) return;

        let newProducts = [...draftData.products];
        if (editingProduct) {
            newProducts = newProducts.map(p =>
                p.id === editingProduct.id ? {
                    ...p,
                    categoryId: selectedCategoryId,
                    subCategoryId: productForm.subCategoryId || undefined,
                    name: productForm.name,
                    description: productForm.description,
                    price: parseFloat(productForm.price),
                    imageUrl: productForm.imageUrl || undefined,
                    variations: productForm.variations
                } : p
            );
        } else {
            newProducts.push({
                id: `prod-${Date.now()}`,
                restaurantId: "1",
                categoryId: selectedCategoryId,
                subCategoryId: productForm.subCategoryId || undefined,
                name: productForm.name,
                description: productForm.description,
                price: parseFloat(productForm.price),
                imageUrl: productForm.imageUrl || undefined,
                variations: productForm.variations,
                orderIndex: newProducts.length
            });
        }

        updateDraftData({ products: newProducts });
        setIsProductDialogOpen(false);
        setEditingProduct(null);
        setProductForm({ name: "", description: "", price: "", imageUrl: "", variations: [], subCategoryId: "" });
        
        // Ensure the category is expanded after adding a product
        if (!expandedCategoryIds.includes(selectedCategoryId)) {
            setExpandedCategoryIds(prev => [...prev, selectedCategoryId]);
        }
        
        resetImageState();
    };

    const handleDeleteProduct = (id: string) => {
        if (confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
            updateDraftData({
                products: draftData.products.filter(p => p.id !== id)
            });
        }
    };

    const openEditCategory = (category: Category) => {
        setEditingCategory(category);
        setCategoryName(category.name);
        setIsCategoryDialogOpen(true);
    };

    const openEditProduct = (product: Product) => {
        setEditingProduct(product);
        setSelectedCategoryId(product.categoryId);
        setProductForm({
            name: product.name,
            description: product.description || "",
            price: product.price.toString(),
            imageUrl: product.imageUrl || "",
            variations: product.variations || [],
            subCategoryId: product.subCategoryId || ""
        });
        setSearchQuery(product.name);
        setIsProductDialogOpen(true);
        
        // Auto-trigger search when opening a product
        if (product.name) {
            const category = draftData.categories.find(c => c.id === product.categoryId);
            const contextQuery = category ? `${product.name} ${category.name}` : product.name;
            performImageSearch(contextQuery);
        }
    };

    const handleAddVariationGroup = () => {
        const newGroup: ProductVariation = {
            id: `var-${Date.now()}`,
            name: "",
            type: "single",
            options: [],
            orderIndex: productForm.variations.length
        };
        setProductForm(prev => ({ ...prev, variations: [...prev.variations, newGroup] }));
    };

    const handleUpdateVariationGroup = (groupId: string, updates: Partial<ProductVariation>) => {
        setProductForm(prev => ({
            ...prev,
            variations: prev.variations.map(v => v.id === groupId ? { ...v, ...updates } : v)
        }));
    };

    const handleRemoveVariationGroup = (groupId: string) => {
        setProductForm(prev => ({
            ...prev,
            variations: prev.variations.filter(v => v.id !== groupId)
        }));
    };

    const handleAddOption = (groupId: string) => {
        setProductForm(prev => ({
            ...prev,
            variations: prev.variations.map(v => {
                if (v.id === groupId) {
                    const newOption: ProductVariationOption = {
                        id: `opt-${Date.now()}`,
                        name: "",
                        price: 0,
                        orderIndex: v.options.length
                    };
                    return { ...v, options: [...v.options, newOption] };
                }
                return v;
            })
        }));
    };

    const handleUpdateOption = (groupId: string, optionId: string, updates: Partial<ProductVariationOption>) => {
        setProductForm(prev => ({
            ...prev,
            variations: prev.variations.map(v => {
                if (v.id === groupId) {
                    return {
                        ...v,
                        options: v.options.map(opt => opt.id === optionId ? { ...opt, ...updates } : opt)
                    };
                }
                return v;
            })
        }));
    };

    const handleRemoveOption = (groupId: string, optionId: string) => {
        setProductForm(prev => ({
            ...prev,
            variations: prev.variations.map(v => {
                if (v.id === groupId) {
                    return { ...v, options: v.options.filter(opt => opt.id !== optionId) };
                }
                return v;
            })
        }));
    };

    const handlePublish = async () => {
        setIsPublishing(true);
        // Simulate delay for realism
        await new Promise(resolve => setTimeout(resolve, 1200));

        // Push draft data to LIVE store
        publishDraft();

        setIsPublishing(false);
        setIsPublishDialogOpen(true);
    };

    const performImageSearch = async (query: string) => {
        const cleanQuery = query.trim();
        if (!cleanQuery) return;

        // Cancel any previous in-flight search
        if (searchAbortRef.current) {
            searchAbortRef.current.abort();
        }
        const abortController = new AbortController();
        searchAbortRef.current = abortController;

        setIsSearching(true);
        setSearchResults([]);

        try {
            const url = `/api/image-search?q=${encodeURIComponent(cleanQuery)}`;
            const res = await fetch(url, { signal: abortController.signal });

            if (!res.ok) throw new Error(`API error: ${res.status}`);

            const data = await res.json();

            if (data.images && Array.isArray(data.images) && data.images.length > 0) {
                setSearchResults(data.images);
            } else {
                setSearchResults([]);
            }
        } catch (error: any) {
            if (error?.name === "AbortError") return; // Ignore aborted requests
            console.error("Image search error:", error);
            setSearchResults([]);
        } finally {
            if (!abortController.signal.aborted) {
                setIsSearching(false);
            }
        }
    };

    const handleSearchClick = () => {
        const category = draftData.categories.find(c => c.id === selectedCategoryId);
        const contextQuery = category && searchQuery.length < 15 ? `${searchQuery} ${category.name}` : searchQuery;
        performImageSearch(contextQuery);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        const btn = document.getElementById('copy-btn');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Kopyalandı!';
            setTimeout(() => { 
                if (btn) btn.innerHTML = originalText; 
            }, 2000);
        }
    };

    const navTabs = [
        { id: 'menu', name: 'Menü İçeriği', active: true },
        { id: 'campaigns', name: 'Kampanyalar', active: false },
        { id: 'settings', name: 'Restoran Bilgileri', active: false },
    ];

    const handleReorderCategories = (newCategories: Category[]) => {
        const categoriesWithNewOrder = newCategories.map((cat, index) => ({
            ...cat,
            orderIndex: index
        }));
        updateDraftData({ categories: categoriesWithNewOrder });
    };

    const handleReorderSubCategories = (categoryId: string, newSubCategories: SubCategory[]) => {
        const subCategoriesWithNewOrder = newSubCategories.map((sub, index) => ({
            ...sub,
            orderIndex: index
        }));

        let newCategories = [...draftData.categories];
        newCategories = newCategories.map(cat => 
            cat.id === categoryId ? { ...cat, subCategories: subCategoriesWithNewOrder } : cat
        );
        updateDraftData({ categories: newCategories });
    };

    const siteUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${draftData.slug}`;

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            {/* Header Section from Screenshot */}
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6 border-b border-zinc-100 dark:border-zinc-800 pb-6 text-center sm:text-left">
                <div className="space-y-1.5 flex flex-col items-center sm:items-start">
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
                        <UtensilsCrossed className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />
                        Dijital Menü Yönetimi
                    </h1>
                    <p className="text-zinc-500 text-sm md:text-base max-w-lg">
                        Menünüzdeki ürünleri ve kategorileri buradan düzenleyebilirsiniz. Değişikliklerin canlı sitede görünmesi için güncellemeyi unutmayın.
                    </p>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button 
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="flex-1 sm:flex-none h-11 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isPublishing ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                Güncelleniyor...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-5 h-5 mr-2" />
                                Değişiklikleri Güncelle
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Kategoriler</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button 
                            variant={isSorting ? "default" : "outline"} 
                            className={`h-9 px-4 text-xs font-semibold shadow-sm transition-all rounded-lg ${isSorting ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300'}`}
                            onClick={() => setIsSorting(!isSorting)}
                        >
                            <ArrowUpDown className="w-3.5 h-3.5 mr-2" /> {isSorting ? "Tamamla" : "Sırala"}
                        </Button>
                        {!isSorting && (
                            <Button 
                                onClick={() => { setEditingCategory(null); setCategoryName(""); setIsCategoryDialogOpen(true); }}
                                className="h-9 px-4 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 transition-all rounded-lg"
                            >
                                <Plus className="w-4 h-4 mr-2" /> Kategori Ekle
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-2.5">
                <Reorder.Group axis="y" values={draftData.categories} onReorder={handleReorderCategories} className="space-y-2.5">
                    {draftData.categories.map((category) => {
                        const isExpanded = expandedCategoryIds.includes(category.id);
                        const categoryProducts = draftData.products.filter(p => p.categoryId === category.id);

                        return (
                            <Reorder.Item 
                                key={category.id} 
                                value={category}
                                dragListener={isSorting}
                                className="list-none"
                            >
                                <Card className={`overflow-hidden border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950 transition-all duration-200 group/cat-card ${isExpanded ? 'ring-1 ring-indigo-600/10' : ''} rounded-lg`}>
                                    {/* Category Header */}
                                    <div 
                                        className={`flex items-center justify-between p-2 cursor-pointer select-none ${isExpanded ? 'bg-zinc-50/20 dark:bg-zinc-900/10 border-b border-zinc-100 dark:border-zinc-800/60' : ''}`}
                                        onClick={() => {
                                            if (isSorting) return;
                                            setExpandedCategoryIds(prev => 
                                                prev.includes(category.id) 
                                                ? prev.filter(id => id !== category.id) 
                                                : [...prev, category.id]
                                            );
                                        }}
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className={`p-1 transition-colors opacity-40 group-hover/cat-card:opacity-100 ${isSorting ? 'text-indigo-600' : 'text-zinc-400'}`}>
                                                <svg width="10" height="14" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="3" cy="3" r="1.5" fill="currentColor" />
                                                    <circle cx="3" cy="9" r="1.5" fill="currentColor" />
                                                    <circle cx="3" cy="15" r="1.5" fill="currentColor" />
                                                    <circle cx="9" cy="3" r="1.5" fill="currentColor" />
                                                    <circle cx="9" cy="9" r="1.5" fill="currentColor" />
                                                    <circle cx="9" cy="15" r="1.5" fill="currentColor" />
                                                </svg>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{category.name}</h3>
                                                <span className="flex items-center justify-center bg-zinc-100/80 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 font-bold px-1.5 py-0.5 rounded text-[9px] min-w-[16px]">
                                                    {categoryProducts.length}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
                                            {!isSorting && (
                                                <>
                                                    <Button 
                                                        variant="link" 
                                                        size="sm" 
                                                        className="h-7 px-2 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 decoration-indigo-600/30"
                                                        onClick={() => {
                                                            setParentCategoryIdForSub(category.id);
                                                            setEditingSubCategory(null);
                                                            setSubCategoryName("");
                                                            setIsSubCategoryDialogOpen(true);
                                                        }}
                                                    >
                                                        <Plus className="w-3 h-3 mr-1" /> Alt Kategori
                                                    </Button>

                                                    <Button 
                                                        variant="link" 
                                                        size="sm" 
                                                        className="h-7 px-2 text-[10px] font-bold text-zinc-600 hover:text-indigo-600 decoration-zinc-600/30"
                                                        onClick={() => {
                                                            setSelectedCategoryId(category.id);
                                                            setEditingProduct(null);
                                                            setProductForm({ name: "", description: "", price: "", imageUrl: "", variations: [], subCategoryId: "" });
                                                            setIsProductDialogOpen(true);
                                                        }}
                                                    >
                                                        <Plus className="w-3 h-3 mr-1" /> Ürün Ekle
                                                    </Button>

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-40">
                                                            <DropdownMenuItem onClick={() => openEditCategory(category)}>
                                                                <Edit className="w-4 h-4 mr-2" /> Düzenle
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem 
                                                                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/10"
                                                                onClick={() => handleDeleteCategory(category.id)}
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-2" /> Sil
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>

                                                    <div className={`transition-transform duration-300 text-zinc-400 ${isExpanded ? 'rotate-180' : ''}`}>
                                                        <ChevronDown className="w-3 h-3" />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Products List (Accordion Content) */}
                                    <AnimatePresence>
                                        {!isSorting && isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="p-3 space-y-4 bg-white dark:bg-zinc-950">
                                                    {/* Sub-categories */}
                                                    {category.subCategories && category.subCategories.length > 0 && (
                                                        <Reorder.Group 
                                                            axis="y" 
                                                            values={category.subCategories} 
                                                            onReorder={(newSubs) => handleReorderSubCategories(category.id, newSubs)}
                                                            className="space-y-3"
                                                        >
                                                            {category.subCategories.map((sub) => {
                                                                const subProducts = categoryProducts.filter(p => p.subCategoryId === sub.id);
                                                                return (
                                                                    <Reorder.Item 
                                                                        key={sub.id} 
                                                                        value={sub}
                                                                        dragListener={isSorting}
                                                                        className="list-none"
                                                                    >
                                                                        <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 p-3 relative group/sub">
                                                                            {/* Sub-category Header */}
                                                                            <div className="flex items-center justify-between mb-2">
                                                                                <div className="flex items-center gap-2">
                                                                                    {isSorting && (
                                                                                        <GripVertical className="w-3 h-3 text-zinc-300 cursor-grab active:cursor-grabbing" />
                                                                                    )}
                                                                                    <h4 className="text-[12px] font-black uppercase tracking-widest text-zinc-400">{sub.name}</h4>
                                                                                    <span className="text-[9px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-bold text-zinc-400">{subProducts.length}</span>
                                                                                </div>
                                                                                
                                                                                {!isSorting && (
                                                                                    <div className="flex items-center gap-1 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                                                                                        <Button 
                                                                                            variant="ghost" 
                                                                                            size="icon" 
                                                                                            className="h-6 w-6 text-zinc-400 hover:text-indigo-600 rounded-md"
                                                                                            onClick={() => {
                                                                                                setSelectedCategoryId(category.id);
                                                                                                setEditingProduct(null);
                                                                                                setProductForm({ name: "", description: "", price: "", imageUrl: "", variations: [], subCategoryId: sub.id });
                                                                                                setIsProductDialogOpen(true);
                                                                                            }}
                                                                                        >
                                                                                            <Plus className="w-3 h-3" />
                                                                                        </Button>
                                                                                        <Button 
                                                                                            variant="ghost" 
                                                                                            size="icon" 
                                                                                            className="h-6 w-6 text-zinc-400 hover:text-indigo-600 rounded-md"
                                                                                            onClick={() => {
                                                                                                setParentCategoryIdForSub(category.id);
                                                                                                setEditingSubCategory(sub);
                                                                                                setSubCategoryName(sub.name);
                                                                                                setIsSubCategoryDialogOpen(true);
                                                                                            }}
                                                                                        >
                                                                                            <Edit className="w-3 h-3" />
                                                                                        </Button>
                                                                                        <Button 
                                                                                            variant="ghost" 
                                                                                            size="icon" 
                                                                                            className="h-6 w-6 text-zinc-400 hover:text-red-500 rounded-md"
                                                                                            onClick={() => handleDeleteSubCategory(category.id, sub.id)}
                                                                                        >
                                                                                            <Trash2 className="w-3 h-3" />
                                                                                        </Button>
                                                                                    </div>
                                                                                )}
                                                                            </div>

                                                                            {/* Sub-category Products */}
                                                                            <div className="space-y-1.5">
                                                                                {subProducts.map(product => (
                                                                                    <ProductRow key={product.id} product={product} />
                                                                                ))}
                                                                                {subProducts.length === 0 && (
                                                                                    <div className="py-4 text-center border border-dashed border-zinc-200/50 dark:border-zinc-800/50 rounded-xl bg-white/50 dark:bg-zinc-900/50">
                                                                                        <span className="text-[11px] text-zinc-400 font-medium">Bu alt kategoride ürün yok.</span>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </Reorder.Item>
                                                                );
                                                            })}
                                                        </Reorder.Group>
                                                    )}

                                                    {/* Top-tier Products (No sub-category or all if no sub-categories defined) */}
                                                    <div className="space-y-1.5">
                                                        {(category.subCategories && category.subCategories.length > 0) && (
                                                            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between mb-2">
                                                                <h4 className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Genel Ürünler</h4>
                                                                <span className="text-[9px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-bold text-zinc-400">
                                                                    {categoryProducts.filter(p => !p.subCategoryId).length}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {categoryProducts.filter(p => !p.subCategoryId).map((product) => (
                                                            <ProductRow key={product.id} product={product} />
                                                        ))}
                                                    </div>

                                                    {categoryProducts.length === 0 && (!category.subCategories || category.subCategories.length === 0) && (
                                                        <div className="py-12 text-center">
                                                            <div className="w-12 h-12 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mx-auto mb-3">
                                                                <Plus className="w-6 h-6 text-zinc-300" />
                                                            </div>
                                                            <p className="text-sm text-zinc-500 font-medium">Bu kategoride henüz ürün bulunmuyor.</p>
                                                            <div className="flex justify-center gap-4 mt-2">
                                                                <Button 
                                                                    variant="link" 
                                                                    className="text-indigo-600 font-bold"
                                                                    onClick={() => {
                                                                        setSelectedCategoryId(category.id);
                                                                        setEditingProduct(null);
                                                                        setIsProductDialogOpen(true);
                                                                    }}
                                                                >
                                                                    Ürün Ekle →
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Card>
                            </Reorder.Item>
                        );
                    })}
                </Reorder.Group>
                </div>

                {draftData.categories.length === 0 && (
                    <div className="py-24 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/20">
                        <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto mb-4">
                            <ListPlus className="w-8 h-8 text-zinc-400" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Henüz kategori yok</h3>
                        <p className="text-zinc-500 mt-2 max-w-xs mx-auto">Menünüzü oluşturmaya bir kategori ekleyerek başlayın.</p>
                        <Button 
                            onClick={() => setIsCategoryDialogOpen(true)}
                            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-indigo-500/20"
                        >
                            <Plus className="w-5 h-5 mr-2" /> Kategori Oluştur
                        </Button>
                    </div>
                )}
            </div>

            {/* Sub-category Dialog */}
            <Dialog open={isSubCategoryDialogOpen} onOpenChange={setIsSubCategoryDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingSubCategory ? "Alt Kategoriyi Düzenle" : "Yeni Alt Kategori Ekle"}</DialogTitle>
                        <DialogDescription>Bu alt kategori seçtiğiniz ana kategorinin içinde görünecektir.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="subCatName">Alt Kategori Adı</Label>
                            <Input
                                id="subCatName"
                                placeholder="Örn: Sıcak İçecekler, Dürümler..."
                                value={subCategoryName}
                                onChange={(e) => setSubCategoryName(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsSubCategoryDialogOpen(false)}>İptal</Button>
                        <Button onClick={handleSaveSubCategory} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">Kaydet</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Category Dialog */}
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="catName">Kategori Adı</Label>
                            <Input
                                id="catName"
                                placeholder="Örn: İçecekler, Ana Yemekler..."
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>İptal</Button>
                        <Button onClick={handleSaveCategory}>Kaydet</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Product Dialog */}
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2 px-1">
                        <div className="space-y-2">
                            <Label htmlFor="prodName">Ürün Adı</Label>
                            <Input
                                id="prodName"
                                placeholder="Örn: Adana Dürüm"
                                value={productForm.name}
                                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="prodDesc">Açıklama</Label>
                            <Textarea
                                id="prodDesc"
                                placeholder="İçindekiler, boyut vb..."
                                value={productForm.description}
                                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                className="resize-none h-20"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="prodPrice">Taban Fiyat (TL)</Label>
                                <Input
                                    id="prodPrice"
                                    type="number"
                                    placeholder="0.00"
                                    value={productForm.price}
                                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="prodCategory">Kategori</Label>
                                <select
                                    id="prodCategory"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                    value={selectedCategoryId}
                                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                                >
                                    {draftData.categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Sub-category Selection (Only if parent has them) */}
                        {draftData.categories.find(c => c.id === selectedCategoryId)?.subCategories?.length ? (
                            <div className="space-y-2">
                                <Label htmlFor="prodSubCategory">Alt Kategori (Opsiyonel)</Label>
                                <select
                                    id="prodSubCategory"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                    value={productForm.subCategoryId}
                                    onChange={(e) => setProductForm({ ...productForm, subCategoryId: e.target.value })}
                                >
                                    <option value="">Genel (Alt kategori yok)</option>
                                    {draftData.categories.find(c => c.id === selectedCategoryId)?.subCategories?.map(sc => (
                                        <option key={sc.id} value={sc.id}>{sc.name}</option>
                                    ))}
                                </select>
                            </div>
                        ) : null}

                        {/* --- SIMPLIFIED VARIATION MANAGEMENT --- */}
                        <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-bold flex items-center gap-2">
                                    <ListPlus className="w-4 h-4 text-emerald-600" />
                                    Varyasyonlar
                                </Label>
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 text-[11px] font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                    onClick={handleAddVariationGroup}
                                >
                                    <Plus className="w-3.5 h-3.5 mr-1" />
                                    Yeni Grup
                                </Button>
                            </div>

                            {/* Quick Presets */}
                            {productForm.variations.length === 0 && (
                                <div className="flex flex-wrap gap-2 pb-2">
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            const newGroup: ProductVariation = { id: `var-${Date.now()}`, name: "Ekstralar", type: "multiple", options: [], orderIndex: 0 };
                                            setProductForm(prev => ({ ...prev, variations: [newGroup] }));
                                        }}
                                        className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                                    >
                                        + Ekstralar
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            const newGroup: ProductVariation = { id: `var-${Date.now()}`, name: "İçecek Seçimi", type: "single", options: [{ id: 'o1', name: 'Ayran', price: 0, orderIndex:0 }], orderIndex: 0 };
                                            setProductForm(prev => ({ ...prev, variations: [newGroup] }));
                                        }}
                                        className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                                    >
                                        + İçecek
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            const newGroup: ProductVariation = { id: `var-${Date.now()}`, name: "Porsiyon", type: "single", options: [{ id: 'o1', name: 'Standart', price: 0, orderIndex:0 }], orderIndex: 0 };
                                            setProductForm(prev => ({ ...prev, variations: [newGroup] }));
                                        }}
                                        className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                                    >
                                        + Porsiyon
                                    </button>
                                </div>
                            )}

                            <div className="space-y-3">
                                {productForm.variations.map((group) => (
                                    <div key={group.id} className="bg-zinc-50 dark:bg-zinc-900/30 rounded-xl border border-zinc-100 dark:border-zinc-800 p-3 space-y-3">
                                        <div className="flex gap-2 items-center">
                                            <Input
                                                placeholder="Grup Adı (Örn: Malzemeler)"
                                                value={group.name}
                                                onChange={(e) => handleUpdateVariationGroup(group.id, { name: e.target.value })}
                                                className="h-8 font-bold border-none bg-transparent shadow-none px-0 focus:ring-0"
                                            />
                                            <div className="flex bg-zinc-200/50 dark:bg-zinc-800 rounded-lg p-0.5">
                                                <button 
                                                    type="button"
                                                    onClick={() => handleUpdateVariationGroup(group.id, { type: "single" })}
                                                    className={`px-2 py-1 text-[9px] font-black rounded-md transition-all ${group.type === "single" ? "bg-white dark:bg-zinc-700 shadow-sm text-emerald-600" : "text-zinc-500"}`}
                                                >
                                                    TEK
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={() => handleUpdateVariationGroup(group.id, { type: "multiple" })}
                                                    className={`px-2 py-1 text-[9px] font-black rounded-md transition-all ${group.type === "multiple" ? "bg-white dark:bg-zinc-700 shadow-sm text-emerald-600" : "text-zinc-500"}`}
                                                >
                                                    ÇOKLU
                                                </button>
                                            </div>
                                            <Button size="icon" variant="ghost" className="h-7 w-7 text-zinc-400 hover:text-red-500" onClick={() => handleRemoveVariationGroup(group.id)}>
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>

                                        {/* Options Simple List */}
                                        <div className="space-y-1.5 pl-2">
                                            {group.options.map((opt) => (
                                                <div key={opt.id} className="flex gap-1.5 items-center group/opt text-[12px]">
                                                    <div className="w-1 h-1 rounded-full bg-zinc-300" />
                                                    <Input
                                                        placeholder="Seçenek..."
                                                        className="h-7 flex-1 border-none shadow-none focus:ring-0 bg-transparent px-0"
                                                        value={opt.name}
                                                        onChange={(e) => handleUpdateOption(group.id, opt.id, { name: e.target.value })}
                                                    />
                                                    <div className="flex items-center bg-zinc-100 dark:bg-black/20 rounded px-1.5 h-6">
                                                        <span className="text-[10px] text-zinc-400 font-bold mr-1">+</span>
                                                        <input
                                                            type="number"
                                                            placeholder="0"
                                                            className="w-10 bg-transparent text-center border-none text-[11px] font-bold text-emerald-600 focus:ring-0 p-0"
                                                            value={opt.price || ""}
                                                            onChange={(e) => handleUpdateOption(group.id, opt.id, { price: parseFloat(e.target.value) || 0 })}
                                                        />
                                                        <span className="text-[9px] text-zinc-400 pl-0.5">TL</span>
                                                    </div>
                                                    <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover/opt:opacity-100 text-zinc-300 hover:text-red-500" onClick={() => handleRemoveOption(group.id, opt.id)}>
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 text-[10px] font-bold text-zinc-400 hover:text-emerald-600 w-fit px-2"
                                                onClick={() => handleAddOption(group.id)}
                                            >
                                                <Plus className="w-3 h-3 mr-1" />
                                                Seçenek Ekle
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {productForm.variations.length === 0 && (
                                <div className="text-center py-8 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                                    <p className="text-xs text-zinc-400">Ürüne soslar, malzemeler veya porsiyonlar ekleyin.</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                            {/* Tabs for Image Mode */}
                            <div className="flex bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setImageMode("upload")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-md transition-all ${imageMode === "upload" ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
                                >
                                    <Upload className="w-4 h-4" /> Bilgisayardan
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setImageMode("search")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-md transition-all ${imageMode === "search" ? "bg-white dark:bg-zinc-700 shadow-sm text-emerald-600 dark:text-emerald-400" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
                                >
                                    <Search className="w-4 h-4" /> Google Görseller
                                </button>
                            </div>

                            {/* Hidden native file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
                            />

                            {/* Upload Area */}
                            {imageMode === "upload" && (
                                <div
                                    onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed cursor-pointer transition-all select-none ${isDragging
                                        ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 scale-[1.01]"
                                        : "border-zinc-200 dark:border-zinc-700 hover:border-emerald-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                        }`}
                                >
                                    {productForm.imageUrl && !productForm.imageUrl.startsWith("http") ? (
                                        <>
                                            <img
                                                src={productForm.imageUrl}
                                                alt="Önizleme"
                                                className="absolute inset-0 w-full h-full object-cover rounded-xl"
                                            />
                                            <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <span className="text-white text-sm font-medium">Değiştir</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={e => { e.stopPropagation(); setProductForm(prev => ({ ...prev, imageUrl: "" })); }}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 z-10"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-4">
                                            <div className={`p-3 rounded-full mb-3 transition-colors ${isDragging ? "bg-emerald-100 dark:bg-emerald-500/20" : "bg-zinc-100 dark:bg-zinc-800"}`}>
                                                <Upload className={`w-6 h-6 ${isDragging ? "text-emerald-600" : "text-zinc-400"}`} />
                                            </div>
                                            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300 text-center px-4">
                                                {isDragging ? "Görseli buraya bırakın!" : "Görsel yüklemek için tıklayın veya sürükleyin"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Google Images Search Area */}
                            {imageMode === "search" && (
                                <div className="space-y-3 bg-zinc-50 dark:bg-zinc-900 overflow-hidden border border-zinc-200 dark:border-zinc-800 rounded-xl p-3">
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
                                            <Input
                                                placeholder={productForm.name ? `${productForm.name} görseli ara...` : "Ürün adı ile arayın..."}
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
                                                className="pl-9 bg-white dark:bg-black"
                                                autoFocus
                                            />
                                        </div>
                                        <Button
                                            onClick={handleSearchClick}
                                            disabled={isSearching || !searchQuery.trim()}
                                            className="bg-zinc-800 hover:bg-zinc-700 text-white"
                                        >
                                            {isSearching ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Ara"}
                                        </Button>
                                    </div>

                                    {(isSearching || searchResults.length > 0) && (
                                        <div className="grid grid-cols-3 gap-2 mt-3 p-1 max-h-48 overflow-y-auto min-h-[120px]">
                                            {isSearching ? (
                                                Array.from({ length: 6 }).map((_, i) => (
                                                    <div key={i} className="aspect-square rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                                                ))
                                            ) : (
                                                searchResults.map((imgUrl, i) => (
                                                    <div
                                                        key={i}
                                                        onClick={() => setProductForm(prev => ({ ...prev, imageUrl: imgUrl }))}
                                                        className={`aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${productForm.imageUrl === imgUrl ? "border-emerald-500 shadow-md scale-95" : "border-transparent hover:border-zinc-300 dark:hover:border-zinc-700"}`}
                                                    >
                                                        <img
                                                            src={`/api/image-proxy?url=${encodeURIComponent(imgUrl)}`}
                                                            alt="Sonuç"
                                                            className="w-full h-full object-cover"
                                                            loading="lazy"
                                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                        />
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}

                                    {searchResults.length === 0 && !isSearching && (
                                        <div className="py-8 text-center text-zinc-400 text-sm flex flex-col items-center">
                                            <Search className="w-8 h-8 opacity-20 mb-2" />
                                            En iyi Google Images sonuçlarını<br />sizin için bulalım.
                                        </div>
                                    )}

                                    {/* Preview selected web image */}
                                    {productForm.imageUrl && productForm.imageUrl.startsWith("http") && (
                                        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
                                            <img
                                                src={`/api/image-proxy?url=${encodeURIComponent(productForm.imageUrl)}`}
                                                className="w-12 h-12 rounded object-cover border border-zinc-200 dark:border-zinc-700"
                                                alt="Seçilen"
                                            />
                                            <div className="flex-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">✨ Görsel seçildi</div>
                                            <Button variant="ghost" size="sm" className="h-7 px-2 text-red-500 hover:text-red-600" onClick={() => setProductForm(prev => ({ ...prev, imageUrl: "" }))}>Kaldır</Button>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>İptal</Button>
                        <Button onClick={handleSaveProduct} className="bg-emerald-600 hover:bg-emerald-700 text-white">Kaydet</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Publish Success Dialog */}
            <Dialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
                <DialogContent className="sm:max-w-md text-center p-8">
                    <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-500 rounded-full flex items-center justify-center mb-6 ring-8 ring-emerald-50 dark:ring-emerald-500/10">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <DialogTitle className="text-2xl font-bold mb-2">Tebrikler!</DialogTitle>
                    <DialogDescription className="text-base text-zinc-600 dark:text-zinc-400 mb-8">
                        Siteniz başarıyla yayınlandı ve sipariş almaya hazır. Harika görünüyorsunuz.
                    </DialogDescription>

                    <div className="space-y-4">
                        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 relative flex items-center justify-between group">
                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate pr-4 select-all">
                                {siteUrl}
                            </span>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4">
                                <Button
                                    id="copy-btn"
                                    size="sm"
                                    variant="secondary"
                                    className="h-8 shadow-sm font-medium"
                                    onClick={() => copyToClipboard(siteUrl)}
                                >
                                    <Copy className="w-3 h-3 mr-1.5" />
                                    Kopyala
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Button
                                variant="outline"
                                className="w-full sm:flex-1 h-11"
                                onClick={() => setIsPublishDialogOpen(false)}
                            >
                                Kapat
                            </Button>
                            <Button
                                className="w-full sm:flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20"
                                onClick={() => window.open(siteUrl, '_blank')}
                            >
                                Siteyi Görüntüle
                                <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );

    // ── Helper Component for Product Row ──────────────────────────────────
    function ProductRow({ product }: { product: Product }) {
        return (
            <div 
                className="group flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-indigo-600/20 hover:shadow-md transition-all"
            >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-14 h-14 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0 border border-zinc-100 dark:border-zinc-800 shadow-sm font-bold flex items-center justify-center">
                        {product.imageUrl ? (
                            <Image src={product.imageUrl} alt={product.name} width={56} height={56} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900/50">
                                <UtensilsCrossed className="w-4 h-4 text-zinc-300 mb-0.5" />
                                <span className="text-[7px] text-zinc-300 uppercase font-black">Görsel</span>
                            </div>
                        )}
                    </div>
                    <div className="min-w-0 space-y-0.5">
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100 truncate text-[14px] tracking-tight">{product.name}</h4>
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-indigo-600 dark:text-indigo-400 text-[13px]">{product.price} ₺</p>
                            {product.variations && product.variations.length > 0 && (
                                <Badge variant="secondary" className="text-[9px] px-1.5 h-4 font-bold uppercase tracking-tighter bg-emerald-50 text-emerald-600 border-none">Varyasyonlu</Badge>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity pr-1">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-zinc-800 rounded-lg shadow-sm border border-transparent hover:border-zinc-100 dark:hover:border-zinc-700"
                        onClick={(e) => {
                            e.stopPropagation();
                            openEditProduct(product);
                        }}
                    >
                        <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-zinc-800 rounded-lg shadow-sm border border-transparent hover:border-zinc-100 dark:hover:border-zinc-700"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProduct(product.id);
                        }}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>
        );
    }
}
