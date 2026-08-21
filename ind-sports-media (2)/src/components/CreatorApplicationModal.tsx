import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Camera, 
  Video, 
  CheckCircle2, 
  FileSpreadsheet, 
  Upload, 
  Send, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  UserCheck,
  AlertCircle
} from 'lucide-react';

interface CreatorApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_SPORTS = [
  '11v11 Football',
  '7v7 Football',
  'Girls Flag Football',
  'Basketball',
  'Volleyball',
  'Softball',
  'Wrestling',
  'Soccer'
];

export default function CreatorApplicationModal({ isOpen, onClose }: CreatorApplicationModalProps) {
  const [activeTab, setActiveTab] = useState<'apply' | 'view-sheet'>('apply');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Both Photography & Videography');
  const [selectedSports, setSelectedSports] = useState<string[]>(['11v11 Football', 'Girls Flag Football']);
  const [experience, setExperience] = useState('');
  const [gear, setGear] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [availability, setAvailability] = useState('Friday Nights & Saturdays');

  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(null);

  const [applications, setApplications] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchApplications();
    }
  }, [isOpen]);

  const fetchApplications = async () => {
    setLoadingApps(true);
    try {
      const res = await fetch('/api/applications');
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications || []);
        if (data.spreadsheetUrl) {
          setSpreadsheetUrl(data.spreadsheetUrl);
        }
      }
    } catch (err) {
      console.warn('Error fetching applications:', err);
    } finally {
      setLoadingApps(false);
    }
  };

  const toggleSport = (sport: string) => {
    if (selectedSports.includes(sport)) {
      setSelectedSports(selectedSports.filter(s => s !== sport));
    } else {
      setSelectedSports([...selectedSports, sport]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          role,
          sports: selectedSports,
          experience,
          gear,
          portfolioUrl,
          availability
        })
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedSuccess(true);
        if (data.spreadsheetUrl) {
          setSpreadsheetUrl(data.spreadsheetUrl);
        }
        fetchApplications();
      }
    } catch (err) {
      console.error('Error submitting application:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setExperience('');
    setGear('');
    setPortfolioUrl('');
    setSubmittedSuccess(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-neutral-950 border border-white/10 rounded-sm shadow-2xl overflow-hidden my-auto text-left"
        >
          {/* Header Bar */}
          <div className="bg-neutral-900 border-b border-white/10 px-6 py-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#00BFFF] text-black text-[10px] font-mono font-black uppercase tracking-widest px-2.5 py-0.5 rounded">
                  CREATOR NETWORK
                </span>
                <span className="text-xs text-neutral-400 font-mono flex items-center gap-1">
                  <FileSpreadsheet size={13} className="text-green-500" /> Google Sheets Sync
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mt-1 font-display">
                APPLY TO SHOOT WITH IND SPORTS MEDIA
              </h2>
            </div>

            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-white/10 bg-black px-6 pt-3 gap-6 font-display uppercase text-xs tracking-widest font-bold">
            <button
              onClick={() => setActiveTab('apply')}
              className={`pb-3 border-b-2 transition-all cursor-pointer ${activeTab === 'apply' ? 'border-[#00BFFF] text-[#00BFFF] font-black' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
            >
              Application Form
            </button>
            <button
              onClick={() => setActiveTab('view-sheet')}
              className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'view-sheet' ? 'border-[#00BFFF] text-[#00BFFF] font-black' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
            >
              <FileSpreadsheet size={14} className="text-green-500" /> Live Submissions ({applications.length})
            </button>
          </div>

          <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
            {activeTab === 'apply' ? (
              submittedSuccess ? (
                <div className="py-12 px-4 text-center space-y-6">
                  <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto text-green-500">
                    <CheckCircle2 size={44} />
                  </div>
                  <h3 className="text-3xl font-black text-white uppercase font-display">
                    APPLICATION SUBMITTED SUCCESSFULLY!
                  </h3>
                  <p className="text-neutral-300 max-w-lg mx-auto font-sans text-base leading-relaxed">
                    Thank you for applying to join the IND Sports Media creator team! Your application details have been recorded and synced directly to our media coordinator's Google Sheet.
                  </p>

                  <div className="bg-neutral-900 border border-white/10 p-4 rounded max-w-md mx-auto flex items-center justify-between text-left">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="text-green-500 flex-shrink-0" size={24} />
                      <div>
                        <div className="text-xs font-mono text-white font-bold uppercase">Google Sheet Status</div>
                        <div className="text-[11px] text-neutral-400">Application row synced to spreadsheet</div>
                      </div>
                    </div>
                    {spreadsheetUrl && (
                      <a 
                        href={spreadsheetUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs font-mono text-[#00BFFF] hover:underline flex items-center gap-1 font-bold"
                      >
                        OPEN SHEET <ExternalLink size={12} />
                      </a>
                    )}
                  </div>

                  <div className="pt-6 flex flex-wrap gap-4 justify-center">
                    <button
                      onClick={resetForm}
                      className="bg-[#00BFFF] hover:bg-[#00A3D9] text-black font-display font-black px-6 py-3 uppercase tracking-widest text-xs rounded transition-all cursor-pointer shadow-lg shadow-[#00BFFF]/20"
                    >
                      SUBMIT ANOTHER APPLICATION
                    </button>
                    <button
                      onClick={onClose}
                      className="border border-white/20 hover:border-white text-white font-display font-black px-6 py-3 uppercase tracking-widest text-xs rounded transition-all cursor-pointer"
                    >
                      CLOSE WINDOW
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <p className="text-sm text-neutral-400 font-sans leading-relaxed">
                    We are expanding our game-day coverage team across high school varsity athletics! If you shoot sideline photography or video highlights, fill out your details below. Submitted applications sync directly to our media log spreadsheet.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest text-neutral-300 mb-2 font-bold">
                        Full Name *
                      </label>
                      <input 
                        type="text" 
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Jordan Miller"
                        className="w-full bg-neutral-900 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00BFFF] font-sans text-sm"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest text-neutral-300 mb-2 font-bold">
                        Email Address *
                      </label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. jordan@media.com"
                        className="w-full bg-neutral-900 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00BFFF] font-sans text-sm"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest text-neutral-300 mb-2 font-bold">
                        Phone Number
                      </label>
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(555) 000-0000"
                        className="w-full bg-neutral-900 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00BFFF] font-sans text-sm"
                      />
                    </div>

                    {/* Primary Role */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest text-neutral-300 mb-2 font-bold">
                        Primary Media Role *
                      </label>
                      <select 
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00BFFF] font-sans text-sm"
                      >
                        <option value="Both Photography & Videography">Both Photography & Videography</option>
                        <option value="Game Photography Only">Game Photography Only</option>
                        <option value="Video Highlight Reels / Filming">Video Highlight Reels / Filming</option>
                        <option value="Drone / Aerial Specialist">Drone / Aerial Specialist</option>
                      </select>
                    </div>
                  </div>

                  {/* Sports Covered */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-neutral-300 mb-2 font-bold">
                      Sports You Feel Comfortable Covering
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_SPORTS.map((sport) => {
                        const isSelected = selectedSports.includes(sport);
                        return (
                          <button
                            type="button"
                            key={sport}
                            onClick={() => toggleSport(sport)}
                            className={`px-3 py-1.5 rounded text-xs font-mono font-bold uppercase transition-all cursor-pointer border ${isSelected ? 'bg-[#00BFFF] border-[#00BFFF] text-black font-extrabold' : 'bg-neutral-900 border-white/10 text-neutral-400 hover:border-white/30'}`}
                          >
                            {sport}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Experience */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest text-neutral-300 mb-2 font-bold">
                        Years of Experience & Background
                      </label>
                      <textarea 
                        rows={3}
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="Detail high school, college, or private media experience..."
                        className="w-full bg-neutral-900 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00BFFF] font-sans text-sm resize-none"
                      />
                    </div>

                    {/* Camera Gear */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest text-neutral-300 mb-2 font-bold">
                        Camera Bodies & Lenses / Equipment
                      </label>
                      <textarea 
                        rows={3}
                        value={gear}
                        onChange={(e) => setGear(e.target.value)}
                        placeholder="e.g. Sony A7IV, 70-200mm f2.8, DJI RS3 gimbal, audio mics..."
                        className="w-full bg-neutral-900 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00BFFF] font-sans text-sm resize-none"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Portfolio */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest text-neutral-300 mb-2 font-bold">
                        Portfolio Link / Instagram / Drive
                      </label>
                      <input 
                        type="url" 
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        placeholder="https://instagram.com/yourhandle or website"
                        className="w-full bg-neutral-900 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00BFFF] font-sans text-sm"
                      />
                    </div>

                    {/* Availability */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest text-neutral-300 mb-2 font-bold">
                        Availability for Game Days
                      </label>
                      <select 
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00BFFF] font-sans text-sm"
                      >
                        <option value="Friday Nights & Saturdays">Friday Nights & Saturdays (Peak Varsity)</option>
                        <option value="Weekday Afternoons & Evenings">Weekday Afternoons & Evenings</option>
                        <option value="Flexible / Full Season Availability">Flexible / Full Season Availability</option>
                        <option value="Tournament / Weekend Only">Tournament / Weekend Only</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-white/10">
                    <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                      <ShieldCheck size={16} className="text-green-500" />
                      Applications sync instantly to Google Sheets
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-[#00BFFF] hover:bg-[#00A3D9] text-black font-display font-black px-8 py-4 uppercase tracking-widest text-sm rounded transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#00BFFF]/20 disabled:opacity-50"
                    >
                      {submitting ? (
                        <>SUBMITTING & SYNCING...</>
                      ) : (
                        <>SUBMIT APPLICATION <Send size={16} /></>
                      )}
                    </button>
                  </div>
                </form>
              )
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-neutral-900 border border-white/10 p-4 rounded">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="text-green-500" size={28} />
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase font-display">
                        Google Sheets Live Synchronization
                      </h4>
                      <p className="text-xs text-neutral-400">
                        All applicant records submitted online are automatically appended into our central spreadsheet.
                      </p>
                    </div>
                  </div>
                  {spreadsheetUrl && (
                    <a 
                      href={spreadsheetUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="bg-green-600 hover:bg-green-700 text-white font-display font-bold text-xs uppercase py-2 px-4 rounded flex items-center gap-1 transition-all"
                    >
                      OPEN IN GOOGLE SHEETS <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                {loadingApps ? (
                  <div className="py-12 text-center text-neutral-500 font-mono text-xs uppercase tracking-widest">
                    Loading submitted applications...
                  </div>
                ) : applications.length === 0 ? (
                  <div className="py-12 text-center text-neutral-500 font-mono text-xs uppercase tracking-widest">
                    No applications submitted yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {applications.map((app) => (
                      <div key={app.id} className="bg-neutral-900/60 border border-white/5 p-4 rounded text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm font-display uppercase">{app.fullName}</span>
                          <span className="bg-[#00BFFF]/10 text-[#00BFFF] border border-[#00BFFF]/20 px-2 py-0.5 rounded font-mono text-[10px]">
                            {app.role}
                          </span>
                        </div>
                        <div className="grid md:grid-cols-3 gap-2 text-neutral-400 font-mono">
                          <div><span className="text-neutral-500">Email:</span> {app.email}</div>
                          <div><span className="text-neutral-500">Phone:</span> {app.phone || 'N/A'}</div>
                          <div><span className="text-neutral-500">Availability:</span> {app.availability}</div>
                        </div>
                        {app.sports && (
                          <div className="text-neutral-300 font-mono text-[11px]">
                            <span className="text-neutral-500">Sports:</span> {app.sports}
                          </div>
                        )}
                        {app.gear && (
                          <div className="text-neutral-400 font-sans text-xs italic">
                            "Gear: {app.gear}"
                          </div>
                        )}
                        {app.portfolioUrl && (
                          <div>
                            <a 
                              href={app.portfolioUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-[#00BFFF] hover:underline flex items-center gap-1 font-mono text-[11px]"
                            >
                              Portfolio Link <ExternalLink size={10} />
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
