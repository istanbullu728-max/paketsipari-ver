"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRestaurant } from "@/components/restaurant-provider";
import { Category, Product } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Image as ImageIcon, Upload, X, Search, Rocket, CheckCircle2, ExternalLink, Copy, Globe } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

export default function AdminMenuPage() {
    const { draftData, updateDraftData, publishDraft } = useRestaurant();
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
    const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    // Category State
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryName, setCategoryName] = useState("");

    // Product State
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(draftData.categories[0]?.id || "");
    const [productForm, setProductForm] = useState({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
    });

    // Image upload state
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [imageMode, setImageMode] = useState<"upload" | "search">("upload");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    // Auto-search effect when product name changes and we are in search mode
    useEffect(() => {
        // Only trigger if we have a name, dialog is open, and it's long enough
        if (!isProductDialogOpen || !productForm.name || productForm.name.trim().length <= 2) return;

        const delayDebounceFn = setTimeout(() => {
            if (searchQuery !== productForm.name) {
                setSearchQuery(productForm.name);
                // Trigger auto search directly
                performImageSearch(productForm.name);
                // Also switch mode to search if it wasn't already to show results instantly
                if (imageMode !== "search") {
                    setImageMode("search");
                }
            }
        }, 600); // 600ms debounce

        return () => clearTimeout(delayDebounceFn);
    }, [productForm.name, isProductDialogOpen]);

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
                    name: productForm.name,
                    description: productForm.description,
                    price: parseFloat(productForm.price),
                    imageUrl: productForm.imageUrl || undefined
                } : p
            );
        } else {
            newProducts.push({
                id: `prod-${Date.now()}`,
                restaurantId: "1",
                categoryId: selectedCategoryId,
                name: productForm.name,
                description: productForm.description,
                price: parseFloat(productForm.price),
                imageUrl: productForm.imageUrl || undefined,
                variations: [],
                orderIndex: newProducts.length
            });
        }

        updateDraftData({ products: newProducts });
        setIsProductDialogOpen(false);
        setEditingProduct(null);
        setProductForm({ name: "", description: "", price: "", imageUrl: "" });
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
            imageUrl: product.imageUrl || ""
        });
        setSearchQuery(product.name);
        setIsProductDialogOpen(true);
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

        setIsSearching(true);
        setSearchResults([]); // clear while searching

        try {
            // Unsplash Source provides better direct matching for food items than raw Pixabay without translation
            // Since it's a mock, we can generate multiple unqiue predictable unsplash source URLs so it looks like a gallery
            // Note: Unsplash Source is technically deprecated but still works for many basic keywords. 
            // We use a combination of query and random seeds to get different pictures of the same dish.

            const engQueryMap: Record<string, string> = {
                "sufle": "souffle dessert",
                "adana": "kebab",
                "kebap": "kebab meat",
                "döner": "doner kebab meat",
                "dürüm": "wrap sandwich",
                "ayran": "yogurt drink",
                "kola": "cola drink",
                "lahmacun": "lahmacun pizza",
                "pide": "pita bread food",
                "tatlı": "dessert",
                "künefe": "kunefe dessert",
                "çorba": "soup bowl",
                "pilav": "rice bowl",
            };

            // Try to map common turkish terms to english for better results, else use base query
            let searchTerm = cleanQuery.toLowerCase();
            for (const [tr, en] of Object.entries(engQueryMap)) {
                if (searchTerm.includes(tr)) {
                    searchTerm = en;
                    break;
                }
            }

            // Let's use Source Unsplash with specific keywords for a highly realistic look.
            // We append different keywords to the same base term to force Unsplash to return different images
            const encodedTerm = encodeURIComponent(searchTerm);

            // To ensure we don't get cached identical images, we append varied contextual tags
            const results = [
                `https://source.unsplash.com/800x600/?${encodedTerm},food`,
                `https://source.unsplash.com/800x600/?${encodedTerm},plate`,
                `https://source.unsplash.com/800x600/?${encodedTerm},restaurant`,
                `https://source.unsplash.com/800x600/?${encodedTerm},gourmet`,
                `https://source.unsplash.com/800x600/?${encodedTerm},meal`,
                `https://source.unsplash.com/800x600/?${encodedTerm},delicious`
            ];

            // Wait a tiny bit to simulate loading
            await new Promise(resolve => setTimeout(resolve, 800));

            setSearchResults(results);
        } catch (error) {
            console.error("Image search error:", error);
            // Fallback
            setSearchResults([
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop"
            ]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchClick = () => {
        performImageSearch(searchQuery);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Basic feedback (in a real app, use a toast notification)
        const btn = document.getElementById('copy-btn');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Kopyalandı!';
            setTimeout(() => { btn.innerHTML = originalText; }, 2000);
        }
    };

    const siteUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${draftData.slug}`;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Menü Yönetimi</h1>
                    <p className="text-zinc-500 mt-2">Taslak menünüzü düzenleyin. Değişikliklerin müşteriye yansıması için yayınlayın.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => { setEditingCategory(null); setCategoryName(""); setIsCategoryDialogOpen(true); }}>
                        <Plus className="w-4 h-4 mr-2" /> Kategori
                    </Button>
                    <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/30" onClick={() => { setEditingProduct(null); setProductForm({ name: "", description: "", price: "", imageUrl: "" }); setIsProductDialogOpen(true); }}>
                        <Plus className="w-4 h-4 mr-2" /> Ürün
                    </Button>
                    <Button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all font-bold group"
                    >
                        {isPublishing ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Yayınlanıyor...
                            </span>
                        ) : (
                            <>
                                <Rocket className="w-4 h-4 mr-2 group-hover:-translate-y-1 transition-transform" />
                                Siteyi Yayınla
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">

                {/* Categories Column */}
                <Card className="col-span-1 border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950">
                    <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-t-xl font-semibold">
                        Kategoriler
                    </div>
                    <div className="flex flex-col p-2 space-y-1">
                        {draftData.categories.map((category) => (
                            <div
                                key={category.id}
                                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${selectedCategoryId === category.id ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 font-medium' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400'}`}
                                onClick={() => setSelectedCategoryId(category.id)}
                            >
                                <span className="flex-1 truncate pr-2">{category.name}</span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:bg-zinc-200 hover:text-blue-600 dark:hover:bg-zinc-800 dark:hover:text-blue-400" onClick={(e) => { e.stopPropagation(); openEditCategory(category); }}>
                                        <Edit className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:bg-zinc-200 hover:text-red-600 dark:hover:bg-zinc-800 dark:hover:text-red-400" onClick={(e) => { e.stopPropagation(); handleDeleteCategory(category.id); }}>
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {draftData.categories.length === 0 && (
                            <div className="text-xs text-center p-4 text-zinc-500">Kategori Bulunmuyor</div>
                        )}
                    </div>
                </Card>

                {/* Products Grid */}
                <div className="col-span-1 md:col-span-3">
                    {selectedCategoryId ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {draftData.products.filter(p => p.categoryId === selectedCategoryId).map((product) => (
                                <Card key={product.id} className="group overflow-hidden relative border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
                                    <div className="h-32 bg-zinc-100 dark:bg-zinc-900 overflow-hidden relative border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-center">
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="w-8 h-8 text-zinc-300" />
                                        )}
                                        {/* Actions overlay */}
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-sm p-1 rounded-lg">
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-white/20" onClick={() => openEditProduct(product)}>
                                                <Edit className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-red-200 hover:text-red-100 hover:bg-red-500/50" onClick={() => handleDeleteProduct(product.id)}>
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                    <CardContent className="p-4 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 leading-tight line-clamp-2 pr-2">{product.name}</h3>
                                            <span className="font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">{product.price} TL</span>
                                        </div>
                                        <p className="text-sm text-zinc-500 line-clamp-2 mt-1 flex-1">{product.description || "Açıklama yok"}</p>
                                        {product.variations && product.variations.length > 0 && (
                                            <span className="mt-3 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded w-fit">Seçenekler Var</span>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Empty State */}
                            {draftData.products.filter(p => p.categoryId === selectedCategoryId).length === 0 && (
                                <div className="col-span-full py-16 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                                    <h3 className="text-zinc-500 font-medium">Bu kategoride henüz ürün yok</h3>
                                    <Button variant="link" className="text-emerald-600 mt-2" onClick={() => { setEditingProduct(null); setProductForm({ name: "", description: "", price: "", imageUrl: "" }); setIsProductDialogOpen(true); }}>
                                        Hemen ilk ürünü ekleyin
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="py-20 text-center text-zinc-500 border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-inner">
                            Lütfen sol taraftan bir kategori seçin veya yeni bir kategori oluşturun.
                        </div>
                    )}
                </div>
            </div>

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
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
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
                                <Label htmlFor="prodPrice">Fiyat (TL)</Label>
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
                        <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
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
                                    <Globe className="w-4 h-4" /> Google Görseller
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

                                    {searchResults.length > 0 && (
                                        <div className="grid grid-cols-3 gap-2 mt-3 p-1 max-h-48 overflow-y-auto">
                                            {searchResults.map((imgUrl, i) => (
                                                <div
                                                    key={i}
                                                    onClick={() => setProductForm(prev => ({ ...prev, imageUrl: imgUrl }))}
                                                    className={`aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${productForm.imageUrl === imgUrl ? "border-emerald-500 shadow-md scale-95" : "border-transparent hover:border-zinc-300 dark:hover:border-zinc-700"}`}
                                                >
                                                    <img src={imgUrl} alt="Sonuç" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {searchResults.length === 0 && !isSearching && (
                                        <div className="py-8 text-center text-zinc-400 text-sm flex flex-col items-center">
                                            <Globe className="w-8 h-8 opacity-20 mb-2" />
                                            Hiçbir resimle uğraşmadan adını yazın,<br />Google'dan sizin için bulalım.
                                        </div>
                                    )}

                                    {/* Preview selected web image */}
                                    {productForm.imageUrl && productForm.imageUrl.startsWith("http") && (
                                        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
                                            <img src={productForm.imageUrl} className="w-12 h-12 rounded object-cover border border-zinc-200 dark:border-zinc-700" alt="Seçilen" />
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
                                className="w-full sm:flex-1 h-11 bg-primary hover:bg-primary/90 text-white font-bold"
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
}
