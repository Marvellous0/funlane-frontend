import { Reveal } from "@/containers/landing/Reveal"
import { SECURITY_POINTS } from "@/lib/constants"
import { CheckCircle2, Lock } from "lucide-react"

export function SecuritySection() {
    return (
        < section id="security" className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-24" >
            <div className="grid lg:grid-cols-2 gap-10 items-center">
                <Reveal from="left">
                    <span className="text-xs font-semibold uppercase tracking-wider text-green-dark dark:text-green">Security &amp; trust</span>
                    <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-ink dark:text-white">Your money never moves until you say so.</h2>
                    <p className="mt-4 text-ink-2 dark:text-white/75 leading-relaxed">
                        Funds sit safely in your pre-funded wallet. They&apos;re only <span className="text-ink dark:text-white font-medium">locked</span> when you approve a
                        quote, and only <span className="text-ink dark:text-white font-medium">captured</span> when your ticket is issued. Cancel anytime before issuance
                        and the funds are released instantly.
                    </p>
                    <ul className="mt-6 space-y-3">
                        {SECURITY_POINTS.map((p) => (
                            <li key={p} className="flex items-start gap-3 text-sm text-ink-2 dark:text-white/80">
                                <CheckCircle2 className="w-5 h-5 text-green shrink-0 mt-0.5" /> {p}
                            </li>
                        ))}
                    </ul>
                </Reveal>

                {/* Always-dark showcase panel */}
                <Reveal from="right" className="relative">
                    <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#0E1A33] to-[#0A1222] p-8 overflow-hidden text-white shadow-card">
                        <div aria-hidden="true" className="absolute -right-16 -top-16 w-52 h-52 rounded-full bg-green/10 blur-3xl" />
                        <div className="relative flex items-center gap-3">
                            <span className="w-12 h-12 rounded-xl bg-green/15 text-green flex items-center justify-center"><Lock className="w-6 h-6" /></span>
                            <div>
                                <div className="font-semibold">Wallet · Funds locked</div>
                                <div className="text-xs text-white/60">Encrypted · NDPA compliant</div>
                            </div>
                        </div>
                        <div className="relative mt-7 grid grid-cols-3 gap-3 text-center">
                            {[
                                { k: 'Available', v: '₦2.40m', c: 'text-white' },
                                { k: 'Locked', v: '₦480k', c: 'text-[#E5C185]' },
                                { k: 'Captured', v: '₦1.12m', c: 'text-green' },
                            ].map((b) => (
                                <div key={b.k} className="rounded-xl bg-white/5 border border-white/10 p-4">
                                    <div className={`text-lg font-bold ${b.c}`}>{b.v}</div>
                                    <div className="text-[11px] uppercase tracking-wide text-white/60 mt-1">{b.k}</div>
                                </div>
                            ))}
                        </div>
                        <div className="relative mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-brand via-[#3AA0DC] to-[#C5A059] animate-gradient-pan bg-[length:200%_200%]" />
                        </div>
                    </div>
                </Reveal>
            </div>
        </section >
    )
}