"use client";

import { useState, useRef, useCallback } from "react";
import { useRestaurant } from "@/components/restaurant-provider";
import { Category, Product } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Image as ImageIcon, Upload, X, Link, Rocket, CheckCircle2, ExternalLink, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

export default function AdminMenuPage() {
    const { restaurantData, updateRestaurantData } = useRestaurant();
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
    const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    // Category State
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryName, setCategoryName] = useState("");

    // Product State
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(restaurantData.categories[0]?.id || "");
    const [productForm, setProductForm] = useState({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
    });

    // Image upload state
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [urlMode, setUrlMode] = useState(false);

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
        setUrlMode(false);
        setIsDragging(false);
    };

    const handleSaveCategory = () => {
        if (!categoryName.trim()) return;

        let newCategories = [...restaurantData.categories];
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

        updateRestaurantData({ categories: newCategories });
        setIsCategoryDialogOpen(false);
        setCategoryName("");
        setEditingCategory(null);
    };

    const handleDeleteCategory = (id: string) => {
        if (confirm("Bu kategoriyi silmek istediğinize emin misiniz? İçindeki ürünler de silinebilir.")) {
            updateRestaurantData({
                categories: restaurantData.categories.filter(c => c.id !== id),
                products: restaurantData.products.filter(p => p.categoryId !== id)
            });
            if (selectedCategoryId === id) {
                setSelectedCategoryId(restaurantData.categories.length > 1 ? restaurantData.categories[0].id : "");
            }
        }
    };

    const handleSaveProduct = () => {
        if (!productForm.name || !productForm.price || !selectedCategoryId) return;

        let newProducts = [...restaurantData.products];
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

        updateRestaurantData({ products: newProducts });
        setIsProductDialogOpen(false);
        setEditingProduct(null);
        setProductForm({ name: "", description: "", price: "", imageUrl: "" });
        resetImageState();
    };

    const handleDeleteProduct = (id: string) => {
        if (confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
            updateRestaurantData({
                products: restaurantData.products.filter(p => p.id !== id)
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
        setIsProductDialogOpen(true);
    };

    const handlePublish = async () => {
        setIsPublishing(true);
        // Simulate publishing process
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsPublishing(false);
        setIsPublishDialogOpen(true);
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

    const siteUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${restaurantData.slug}`;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Menü Yönetimi</h1>
                    <p className="text-zinc-500 mt-2">Kategorileri, ürünleri ve fiyatları düzenleyin.</p>
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
                        {restaurantData.categories.map((category) => (
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
                        {restaurantData.categories.length === 0 && (
                            <div className="text-xs text-center p-4 text-zinc-500">Kategori Bulunmuyor</div>
                        )}
                    </div>
                </Card>

                {/* Products Grid */}
                <div className="col-span-1 md:col-span-3">
                    {selectedCategoryId ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {restaurantData.products.filter(p => p.categoryId === selectedCategoryId).map((product) => (
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
                                            <span className="mt-3 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded w-fit">Seçenler Var</span>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Empty State */}
                            {restaurantData.products.filter(p => p.categoryId === selectedCategoryId).length === 0 && (
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
                                    {restaurantData.categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Ürün Görseli</Label>
                                <button
                                    type="button"
                                    onClick={() => setUrlMode(v => !v)}
                                    className="text-xs text-zinc-400 hover:text-zinc-600 flex items-center gap-1"
                                >
                                    <Link className="w-3 h-3" />
                                    {urlMode ? "Dosya yükle" : "URL ile ekle"}
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

                            {urlMode ? (
                                <Input
                                    placeholder="https://örnek.com/gorsel.jpg"
                                    value={productForm.imageUrl.startsWith("data:") ? "" : productForm.imageUrl}
                                    onChange={e => setProductForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                                    autoFocus
                                />
                            ) : (
                                <div
                                    onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative flex flex-col items-center justify-center h-36 rounded-xl border-2 border-dashed cursor-pointer transition-all select-none ${isDragging
                                        ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 scale-[1.01]"
                                        : "border-zinc-200 dark:border-zinc-700 hover:border-emerald-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                        }`}
                                >
                                    {productForm.imageUrl ? (
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
                                        <>
                                            <div className={`p-3 rounded-full mb-2 transition-colors ${isDragging ? "bg-emerald-100 dark:bg-emerald-500/20" : "bg-zinc-100 dark:bg-zinc-800"
                                                }`}>
                                                <Upload className={`w-5 h-5 ${isDragging ? "text-emerald-600" : "text-zinc-400"
                                                    }`} />
                                            </div>
                                            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                                {isDragging ? "Bırakın!" : "Görseli sürükleyin veya tıklayın"}
                                            </p>
                                            <p className="text-xs text-zinc-400 mt-1">PNG, JPG, WEBP — maks 10 MB</p>
                                        </>
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
                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate pr-4select-all">
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
                                className="w-full h-11"
                                onClick={() => setIsPublishDialogOpen(false)}
                            >
                                Kapat
                            </Button>
                            <Button
                                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-bold"
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
