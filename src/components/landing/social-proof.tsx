"use client";

import { Star } from "lucide-react";

export function SocialProof() {
    return (
        <section className="py-12 border-y border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-950/30">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="text-center md:text-left">
                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2">Güven Veren Rakamlar</h3>
                        <div className="flex items-center gap-1 group">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform" style={{ transitionDelay: `${i * 50}ms` }} />
                            ))}
                            <span className="ml-2 font-bold text-zinc-900 dark:text-zinc-100">4.9/5</span>
                        </div>
                    </div>

                    <div className="h-px w-20 md:h-12 md:w-px bg-zinc-200 dark:border-zinc-800" />

                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                        <div className="text-2xl font-black italic tracking-tighter text-zinc-400 group cursor-default">
                            100+ <span className="text-sm font-bold uppercase tracking-widest ml-1 text-zinc-500">Restoran</span>
                        </div>
                        <div className="text-2xl font-black italic tracking-tighter text-zinc-400 group cursor-default">
                            50K+ <span className="text-sm font-bold uppercase tracking-widest ml-1 text-zinc-500">Sipariş</span>
                        </div>
                        <div className="text-2xl font-black italic tracking-tighter text-zinc-400 group cursor-default">
                            %0 <span className="text-sm font-bold uppercase tracking-widest ml-1 text-zinc-500">Komisyon</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
