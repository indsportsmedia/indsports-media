import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  CheckCircle, 
  MapPin, 
  Clock, 
  Award, 
  Share2, 
  ChevronRight, 
  Calendar,
  Zap,
  Shield,
  Film,
  Target
} from 'lucide-react';

interface ServiceDetailProps {
  serviceId: 'game-coverage' | 'girls-flag-football';
  onBack: () => void;
  onBookNow: () => void;
}

export default function ServiceDetailPage({ serviceId, onBack, onBookNow }: ServiceDetailProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const content = {
    'game-coverage': {
      title: 'Varsity Game Coverage',
      tagline: 'EVERY SNAP. EVERY SHOT. PROFESSIONAL BROADCAST QUALITY.',
      heroImage: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&q=80&w=1600',
      description1: 'Get professional, multi-camera varsity game film. We deploy broadcast-grade 4K equipment to cover your matchups, creating high-definition files ideal for scout evaluation, team study, and high-octane team recaps.',
      description2: 'Your plays on the field deserve to be documented in full clarity. We work directly with high school athletic coordinators, booster clubs, and coaches to integrate our film seamlessly with recruitment networks like Hudl.',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-football-player-running-on-the-field-34250-large.mp4',
      badge: 'PRO SERIES FILMING',
      features: [
        {
          title: 'Multi-Angle Vantage',
          desc: 'High elevated press-box main camera combined with raw sideline/end-zone wide angle options.',
          icon: <Film className="w-6 h-6 text-red-500" />
        },
        {
          title: 'Premium Ambient Audio',
          desc: 'Ultra-directional shotgun microphones capture the hard hits, play calling, and roaring stadium atmosphere.',
          icon: <Zap className="w-6 h-6 text-red-500" />
        },
        {
          title: 'Hudl-Optimized Delivery',
          desc: 'Processed, optimized, and ready to import directly into your coaching libraries within 24 hours of game end.',
          icon: <Target className="w-6 h-6 text-red-500" />
        },
        {
          title: 'Statistical Down-tagging',
          desc: 'Optional play-by-play breakdown and Down-and-Distance timestamps pinned throughout the entire reel.',
          icon: <Award className="w-6 h-6 text-red-500" />
        }
      ],
      packages: [
        {
          name: 'Single Showcase Game',
          price: '$249',
          features: [
            '1 High-definition game film',
            'Press box primary angle',
            'Raw uncut video logs',
            'Digital delivery on Next-Day schedule'
          ],
          popular: false
        },
        {
          name: 'Elite Rivalry Clash',
          price: '$399',
          features: [
            '2-Camera synchronized capture',
            'Full press box + High-end sideline zoom',
            'On-field player audio integration',
            'Hudl exchange-ready tags and files'
          ],
          popular: true
        },
        {
          name: 'The Varsity Season',
          price: '$1,999',
          features: [
            'Full regular season coverage (up to 10 games)',
            'Multi-cam editing & post-production',
            'Weekly raw play exports',
            '1 Complimentary 5-minute team recruitment trailer'
          ],
          popular: false
        }
      ],
      stats: [
        { label: 'Varsity Games Captured', value: '450+' },
        { label: 'Turnaround Time', value: '<24 Hrs' },
        { label: 'Next-Gen Camera Rigs', value: '4K Native' },
        { label: 'Division I Scout Views', value: '85k+' }
      ]
    },
    'girls-flag-football': {
      title: 'Girls Flag Football Media',
      tagline: 'FAST, EXPLOSIVE, REVOLUTIONARY. THE FUTURE OF VARSITY ATHLETICS.',
      heroImage: 'https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?auto=format&fit=crop&q=80&w=1600',
      description1: 'Girls Flag Football is officially the fastest-growing high school sport in the nation, and we are setting the standard for how it is broadcasted. We capture the elite agility, bullet passes, and incredible grabs that define the modern game.',
      description2: 'Through slow-motion cinematic focus, high-impact highlights, and spotlight tracking overlays, we give top prospects the spotlight they deserve. Showcase your athletic recruitment capabilities directly to college coaches launching newly minted programs.',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-flag-football-highlight-demo.mp4', 
      fallbackVideo: 'https://assets.mixkit.co/videos/preview/mixkit-football-player-running-on-the-field-34250-large.mp4',
      badge: 'EXCLUSIVE SPOTLIGHT',
      features: [
        {
          title: 'Spotlight Overlays',
          desc: 'Our graphical highlighting element circles the targeted athlete before the play begins, keeping eyes locked on their form.',
          icon: <Target className="w-6 h-6 text-red-500" />
        },
        {
          title: 'Super-Slow Capture',
          desc: '120fps high frame rate tracking that highlights crisp flag-pulls, sharp cutbacks, and diving interceptions in extreme detail.',
          icon: <Film className="w-6 h-6 text-red-500" />
        },
        {
          title: 'DI program alignment',
          desc: 'Engineered in compliance with collegiate athletic boards and scouts requesting specific physical metrics.',
          icon: <Award className="w-6 h-6 text-red-500" />
        },
        {
          title: 'Social Optimization',
          desc: 'Packaged in both 16:9 widescreen formats for HUDL and vertical 9:16 optimized format for Instagram, YT, and TikTok.',
          icon: <Zap className="w-6 h-6 text-red-500" />
        }
      ],
      packages: [
        {
          name: 'Player Spotlight Capture',
          price: '$199',
          features: [
            'Dedicated camera tracking 1 player',
            'Full game footage segment list',
            '3 Best-play highlights customized',
            'Digital recruitment contact card embed'
          ],
          popular: false
        },
        {
          name: 'Championship Showcase',
          price: '$349',
          features: [
            'Spotlight overlay graphics on 5 prime clips',
            'Cinematic opening title with career statistics',
            'Music licensing & professional mastering',
            'HUDL + Vertical social exports included'
          ],
          popular: true
        },
        {
          name: 'Teammate Duo Package',
          price: '$499',
          features: [
            'Covers two players in the same game',
            'Individual spotlight highlight tapes created',
            'Shared highlights compilation',
            'Direct scout recruitment export bundle'
          ],
          popular: false
        }
      ],
      stats: [
        { label: 'Flag Athletes Showcased', value: '180+' },
        { label: 'Social Media Views', value: '1.2M+' },
        { label: 'Scholarships Gained', value: '45+' },
        { label: 'Program Video Licenses', value: '24' }
      ]
    }
  };

  const data = content[serviceId];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
      {/* Top utility bar */}
      <div className="bg-neutral-950 border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 font-display font-black text-sm uppercase tracking-widest text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> BACK TO ATHLETICS
        </button>
        <span className="text-[11px] font-mono tracking-widest text-red-500 font-bold uppercase py-1 px-3 bg-red-500/10 border border-red-500/20 rounded-full">
          {data.badge}
        </span>
      </div>

      {/* Hero Header Area */}
      <section className="relative h-[65vh] flex items-end justify-start overflow-hidden">
        <div className="absolute inset-0 z-0 scale-105 filter blur-[1px]">
          <img 
            src={data.heroImage} 
            alt={data.title} 
            className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pb-16 text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="text-red-500 font-display font-black tracking-widest text-sm uppercase block mb-3">
              LIVE PORTAL PAGE
            </span>
            <h1 className="text-5xl md:text-8xl font-black text-white uppercase leading-none tracking-tight">
              {data.title}
            </h1>
            <p className="mt-4 text-white/50 font-display text-sm md:text-base tracking-widest max-w-2xl leading-relaxed uppercase">
              {data.tagline}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview and Video Hub */}
      <section className="py-20 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Text Content */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
              DOCUMENT <br />YOUR <span className="italic text-red-500">LEGACY</span>
            </h2>
            
            <div className="space-y-6 text-neutral-400 font-sans leading-relaxed text-lg">
              <p>{data.description1}</p>
              <p className="border-l-4 border-red-500 pl-6 text-white font-medium italic">
                {data.description2}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              {data.stats.map((stat, i) => (
                <div key={i} className="bg-neutral-900/60 p-4 border border-white/5 rounded-sm">
                  <div className="text-3xl font-black text-red-500 font-display">{stat.value}</div>
                  <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button 
                onClick={onBookNow}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-display font-black tracking-widest text-lg py-5 px-8 uppercase transition-all rounded-sm flex items-center justify-center gap-2 group hover:scale-[1.01]"
              >
                SCHEDULE FILMING APPOINTMENT <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Interactive Player */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-video rounded-sm overflow-hidden bg-neutral-950 border border-white/10 group shadow-2xl">
              <video 
                ref={videoRef}
                src={serviceId === 'girls-flag-football' && 'fallbackVideo' in data ? (data.fallbackVideo as string) : data.videoUrl}
                className="w-full h-full object-cover"
                loop
                muted
                playsInline
                onClick={togglePlay}
              />
              
              {/* Play Overlay */}
              <div 
                onClick={togglePlay}
                className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-all cursor-pointer ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}
              >
                <div className="w-20 h-20 bg-red-650 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-2xl transform transition-transform hover:scale-110">
                  {isPlaying ? <Pause size={32} className="fill-white" /> : <Play size={32} className="fill-white ml-2" />}
                </div>
              </div>

              {/* Tag indicator */}
              <div className="absolute bottom-4 left-4 bg-black/80 border border-white/10 text-white text-[10px] font-mono py-1 px-3 rounded uppercase tracking-wider">
                {isPlaying ? "🎥 PLAYING PREVIEW CLIP" : "🎬 REELS PREVIEW DEMO"}
              </div>
            </div>
            
            <p className="text-xs text-neutral-500 uppercase font-mono text-center tracking-widest">
              *All preview footage represents actual student highlight reels recorded in high density.
            </p>
          </div>

        </div>
      </section>

      {/* Feature Pillar Grid */}
      <section className="bg-neutral-950 py-24 border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-[11px] font-mono text-red-500 font-black tracking-widest uppercase bg-red-500/5 px-4 py-1.5 border border-red-500/10 rounded-full">
              WHY IND BROADCASTING
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mt-4">
              THE BROADCAST <span className="italic opacity-30">ADVANTAGE</span>
            </h2>
            <p className="mt-2 text-neutral-500 font-display text-sm tracking-widest uppercase">
              How we construct scout-ready film that gets athletes placed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {data.features.map((feat, i) => (
              <div 
                key={i} 
                className="bg-neutral-900/40 p-10 border border-white/5 rounded-sm hover:border-red-500/20 hover:bg-neutral-900/60 transition-all text-left flex gap-6 items-start"
              >
                <div className="bg-red-500/10 p-4 border border-red-500/25 rounded-md flex-shrink-0">
                  {feat.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-neutral-400 font-sans leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Packages */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
            SERVICE <span className="italic text-red-500">PACKAGES</span>
          </h2>
          <p className="mt-2 text-neutral-500 font-display text-sm tracking-widest uppercase">
            Select the optimal coverage package for your recruitment goals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {data.packages.map((pkg, i) => (
            <div 
              key={i}
              className={`relative bg-neutral-900 border rounded-sm p-8 text-left transition-all flex flex-col justify-between ${pkg.popular ? 'border-red-500 ring-2 ring-red-500/10 scale-105 md:translate-y-[-10px] z-10 bg-gradient-to-b from-neutral-900 to-neutral-950' : 'border-white/5'}`}
            >
              {pkg.popular && (
                <span className="absolute top-0 right-8 transform -translate-y-1/2 bg-red-600 text-white text-[9px] font-mono font-bold uppercase tracking-widest py-1 px-3 rounded">
                  MOST POPULAR REEL
                </span>
              )}
              
              <div>
                <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-2 block">
                  {pkg.name}
                </h4>
                <div className="flex items-baseline gap-2 mb-6 border-b border-white/10 pb-6">
                  <span className="text-5xl font-black text-white font-display">{pkg.price}</span>
                  <span className="text-neutral-500 text-sm font-mono font-medium">/ Flat Rate</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-neutral-300 font-sans text-sm">
                      <CheckCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <button 
                  onClick={onBookNow}
                  className={`w-full font-display font-black text-center uppercase tracking-widest py-4 px-6 rounded-sm text-sm transition-all cursor-pointer ${pkg.popular ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg' : 'bg-white/10 hover:bg-white text-white hover:text-black'}`}
                >
                  RESERVE COVERAGE NOW
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Booking CTA bar */}
      <section className="bg-red-650 py-16 px-6 md:px-12 text-center relative overflow-hidden border-t-4 border-red-500">
        <div className="absolute inset-0 bg-red-900 opacity-20 filter blur-[80px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-5xl font-display font-black text-white uppercase leading-none tracking-tight">
            READY TO FILM YOUR NEXT BIG OUTING?
          </h2>
          <p className="text-white/85 text-lg font-sans max-w-2xl mx-auto leading-relaxed">
            Boosters, athletic program directors, and student parents are booking fast for the upcoming athletic cycles. Lock in your dates.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={onBookNow}
              className="bg-white hover:bg-neutral-100 text-black font-display font-black py-4 px-8 tracking-widest uppercase transition-all rounded-sm flex items-center gap-2 cursor-pointer text-sm"
            >
              <Calendar size={18} /> BOOK APPOINTMENT DATE
            </button>
            <button 
              onClick={onBack}
              className="border border-white/30 hover:border-white text-white font-display font-black py-4 px-8 tracking-widest uppercase transition-all rounded-sm text-sm"
            >
              VIEW OTHER SPORTS
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
