import { Reveal } from "@/containers/landing/Reveal"
import { STATS } from "@/lib/constants"

export function StatsSection() {
    return (
        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-line dark:bg-white/10 rounded-2xl overflow-hidden border border-line dark:border-white/10">
                {STATS.map((s, i) => (
                    <Reveal key={s.label} delay={i * 80} className="bg-white dark:bg-[#0A1222] p-6 sm:p-8">
                        <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-ink to-ink/70 dark:from-white dark:to-white/85 bg-clip-text text-transparent">{s.value}</div>
                        <div className="text-sm text-ink-3 dark:text-white/60 mt-1.5">{s.label}</div>
                    </Reveal>
                ))}
            </div>
                </section >
    )
}