import { Reveal } from "@/containers/landing/Reveal"
import { Star } from "lucide-react"


export const TestimonialSection = () => {
    return (
        < section className="max-w-4xl mx-auto px-5 sm:px-8 py-16 sm:py-20" >
            <Reveal className="relative rounded-3xl border border-line dark:border-white/10 bg-white dark:bg-white/[0.04] p-8 sm:p-12 text-center shadow-card">
                <div className="flex justify-center gap-1 mb-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-[#C5A059] fill-[#C5A059]" />
                    ))}
                </div>
                <blockquote className="text-xl sm:text-2xl font-medium leading-relaxed text-ink dark:text-white">
                    “Funlane took our travel chaos and turned it into a clean, auditable flow. We approve quotes in seconds and never worry about
                    where the money is.”
                </blockquote>
                <div className="mt-6 inline-flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm">AO</span>
                    <div className="text-left">
                        <div className="font-semibold text-sm text-ink dark:text-white">Amaka Obi</div>
                        <div className="text-xs text-ink-3 dark:text-white/60">Operations Lead, Sterling Group</div>
                    </div>
                </div>
            </Reveal>
        </section >
    )
}