import { Reveal } from "@/containers/landing/Reveal"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const CTASection = () => {
    return (
        <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-20">
            <Reveal from="scale">
                <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#0F2447] via-[#0B1A33] to-[#0A1222] px-6 sm:px-12 py-14 sm:py-20 text-center text-white">
                    <div aria-hidden="true" className="absolute -top-24 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full bg-brand/20 blur-[120px] animate-aurora" />
                    <div className="relative">
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">Ready to take off?</h2>
                        <p className="mt-4 text-white/70 max-w-xl mx-auto">
                            Join the teams managing corporate travel the precise way. Create your account in minutes.
                        </p>
                        <div className="mt-9 flex flex-col sm:flex-row justify-center gap-3">
                            <Link href="/signup" className="inline-flex items-center justify-center gap-2 h-[3.25rem] px-8 py-3.5 rounded-xl bg-brand text-white hover:bg-brand-dark font-semibold transition-colors shadow-[0_12px_40px_-10px_rgba(22,112,181,0.9)]">
                                Get started free <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/login" className="inline-flex items-center justify-center h-[3.25rem] px-8 py-3.5 rounded-xl border border-white/20 text-white hover:bg-white/10 font-semibold transition-colors">
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </Reveal>
        </section>
    )
}