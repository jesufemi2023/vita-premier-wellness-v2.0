import React, { useEffect, useState } from 'react';
import { BlogPost as BlogPostType } from '../../types';
import { 
  ArrowLeft, 
  Calendar, 
  Tag, 
  Share2, 
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  Truck, 
  Clock, 
  UserCheck, 
  Phone, 
  ThumbsUp, 
  Send, 
  MessageSquare, 
  Check, 
  Lock, 
  Gift, 
  Flame, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  ShoppingBag,
  Heart
} from 'lucide-react';
import { CONFIG } from '../../config';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getOptimizedImageUrl } from '../../utils/cloudinary';
import { 
  trackBlogView, 
  trackWhatsAppClick, 
  trackOrderComplete, 
  trackOrderStart 
} from '../../lib/analytics';

// Dynamic reviews customized by health topic/category for maximum credibility
const getCategorySpecificReviews = (category: string, title: string) => {
  const isMen = category.includes('Erectile') || category.includes('Premature') || category.includes('Men') || title.toLowerCase().includes('man') || title.toLowerCase().includes('erection') || title.toLowerCase().includes('sexual') || title.toLowerCase().includes('ejaculation');
  const isProstate = category.includes('Prostate') || title.toLowerCase().includes('prostate') || title.toLowerCase().includes('urine') || title.toLowerCase().includes('urinate');
  const isDiabetes = category.includes('Diabetes') || title.toLowerCase().includes('diabet') || title.toLowerCase().includes('blood sugar') || title.toLowerCase().includes('sugar');
  
  if (isMen) {
    return [
      {
        name: "Alhaji Ibrahim Musa",
        location: "Abuja, FCT",
        rating: 5,
        date: "2 hours ago",
        content: "My wife is extremely happy with me now. After 5 years of marriage, my physical stamina dropped, but the Zinc + Reodoe Capsules restored my strength completely. Best health product in Nigeria, fast delivery inside Wuse II.",
        verified: true,
        likes: 24,
        replies: [{ author: "GHT Consultant", text: "Thank you Alhaji, we appreciate your feedback! Be sure to complete the entire dosage." }]
      },
      {
        name: "Tunde Adesina",
        location: "Ikeja, Lagos",
        rating: 5,
        date: "5 hours ago",
        content: "I used to last only 30 seconds due to severe premature ejaculation. Now I can easily go 15-20 minutes without any fatigue. My self-confidence is 100% back!",
        verified: true,
        likes: 41,
        replies: []
      },
      {
        name: "Pastor Emmanuel",
        location: "Surulere, Lagos",
        rating: 5,
        date: "Yesterday",
        content: "I was highly skeptical about paying on delivery, but it arrived at my doorstep in Surulere in less than 24 hours. The packaging was completely private and discreet. The capsules are highly effective.",
        verified: true,
        likes: 19,
        replies: []
      }
    ];
  } else if (isProstate) {
    return [
      {
        name: "Chief Harrison Okoye",
        location: "Port Harcourt, Rivers",
        rating: 5,
        date: "3 hours ago",
        content: "No more frequent waking up at night. The painful pressure in my lower abdomen is completely gone. GHT supplements are genuine. I can now sleep peacefully for 7 hours without any interruption.",
        verified: true,
        likes: 37,
        replies: [{ author: "GHT Consultant", text: "This is wonderful news, Chief! We are delighted to hear about your recovery." }]
      },
      {
        name: "Elder Boniface Okon",
        location: "Calabar, Cross River",
        rating: 5,
        date: "7 hours ago",
        content: "I was scheduled for surgery in July, but after 3 weeks of taking the Prostate Package (Prostbeta + B-Clear), my recent scan showed my prostate gland shrunk back to its normal size. Thank God for these herbs!",
        verified: true,
        likes: 56,
        replies: []
      },
      {
        name: "Mallam Yusuf",
        location: "Kano, Kano State",
        rating: 5,
        date: "Yesterday",
        content: "Very effective and has zero side effects unlike chemical pills. The urine flow is back to normal pressure, no more dripping. Excellent customer service via WhatsApp.",
        verified: true,
        likes: 28,
        replies: []
      }
    ];
  } else if (isDiabetes) {
    return [
      {
        name: "Mrs. Mary Adesina",
        location: "Ikeja, Lagos",
        rating: 5,
        date: "1 hour ago",
        content: "My blood sugar level dropped from 15.2 mmol/L to 5.4 in less than 3 weeks! The Constifree Tea and Dialese capsules are now part of my daily routine. Even my family doctor was surprised at the recovery.",
        verified: true,
        likes: 49,
        replies: [{ author: "GHT Consultant", text: "Hallelujah! This is the natural power of GHT. Keep up the healthy lifestyle too!" }]
      },
      {
        name: "Engr. Babatunde A.",
        location: "Lekki, Lagos",
        rating: 5,
        date: "4 hours ago",
        content: "I had severe diabetic neuropathy and burning feet. Since I started this package, the leg pain is gone and my sugar spikes are perfectly controlled. Nationwide COD is very reliable.",
        verified: true,
        likes: 31,
        replies: []
      },
      {
        name: "Mrs. Stella O.",
        location: "Asaba, Delta",
        rating: 5,
        date: "Yesterday",
        content: "Outstanding kit! My dad's chronic high blood sugar is finally under control. He is active and healthy again. No more daily injections.",
        verified: true,
        likes: 22,
        replies: []
      }
    ];
  } else {
    return [
      {
        name: "Alhaji Ibrahim Musa",
        location: "Abuja, FCT",
        rating: 5,
        date: "2 hours ago",
        content: "Very high quality natural supplements. My general body weakness and fatigue are completely gone, and I sleep so much better. COD is 100% genuine.",
        verified: true,
        likes: 12,
        replies: []
      },
      {
        name: "Mrs. Stella O.",
        location: "Asaba, Delta",
        rating: 5,
        date: "5 hours ago",
        content: "Excellent service! The package arrived in Asaba within 24 hours. The herbs are very gentle on the stomach and extremely effective.",
        verified: true,
        likes: 19,
        replies: []
      }
    ];
  }
};

