import { FunlaneLogo } from "@/components/ui/Logo"
import { BadgeCheck } from "lucide-react"
import Link from "next/link";

function FooterCol({ title, links }: { title: string; links: { l: string; h: string }[] }) {
  return (
    <div>
      <div className="text-sm font-semibold text-ink dark:text-white/90">{title}</div>
      <ul className="mt-4 space-y-2.5">
        {links.map((x) => (
          <li key={x.l}>
            <Link href={x.h} className="text-sm text-ink-3 dark:text-white/60 hover:text-ink dark:hover:text-white transition-colors">{x.l}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({ isDark }: { isDark: boolean }) {
    return (
        <footer className="border-t border-line dark:border-white/10">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <FunlaneLogo tone={isDark ? 'light' : 'dark'} markClassName="w-9 h-9" />
              <p className="mt-4 text-sm text-ink-3 dark:text-white/60 leading-relaxed max-w-xs">
                The corporate travel &amp; logistics desk for modern teams across Nigeria.
              </p>
            </div>
            <FooterCol title="Product" links={[{ l: 'Features', h: '#features' }, { l: 'How it works', h: '#how' }, { l: 'Security', h: '#security' }]} />
            <FooterCol title="Clients" links={[{ l: 'Create account', h: '/signup' }, { l: 'Client sign in', h: '/login' }]} />
            <FooterCol title="Agency" links={[{ l: 'Agent sign in', h: '/agent/login' }, { l: 'Admin console', h: '/admin/login' }]} />
          </div>
          <div className="border-t border-line dark:border-white/10">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-3 dark:text-white/50">
              <span>© {new Date().getFullYear()} Funlane Travels &amp; Logistics. All rights reserved.</span>
              <span className="inline-flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5 text-green" /> NDPA compliant · Secured by Paystack</span>
            </div>
          </div>
        </footer>
    )
}