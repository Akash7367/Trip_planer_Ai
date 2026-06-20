'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      router.push(`/plan?prompt=${encodeURIComponent(prompt)}`);
    } else {
      router.push('/plan');
    }
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col pt-16">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-sm transition-all duration-300 ease-in-out">
        <div className="max-w-container-max mx-auto px-margin-desktop md:px-margin-mobile flex justify-between items-center h-16">
          <div className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>flight_takeoff</span>
            AeroGuide
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/discover" className="font-body-md text-body-md text-primary border-b-2 border-primary font-bold pb-1 transition-all duration-300 ease-in-out">
              Discover
            </Link>
            <Link href="/dashboard" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors hover:opacity-80">
              My Trips
            </Link>
            <Link href="/profile" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors hover:opacity-80">
              Profile
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-surface-container rounded-full px-4 py-2">
              <span className="material-symbols-outlined text-outline">search</span>
              <input 
                className="bg-transparent border-none focus:ring-0 text-body-sm font-body-sm ml-2 outline-none w-48 text-on-surface" 
                placeholder="Search destinations..." 
                type="text"
              />
            </div>
            <button 
              onClick={() => router.push('/plan')}
              className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2 rounded-full hover:opacity-80 transition-opacity flex items-center gap-2 shadow-[0px_4px_20px_rgba(0,88,188,0.2)]"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              Start Planning
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[870px] flex items-center justify-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-bright/90 z-10"></div>
            <img 
              className="w-full h-full object-cover" 
              alt="A breathtaking, expansive view of a serene coastal landscape at sunrise" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_HtYZZndBLPGjrN_FLavP1n_AOk7xWjkoW4lIwtTyckQd0nSMvtw57gK5ebQRpmZjxBvuaHCCPTjJHIUEN0l50Ii0nKOMSFO5WUeV1GNSkM3fKLWk5_mNP_KNy_z-ueTwfARrwaBDRMiaaNdmVrUT6Fpjr20S97AbJziSOMmNZa5YSs9RZpJj5gBfTcktQvz_G956Ye1if9Fau0IQdpSr5RL8YVonzYGQb-2ZfD-kK_6oQN8NLjEXU0VD4WTDKpOk5yhAo7He05x_"
            />
          </div>
          
          <div className="relative z-20 w-full max-w-container-max px-margin-mobile md:px-margin-desktop text-center mt-[-10vh]">
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-primary-fixed mb-6 drop-shadow-md">
              Where to next?
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-12 max-w-2xl mx-auto">
              Describe your dream getaway, and our AI will craft a perfectly tailored, airy itinerary in seconds.
            </p>

            {/* AI Prompt Bar */}
            <form onSubmit={handleGenerate} className="max-w-3xl mx-auto glass-panel rounded-[32px] p-2 flex flex-col md:flex-row items-center soft-shadow hover-shadow transition-all duration-300 border border-white/50">
              <div className="flex-grow flex items-center w-full px-4 py-3 md:py-0">
                <span className="material-symbols-outlined text-primary mr-3" style={{ fontVariationSettings: "'FILL' 1" }}>temp_preferences_custom</span>
                <input 
                  className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-body-md text-body-md placeholder-outline p-0" 
                  placeholder="e.g. A relaxing 5-day retreat in Kyoto focusing on temples and matcha..." 
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full md:w-auto mt-2 md:mt-0 bg-primary text-on-primary rounded-full px-8 py-4 font-label-md text-label-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap">
                Generate Itinerary <span className="material-symbols-outlined">magic_button</span>
              </button>
            </form>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <span 
                onClick={() => setPrompt("Mountain Escapes in Switzerland")}
                className="bg-surface-container-low text-on-surface px-4 py-2 rounded-full font-body-sm text-body-sm flex items-center gap-2 cursor-pointer hover:bg-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">landscape</span> Mountain Escapes
              </span>
              <span 
                onClick={() => setPrompt("Culinary tours in Tokyo")}
                className="bg-surface-container-low text-on-surface px-4 py-2 rounded-full font-body-sm text-body-sm flex items-center gap-2 cursor-pointer hover:bg-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">restaurant</span> Culinary Tours
              </span>
              <span 
                onClick={() => setPrompt("Family friendly beach trip to Hawaii")}
                className="bg-surface-container-low text-on-surface px-4 py-2 rounded-full font-body-sm text-body-sm flex items-center gap-2 cursor-pointer hover:bg-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">family_restroom</span> Family Friendly
              </span>
            </div>
          </div>
        </section>

        {/* How It Works (Bento Grid) */}
        <section className="py-[120px] max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop border-t border-surface-container">
          <div className="text-center mb-16">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Intelligent Planning, Simplified</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto">Experience a new standard of travel preparation. Less logistics, more anticipation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Bento Item 1 */}
            <div className="bg-surface-container-lowest rounded-xl p-8 soft-shadow hover-shadow transition-all duration-300 md:col-span-2 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute right-[-10%] top-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl z-0"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">Conversational Discovery</h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md">Tell us what you crave in your own words. Our AI understands context, vibe, and pacing to draft the perfect foundation.</p>
              </div>
            </div>

            {/* Bento Item 2 */}
            <div className="bg-surface-container-lowest rounded-xl p-8 soft-shadow hover-shadow transition-all duration-300 flex flex-col justify-center">
              <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-6">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>tune</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">Fluid Adjustments</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Swap activities instantly. The itinerary reflows automatically.</p>
            </div>

            {/* Bento Item 3 */}
            <div className="bg-surface-container-lowest rounded-xl p-0 soft-shadow hover-shadow transition-all duration-300 md:col-span-3 flex flex-col md:flex-row overflow-hidden min-h-[300px]">
              <div className="p-8 md:w-1/2 flex flex-col justify-center">
                <div className="w-12 h-12 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">Seamless Navigation</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Your entire journey mapped out beautifully. Syncs directly to your phone for offline, stress-free exploration.</p>
              </div>
              <div className="md:w-1/2 bg-surface-container h-full relative min-h-[200px]">
                <div 
                  className="absolute inset-0 bg-cover bg-center w-full h-full opacity-80 mix-blend-multiply" 
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDP2orEbj3fDzpVq5FCOB10rqXjUC7SM1z4ET87bI3-tnlRycNX3Z2FJGBlOQgM6kEoFd0vcuXz704V_q4U8fQYGgIrZNnmVObGP8aXuMNq-wbX4Csr-iStCwL7P7i3nuJHZDnxM38N-fpJngeitAjy3cPYzlVmCbCnqqEEOt6sPjmBHmu-hy2iUp7rHQ9dE6e941c71w0Eje3V1iKfSgg2dkbktuq0oAOFBIt8JQKfXUySvLUhxo3gGLLSHkrZcgG4v1MXmSEmdYzZ')" }}
                ></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container w-full py-12">
        <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter">
          <div>
            <div className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">AeroGuide</div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">© 2026 AeroGuide AI. Your intuitive travel companion.</p>
          </div>
          <div className="flex flex-col space-y-3">
            <Link href="#" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors duration-200">About Us</Link>
            <Link href="#" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors duration-200">Privacy Policy</Link>
          </div>
          <div className="flex flex-col space-y-3">
            <Link href="#" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors duration-200">Terms of Service</Link>
            <Link href="#" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors duration-200">Help Center</Link>
          </div>
          <div className="flex flex-col space-y-3">
            <Link href="#" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors duration-200">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
