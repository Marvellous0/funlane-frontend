import { CITIES } from "@/lib/constants";
import { Globe2 } from "lucide-react";

export const TrustMarque = () => {
    return (
        < section className="relative border-y border-line dark:border-white/10 py-6 bg-surface dark:bg-white/[0.02]" >
            <p className="text-center text-[11px] uppercase tracking-[0.2em] text-ink-3 dark:text-white/60 mb-4">Trusted by teams moving across</p>
            <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
                <div className="flex w-max animate-marquee gap-12 pr-12">
                    {[...CITIES, ...CITIES].map((c, i) => (
                        <span key={i} className="inline-flex items-center gap-2 text-ink-3 dark:text-white/65 font-semibold whitespace-nowrap">
                            <Globe2 className="w-4 h-4 text-brand" /> {c}
                        </span>
                    ))}
                </div>
            </div>
        </section >
    )
}