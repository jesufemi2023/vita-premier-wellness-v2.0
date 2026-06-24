import React, { useEffect, useState } from 'react';
import { BlogPost } from '../../types';
import { Calendar, ChevronRight, Tag, Sparkles, MessageSquare, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/cloudinary';
import { CONFIG } from '../../config';
import { trackWhatsAppClick } from '../../lib/analytics';

interface BlogListProps {
  onSelectPost: (id: string) => void;
}

export function BlogList({ onSelectPost }: BlogListProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/blogs');
        if (res.ok) {
          setPosts(await res.json());
        }
      } catch (e) {
        console.error("Failed to fetch blogs", e);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 max-w-4xl mx-auto my-12">
        <h3 className="text-xl font-bold text-slate-700">No articles found</h3>
        <p className="text-slate-500 mt-2">Check back later for new certified medical insights.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Editorial Header Section */}
      <div className="text-center mb-16 relative">
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
          <ShieldCheck size={14} />
          Medically Reviewed & Approved Journal
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 leading-none">
          Proven Natural Solutions & <span className="text-emerald-600">Health Guides</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
          Read verified medical reports, patient testimonials, and expert herbal therapy guides designed to heal chronic ailments permanently without toxic side effects.
        </p>

        {/* Global trust symbols */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500" /> NAFDAC Certified Solutions</span>
          <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500" /> 100% Organic Herbal Extract</span>
          <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500" /> Nationwide Cash On Delivery</span>
        </div>
      </div>

      {/* Main Grid: split with a high-impact consultation ad banner */}
      <div className="space-y-12">
        
        {/* First Row: 3 standard articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post) => (
            <div 
              key={post.id} 
              className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border border-slate-100 hover:-translate-y-1.5 transition-all duration-500 cursor-pointer group flex flex-col relative"
              onClick={() => onSelectPost(post.id)}
              id={`blog-card-${post.id}`}
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img 
                  src={getOptimizedImageUrl(post.image_url || `https://picsum.photos/seed/supplement-article-${post.id}/800/600`, 800)} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/healthcare-article-${post.id}/800/600`;
                  }}
                />
                
                {post.category && (
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border border-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-emerald-800 uppercase tracking-widest shadow">
                    {post.category}
                  </div>
                )}

                {/* Highly Ad-Focused package indicator banner */}
                {post.recommended_package && (
                  <div className="absolute bottom-3 left-3 right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-[10px] px-3 py-1.5 rounded-xl uppercase tracking-wider flex items-center justify-between shadow-lg">
                    <span>⚡ Treatment Kit Included</span>
                    <span className="text-white/90">View Cure &rarr;</span>
                  </div>
                )}
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-3 font-semibold">
                  <Calendar size={14} className="text-emerald-500" />
                  {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                
                <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2.5 line-clamp-2 group-hover:text-emerald-600 transition-colors leading-snug">
                  {post.title}
                </h3>
                
                <p className="text-sm text-slate-500 mb-6 line-clamp-3 flex-1 font-medium leading-relaxed">
                  {post.meta_description || post.content.substring(0, 150).replace(/[#*`]/g, '') + '...'}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Tag size={13} className="text-emerald-500 shrink-0" />
                    <div className="flex gap-1 overflow-hidden">
                      {post.tags?.slice(0, 2).map((tag, i) => (
                        <span key={i} className="text-[9px] font-black text-slate-500 uppercase tracking-wider truncate bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-emerald-600 font-black text-xs uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read Article <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* HIGHLY CONVERTING SPONSOR AD LEAD BANNER */}
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 border-4 border-emerald-500/30">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
          
          <div className="relative z-10 max-w-2xl text-left">
            <div className="inline-flex items-center gap-1.5 bg-amber-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4 border border-amber-400">
              <Sparkles size={12} />
              Free Medical Consultation
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black mb-4 uppercase tracking-tight leading-none">
              Have a Chronic Health Condition?
            </h2>
            <p className="text-slate-100 font-medium text-base md:text-lg mb-0 leading-relaxed max-w-xl">
              Get an immediate private chat with our Senior GHT Medical Consultant on WhatsApp. Explain your health issues and get professional dosage advice for free. 100% confidential.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-6 text-xs font-bold text-emerald-200">
              <span className="flex items-center gap-1">✓ Instant Reply</span>
              <span className="flex items-center gap-1">✓ Privacy Protected</span>
              <span className="flex items-center gap-1">✓ Certified Doctors</span>
            </div>
          </div>

          <div className="relative z-10 shrink-0 w-full lg:w-auto">
            <button 
              onClick={() => {
                trackWhatsAppClick("Blog List Large Consultation Ad");
                const message = `Hello SD GHT Health Care, I am visiting your blog page and I would like a free health consultation with a senior consultant.`;
                window.open(`https://wa.me/${CONFIG.whatsapp.number}?text=${encodeURIComponent(message)}`, '_blank');
              }}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-8 py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase tracking-wider text-sm w-full lg:w-auto hover:-translate-y-1"
            >
              <Phone size={18} className="text-slate-950 animate-bounce" />
              <span>Consult Expert on WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Second Row: Remaining articles */}
        {posts.length > 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
            {posts.slice(3).map((post) => (
              <div 
                key={post.id} 
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/60 hover:-translate-y-1.5 transition-all duration-500 cursor-pointer group flex flex-col relative"
                onClick={() => onSelectPost(post.id)}
                id={`blog-card-${post.id}`}
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img 
                    src={getOptimizedImageUrl(post.image_url || `https://picsum.photos/seed/supplement-article-${post.id}/800/600`, 800)} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/healthcare-article-${post.id}/800/600`;
                    }}
                  />
                  
                  {post.category && (
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border border-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-emerald-800 uppercase tracking-widest shadow">
                      {post.category}
                    </div>
                  )}

                  {post.recommended_package && (
                    <div className="absolute bottom-3 left-3 right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-[10px] px-3 py-1.5 rounded-xl uppercase tracking-wider flex items-center justify-between shadow-lg">
                      <span>⚡ Treatment Kit Included</span>
                      <span className="text-white/90">View Cure &rarr;</span>
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-3 font-semibold">
                    <Calendar size={14} className="text-emerald-500" />
                    {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2.5 line-clamp-2 group-hover:text-emerald-600 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  
                  <p className="text-sm text-slate-500 mb-6 line-clamp-3 flex-1 font-medium leading-relaxed font-medium">
                    {post.meta_description || post.content.substring(0, 150).replace(/[#*`]/g, '') + '...'}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Tag size={13} className="text-emerald-500 shrink-0" />
                      <div className="flex gap-1 overflow-hidden">
                        {post.tags?.slice(0, 2).map((tag, i) => (
                          <span key={i} className="text-[9px] font-black text-slate-500 uppercase tracking-wider truncate bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-emerald-600 font-black text-xs uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read Article <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
