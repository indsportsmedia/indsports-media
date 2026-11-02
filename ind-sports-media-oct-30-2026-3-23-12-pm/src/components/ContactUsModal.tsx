import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle2, X, MessageSquare, Clock } from 'lucide-react';

interface ContactUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactUsModal: React.FC<ContactUsModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    schoolOrTeam: '',
    message: ''
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
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#00BFFF]/10 border border-[#00BFFF]/30 flex items-center justify-center text-[#00BFFF]">
                  <Mail size={22} />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">
                    Contact <span className="text-[#00BFFF]">IND Sports Media</span>
                  </h3>
                  <p className="text-xs text-white/50 font-sans">
                    Have a story tip, coverage request, or general question? Drop us a line.
                  </p>
                </div>
              </div>

              {/* Direct Info Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="bg-black/50 border border-white/10 p-3 rounded text-center">
                  <Mail size={16} className="text-[#00BFFF] mx-auto mb-1" />
                  <div className="text-[10px] text-white/40 uppercase font-bold">Direct Email</div>
                  <div className="text-xs text-white font-mono font-bold truncate">admin@indsports.media</div>
                </div>
                <div className="bg-black/50 border border-white/10 p-3 rounded text-center">
                  <Phone size={16} className="text-[#00BFFF] mx-auto mb-1" />
                  <div className="text-[10px] text-white/40 uppercase font-bold">Media Desk</div>
                  <div className="text-xs text-white font-mono font-bold">(317) 420-1722</div>
                </div>
                <div className="bg-black/50 border border-white/10 p-3 rounded text-center">
                  <Clock size={16} className="text-[#00BFFF] mx-auto mb-1" />
                  <div className="text-[10px] text-white/40 uppercase font-bold">Response Time</div>
                  <div className="text-xs text-white font-mono font-bold">Under 24 Hours</div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                      Your Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Marcus Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:border-[#00BFFF] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                      Email Address *
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="marcus@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:border-[#00BFFF] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                      Topic / Subject *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:border-[#00BFFF] focus:outline-none"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Game Filming Request">Game Filming & Highlight Request</option>
                      <option value="Story Pitch">Story / Athlete Feature Pitch</option>
                      <option value="Broadcast Partnership">Broadcast & Live Stream Info</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                      School or Club Team
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Mater Dei High School"
                      value={formData.schoolOrTeam}
                      onChange={(e) => setFormData({ ...formData, schoolOrTeam: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:border-[#00BFFF] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                    Your Message *
                  </label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="Tell us about your team, event dates, or how we can assist..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#00BFFF] focus:outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full mt-4 bg-[#00BFFF] hover:bg-[#00A3D9] text-black font-display font-black text-xs uppercase tracking-widest py-3.5 rounded transition-all cursor-pointer shadow-lg shadow-[#00BFFF]/20 flex items-center justify-center gap-2"
                >
                  <Send size={16} /> Send Direct Message
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle2 size={56} className="text-[#00BFFF] mx-auto mb-4" />
              <h3 className="text-2xl font-display font-black text-white uppercase mb-2">
                Message Sent!
              </h3>
              <p className="text-white/70 text-sm max-w-md mx-auto mb-6 leading-relaxed font-sans">
                Thank you, <strong>{formData.name}</strong>. Our staff has received your message regarding <em>{formData.subject}</em> and will get back to you shortly.
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

export default ContactUsModal;
