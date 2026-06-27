'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSelector from '@/components/LanguageSelector';

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [heroImage, setHeroImage] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuCc-F-71UrXqdC7dRvz62G5o6YUOhXywCbsrRCbPAzfB3YlAymVsazWwux9vLNxGz0kjWZZ_as_DsdPYeyEJ9ZCu49z9I2BqoZucG5-MUlckoy0jFiFt2eKChoOsF0gRlmhCigQVilPHi-1pV0aqYJwoS-S67KOcY2HKDOpIYnkQ6tconJDU3LE3PtvZbO-CfrjAIB-rTHTOGk_j_D1edsV-db-xuxOqMF3VwFX052ZwGt0CBU52q4co7dH0WSKb4bs5bweK_IZac0');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      router.push(`/plan?prompt=${encodeURIComponent(prompt)}`);
    } else {
      router.push('/plan');
    }
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Header Section */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md dark:bg-primary/80 border-b border-outline-variant/30 dark:border-outline/20 shadow-sm dark:shadow-none h-20">
        <nav className="flex justify-between items-center h-full px-margin-desktop max-w-container-max mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary dark:text-primary-fixed text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>flight_takeoff</span>
            <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed">VoyageEase</span>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a className="text-secondary font-bold border-b-2 border-secondary pb-1 font-body-md text-body-md" href="#">Explore</a>
            <Link className="text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed transition-colors font-body-md text-body-md" href="/plan">Planner</Link>
            <Link className="text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed transition-colors font-body-md text-body-md" href="/dashboard">My Trips</Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LanguageSelector />
            <button onClick={() => router.push('/login')} className="text-secondary dark:text-secondary-fixed font-body-md hover:opacity-80 transition-opacity active:scale-95 duration-200 bg-transparent border-none cursor-pointer">Login</button>
            <button onClick={() => router.push('/register')} className="bg-secondary text-on-primary px-6 py-2 rounded-lg font-body-md font-semibold hover:opacity-90 transition-all active:scale-95 border-none cursor-pointer">Sign Up</button>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${heroImage}')` }}></div>
            <div className="absolute inset-0 bg-primary/25"></div>
          </div>
          <div className="relative z-10 w-full max-w-container-max px-margin-desktop text-center">
            <h1 className="font-display-lg text-display-lg text-white mb-8 drop-shadow-lg max-w-3xl mx-auto">
              Your Perfect Trip, Planned in Seconds
            </h1>
            {/* Search Component */}
            <form onSubmit={handleGenerate} className="glass-panel p-2 md:p-4 rounded-xl shadow-xl max-w-4xl mx-auto flex flex-col md:flex-row gap-2 items-stretch border border-white/40">
              <div className="flex-1 flex flex-col items-start px-4 py-2 border-r border-outline-variant/30 last:border-0">
                <label className="font-body-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Destination</label>
                <input 
                  className="w-full bg-transparent border-none focus:ring-0 text-body-lg font-semibold text-primary placeholder:text-outline p-0 outline-none" 
                  placeholder="Where to?" 
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              <div className="flex-1 flex flex-col items-start px-4 py-2 border-r border-outline-variant/30 last:border-0">
                <label className="font-body-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Dates</label>
                <input className="w-full bg-transparent border-none focus:ring-0 text-body-lg font-semibold text-primary placeholder:text-outline p-0 outline-none" placeholder="Add dates" type="text" />
              </div>
              <div className="flex-1 flex flex-col items-start px-4 py-2 last:border-0">
                <label className="font-body-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Travelers</label>
                <input className="w-full bg-transparent border-none focus:ring-0 text-body-lg font-semibold text-primary placeholder:text-outline p-0 outline-none" placeholder="1 Traveler" type="text" />
              </div>
              <button type="submit" className="bg-secondary text-on-primary px-8 py-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 border-none cursor-pointer">
                <span className="material-symbols-outlined">travel_explore</span>
                <span className="font-semibold">Start Planning</span>
              </button>
            </form>
          </div>
        </section>

        {/* Top Destinations Section */}
        <section className="py-24 bg-surface px-margin-desktop max-w-container-max mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-display-lg text-headline-md md:text-display-lg text-primary mb-4">Popular Escapes</h2>
              <p className="text-body-lg text-on-surface-variant max-w-xl">Curated itineraries from our most-loved destinations around the globe.</p>
            </div>
            <button onClick={() => router.push('/plan')} className="hidden md:flex items-center gap-2 text-secondary font-semibold hover:underline bg-transparent border-none cursor-pointer">
              Explore All <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Card 1: Kyoto */}
            <div className="group relative overflow-hidden rounded-xl bg-surface-container shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="aspect-[4/5] overflow-hidden">
                <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Kyoto, Japan" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADXeqJgYG5XDREQbiTda0V-4-sNxynB7JaeMMiNeohJavJPx1zLR0brDA1kwOEFE5evM5be6baegQOqnp8TD4hf0bVxJYNWXNOCuQN98YCWvVKjBFYKX8KRmMjo1uGMtemSzDPL9DIz0JHx9xT9ejWF1QEQkfAGgHVMwoOQFcqMAXKZbGKP1s5gejsJO1w8KYQsKOG2lYBPcZZmOjqRSebXz3EHQ0RQtAHKpItrxfEcDOU4hTocgJqCWmX4jkt9529KKAZmU5-u5A" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
                <h3 className="font-headline-md text-white mb-2">Kyoto, Japan</h3>
                <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white/80 text-body-sm">124 Itineraries</span>
                  <button onClick={() => { setPrompt("Kyoto temples and culture"); router.push(`/plan?prompt=Kyoto`); }} className="bg-white text-primary px-4 py-2 rounded-lg font-semibold text-body-sm hover:bg-secondary hover:text-white transition-colors border-none cursor-pointer">View Itineraries</button>
                </div>
              </div>
            </div>
            {/* Card 2: Amalfi Coast */}
            <div className="group relative overflow-hidden rounded-xl bg-surface-container shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="aspect-[4/5] overflow-hidden">
                <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Amalfi Coast, Italy" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPvrO4XgDVcUuv7b4ZQMZ4qoq0UwE5CYaAKIdgwvNjHp3s6ytF1iK-zbbw3uDomhjLxUojrziIijCBMY6QQO_U3GuavqQaPIqYABCOELK_aINqBoJw2xrariVuClfKkgbunDh2YYFu7gGrKrL0WxBKtI6RG1Dy2btJXUUBklcOlcGsWLRkamdRaal4qf5ygJk8VL7wRqnzG3_-eARTMV080byRC0N7Zclcq7Cr6-FduKlga1i8xlhk5yipprjQbRzbeIM74AgncF8" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
                <h3 className="font-headline-md text-white mb-2">Amalfi Coast, Italy</h3>
                <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white/80 text-body-sm">89 Itineraries</span>
                  <button onClick={() => { setPrompt("Amalfi Coast beach trip"); router.push(`/plan?prompt=Amalfi%20Coast`); }} className="bg-white text-primary px-4 py-2 rounded-lg font-semibold text-body-sm hover:bg-secondary hover:text-white transition-colors border-none cursor-pointer">View Itineraries</button>
                </div>
              </div>
            </div>
            {/* Card 3: Santorini */}
            <div className="group relative overflow-hidden rounded-xl bg-surface-container shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="aspect-[4/5] overflow-hidden">
                <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Santorini, Greece" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTZiFIkOM0SeVjMhW7fG5T9Hpkp-F0pRytwf4cnk74L09gR8AZGTkAgFQmvVWyl4oFxRVHM-1eJUHW6ZUkeuzk10oFsIJpXqr41jT0IHvg636oM87LeXyLLoyJkX92a36Ioc8vrljKPz30Zzxy8d5MHcw0wXwAb16lIHT8MfqJ2-9dmY_3fXW4-w-9gNaTRMxZYY51gG4irCPw6e0VE1WY-1Wg-bQ3rdNA7taAQXkNTdGn7rtuq5q04GEqnUinC_7GloUk7heBN_U" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
                <h3 className="font-headline-md text-white mb-2">Santorini, Greece</h3>
                <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white/80 text-body-sm">215 Itineraries</span>
                  <button onClick={() => { setPrompt("Santorini honeymoon escape"); router.push(`/plan?prompt=Santorini`); }} className="bg-white text-primary px-4 py-2 rounded-lg font-semibold text-body-sm hover:bg-secondary hover:text-white transition-colors border-none cursor-pointer">View Itineraries</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Features Section */}
        <section className="py-32 bg-primary text-white overflow-hidden">
          <div className="max-w-container-max mx-auto px-margin-desktop">
            <div className="text-center mb-20">
              <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-6">Built for the Modern Traveler</h2>
              <p className="text-on-primary-container max-w-2xl mx-auto text-body-lg">We leverage advanced AI to take the friction out of travel planning, so you can focus on the memories.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-primary-container/50 border border-outline/10 hover:border-secondary transition-colors group">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-6 text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                </div>
                <h3 className="font-headline-sm text-white mb-4">AI Itineraries</h3>
                <p className="text-on-primary-container text-body-md">Get a personalized minute-by-minute plan based on your interests, pace, and local hidden gems.</p>
              </div>
              <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-primary-container/50 border border-outline/10 hover:border-secondary transition-colors group">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-6 text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
                </div>
                <h3 className="font-headline-sm text-white mb-4">Smart Budgeting</h3>
                <p className="text-on-primary-container text-body-md">Real-time cost estimations and currency tracking to keep your wanderlust within your wallet's reach.</p>
              </div>
              <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-primary-container/50 border border-outline/10 hover:border-secondary transition-colors group">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-6 text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>notifications_active</span>
                </div>
                <h3 className="font-headline-sm text-white mb-4">Real-time Alerts</h3>
                <p className="text-on-primary-container text-body-md">Stay ahead with instant updates on flight delays, gate changes, and local weather shifts.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-24 bg-surface-container-low px-margin-desktop">
          <div className="max-w-container-max mx-auto">
            <div className="flex flex-col items-center mb-16">
              <div className="flex items-center gap-1 text-secondary mb-4">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
              <h2 className="font-headline-md text-primary font-bold">4.9/5 stars on App Store</h2>
              <p className="text-on-surface-variant text-body-md mt-2">Trusted by over 500,000 travelers worldwide</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-outline-variant/30 italic">
                <p className="text-body-lg text-primary mb-6">"I used to spend weeks planning our family vacations. VoyageEase did it in less than a minute, and the suggestions were places I never would have found on my own!"</p>
                <div className="flex items-center gap-4 non-italic">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img className="w-full h-full object-cover" alt="Sarah Jenkins" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAB8-thVdbDxsCjcR56jwDEsI0RIWQnYT_KMMcoHuMmb18ZUymloEYgxfirWmilnaUtVReVbYRb5m3nIPIyDuAp10UkfXMjfDuMmhmhHJEEE8siJyt7uvL43UrbO__XnQO3-dQYU5YAfWxkWq4bmQ2MH6yIRCjVvU7k0BQ3mzt-SMyhuZPeWgLeQlIlLlozhrYGqA9xeOM4tedMb_pBd1lkYFZlQUQXUM6pggw0kfXpN1qww7JthInXDKopfoShrDm7HVx2U0E061c" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Sarah Jenkins</h4>
                    <p className="text-body-sm text-on-surface-variant">Frequent Traveler</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-outline-variant/30 italic">
                <p className="text-body-lg text-primary mb-6">"The budget tracking is a lifesaver. Being able to see our spending in real-time while navigating the Tokyo subway made our trip so much less stressful."</p>
                <div className="flex items-center gap-4 non-italic">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img className="w-full h-full object-cover" alt="Mark Thompson" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhC1qSIUtvDd083zgC9XJuv1jpXpl9Ue6k8RimIHzgD5BEtxkU5RWr2p--xJMtZqfpRme9xVfemNUtkyiFEJJuvWjRHiUPTR_c2_6MPDs_WSLUCOodeNlWiuKpxAAVIVXYA3lBgdBOMtdGkIvy6Mhqn-m6vBVKWxp02SuhaQSijYFLaMvNhBbrPL7GJLN6qURwVPQGXYyP2NAyDd_FMTrKiRZDMddkOXMgsVE2vxAZ9pDswmGO3HGBgEhJJnWxHiy3uq-5L7qxtes" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Mark Thompson</h4>
                    <p className="text-body-sm text-on-surface-variant">Backpacker & Tech Enthusiast</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAJF-4HffU7La3O9eeXHGBEwoL4C2Pbx2QWvL-Ku8WX81mxMUSJwLQo7ceaKSFkp8bz4_81LIGXGTnd5DnNbpfwRv00iQV79nKLivqCa-6CMgL9ZcjJwXAvZ7xKzCocztL6WSOcYJnZTpDBBhpxbqYwW5Lp9hP5mdoHeMil97t2aurJ12ZDJKM2QDTtmZkty14NamJMjF6cPUBOA39_GH-RMmarHBJ2a7y1SPRsrEEsNfdWqNvP4lNjonF8ANyjFwJWLMCP7G5u590')" }}></div>
            <div className="absolute inset-0 bg-primary/60"></div>
          </div>
          <div className="relative z-10 max-w-container-max mx-auto px-margin-desktop text-center">
            <h2 className="font-display-lg text-display-lg text-white mb-8">Ready to see the world?</h2>
            <p className="text-white/80 text-body-lg max-w-2xl mx-auto mb-12">Join thousands of travelers who are planning smarter, better, and faster with VoyageEase AI.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => router.push('/plan')} className="bg-secondary text-on-primary px-10 py-5 rounded-lg text-body-lg font-bold hover:opacity-90 transition-all active:scale-95 shadow-xl border-none cursor-pointer">
                Get Started for Free
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="w-full py-20 bg-primary dark:bg-surface-container-lowest text-on-primary dark:text-on-surface">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop max-w-container-max mx-auto">
          <div className="md:col-span-1">
            <span className="font-headline-sm text-headline-sm text-secondary-fixed dark:text-secondary block mb-6">VoyageEase</span>
            <p className="text-body-sm opacity-80 mb-6 font-medium">Your journey begins here. We help you explore the world with the power of artificial intelligence.</p>
          </div>
          <div>
            <h5 className="font-bold mb-6 text-on-primary-fixed-variant dark:text-on-surface-variant uppercase text-[12px] tracking-widest">Company</h5>
            <ul className="space-y-4 list-none p-0 m-0">
              <li><Link className="text-on-primary-fixed-variant dark:text-on-surface-variant hover:text-white transition-colors hover:underline decoration-secondary-fixed font-medium text-body-sm" href="#">About Us</Link></li>
              <li><Link className="text-on-primary-fixed-variant dark:text-on-surface-variant hover:text-white transition-colors hover:underline decoration-secondary-fixed font-medium text-body-sm" href="#">Careers</Link></li>
              <li><Link className="text-on-primary-fixed-variant dark:text-on-surface-variant hover:text-white transition-colors hover:underline decoration-secondary-fixed font-medium text-body-sm" href="#">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-6 text-on-primary-fixed-variant dark:text-on-surface-variant uppercase text-[12px] tracking-widest">Product</h5>
            <ul className="space-y-4 list-none p-0 m-0">
              <li><Link className="text-on-primary-fixed-variant dark:text-on-surface-variant hover:text-white transition-colors hover:underline decoration-secondary-fixed font-medium text-body-sm" href="#">Explore</Link></li>
              <li><Link className="text-on-primary-fixed-variant dark:text-on-surface-variant hover:text-white transition-colors hover:underline decoration-secondary-fixed font-medium text-body-sm" href="/plan">Planner</Link></li>
              <li><Link className="text-on-primary-fixed-variant dark:text-on-surface-variant hover:text-white transition-colors hover:underline decoration-secondary-fixed font-medium text-body-sm" href="#">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-6 text-on-primary-fixed-variant dark:text-on-surface-variant uppercase text-[12px] tracking-widest">Legal</h5>
            <ul className="space-y-4 list-none p-0 m-0">
              <li><Link className="text-on-primary-fixed-variant dark:text-on-surface-variant hover:text-white transition-colors hover:underline decoration-secondary-fixed font-medium text-body-sm" href="#">Privacy Policy</Link></li>
              <li><Link className="text-on-primary-fixed-variant dark:text-on-surface-variant hover:text-white transition-colors hover:underline decoration-secondary-fixed font-medium text-body-sm" href="#">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-20 border-t border-on-primary/10 pt-10 text-center">
          <p className="font-body-sm text-body-sm opacity-60">© 2026 VoyageEase. All rights reserved. Your journey begins here.</p>
        </div>
      </footer>
    </div>
  );
}
