import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Megaphone, TrendingUp, Users, Video, CheckCircle2, X, Send, Award, Target, Flame } from 'lucide-react';

interface AdvertiseWithUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvertiseWithUsModal: React.FC<AdvertiseWithUsModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    tier: 'Digital Sponsorship',
    budget: '$2,500 - $5,000',
    details: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#111111] border border-white/10 rounded-xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>

          {!submitted ? (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#00BFFF]/10 border border-[#00BFFF]/30 flex items-center justify-center text-[#00BFFF]">
                  <Megaphone size={22} />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">
                    Advertise <span className="text-[#00BFFF]">With Us</span>
                  </h3>
                  <p className="text-xs text-white/50 font-sans">
                    Connect your brand with millions of high school student-athletes, parents, and sports fans.
                  </p>
                </div>
              </div>

              {/* Metrics Highlights */}
              <div className="grid grid-cols-3 gap-2.5 mb-6">
                <div className="bg-black/50 border border-white/10 p-3 rounded text-center">
                  <div className="text-lg font-display font-black text-[#00BFFF]">15M+</div>
                  <div className="text-[10px] text-white/40 uppercase font-bold">Monthly Views</div>
                </div>
                <div className="bg-black/50 border border-white/10 p-3 rounded text-center">
                  <div className="text-lg font-display font-black text-[#00BFFF]">84%</div>
                  <div className="text-[10px] text-white/40 uppercase font-bold">Gen-Z / Family Reach</div>
                </div>
                <div className="bg-black/50 border border-white/10 p-3 rounded text-center">
                  <div className="text-lg font-display font-black text-[#00BFFF]">500+</div>
                  <div className="text-[10px] text-white/40 uppercase font-bold">Varsity Programs</div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                      Company / Brand Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Gatorade / Local Orthopedic Clinic"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:border-[#00BFFF] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                      Contact Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Sarah Jenkins"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:border-[#00BFFF] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                      Business Email *
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="partnerships@brand.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:border-[#00BFFF] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                      Phone Number
                    </label>
                    <input 
                      type="tel" 
                      placeholder="(555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:border-[#00BFFF] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                      Partnership Category *
                    </label>
                    <select
                      value={formData.tier}
                      onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:border-[#00BFFF] focus:outline-none"
                    >
                      <option value="Digital Sponsorship">Live Stream Title Sponsor</option>
                      <option value="Highlight Reel Integration">Viral Highlight Reel Watermark & Placements</option>
                      <option value="Sideline Banner & Event">Sideline Banners & On-Field Activations</option>
                      <option value="Athlete Spotlight Presenter">"Player of the Week" Presenting Sponsor</option>
                      <option value="Custom Multi-Channel Campaign">Full Multi-Sport Season Package</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                      Estimated Campaign Budget
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:border-[#00BFFF] focus:outline-none"
                    >
                      <option value="Under $2,500">$1,000 - $2,500</option>
                      <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                      <option value="$5,000 - $15,000">$5,000 - $15,000</option>
                      <option value="$15,000+">$15,000+ (Title Sponsor)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                    Campaign Goals & Details
                  </label>
                  <textarea 
                    rows={3}
                    placeholder="We want to promote our sports nutrition product to varsity football and basketball athletes in Southern California..."
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#00BFFF] focus:outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full mt-4 bg-[#00BFFF] hover:bg-[#00A3D9] text-black font-display font-black text-xs uppercase tracking-widest py-3.5 rounded transition-all cursor-pointer shadow-lg shadow-[#00BFFF]/20 flex items-center justify-center gap-2"
                >
                  <Send size={16} /> Request Media Kit & Rate Card
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle2 size={56} className="text-[#00BFFF] mx-auto mb-4" />
              <h3 className="text-2xl font-display font-black text-white uppercase mb-2">
                Media Kit on the Way!
              </h3>
              <p className="text-white/70 text-sm max-w-md mx-auto mb-6 leading-relaxed font-sans">
                Thank you, <strong>{formData.contactName}</strong> from <strong>{formData.companyName}</strong>. Our partnerships director will review your campaign goals and deliver our full deck and customized rate card to <em>{formData.email}</em> within 24 hours.
              </p>
              <button 
                onClick={() => { setSubmitted(false); onClose(); }}
                className="bg-white/10 hover:bg-white/20 text-white font-display font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AdvertiseWithUsModal;
