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
            className="group relative flex flex-row sm:flex-col bg-white rounded-2xl overflow-hidden
                       border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/20
                       transition-all duration-300 cursor-pointer hover:-translate-y-1 active:scale-[0.98]"
        >
            {/* Image */}
            {hasImage ? (
                <div className="w-28 h-28 sm:w-full sm:h-44 overflow-hidden shrink-0 relative">
                    <img
                        src={product.imageUrl!}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    />
                    {/* Gradient overlay on desktop hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block" />

                    {/* Add button on image hover (desktop) */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hidden sm:flex">
                        <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 hover:scale-110 transition-transform">
                            <Plus className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Popular badge */}
                    {product.price > 100 && (
                        <div className="absolute top-2 left-2 flex items-center gap-1 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                            <Flame className="w-3 h-3" />
                            Popüler
                        </div>
                    )}
                </div>
            ) : (
                /* No image placeholder */
                <div className="w-28 h-28 sm:w-full sm:h-32 shrink-0 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                    <span className="text-4xl sm:text-5xl">🍽️</span>
                </div>
            )}

            {/* Content */}
            <div className="flex flex-col flex-1 justify-between p-3 sm:p-4 min-w-0">
                <div>
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-sm sm:text-base text-gray-900 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {product.name}
                        </h3>
                        {/* Mobile add button */}
                        <div className="sm:hidden shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                            <Plus className="w-4 h-4" />
                        </div>
                    </div>

                    {product.description && (
                        <p className="text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed hidden sm:block">
                            {product.description}
                        </p>
                    )}
                </div>

                {/* Bottom row */}
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100/80">
                    <div className="flex flex-col">
                        <span className="font-black text-base sm:text-lg text-primary leading-none tracking-tight">
                            {product.price.toFixed(2)} ₺
                        </span>
                    </div>

                    {hasVariations && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-md uppercase tracking-wide">
                            <Tag className="w-3 h-3" />
                            Seçenekli
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
