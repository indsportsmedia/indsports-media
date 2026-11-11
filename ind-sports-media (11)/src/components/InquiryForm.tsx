import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { sendSiteForm } from '../lib/forms';

const ROLES = ['Athletic director', 'Coach', 'School administrator', 'Athlete or parent', 'Business or sponsor', 'Other'];
const LEVELS = ['High school', 'College', 'Club / travel', 'Other'];

const field =
  'w-full bg-black border border-rule focus:border-ind rounded-sm px-3 py-2.5 text-white text-[15px] outline-none placeholder:text-white/30 transition-colors';
const lbl = 'block text-[13px] font-medium text-mute mb-1.5';

export default function InquiryForm({ defaultRole = 'Athletic director', tone = 'dark' }: { defaultRole?: string; tone?: 'dark' | 'light' }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [role, setRole] = useState(defaultRole);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get('bot-field')) return;
    setStatus('sending');
    try {
      await sendSiteForm('partner-inquiry', {
        name: String(fd.get('name') || ''),
        email: String(fd.get('email') || ''),
        Role: role,
        Title: String(fd.get('title') || ''),
        'School or organization': String(fd.get('school') || ''),
        Level: String(fd.get('level') || ''),
        Phone: String(fd.get('phone') || ''),
        Sports: String(fd.get('sports') || ''),
        Message: String(fd.get('message') || ''),
      });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className={`border-l-2 border-ind pl-5 py-2 ${tone === 'light' ? 'text-black' : 'text-white'}`}>
        <p className="font-display text-2xl font-bold mb-1">Thanks, we got it.</p>
        <p className={tone === 'light' ? 'text-black/70' : 'text-mute'}>
          We'll reply to the email you gave us. If it's game week, call or text (317) 420-1722.
        </p>
      </div>
    );
  }

  const isSchool = role === 'Athletic director' || role === 'Coach' || role === 'School administrator';

  return (
    <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <input type="text" name="bot-field" className="hidden" tabIndex={-1} autoComplete="off" />
      <div className="sm:col-span-2">
        <label className={lbl} htmlFor="iq-role">I'm a</label>
        <select id="iq-role" value={role} onChange={(e) => setRole(e.target.value)} className={field}>
          {ROLES.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>
      <div>
        <label className={lbl} htmlFor="iq-name">Name</label>
        <input id="iq-name" name="name" required autoComplete="name" className={field} />
      </div>
      <div>
        <label className={lbl} htmlFor="iq-title">{isSchool ? 'Title' : 'Athlete name (if applicable)'}</label>
        <input id="iq-title" name="title" className={field} placeholder={isSchool ? 'Director of Athletics' : ''} />
      </div>
      <div>
        <label className={lbl} htmlFor="iq-school">School or organization</label>
        <input id="iq-school" name="school" required={isSchool} autoComplete="organization" className={field} />
      </div>
      <div>
        <label className={lbl} htmlFor="iq-level">Level</label>
        <select id="iq-level" name="level" className={field}>
          {LEVELS.map((l) => <option key={l}>{l}</option>)}
        </select>
      </div>
      <div>
        <label className={lbl} htmlFor="iq-email">Email</label>
        <input id="iq-email" name="email" type="email" required autoComplete="email" className={field} />
      </div>
      <div>
        <label className={lbl} htmlFor="iq-phone">Phone</label>
        <input id="iq-phone" name="phone" type="tel" autoComplete="tel" className={field} />
      </div>
      <div className="sm:col-span-2">
        <label className={lbl} htmlFor="iq-sports">Sports and dates you're thinking about</label>
        <input id="iq-sports" name="sports" className={field} placeholder="Football home games, boys basketball sectionals" />
      </div>
      <div className="sm:col-span-2">
        <label className={lbl} htmlFor="iq-message">Anything else we should know</label>
        <textarea id="iq-message" name="message" rows={4} className={field} />
      </div>
      {status === 'error' && (
        <p className="sm:col-span-2 text-red-400 text-sm">
          Your request didn't send. Check your connection and try again, or email admin@indsports.media.
        </p>
      )}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex items-center gap-2 bg-ind hover:bg-white text-black font-display font-bold text-lg px-6 py-2.5 rounded-sm transition-colors cursor-pointer disabled:opacity-60"
        >
          {status === 'sending' && <Loader2 size={18} className="animate-spin" />}
          Send request
        </button>
      </div>
    </form>
  );
}