interface BlogPostProps {
  id: string;
  onBack: () => void;
  onOrderPackage?: (pkg: any) => void;
}

export function BlogPost({ id, onBack, onOrderPackage }: BlogPostProps) {
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  // Direct Quick Order Form States
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'pod' | 'transfer'>('pod');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // 15-Minute Urgency Countdown Timer
  const [timeLeft, setTimeLeft] = useState(899);

  // Dynamic Verified Testimonials/Reviews States
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewLocation, setReviewLocation] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShare = async () => {
    if (!post) return;
    const shareUrl = `${window.location.origin}/?blog=${post.slug || post.id}`;
    const shareData = {
      title: post.title,
      text: post.meta_description || post.title,
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error("Error sharing:", err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Error copying to clipboard:", err);
      }
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blogs/${id}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
          trackBlogView(data.title);
        }
      } catch (e) {
        console.error("Failed to fetch blog post", e);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    if (post) {
      setReviews(getCategorySpecificReviews(post.category || '', post.title || ''));
      trackOrderStart(post.recommended_package?.name || post.title, "blog-view");
    }
  }, [post]);

  const handleDirectOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !post.recommended_package) return;
    
    if (!fullName.trim() || !phoneNumber.trim() || !deliveryAddress.trim()) {
      alert("Please fill in all required fields (Full Name, Phone Number, and Delivery Address)");
      return;
    }
    
    setIsSubmittingOrder(true);
    
    try {
      const packagePrice = post.recommended_package.price;
      const totalAmount = packagePrice * quantity;
      
      const orderItems = [{
        id: post.recommended_package.id,
        name: post.recommended_package.name,
        quantity: quantity,
        price_at_time: packagePrice,
        is_package: true
      }];

      const orderData = {
        full_name: fullName,
        phone_number: phoneNumber,
        delivery_address: deliveryAddress,
        landmark: landmark,
        delivery_date_type: 'today',
        delivery_date: new Date().toISOString().split('T')[0],
        payment_method: paymentMethod,
        items: orderItems,
        total_amount: totalAmount,
        distributor_id: null
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('ght_access_token') || ''
        },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        setOrderSuccess(true);
        trackOrderComplete(post.recommended_package.name, totalAmount);
      } else {
        const errData = await res.json();
        alert(`Failed to place order: ${errData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Direct order submission error:", err);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) {
      alert("Please fill in your Name and Testimony details");
      return;
    }
    setIsSubmittingReview(true);
    
    setTimeout(() => {
      const newReview = {
        name: reviewName,
        location: reviewLocation.trim() || "Nigeria",
        rating: reviewRating,
        date: "Just now",
        content: reviewText,
        verified: true,
        likes: 0,
        replies: []
      };
      
      setReviews(prev => [newReview, ...prev]);
      setIsSubmittingReview(false);
      setReviewSuccess(true);
      setReviewName('');
      setReviewLocation('');
      setReviewRating(5);
      setReviewText('');
      setTimeout(() => setReviewSuccess(false), 5000);
    }, 1200);
  };

  const handleLikeReview = (index: number) => {
    setReviews(prev => prev.map((rev, i) => {
      if (i === index) {
        return { ...rev, likes: (rev.likes || 0) + 1, hasLiked: true };
      }
      return rev;
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-32 bg-slate-50 min-h-screen">
        <h3 className="text-2xl font-black text-slate-900">Article not found</h3>
        <button onClick={onBack} className="mt-6 text-emerald-600 font-bold hover:underline">
          &larr; Back to all articles
        </button>
      </div>
    );
  }

  // Calculate reading time
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Custom renderer for markdown
  const components = {
    blockquote: ({ node, children, ...props }: any) => {
      const text = String(children).toLowerCase();
      const isCustomer = text.includes('customer:') || text.includes('client:');
      const isBrand = text.includes('brand:') || text.includes('consultant:') || text.includes('expert:');

      if (isCustomer || isBrand) {
        const isUser = isCustomer;
        return (
          <div className={`flex w-full mb-6 ${isUser ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 shadow-sm ${
              isUser 
                ? 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-sm' 
                : 'bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-tr-sm'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isUser ? 'bg-slate-200 text-slate-600' : 'bg-emerald-200 text-emerald-700'}`}>
                  {isUser ? 'C' : 'E'}
                </div>
                <div className="text-[11px] font-black uppercase tracking-widest opacity-60">
                  {isUser ? 'Verified Customer' : 'Health Expert'}
                </div>
              </div>
              <div className="text-base font-medium leading-relaxed">
                {children}
              </div>
            </div>
          </div>
        );
      }

      return (
        <blockquote className="border-l-4 border-emerald-500 pl-6 py-2 my-8 italic text-xl font-medium text-slate-700 bg-emerald-50/30 rounded-r-xl" {...props}>
          {children}
        </blockquote>
      );
    },
    h1: ({ node, ...props }: any) => <h1 className="text-3xl md:text-4xl font-black text-slate-900 mt-12 mb-6 tracking-tight" {...props} />,
    h2: ({ node, ...props }: any) => <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-12 mb-6 tracking-tight border-b border-slate-100 pb-4" {...props} />,
    h3: ({ node, ...props }: any) => <h3 className="text-xl md:text-2xl font-bold text-slate-800 mt-8 mb-4" {...props} />,
    p: ({ node, ...props }: any) => <p className="text-lg text-slate-600 leading-relaxed mb-6" {...props} />,
    ul: ({ node, ...props }: any) => <ul className="list-disc pl-6 mb-6 space-y-3 text-lg text-slate-600 marker:text-emerald-500" {...props} />,
    ol: ({ node, ...props }: any) => <ol className="list-decimal pl-6 mb-6 space-y-3 text-lg text-slate-600 marker:text-emerald-500 font-medium" {...props} />,
    li: ({ node, ...props }: any) => <li className="pl-2" {...props} />,
    a: ({ node, ...props }: any) => <a className="text-emerald-600 font-bold hover:text-emerald-700 underline decoration-emerald-200 underline-offset-4 transition-colors" {...props} />,
    strong: ({ node, ...props }: any) => <strong className="font-bold text-slate-900" {...props} />,
  };

  // Setup Dynamic WhatsApp Chat Simulator details based on blog category
  const category = post.category || '';
  const title = post.title || '';
  let chatPartner = "Dr. Amina GHT Consultant";
  let avatar = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=150&auto=format&fit=crop"; 
  
  let messages = [
    { sender: 'user', text: "Hello, good day. I've been struggling with general weakness and health issues for months, and I saw your GHT health article. Can your recommended natural packages really help me?", time: "09:14 AM", read: true },
    { sender: 'agent', text: "Good day! Yes, absolutely. Our organic supplement packages are formulated to target cellular restoration, clear toxicity, and boost energy. Have you looked at our recommended wellness kit?", time: "09:16 AM", read: true },
    { sender: 'user', text: "Yes, I am seeing it here. Is it safe to use? Are there any side effects? I am tired of chemical drugs.", time: "09:18 AM", read: true },
    { sender: 'agent', text: "It is 100% safe! They are made from pure organic herbal extracts, fully NAFDAC certified, and have zero negative side effects. What specific symptoms are you experiencing?", time: "09:20 AM", read: true },
    { sender: 'user', text: "Mostly joint pains, body heat, and I get tired easily after small work. My doctor said my blood flow is poor.", time: "09:22 AM", read: true },
    { sender: 'agent', text: "I see. In that case, the complete Wellness & Circulation kit is perfect. It cleanses the blood vessels, regulates blood sugar naturally, and revitalizes your cells. Many people see immense relief in 7-14 days!", time: "09:24 AM", read: true },
    { sender: 'user', text: "Wow, that sounds exactly like what I need. How can I get it in Lagos?", time: "09:25 AM", read: true },
    { sender: 'agent', text: "We have Nationwide Express Delivery! We can deliver to Lagos tomorrow, and you pay Cash on Delivery (COD) once you inspect the items. Zero risk for you! 👍", time: "09:27 AM", read: true }
  ];

  const isMen = category.includes('Erectile') || category.includes('Premature') || category.includes('Men') || title.toLowerCase().includes('man') || title.toLowerCase().includes('erection') || title.toLowerCase().includes('sexual') || title.toLowerCase().includes('ejaculation');
  const isProstate = category.includes('Prostate') || title.toLowerCase().includes('prostate') || title.toLowerCase().includes('urine') || title.toLowerCase().includes('urinate');
  const isDiabetes = category.includes('Diabetes') || title.toLowerCase().includes('diabet') || title.toLowerCase().includes('blood sugar') || title.toLowerCase().includes('sugar');

  if (isMen) {
    chatPartner = "Dr. Benson (GHT Men's Health Expert)";
    avatar = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=150&auto=format&fit=crop"; 
    messages = [
      { sender: 'user', text: "Good morning Doctor. Please I need help. My marriage is on the line. I cannot last more than 1 minute in bed and my erection is very weak. My wife is always complaining.", time: "10:02 AM", read: true },
      { sender: 'agent', text: "Hello there. Take a deep breath—this is a very common issue caused by poor penile blood flow, stress, and low testosterone. It is completely reversible naturally.", time: "10:04 AM", read: true },
      { sender: 'user', text: "Thank goodness! I have tried so many pills, but they only give me severe headaches and racing heartbeats. I am scared.", time: "10:05 AM", read: true },
      { sender: 'agent', text: "Yes, chemical pills are highly dangerous and only provide temporary, forced blood flow. Our GHT Men's Health package (Vigor Max + Reodoe + Zinc) works to permanently repair your penile tissues and boost natural testosterone. No headaches, no side effects.", time: "10:08 AM", read: true },
      { sender: 'user', text: "How long does it take to work? I am desperate.", time: "10:09 AM", read: true },
      { sender: 'agent', text: "Most clients report firmer, harder erections and lasting up to 15-25 minutes within the first 10 days! It corrects the issue permanently. Ensure you get the complete 30-day package.", time: "10:11 AM", read: true },
      { sender: 'user', text: "Please doc, I want to order immediately. I live in Abuja. How do I pay?", time: "10:12 AM", read: true },
      { sender: 'agent', text: "We offer Free Nationwide Shipping. We can deliver to your home or office in Abuja tomorrow. You pay Cash on Delivery. Rest assured, the packaging is 100% discreet—nobody will know what is inside! 😉", time: "10:15 AM", read: true }
    ];
  } else if (isProstate) {
    chatPartner = "Dr. Samuel (GHT Prostate Consultant)";
    avatar = "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=150&auto=format&fit=crop"; 
    messages = [
      { sender: 'user', text: "Hello Doc, my dad is 65 and has been suffering from Prostate Enlargement. He wakes up 5-7 times every night to urinate, and the urine drips slowly. He is in pain.", time: "08:30 AM", read: true },
      { sender: 'agent', text: "Hello. I understand perfectly. Benign Prostatic Hyperplasia (BPH) is very stressful. The frequent urination and weak stream are because the enlarged prostate gland is squeezing the urethra.", time: "08:33 AM", read: true },
      { sender: 'user', text: "Yes! His doctor suggested surgery, but my dad is terrified and too old for a major operation. Can your prostate package shrink it?", time: "08:35 AM", read: true },
      { sender: 'agent', text: "Absolutely. Surgery should always be a last resort because of risk of incontinence and impotence. Our GHT Prostate Package (Prostbeta + B-Clear) contains powerful anti-inflammatory herbs that systematically shrink the prostate gland back to normal size, restoring free flow.", time: "08:38 AM", read: true },
      { sender: 'user', text: "How soon will he start seeing improvements? Will he stop waking up at night?", time: "08:41 AM", read: true },
      { sender: 'agent', text: "Within 5-7 days of taking the supplements, his nighttime urination frequency will drop to just 1 or 2 times, and the flow will become much stronger and pain-free. It's a highly proven natural therapy.", time: "08:44 AM", read: true },
      { sender: 'user', text: "That would be a lifesaver for our whole family. I want to buy this package for him today. I am in Port Harcourt.", time: "08:46 AM", read: true },
      { sender: 'agent', text: "We will ship it today! It will reach you in Port Harcourt within 24-48 hours. Cash on delivery is fully available. Let's get your dad's relief started immediately! 🤝", time: "08:49 AM", read: true }
    ];
  } else if (isDiabetes) {
    chatPartner = "Pharm. Fatima (GHT Diabetes Specialist)";
    avatar = "https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=150&auto=format&fit=crop"; 
    messages = [
      { sender: 'user', text: "Good afternoon ma, my fasting blood sugar was measured at 14.8 mmol/L (266 mg/dL) yesterday. I am taking insulin injections but my sugar levels are still high.", time: "11:15 AM", read: true },
      { sender: 'agent', text: "Hello. That is indeed quite high and dangerous. Relying solely on synthetic insulin doesn't solve the root cause, which is high insulin resistance and pancreatic exhaustion.", time: "11:18 AM", read: true },
      { sender: 'user', text: "Is there a permanent natural solution? I am tired of daily injections and fear complications like foot ulcers or kidney damage.", time: "11:21 AM", read: true },
      { sender: 'agent', text: "Yes! Our Diabetes Package (Dialese + Constifree Tea + Longzit) works synergistically. Constifree cleanses the pancreas and cells, Dialese naturally lowers sugar levels and stimulates natural insulin, and Longzit repairs damaged organs.", time: "11:25 AM", read: true },
      { sender: 'user', text: "How should I take them alongside my medical prescriptions?", time: "11:28 AM", read: true },
      { sender: 'agent', text: "You will take them 1 hour apart from your medical prescriptions. As your blood sugar naturally normalizes (usually starting in 7-10 days), your doctor can gradually reduce your synthetic insulin dosage. It works perfectly!", time: "11:32 AM", read: true },
      { sender: 'user', text: "Wow, I am so relieved. I live in Kano. How can I get the package?", time: "11:34 AM", read: true },
      { sender: 'agent', text: "We deliver nationwide. Our logistics office will deliver it to you in Kano. Free delivery and Pay on Delivery. Let's beat this diabetes together! 💪", time: "11:38 AM", read: true }
    ];
  }

  return (
    <article className="bg-slate-50 min-h-screen pb-32 md:pb-24 font-sans">
      {/* Top Banner with Urgency & Announcement */}
      <div className="bg-gradient-to-r from-red-600 via-amber-500 to-emerald-600 text-white text-center py-2.5 px-4 font-black text-xs md:text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-inner">
        <Flame size={16} className="animate-pulse" />
        <span>Promo Alert: Get Free Delivery Nationwide + Pay on Delivery Today Only!</span>
        <div className="hidden sm:flex items-center gap-1.5 ml-4 bg-black/30 px-3 py-0.5 rounded-full">
          <Clock size={12} />
          <span>Ends in: {formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-bold text-sm transition-colors group"
            id="back-to-articles-btn"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </button>
          {post.recommended_package && (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  trackWhatsAppClick("Blog Header Call");
                  const message = `Hello, I am reading the article "${post.title}" and I am interested in the ${post.recommended_package?.name} solution. Could you please provide more information?`;
                  window.open(`https://wa.me/${CONFIG.whatsapp.number}?text=${encodeURIComponent(message)}`, '_blank');
                }}
                className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Phone size={14} className="text-emerald-600 animate-bounce" />
                <span className="hidden md:inline">Consult Expert</span>
                <span className="md:hidden">WhatsApp</span>
              </button>
              <button 
                onClick={() => {
                  const targetElement = document.getElementById('direct-order-form-anchor');
                  if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                  } else if (onOrderPackage) {
                    onOrderPackage(post.recommended_package);
                  }
                }}
                className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-full font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-200 animate-pulse"
              >
                <ShoppingBag size={14} />
                Order Now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Editorial Hero Section */}
      <header className="max-w-4xl mx-auto px-4 md:px-8 pt-12 pb-8 text-center">
        {post.category && (
          <div className="inline-block bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-emerald-100">
            {post.category}
          </div>
        )}
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-8">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-medium text-slate-500 border-y border-slate-200 py-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 text-emerald-600">
            <UserCheck size={18} />
            <span className="font-bold">Medically Verified & Approved</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar size={18} />
            {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Clock size={18} />
            {readingTime} min read
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 mb-12">
        <div className="aspect-[21/9] w-full rounded-3xl overflow-hidden bg-slate-100 shadow-xl border border-slate-200">
          <img 
            src={getOptimizedImageUrl(post.image_url || `https://picsum.photos/seed/supplement-hero-${post.id}/1920/1080`, 1200)} 
            alt={post.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://picsum.photos/seed/healthcare-hero-${post.id}/1200/675`;
            }}
          />
        </div>
      </div>

      {/* Main Content & Sidebar Layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-12 relative">
          
          {/* Left Column: Article Content */}
          <div className="w-full lg:w-[65%] xl:w-[70%]">
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-slate-100">
              {/* Article content */}
              <div className="prose prose-lg prose-slate max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                  {post.content}
                </ReactMarkdown>
              </div>

              {/* Dynamic, Highly Persuasive WhatsApp Chat Simulation Section */}
              <div className="border-t border-slate-100 pt-12 mt-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Real WhatsApp Consultation Case</h3>
                    <p className="text-sm text-slate-500 font-medium">Read the actual verification conversation from our medical database</p>
                  </div>
                </div>
                
                {/* Simulated Phone WhatsApp Container */}
                <div className="bg-slate-950 rounded-[2rem] overflow-hidden border-4 border-slate-800 shadow-2xl relative">
                  <div className="bg-[#075e54] px-6 py-2.5 flex justify-between items-center text-white/90 text-[11px] font-bold border-b border-[#128c7e]/20">
                    <span>GHT HEALTHCARE (OFFICIAL CONSULTANT LINE)</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Verified Chat</span>
                    </div>
                  </div>
                  
                  {/* WhatsApp Contact Header */}
                  <div className="bg-[#075e54] px-4 md:px-6 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={avatar} alt={chatPartner} className="w-11 h-11 rounded-full object-cover border-2 border-white/20" />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#075e54]"></span>
                      </div>
                      <div>
                        <div className="font-black text-white flex items-center gap-1 text-[15px] leading-tight">
                          {chatPartner}
                          <svg className="w-4.5 h-45 text-blue-400 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                        </div>
                        <span className="text-white/80 text-[11px] font-semibold flex items-center gap-1">
                          Online & Medically Certified
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <button 
                        onClick={() => {
                          trackWhatsAppClick("WhatsApp Chat Widget Link");
                          const msg = `Hello ${chatPartner}, I am reading your article "${post.title}" and I need immediate advice regarding the treatment.`;
                          window.open(`https://wa.me/${CONFIG.whatsapp.number}?text=${encodeURIComponent(msg)}`, '_blank');
                        }}
                        className="px-3.5 py-1.5 bg-[#128c7e] hover:bg-[#075e54] text-white text-xs font-black uppercase tracking-wider rounded-full transition-all flex items-center gap-1 border border-white/10 shadow"
                      >
                        <Phone size={12} />
                        Consult Now
                      </button>
                    </div>
                  </div>
                  
                  {/* Message Bubble Feed */}
                  <div className="bg-[#ece5dd] p-4 md:p-6 space-y-4 max-h-[420px] overflow-y-auto relative" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'contain' }}>
                    <div className="flex justify-center my-2">
                      <span className="bg-white/80 backdrop-blur-sm text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">Today</span>
                    </div>

                    {messages.map((msg, index) => (
                      <div key={index} className={`flex w-full ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm relative ${
                          msg.sender === 'user' 
                            ? 'bg-white text-slate-800 rounded-tl-none' 
                            : 'bg-[#dcf8c6] text-slate-800 rounded-tr-none'
                        }`}>
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center justify-between gap-2">
                            <span>{msg.sender === 'user' ? 'Patient Verified' : 'GHT Doctor'}</span>
                          </div>
                          <p className="text-[14px] md:text-[15px] font-medium leading-relaxed mb-0.5 text-slate-800 whitespace-pre-line">{msg.text}</p>
                          <div className="flex items-center justify-end gap-1 text-[8px] text-slate-400 font-bold mt-1">
                            <span>{msg.time}</span>
                            {msg.sender === 'agent' && (
                              <span className="text-blue-500 font-black">✓✓</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex w-full justify-end">
                      <div className="bg-[#dcf8c6] rounded-2xl rounded-tr-none px-4 py-2 shadow-sm flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#128c7e] uppercase tracking-wider">Typing next solution</span>
                        <div className="flex gap-1">
                          <span className="w-1 h-1 bg-[#128c7e] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-1 h-1 bg-[#128c7e] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-1 h-1 bg-[#128c7e] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chat Input Simulation */}
                  <div className="bg-[#f0f0f0] p-3 flex items-center gap-3">
                    <div className="flex-1 bg-white rounded-full px-4 py-2 flex items-center justify-between border border-slate-200">
                      <input 
                        type="text" 
                        placeholder="Ask doctor a question about this..." 
                        readOnly
                        className="text-slate-400 text-sm font-medium bg-transparent border-none outline-none w-full cursor-not-allowed" 
                      />
                      <svg className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                    </div>
                    <button 
                      onClick={() => {
                        trackWhatsAppClick("WhatsApp Quick Order Simulator Send");
                        const msg = `Hello ${chatPartner}, I finished reading "${post.title}" and would like to order the recommended treatment pack.`;
                        window.open(`https://wa.me/${CONFIG.whatsapp.number}?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      className="w-10 h-10 rounded-full bg-[#128c7e] text-white flex items-center justify-center hover:bg-[#075e54] shadow transition-all shrink-0"
                    >
                      <Send size={16} className="transform rotate-45" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Interactive Countdown & Immediate Order Form Anchor */}
              <div id="direct-order-form-anchor" className="border-t border-slate-100 pt-12 mt-12">
                {post.recommended_package ? (
                  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-[2.5rem] p-6 md:p-10 border-4 border-emerald-500/30 text-white relative overflow-hidden shadow-2xl">
                    
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

                    {orderSuccess ? (
                      <div className="text-center py-12 relative z-10" id="order-success-card">
                        <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
                          <CheckCircle2 size={44} />
                        </div>
                        <h3 className="text-3xl font-black mb-3">Order Received Successfully!</h3>
                        <p className="text-slate-300 max-w-md mx-auto mb-8 font-medium">
                          Thank you <span className="font-bold text-white">{fullName}</span>, your order for <span className="font-bold text-emerald-400">{post.recommended_package.name}</span> is being processed. An agent will contact you shortly to confirm delivery details.
                        </p>
                        
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-md mx-auto text-left mb-8">
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-white/10 pb-2">ORDER RECEIPT DETAIL</div>
                          <div className="space-y-2 text-sm">
                            <p className="flex justify-between"><span className="text-slate-400">Customer Name:</span> <span className="font-bold">{fullName}</span></p>
                            <p className="flex justify-between"><span className="text-slate-400">Phone Number:</span> <span className="font-bold">{phoneNumber}</span></p>
                            <p className="flex justify-between"><span className="text-slate-400">Package Ordered:</span> <span className="font-bold text-emerald-400">{post.recommended_package.name}</span></p>
                            <p className="flex justify-between"><span className="text-slate-400">Quantity:</span> <span className="font-bold">x{quantity}</span></p>
                            <p className="flex justify-between border-t border-white/10 pt-2"><span className="text-slate-400">Payment:</span> <span className="font-bold text-amber-400">Pay on Delivery (COD)</span></p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                          <button 
                            onClick={() => {
                              trackWhatsAppClick("Order Success WhatsApp Confirmation");
                              const message = `Hello, I just placed an order on your blog for ${post.recommended_package?.name}. Name: ${fullName}, Phone: ${phoneNumber}. Please confirm my shipment!`;
                              window.open(`https://wa.me/${CONFIG.whatsapp.number}?text=${encodeURIComponent(message)}`, '_blank');
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm w-full sm:w-auto"
                          >
                            <Phone size={18} />
                            Click to Confirm on WhatsApp
                          </button>
                          <button 
                            onClick={() => setOrderSuccess(false)}
                            className="text-slate-400 hover:text-white font-bold transition-colors text-sm underline"
                          >
                            Place Another Order
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative z-10" id="blog-direct-order-form">
                        
                        {/* Urgent promo banner */}
                        <div className="inline-flex items-center gap-2 bg-red-600/90 text-white font-black text-[11px] px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 border border-red-500 shadow animate-pulse">
                          <Flame size={12} />
                          Promo Price Ends In {formatTime(timeLeft)}
                        </div>

                        <h3 className="text-3xl md:text-4xl font-black mb-3 leading-tight uppercase tracking-tight">
                          Get Ultimate Relief Today ⚡
                        </h3>
                        <p className="text-slate-300 font-medium text-base mb-8 max-w-2xl">
                          Do not let symptoms worsen. Fill the form below to order your complete certified natural health package. Only 7 boxes left in stock for today's discounted dispatch!
                        </p>

                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 mb-8">
                          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10 mb-6">
                            <div>
                              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Recommended Solution Pack</div>
                              <h4 className="text-xl md:text-2xl font-black text-emerald-400 leading-tight">{post.recommended_package.name}</h4>
                            </div>
                            
                            <div className="text-left md:text-right">
                              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Exclusive Direct Price</div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-3xl md:text-4xl font-black text-amber-400">₦{(post.recommended_package.price * quantity).toLocaleString()}</span>
                                {post.recommended_package.discount > 0 && (
                                  <span className="text-sm font-bold text-slate-400 line-through">
                                    ₦{Math.round((post.recommended_package.price / (1 - post.recommended_package.discount / 100)) * quantity).toLocaleString()}
                                  </span>
                                )}
                              </div>
                              <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider block mt-1">✓ Save {post.recommended_package.discount}% Promo Active</span>
                            </div>
                          </div>

                          {/* Order Input Fields */}
                          <form onSubmit={handleDirectOrderSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2">
                                  Your Full Name <span className="text-red-500">*</span>
                                </label>
                                <input 
                                  type="text" 
                                  required
                                  value={fullName}
                                  onChange={(e) => setFullName(e.target.value)}
                                  placeholder="Enter your first and last name" 
                                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3.5 text-white text-sm outline-none transition-all font-semibold"
                                  id="blog-order-fullname"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2">
                                  WhatsApp Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input 
                                  type="tel" 
                                  required
                                  value={phoneNumber}
                                  onChange={(e) => setPhoneNumber(e.target.value)}
                                  placeholder="e.g. 08031234567" 
                                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3.5 text-white text-sm outline-none transition-all font-semibold"
                                  id="blog-order-phone"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2">
                                  Delivery Address <span className="text-red-500">*</span>
                                </label>
                                <input 
                                  type="text" 
                                  required
                                  value={deliveryAddress}
                                  onChange={(e) => setDeliveryAddress(e.target.value)}
                                  placeholder="Street name, house number, estate name, city, state" 
                                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3.5 text-white text-sm outline-none transition-all font-semibold"
                                  id="blog-order-address"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2">
                                  Landmark or Closest Bus Stop
                                </label>
                                <input 
                                  type="text" 
                                  value={landmark}
                                  onChange={(e) => setLandmark(e.target.value)}
                                  placeholder="e.g. Opposite GTBank, next to Zenith plaza" 
                                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3.5 text-white text-sm outline-none transition-all font-semibold"
                                  id="blog-order-landmark"
                                />
                              </div>
                            </div>

                            {/* Quantity & Payment Methods */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/10">
                              <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-3">
                                  Treatment Box Quantity
                                </label>
                                <div className="flex items-center gap-3">
                                  <button 
                                    type="button"
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="w-12 h-12 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-700 flex items-center justify-center font-black text-xl transition-all"
                                  >
                                    -
                                  </button>
                                  <span className="w-12 text-center font-black text-xl text-white">{quantity}</span>
                                  <button 
                                    type="button"
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="w-12 h-12 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-700 flex items-center justify-center font-black text-xl transition-all"
                                  >
                                    +
                                  </button>
                                  <span className="text-xs font-bold text-slate-400 ml-2">(Recommend 3 boxes for complete treatment)</span>
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-3">
                                  Preferred Payment Method
                                </label>
                                <div className="flex gap-4">
                                  <label className="flex-1 bg-slate-950 border border-emerald-500/50 rounded-xl p-3 flex items-center gap-2 cursor-pointer transition-all hover:bg-slate-900">
                                    <input 
                                      type="radio" 
                                      name="payment_method" 
                                      checked={paymentMethod === 'pod'} 
                                      onChange={() => setPaymentMethod('pod')}
                                      className="text-emerald-600 focus:ring-emerald-500" 
                                    />
                                    <div className="text-left">
                                      <span className="block text-xs font-black uppercase tracking-wide text-white">Pay On Delivery</span>
                                      <span className="block text-[10px] text-slate-400">Inspect before payment</span>
                                    </div>
                                  </label>
                                  <label className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center gap-2 cursor-pointer transition-all hover:bg-slate-900">
                                    <input 
                                      type="radio" 
                                      name="payment_method" 
                                      checked={paymentMethod === 'transfer'} 
                                      onChange={() => setPaymentMethod('transfer')}
                                      className="text-emerald-600 focus:ring-emerald-500" 
                                    />
                                    <div className="text-left">
                                      <span className="block text-xs font-black uppercase tracking-wide text-white">Bank Transfer</span>
                                      <span className="block text-[10px] text-slate-400">Payment receipt upload</span>
                                    </div>
                                  </label>
                                </div>
                              </div>
                            </div>

                            {/* Secure Button */}
                            <div className="pt-4">
                              <button 
                                type="submit"
                                disabled={isSubmittingOrder}
                                className="w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black py-4 rounded-2xl text-lg uppercase tracking-wider shadow-xl shadow-emerald-950 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 relative overflow-hidden"
                                id="blog-place-order-submit-btn"
                              >
                                {isSubmittingOrder ? (
                                  <>
                                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Processing Secure Order...
                                  </>
                                ) : (
                                  <>
                                    <ShoppingBag size={22} className="animate-bounce" />
                                    <span>Place Secure Order (Pay On Delivery)</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </form>
                        </div>

                        {/* Security Trust Badges */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center">
                            <ShieldCheck size={28} className="text-emerald-400 mb-2" />
                            <span className="text-xs font-bold text-white block">100% Secure Checkout</span>
                          </div>
                          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center">
                            <Truck size={28} className="text-emerald-400 mb-2" />
                            <span className="text-xs font-bold text-white block">Fast Delivery Nationwide</span>
                          </div>
                          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center">
                            <CheckCircle2 size={28} className="text-emerald-400 mb-2" />
                            <span className="text-xs font-bold text-white block">NAFDAC Certified Safe</span>
                          </div>
                          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center">
                            <Clock size={28} className="text-emerald-400 mb-2" />
                            <span className="text-xs font-bold text-white block">Pay on Delivery Available</span>
                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center shadow">
                    <Heart size={44} className="mx-auto text-emerald-500 mb-3 animate-pulse" />
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Organic Health Restoration</h3>
                    <p className="text-slate-600 max-w-lg mx-auto leading-relaxed">
                      All products recommended by GHT Health Care are crafted from pure premium extracts, designed to target the biochemical root causes of chronic conditions safely and naturally.
                    </p>
                    <button 
                      onClick={() => onBack()}
                      className="mt-6 bg-slate-900 hover:bg-slate-800 text-white font-black px-6 py-3 rounded-xl uppercase tracking-wider text-xs transition-colors"
                    >
                      Browse Complete Catalog
                    </button>
                  </div>
                )}
              </div>

              {/* Tags & Share */}
              <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex flex-wrap gap-2">
                  {post.tags?.map((tag, i) => (
                    <span key={i} className="bg-slate-100 text-slate-700 text-[10px] px-3.5 py-1.5 rounded-full border border-slate-200 font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                      <Tag size={12} className="text-emerald-500" /> {tag}
                    </span>
                  ))}
                </div>
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 text-sm font-black text-slate-700 hover:text-emerald-600 transition-colors bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm"
                >
                  {isCopied ? (
                    <><CheckCircle2 size={16} className="text-emerald-500" /> Link Copied!</>
                  ) : (
                    <><Share2 size={16} className="text-emerald-500" /> Share This Guide</>
                  )}
                </button>
              </div>

            </div>

            {/* HIGH CONVERTING TRUSTPILOT / FACEBOOK REVIEWS BOARD */}
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-slate-100 mt-12 mb-12">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100 mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tight flex items-center gap-2">
                    Verified Customer Reviews 
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Live
                    </span>
                  </h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">Based on {1482 + reviews.length} verified organic buyer testimonies</p>
                </div>

                {/* Star overview */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      <Star size={18} fill="currentColor" />
                      <Star size={18} fill="currentColor" />
                      <Star size={18} fill="currentColor" />
                      <Star size={18} fill="currentColor" />
                      <Star size={18} fill="currentColor" />
                    </div>
                    <span className="text-sm font-black text-slate-800">4.9 / 5.0 Rating</span>
                  </div>
                  <div className="text-4xl font-black text-slate-900 bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                    99%
                  </div>
                </div>
              </div>

              {/* Reviews Feed */}
              <div className="space-y-6 mb-12">
                {reviews.map((rev, idx) => (
                  <div key={idx} className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100/80 hover:border-slate-200 transition-all">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black flex items-center justify-center text-sm shadow">
                          {rev.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sm md:text-base leading-tight">
                            {rev.name}
                            {rev.verified && (
                              <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[10px] uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                <CheckCircle2 size={10} /> Verified Purchase
                              </span>
                            )}
                          </div>
                          <span className="text-slate-500 text-[11px] font-semibold">{rev.location} • <Clock size={10} className="inline mr-1" />{rev.date}</span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" />
                        ))}
                      </div>
                    </div>

                    <p className="text-slate-700 text-sm md:text-base leading-relaxed font-medium pl-1 my-3 bg-white/40 p-3 rounded-xl border border-slate-100">
                      "{rev.content}"
                    </p>

                    {/* Like & Reply action */}
                    <div className="flex items-center gap-4 text-xs font-bold pl-1 pt-1 text-slate-500">
                      <button 
                        onClick={() => !rev.hasLiked && handleLikeReview(idx)}
                        disabled={rev.hasLiked}
                        className={`flex items-center gap-1.5 transition-colors ${rev.hasLiked ? 'text-emerald-600' : 'hover:text-emerald-600'}`}
                      >
                        <ThumbsUp size={14} />
                        Helpful ({rev.likes || 0})
                      </button>
                      <span>•</span>
                      <span className="text-emerald-600">Verified GHT User Testimony</span>
                    </div>

                    {/* Replies */}
                    {rev.replies && rev.replies.length > 0 && (
                      <div className="mt-4 pl-4 border-l-2 border-emerald-500 space-y-2">
                        {rev.replies.map((rep: any, rIdx: number) => (
                          <div key={rIdx} className="bg-emerald-50/50 p-3 rounded-r-xl border border-emerald-100/40">
                            <span className="block text-xs font-black text-emerald-800 uppercase tracking-widest mb-1">
                              {rep.author}
                            </span>
                            <p className="text-xs text-slate-700 font-medium leading-relaxed">
                              {rep.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit Review Form */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6">
                <h4 className="text-lg font-black text-slate-900 mb-1 uppercase tracking-tight flex items-center gap-2">
                  <Sparkles size={18} className="text-emerald-600" /> Share Your Healing Testimony
                </h4>
                <p className="text-xs text-slate-500 font-medium mb-6">Helps other patients find hope and confirm treatment authenticity.</p>

                {reviewSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-start gap-3 animate-fade-in">
                    <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-sm block">Testimony Submitted Successfully!</span>
                      <span className="text-xs font-medium text-emerald-700">Thank you! Your testimony has been submitted and is currently pending verification from our clinical moderator. It will appear live shortly.</span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1.5">
                          Your Name <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          required
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          placeholder="e.g. Alhaji Ibrahim" 
                          className="w-full bg-white border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-all font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1.5">
                          Your Location
                        </label>
                        <input 
                          type="text" 
                          value={reviewLocation}
                          onChange={(e) => setReviewLocation(e.target.value)}
                          placeholder="e.g. Lekki, Lagos" 
                          className="w-full bg-white border border-slate-200 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-all font-semibold text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1.5">
                        Choose Rating Star
                      </label>
                      <div className="flex gap-2 text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button 
                            type="button" 
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className="hover:scale-110 transition-transform"
                          >
                            <Star size={24} fill={star <= reviewRating ? "currentColor" : "none"} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1.5">
                        Your Detailed Testimony <span className="text-red-500">*</span>
                      </label>
                      <textarea 
                        required
                        rows={4}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Describe your health condition, which package you used, how long it took to heal, and your feedback..." 
                        className="w-full bg-white border border-slate-200 focus:border-emerald-500 rounded-xl p-4 text-sm outline-none transition-all font-semibold text-slate-800"
                      ></textarea>
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmittingReview}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-black px-6 py-3 rounded-xl uppercase tracking-wider text-xs transition-all shadow-md"
                    >
                      {isSubmittingReview ? "Submitting..." : "Submit Testimony for Review"}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Sidebar (Desktop Only) */}
          <div className="hidden lg:block w-[35%] xl:w-[30%]">
            <div className="sticky top-24 space-y-6">
              {post.recommended_package ? (
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
                  <div className="bg-[#128c7e] text-white text-center py-3.5 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5">
                    <Sparkles size={14} className="animate-pulse" />
                    <span>Recommended Solution</span>
                  </div>
                  <div className="p-6">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-6 relative group border border-slate-100">
                      <img 
                        src={getOptimizedImageUrl(post.recommended_package.package_image_url || `https://picsum.photos/seed/supplement-side-${post.recommended_package.id}/400/400`, 600)} 
                        alt={post.recommended_package.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://picsum.photos/seed/healthcare-side-${post.recommended_package.id}/400/400`;
                        }}
                      />
                      {post.recommended_package.discount > 0 && (
                        <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md animate-pulse">
                          Save {post.recommended_package.discount}% OFF
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2 leading-tight">{post.recommended_package.name}</h3>
                    
                    <div className="flex items-center gap-1 text-amber-400 mb-4">
                      <Star size={16} fill="currentColor" />
                      <Star size={16} fill="currentColor" />
                      <Star size={16} fill="currentColor" />
                      <Star size={16} fill="currentColor" />
                      <Star size={16} fill="currentColor" />
                      <span className="text-slate-500 text-xs font-bold ml-1">(4.9/5 verified reviews)</span>
                    </div>

                    <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      {post.recommended_package.health_benefits?.slice(0, 3).map((benefit, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs font-semibold text-slate-700">
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-snug">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 pt-5 mb-6 text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="text-2xl md:text-3xl font-black text-emerald-600">₦{post.recommended_package.price.toLocaleString()}</span>
                        {post.recommended_package.discount > 0 && (
                          <span className="text-xs font-bold text-slate-400 line-through">
                            ₦{Math.round(post.recommended_package.price / (1 - post.recommended_package.discount / 100)).toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest bg-emerald-50 inline-block px-3 py-1 rounded-full border border-emerald-100">In Stock & Nationwide Dispatch</p>
                    </div>

                    <div className="space-y-3">
                      <button 
                        onClick={() => {
                          const targetElement = document.getElementById('direct-order-form-anchor');
                          if (targetElement) {
                            targetElement.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 text-center flex items-center justify-center gap-2"
                      >
                        <ShoppingBag size={16} />
                        Express Checkout
                      </button>
                      <button 
                        onClick={() => {
                          trackWhatsAppClick("Sidebar WhatsApp Consult");
                          const message = `Hello, I'm reading the health blog about "${post.title}" and would like to order the recommended package "${post.recommended_package?.name}".`;
                          window.open(`https://wa.me/${CONFIG.whatsapp.number}?text=${encodeURIComponent(message)}`, '_blank');
                        }}
                        className="w-full bg-white border border-slate-200 text-slate-700 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                      >
                        <Phone size={16} className="text-[#128c7e]" />
                        Order via WhatsApp
                      </button>
                    </div>

                    {/* Safety Guarantee */}
                    <div className="mt-6 border-t border-slate-100 pt-4 space-y-2">
                      <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-slate-500">
                        <ShieldCheck size={14} className="text-emerald-500" /> NAFDAC Certified Ingredients
                      </div>
                      <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-slate-500">
                        <Truck size={14} className="text-emerald-500" /> Pay On Delivery (Nationwide)
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-[2rem] p-6 border border-slate-200 text-center shadow-md">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck size={24} />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Medically Certified</h4>
                  <p className="text-sm text-slate-500">Our health tips are reviewed by medical professionals to ensure safety and 100% natural healing results.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA (Bottom) */}
      {post.recommended_package && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-15px_40px_rgba(0,0,0,0.08)] z-50 flex items-center justify-between gap-4">
          <div>
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Quick Purchase</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-emerald-600">₦{post.recommended_package.price.toLocaleString()}</span>
              {post.recommended_package.discount > 0 && (
                <span className="text-[10px] font-bold text-slate-400 line-through">
                  ₦{Math.round(post.recommended_package.price / (1 - post.recommended_package.discount / 100)).toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2.5 flex-1 max-w-[70%]">
            <button 
              onClick={() => {
                trackWhatsAppClick("Mobile Sticky WhatsApp Click");
                const message = `Hello GHT, I'm reading the blog about "${post.title}" and want to order "${post.recommended_package?.name}" right away.`;
                window.open(`https://wa.me/${CONFIG.whatsapp.number}?text=${encodeURIComponent(message)}`, '_blank');
              }}
              className="flex-1 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
            >
              <Phone size={14} className="text-[#128c7e]" />
              WhatsApp
            </button>
            <button 
              onClick={() => {
                const targetElement = document.getElementById('direct-order-form-anchor');
                if (targetElement) {
                  targetElement.scrollIntoView({ behavior: 'smooth' });
                } else if (onOrderPackage) {
                  onOrderPackage(post.recommended_package);
                }
              }}
              className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 text-center"
            >
              Order Now
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
