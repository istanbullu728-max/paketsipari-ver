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

                        {/* Right: Stats */}
                        <div className="flex sm:flex-col justify-between sm:justify-center gap-4 sm:gap-6 border-t sm:border-t-0 sm:border-l border-zinc-100 bg-zinc-50/50 p-6 sm:px-10 sm:min-w-[200px] sm:rounded-none rounded-b-2xl">
                            <div className="flex flex-col items-center sm:items-start gap-1">
                                <span className="text-2xl sm:text-3xl font-black text-zinc-900 italic">
                                    {product.price}
                                    <span className="text-xs font-bold ml-1 not-italic opacity-50">₺</span>
                                </span>
                                <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-[0.2em]">Min. Sipariş</span>
                            </div>
                            <div className="w-px h-8 bg-zinc-200 sm:hidden self-center" />
                            <div className="flex flex-col items-center sm:items-start gap-1">
                                <span className="text-2xl sm:text-3xl font-black text-zinc-900 italic">
                                    25
                                    <span className="text-xs font-bold ml-1 not-italic opacity-50">dk</span>
                                </span>
                                <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-[0.2em]">Teslimat</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
