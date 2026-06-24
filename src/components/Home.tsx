import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Leaf, 
  Award, 
  Users, 
  ChevronRight,
  ChevronLeft,
  Activity,
  Heart,
  Zap,
  Coffee,
  ShoppingBag,
  Stethoscope,
  MessageSquare,
  ClipboardList,
  Sparkles,
  Globe,
  Truck
} from 'lucide-react';
import { Product, PackageData, BlogPost } from '../types';
import { CONFIG } from '../config';
import { ProductCard } from './ProductCard';
import { PackageCard } from './PackageCard';
import { ComboCard } from './ComboCard';
import { Testimonials } from './Testimonials';
import { getOptimizedImageUrl } from '../utils/cloudinary';

interface HomeProps {
  products: Product[];
  comboPackages: PackageData[];
  recommendedPackages?: PackageData[];
  onNavigate: (tab: string) => void;
  onOrderProduct: (product: Product) => void;
  onOrderPackage: (pkg: PackageData) => void;
  onOrderComboItem?: (item: any, type: 'package' | 'product', qty: number) => void;
  onViewProduct: (product: Product) => void;
  onSelectBlog: (id: string) => void;
  onOpenChat: () => void;
}

export function Home({ 
  products, 
  comboPackages, 
  recommendedPackages = [],
  onNavigate, 
  onOrderProduct, 
  onOrderPackage, 
  onOrderComboItem,
  onViewProduct,
  onSelectBlog,
  onOpenChat
}: HomeProps) {
  const [recentBlogs, setRecentBlogs] = useState<BlogPost[]>([]);
  const trendingScrollRef = useRef<HTMLDivElement>(null);
  const recScrollRef = useRef<HTMLDivElement>(null);
  const comboScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs');
        if (res.ok) {
          const data = await res.json();
          setRecentBlogs(data.slice(0, 3));
        }
      } catch (e) {
        console.error("Failed to fetch blogs", e);
      }
    };
    fetchBlogs();
  }, []);

  // Auto-scroll for Trending Products
  useEffect(() => {
    if (products.length <= 4) return;
    const timer = setInterval(() => {
      if (trendingScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = trendingScrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          trendingScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          trendingScrollRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' });
        }
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [products.length]);

  // Auto-scroll for Recommended Packages
  useEffect(() => {
    if (recommendedPackages.length <= 1) return;
    const timer = setInterval(() => {
      if (recScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = recScrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          recScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          recScrollRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' });
        }
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [recommendedPackages.length]);

  // Auto-scroll for Combo Packages
  useEffect(() => {
    if (comboPackages.length <= 1) return;
    const timer = setInterval(() => {
      if (comboScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = comboScrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          comboScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          comboScrollRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' });
        }
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [comboPackages.length]);

  const scrollPrev = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -ref.current.clientWidth, behavior: 'smooth' });
    }
  };

  const scrollNext = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: ref.current.clientWidth, behavior: 'smooth' });
    }
  };

  // Get top 4 products for bestsellers
  const bestSellers = products.slice(0, 4);

  const heroImages = CONFIG.heroImages;

  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <div className="space-y-8 md:space-y-10 pb-12">
      
      {/* 1. Hero Section - Majestic Editorial Brand Trilogy Grid */}
      <section className="relative min-h-0 lg:min-h-[calc(100vh-5rem)] w-full overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 flex items-center py-10 md:py-16">
        {/* Subtle atmospheric ambient glow effects */}
        <div className="absolute top-0 right-0 w-2/3 h-full overflow-hidden pointer-events-none z-0 opacity-40">
          <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-emerald-600 rounded-full blur-[160px]"></div>
          <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-teal-600 rounded-full blur-[140px]"></div>
        </div>

        <div className="hidden lg:grid max-w-7xl mx-auto px-6 md:px-8 w-full lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
          
          {/* First Section (Left Column: 25% Desktop Allocation) */}
          <div className="lg:col-span-3 flex flex-col items-start text-left space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-400/25 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400"
            >
              <Sparkles size={11} className="animate-pulse" />
              <span>Wellness Portfolio</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-4"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-3xl xl:text-4xl font-sans font-black tracking-tight text-white leading-[1.12]">
                TRUSTED SOLUTIONS FOR <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-serif font-black italic">HEALTH, WELLNESS AND VITALITY</span> <br />
                CONQUER CHRONIC <br />
                AILMENTS.
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-semibold leading-relaxed bg-slate-950/25 backdrop-blur-sm p-3 rounded-xl border border-white/5">
                Join over <span className="text-emerald-400 underline decoration-2 decoration-teal-400 font-black">45,000+ healthy Nigerians</span>. Discover active herbal formulas crafted to support cellular restoration.
              </p>
            </motion.div>

            {/* Premium CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col gap-2.5 w-full"
            >
              <button
                onClick={() => onNavigate('products')}
                className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider hover:from-emerald-400 hover:to-teal-400 hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-[0_10px_25px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
              >
                <span>Shop Certified Formulas</span>
                <ShoppingBag size={14} />
              </button>
              <button
                onClick={() => onNavigate('consultation')}
                className="w-full px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-extrabold text-xs uppercase tracking-wider border border-white/20 hover:border-white/40 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Ask Consultant</span>
                <ArrowRight size={14} />
              </button>
            </motion.div>
          </div>

          {/* Second Section (Middle Column: 50% Desktop Allocation / Multi-Item Image Carousel) */}
          <div className="lg:col-span-6 w-full flex flex-col items-center justify-center relative">
            <div className="relative w-full aspect-square sm:aspect-[4/3] lg:h-[480px] rounded-3xl overflow-hidden bg-slate-900/40 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-[2px] flex items-center justify-center p-2 group/carousel">
              
              {/* Image Track */}
              <div className="absolute inset-0">
                {heroImages.map((img, index) => (
                  <motion.div
                    key={index}
                    className="absolute inset-0 flex items-center justify-center p-6 md:p-10"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ 
                      opacity: index === currentHeroIndex ? 1 : 0,
                      scale: index === currentHeroIndex ? 1 : 0.95
                    }}
                    transition={{ 
                      duration: 0.8,
                      ease: "easeInOut"
                    }}
                  >
                    {/* Atmospheric Blurred backdrop overlay */}
                    <img 
                      src={getOptimizedImageUrl(img, 600)} 
                      alt="" 
                      className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-110 pointer-events-none"
                      referrerPolicy="no-referrer"
                    />
                    {/* Main transparent / product display */}
                    <img 
                      src={getOptimizedImageUrl(img, 800)} 
                      alt={`Featured Formula ${index + 1}`} 
                      className="relative max-w-full max-h-full object-contain z-10 select-none drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://picsum.photos/seed/supplement-hero-${index}/800/600`;
                      }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Slider Controls */}
              <button 
                onClick={() => setCurrentHeroIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-emerald-600 text-white flex items-center justify-center backdrop-blur-md border border-white/10 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 z-20 hover:scale-105"
                aria-label="Previous Slide"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-emerald-600 text-white flex items-center justify-center backdrop-blur-md border border-white/10 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 z-20 hover:scale-105"
                aria-label="Next Slide"
              >
                <ChevronRight size={20} />
              </button>

              {/* Carousel Indicators overlaying the visual */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentHeroIndex(index)}
                    className="h-1.5 rounded-full transition-all duration-300 first:ml-0"
                    style={{
                      width: index === currentHeroIndex ? "32px" : "12px",
                      backgroundColor: index === currentHeroIndex ? "#34d399" : "rgba(255,255,255,0.2)"
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Third Section (Right Column: 25% Desktop Allocation) */}
          <div className="lg:col-span-3 flex flex-col items-start text-left space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-2"
            >
              <h3 className="text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-400">
                ROOT-CAUSE RECOVERY
              </h3>
              <p className="text-xs text-slate-300 font-bold leading-relaxed">
                Experience clinical-grade Traditional Chinese Medicine (TCM) and premium NAFDAC organic formulas designed to target roots for biological balance.
              </p>
            </motion.div>

            {/* Crucial Trust Selling Indicators */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-2 text-slate-300 text-xs font-bold w-full pt-1"
            >
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-emerald-500/15 border border-emerald-400/35 text-emerald-400 rounded-full flex items-center justify-center text-[10px] shrink-0 font-extrabold">✓</span>
                <span className="truncate">NAFDAC Certified Products</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-emerald-500/15 border border-emerald-400/35 text-emerald-400 rounded-full flex items-center justify-center text-[10px] shrink-0 font-extrabold">✓</span>
                <span className="truncate">Pay on Delivery + Free Tracking</span>
              </div>
            </motion.div>

            {/* Dynamic Real-time Stock / Dispatch alert */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="text-[10px] font-black text-amber-400/95 flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-xl w-full"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping shrink-0"></span>
              <span className="truncate">stock alert: Limited batches left.</span>
            </motion.div>
          </div>

        </div>

        {/* ----------------- TABLET AND MOBILE ULTRA-OPTIMIZED VIEW ----------------- */}
        <div className="lg:hidden w-full px-5 flex flex-col justify-between h-[660px] sm:h-[720px] md:h-[780px] relative z-10 gap-3">
          
          {/* First Subsection: 10% space - Heading and Subheading only */}
          <div className="h-[10%] sm:h-[10%] flex flex-col justify-center items-center text-center">
            <h1 className="text-2xl sm:text-3xl font-sans font-black tracking-tight text-white leading-none">
              TRUSTED SOLUTIONS FOR <br className="sm:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-serif font-black italic">HEALTH, WELLNESS AND VITALITY</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-300 font-extrabold uppercase tracking-widest mt-1.5">
              Organic Traditional Chinese Medicine
            </p>
          </div>

          {/* Second Subsection: 60% space on mobile / 70% space on tablet - Carousel filling completely horizontally and vertically */}
          <div className="h-[60%] sm:h-[70%] w-full relative">
            <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-900/60 border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.4)] relative group/mobile-carousel">
              
              {/* Image Track */}
              <div className="absolute inset-0">
                {heroImages.map((img, index) => (
                  <motion.div
                    key={index}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: index === currentHeroIndex ? 1 : 0
                    }}
                    transition={{ 
                      duration: 0.7,
                      ease: "easeInOut"
                    }}
                  >
                    {/* Background fill */}
                    <img 
                      src={getOptimizedImageUrl(img, 600)} 
                      alt="" 
                      className="absolute inset-0 w-full h-full object-cover blur-xl opacity-20 scale-105 pointer-events-none"
                      referrerPolicy="no-referrer"
                    />
                    {/* Main carousel image occupying all 2nd section scope, perfectly fitting with no crop */}
                    <img 
                      src={getOptimizedImageUrl(img, 800)} 
                      alt={`Featured Supplement ${index + 1}`} 
                      className="w-full h-full object-contain select-none relative z-10"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://picsum.photos/seed/supplement-hero-${index}/800/600`;
                      }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Slider Controls for touch/navigation */}
              <button 
                onClick={() => setCurrentHeroIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md border border-white/10 active:scale-95 transition-all z-20"
                aria-label="Previous Slide"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md border border-white/10 active:scale-95 transition-all z-20"
                aria-label="Next Slide"
              >
                <ChevronRight size={16} />
              </button>

              {/* Carousel Indicators */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentHeroIndex(index)}
                    className="h-1 rounded-full transition-all duration-300"
                    style={{
                      width: index === currentHeroIndex ? "24px" : "8px",
                      backgroundColor: index === currentHeroIndex ? "#34d399" : "rgba(255,255,255,0.2)"
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Third Subsection: 30% space on mobile / 20% space on tablet - Short, convincing, professional, understandably organized marketing elements */}
          <div className="h-[30%] sm:h-[20%] flex flex-col justify-between py-2 md:py-2.5 px-4 bg-slate-950/30 border border-white/10 backdrop-blur-md rounded-2xl">
            
            {/* Highly persuasive precise copy */}
            <div className="text-center">
              <p className="text-xs sm:text-sm text-slate-100 font-extrabold leading-relaxed">
                Reverse chronic disease starting at the cell. Over <span className="text-emerald-400 font-black underline decoration-emerald-400">45,000+ healthy Nigerians</span> trust our active, NAFDAC-certified formulations.
              </p>
            </div>

            {/* Professionally Arranged Indicators (100% Organic, Expert Formulated, NAFDAC approved) */}
            <div className="flex justify-center items-center gap-3 py-1 sm:py-1.5 border-y border-white/5">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-300 font-black">
                <Leaf size={12} className="text-emerald-400 shrink-0" />
                <span>100% Organic</span>
              </div>
              <div className="h-2 w-[1px] bg-white/20"></div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-300 font-black">
                <Award size={12} className="text-teal-400 shrink-0" />
                <span>Expert formulated</span>
              </div>
              <div className="h-2 w-[1px] bg-white/20"></div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-300 font-black">
                <span className="text-emerald-400 font-extrabold">✓</span>
                <span>NAFDAC Approved</span>
              </div>
            </div>

            {/* Action buttons CTA stack */}
            <div className="flex gap-2.5 w-full">
              <button
                onClick={() => onNavigate('products')}
                className="flex-1 py-2 sm:py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold text-[11px] uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <span>Shop Certified</span>
                <ShoppingBag size={12} />
              </button>
              <button
                onClick={() => onNavigate('consultation')}
                className="flex-1 py-2 sm:py-2.5 px-3 rounded-xl bg-white/10 text-white font-extrabold text-[11px] uppercase tracking-wider border border-white/20 flex items-center justify-center gap-1.5 hover:bg-white/15 active:scale-95 transition-all"
              >
                <span>Ask Consultant</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Individual Products */}
      <section className="max-w-7xl mx-auto px-6 py-2">
        <div className="flex items-end justify-between mb-6">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">Trending Now</h2>
            <div className="h-2 w-24 bg-emerald-500 rounded-full"></div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('products')} 
              className="hidden md:flex text-emerald-600 font-black text-lg items-center gap-2 hover:gap-4 transition-all uppercase tracking-widest mr-4"
            >
              View All <ArrowRight size={24} />
            </button>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => scrollPrev(trendingScrollRef)}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center text-slate-600 hover:bg-emerald-600 hover:text-white transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => scrollNext(trendingScrollRef)}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center text-slate-600 hover:bg-emerald-600 hover:text-white transition-all"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
        <div 
          ref={trendingScrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar gap-6 pb-4"
        >
          {products.map(product => (
            <div 
              key={product.id} 
              className="snap-start flex-shrink-0 w-[280px] sm:w-[320px] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)]"
            >
              <ProductCard 
                product={product}
                onQuickView={onViewProduct}
                onViewProduct={onViewProduct}
                onOrder={() => onOrderProduct(product)}
              />
            </div>
          ))}
        </div>
        <div className="mt-6 text-center md:hidden">
          <button 
            onClick={() => onNavigate('products')}
            className="bg-emerald-600 text-white px-8 py-3 rounded-full font-black uppercase tracking-widest text-sm shadow-lg"
          >
            View All Products
          </button>
        </div>
      </section>

      {/* 4. Expert Recommended Packages */}
      {recommendedPackages.length > 0 && (
        <section className="bg-slate-50 py-6 md:py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-6">
              <div className="space-y-2">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">Health Solutions</h2>
                <p className="text-xl text-slate-500 font-bold">Curated packages for specific health needs.</p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => onNavigate('recommended')} 
                  className="hidden md:flex text-emerald-600 font-black text-lg items-center gap-2 hover:gap-4 transition-all uppercase tracking-widest mr-4"
                >
                  View All <ArrowRight size={24} />
                </button>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => scrollPrev(recScrollRef)}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center text-slate-600 hover:bg-emerald-600 hover:text-white transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={() => scrollNext(recScrollRef)}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center text-slate-600 hover:bg-emerald-600 hover:text-white transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            </div>
            <div 
              ref={recScrollRef}
              className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar gap-8 pb-8"
            >
              {recommendedPackages.map(pkg => (
                <div 
                  key={pkg.id} 
                  className="snap-start flex-shrink-0 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.3333%-1.5rem)]"
                >
                  <PackageCard 
                    data={pkg} 
                    allPackages={recommendedPackages} 
                    onOrder={() => onOrderPackage(pkg)} 
                    onViewProduct={onViewProduct} 
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 text-center md:hidden">
              <button 
                onClick={() => onNavigate('recommended')}
                className="bg-emerald-600 text-white px-8 py-3 rounded-full font-black uppercase tracking-widest text-sm shadow-lg"
              >
                View All Solutions
              </button>
            </div>
          </div>
        </section>
      )}


      {/* 5. Combo Packs - Elderly Accessible Design */}
      {comboPackages.length > 0 && (
        <section className="bg-emerald-950 py-8 md:py-10 rounded-[3rem] mx-4 md:mx-8">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-10 space-y-6">
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
                Ultimate <span className="text-emerald-400">Combo Packs</span>
              </h2>
              <p className="text-2xl md:text-3xl text-emerald-100/80 max-w-4xl mx-auto font-bold leading-relaxed">
                Maximum value bundles designed for complete body restoration. Perfect for long-term wellness.
              </p>
              <div className="h-1.5 w-48 bg-emerald-500 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
              {comboPackages.map(pkg => (
                <div key={pkg.id} className="w-full">
                  <ComboCard 
                    data={pkg} 
                    onOrder={onOrderComboItem || ((item) => onOrderPackage(item))} 
                    onProductClick={onViewProduct} 
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <button 
                onClick={() => onNavigate('combo')} 
                className="bg-emerald-500 text-white px-16 py-6 rounded-full font-black text-2xl hover:bg-emerald-400 transition-all shadow-3xl shadow-emerald-900/50 uppercase tracking-widest"
              >
                View All Master Kits
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 6. Testimonials Section */}
      <Testimonials onViewAll={() => onNavigate('testimonials')} />

      {/* 7. Ask Virtual Guide Teaser */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-24 text-center border-4 border-emerald-100 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-200 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-300 rounded-full blur-[100px]"></div>
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-6 md:space-y-10">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto shadow-2xl text-white mb-4 md:mb-8 rotate-3">
              <Sparkles size={32} className="md:hidden" />
              <Sparkles size={48} className="hidden md:block" />
            </div>
            <h2 className="text-3xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
              Instant <span className="text-emerald-600">Health Chat</span>
            </h2>
            <p className="text-lg md:text-3xl text-slate-600 font-bold leading-relaxed">
              Have a quick question? Our Virtual Health Guide is available 24/7 for immediate guidance.
            </p>
            <div className="pt-4 md:pt-6">
              <button 
                onClick={onOpenChat}
                className="bg-emerald-600 text-white px-8 md:px-16 py-4 md:py-6 rounded-full font-black text-lg md:text-2xl hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-200 uppercase tracking-widest flex items-center justify-center gap-3 md:gap-4 mx-auto"
              >
                Chat with Virtual Guide <MessageSquare size={24} className="md:hidden" />
                <MessageSquare size={32} className="hidden md:block" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Education & Lifestyle (Blog) */}
      {recentBlogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Latest Health Insights</h2>
            <button onClick={() => onNavigate('blog')} className="text-emerald-600 font-bold flex items-center gap-1 hover:text-emerald-700 transition-colors">
              Read Journal <ChevronRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {recentBlogs.map((post) => (
              <div 
                key={post.id} 
                className="group cursor-pointer"
                onClick={() => onSelectBlog(post.id)}
              >
                <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-4 relative">
                  <img 
                    src={getOptimizedImageUrl(post.image_url || `https://picsum.photos/seed/supplement-blog-${post.id}/600/400`, 600)} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/healthcare-blog-${post.id}/600/400`;
                    }}
                  />
                  {post.category && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                      {post.category}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2 font-medium">
                  {post.meta_description || post.content.substring(0, 100).replace(/[#*`]/g, '') + '...'}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
