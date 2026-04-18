import { Product } from "@/types";
import { Plus, Flame, Tag } from "lucide-react";

export default function ProductCard({
    product,
    onSelect,
}: {
    product: Product;
    onSelect: () => void;
}) {
    const hasImage = !!product.imageUrl;
    const hasVariations = product.variations && product.variations.length > 0;

    return (
        <div
            onClick={onSelect}
            className="group relative flex flex-row sm:flex-col bg-white rounded-3xl overflow-hidden
                       border border-zinc-100 shadow-sm hover:shadow-2xl hover:border-primary/20
                       transition-all duration-300 cursor-pointer hover:-translate-y-1 active:scale-[0.98]"
        >
            {/* Image */}
            {hasImage ? (
                <div className="w-24 h-24 sm:w-full sm:h-44 overflow-hidden shrink-0 relative">
                    <img
                        src={product.imageUrl!}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    {/* Gradient overlay on desktop hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block" />

                    {/* Popular badge */}
                    {product.price > 100 && (
                        <div className="absolute top-2 left-2 flex items-center gap-1 bg-orange-600 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-lg uppercase tracking-widest">
                            <Flame className="w-3 h-3" />
                            Popüler
                        </div>
                    )}
                </div>
            ) : (
                /* No image placeholder */
                <div className="w-24 h-24 sm:w-full sm:h-32 shrink-0 bg-zinc-50 flex items-center justify-center">
                    <span className="text-3xl sm:text-5xl">🍽️</span>
                </div>
            )}

            {/* Content */}
            <div className="flex flex-col flex-1 justify-between p-4 sm:p-5 min-w-0">
                <div className="space-y-1">
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="font-black text-sm sm:text-base text-zinc-900 leading-tight group-hover:text-primary transition-colors line-clamp-2 italic">
                            {product.name}
                        </h3>
                    </div>

                    {product.description && (
                        <p className="text-zinc-400 text-[11px] mt-1 line-clamp-2 leading-relaxed hidden sm:block font-medium">
                            {product.description}
                        </p>
                    )}
                </div>

                {/* Bottom row */}
                <div className="flex items-center justify-between mt-4 pb-1">
                    <div className="flex flex-col">
                        <span className="font-black text-lg sm:text-xl text-zinc-900 leading-none tracking-tighter">
                            {product.price.toFixed(2)} <span className="text-xs italic ml-0.5">₺</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {hasVariations && (
                            <span className="flex items-center gap-1 text-[9px] font-black text-zinc-400 bg-zinc-100 px-2.5 py-1 rounded-full uppercase tracking-tighter">
                                <Tag className="w-2.5 h-2.5" />
                                Seçenekli
                            </span>
                        )}
                        <div className="w-9 h-9 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 active:scale-95 transition-all">
                            <Plus className="w-5 h-5 stroke-[3]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
