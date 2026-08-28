import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, X, CheckCircle2, Camera, AlertCircle, FileText, Send } from 'lucide-react';

interface MediaCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MediaCredentialsModal: React.FC<MediaCredentialsModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    outlet: '',
    role: 'Photographer',
    email: '',
    phone: '',
    portfolioUrl: '',
    targetEvent: '',
    equipmentSummary: '',
    termsAgreed: false
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
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">
                    Media <span className="text-[#00BFFF]">Credentials</span>
                  </h3>
                  <p className="text-xs text-white/50 font-sans">
                    Apply for sideline press passes, photo vests, and creator credentials.
                  </p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded p-3.5 mb-6 text-xs text-white/70 leading-relaxed">
                <strong className="text-white block mb-1">Credential Guidelines:</strong>
                Approved credentials grant sideline and press-box access for accredited photographers, videographers, and editorial journalists. Must adhere to state federation (CIF/NFHS) guidelines.
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                      Full Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Jane Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:border-[#00BFFF] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                      Media Outlet / Org *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="IND Freelance / School Paper"
                      value={formData.outlet}
                      onChange={(e) => setFormData({ ...formData, outlet: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:border-[#00BFFF] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                      Primary Role *
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:border-[#00BFFF] focus:outline-none"
                    >
                      <option value="Photographer">Sideline Photographer</option>
                      <option value="Videographer">Cinematographer / Reel Creator</option>
                      <option value="Journalist">Sports Writer / Reporter</option>
                      <option value="MediaAnalyst">Media Analyst / Broadcaster</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                      Email Address *
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="credentials@outlet.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:border-[#00BFFF] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                      Target Game / Event *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Mater Dei vs. Centennial (Oct 24)"
                      value={formData.targetEvent}
                      onChange={(e) => setFormData({ ...formData, targetEvent: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:border-[#00BFFF] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                      Portfolio / Instagram Link
                    </label>
                    <input 
                      type="url" 
                      placeholder="https://instagram.com/your_handle"
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:border-[#00BFFF] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                    Camera Equipment & Purpose
                  </label>
                  <textarea 
                    rows={2}
                    placeholder="Sony A7IV, 70-200mm f/2.8, gathering game highlights for student news..."
                    value={formData.equipmentSummary}
                    onChange={(e) => setFormData({ ...formData, equipmentSummary: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#00BFFF] focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="cred-terms"
                    required
                    checked={formData.termsAgreed}
                    onChange={(e) => setFormData({ ...formData, termsAgreed: e.target.checked })}
                    className="w-4 h-4 accent-[#00BFFF]"
                  />
                  <label htmlFor="cred-terms" className="text-xs text-white/60">
                    I agree to follow all sideline safety policies and credential badge rules.
                  </label>
                </div>

                <button 
                  type="submit"
                  className="w-full mt-4 bg-[#00BFFF] hover:bg-[#00A3D9] text-black font-display font-black text-xs uppercase tracking-widest py-3.5 rounded transition-all cursor-pointer shadow-lg shadow-[#00BFFF]/20 flex items-center justify-center gap-2"
                >
                  <Send size={16} /> Submit Credential Application
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle2 size={56} className="text-[#00BFFF] mx-auto mb-4" />
              <h3 className="text-2xl font-display font-black text-white uppercase mb-2">
                Application Received!
              </h3>
              <p className="text-white/70 text-sm max-w-md mx-auto mb-6 leading-relaxed font-sans">
                Thank you, <strong>{formData.fullName}</strong>. Our credentialing director will review your request for <em>{formData.targetEvent}</em> and email approval within 24-48 hours.
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

export default MediaCredentialsModal;
