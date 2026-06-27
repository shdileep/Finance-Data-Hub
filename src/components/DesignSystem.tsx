import React from 'react';
import { Landmark, ArrowLeft, Paintbrush, Type, Eye } from 'lucide-react';

interface DesignSystemProps {
  onBack: () => void;
}

export default function DesignSystem({ onBack }: DesignSystemProps) {
  const colors = [
    { name: 'primary', hex: '#000000', desc: 'Core branding & high-contrast elements' },
    { name: 'secondary', hex: '#006c49', desc: 'Positive actions, checkmarks & success states' },
    { name: 'primary-container', hex: '#131b2e', desc: 'Zero-trust highlights & dark cards' },
    { name: 'surface', hex: '#f8f9ff', desc: 'Main window background color' },
    { name: 'surface-container-low', hex: '#eff4ff', desc: 'Grid backgrounds & secondary cards' },
    { name: 'outline-variant', hex: '#c6c6cd', desc: 'Sleek thin borders & table separators' },
    { name: 'on-surface-variant', hex: '#45464d', desc: 'Secondary typography text color' },
  ];

  return (
    <div className="bg-background text-on-surface font-body-lg min-h-screen flex flex-col w-full selection:bg-primary-fixed selection:text-primary">
      {/* TopAppBar */}
      <header className="bg-surface-container-lowest sticky top-0 w-full border-b border-outline-variant z-50 flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop">
        <div onClick={onBack} className="flex items-center gap-2 cursor-pointer select-none active:opacity-80">
          <Landmark className="text-primary w-5 h-5" />
          <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">FinanceHub</span>
        </div>
        <button onClick={onBack} className="flex items-center gap-1 text-on-surface-variant hover:text-primary text-xs font-bold uppercase transition-all">
          <ArrowLeft className="w-4 h-4" /> Exit Preview
        </button>
      </header>

      <main className="max-w-[1000px] mx-auto px-margin-mobile py-12 md:py-20 flex-grow w-full space-y-16">
        <header className="border-l-4 border-primary pl-6">
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-2 text-xs font-bold uppercase tracking-wider">ASSET STUB PREVIEW</p>
          <h1 className="font-headline-lg text-headline-lg md:text-[40px] text-on-surface mb-4 font-bold">Stitch Design System</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
            The structural visual tokens, typography guidelines, and design variables powering our institutional interfaces.
          </p>
        </header>

        {/* Color Palette */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Paintbrush className="text-secondary w-6 h-6" />
            <h2 className="text-xl font-bold text-primary">1. Color Palette Tokens</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {colors.map((c) => (
              <div key={c.name} className="border border-outline-variant rounded-xl p-4 bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-full h-24 rounded-lg mb-4" style={{ backgroundColor: c.hex }}></div>
                  <h4 className="font-title-md text-base font-bold text-primary uppercase">{c.name}</h4>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{c.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/30 flex justify-between font-mono text-[10px] text-on-surface-variant">
                  <span>TOKEN: --color-{c.name}</span>
                  <span className="font-bold">{c.hex}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Type className="text-secondary w-6 h-6" />
            <h2 className="text-xl font-bold text-primary">2. Typography Hierarchy</h2>
          </div>
          <div className="border border-outline-variant rounded-xl p-8 bg-white shadow-sm space-y-6">
            <div className="border-b border-outline-variant/30 pb-4">
              <span className="text-[10px] font-mono text-on-surface-variant block mb-1">font-display-lg | Hanken Grotesk 48px</span>
              <span className="font-display-lg text-3xl font-bold text-primary">Precision Infrastructure.</span>
            </div>
            <div className="border-b border-outline-variant/30 pb-4">
              <span className="text-[10px] font-mono text-on-surface-variant block mb-1">font-headline-lg | Hanken Grotesk 32px</span>
              <span className="font-headline-lg text-xl font-bold text-primary">High-Frequency Execution Nodes</span>
            </div>
            <div className="border-b border-outline-variant/30 pb-4">
              <span className="text-[10px] font-mono text-on-surface-variant block mb-1">font-body-lg | Inter 16px</span>
              <span className="font-body-lg text-sm text-on-surface-variant">Empowering institutional investors with rigorous analytical frameworks.</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-on-surface-variant block mb-1">font-data-mono | JetBrains Mono 13px</span>
              <span className="font-data-mono text-xs font-bold text-secondary">LATENCY: 0.024ms</span>
            </div>
          </div>
        </section>

        {/* Components */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Eye className="text-secondary w-6 h-6" />
            <h2 className="text-xl font-bold text-primary">3. Standard Component States</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-outline-variant rounded-xl p-8 bg-white shadow-sm space-y-4">
              <h4 className="font-bold text-sm text-on-surface-variant mb-4 uppercase">Buttons</h4>
              <div className="flex flex-wrap gap-4">
                <button className="bg-primary text-on-primary px-6 py-2.5 rounded font-semibold text-xs uppercase tracking-wider">Primary Solid</button>
                <button className="border border-primary text-primary px-6 py-2.5 rounded font-semibold text-xs uppercase tracking-wider hover:bg-surface-container-low transition-all">Outline Action</button>
                <button className="bg-secondary text-white px-6 py-2.5 rounded font-semibold text-xs uppercase tracking-wider">Success Action</button>
              </div>
            </div>
            <div className="border border-outline-variant rounded-xl p-8 bg-white shadow-sm space-y-4">
              <h4 className="font-bold text-sm text-on-surface-variant mb-4 uppercase">Badges &amp; Tags</h4>
              <div className="flex flex-wrap gap-4">
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">SOC2 Certified</span>
                <span className="bg-primary-container text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">EU RESIDENCY</span>
                <span className="bg-surface-container-high text-on-surface px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">FIDO2 MFA</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-highest border-t border-outline-variant py-8">
        <div className="max-w-[1000px] mx-auto px-margin-mobile flex justify-between items-center text-xs font-bold uppercase tracking-wider text-on-surface-variant">
          <span>© 2026 FinanceHub. Design System Spec.</span>
          <button onClick={onBack} className="hover:underline">Back to Home</button>
        </div>
      </footer>
    </div>
  );
}
