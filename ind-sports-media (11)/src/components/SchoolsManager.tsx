import { useEffect, useRef, useState } from 'react';
import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { Loader2, Trash2, Upload } from 'lucide-react';
import { db, subscribeToSchools, schoolKey, uploadMediaFile, compressImageToBlob, type School } from '../lib/firebase';
import TeamLogo from './TeamLogo';

const input =
  'w-full bg-black border border-white/15 focus:border-[#00BFFF] rounded-lg px-3 py-3 text-white text-base outline-none placeholder:text-white/30';

async function uploadLogo(file: File, onProgress: (n: number) => void): Promise<string> {
  // PNGs keep their transparent background; other images are shrunk to 512px.
  let blob: Blob = file;
  if (!/png|svg/i.test(file.type)) {
    try { blob = await compressImageToBlob(file, 512, 0.9); } catch { /* use original */ }
  }
  return uploadMediaFile(blob, 'logos', onProgress);
}

/** Newsroom → Schools: one place to add school logos. Games pick them up by name automatically. */
export default function SchoolsManager() {
  const [schools, setSchools] = useState<School[]>([]);
  const [name, setName] = useState('');
  const [mascot, setMascot] = useState('');
  const [aliases, setAliases] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);
  const [replacing, setReplacing] = useState<School | null>(null);

  useEffect(() => subscribeToSchools(setSchools), []);

  const add = async () => {
    const n = name.trim();
    if (!n) return setError('Enter the school name as it appears on the scoreboard.');
    if (!file) return setError('Choose a logo image.');
    setError('');
    setProgress(0);
    try {
      const logoUrl = await uploadLogo(file, setProgress);
      await setDoc(doc(db, 'schools', schoolKey(n) || n), {
        name: n,
        mascot: mascot.trim(),
        aliases: aliases.split(',').map((a) => a.trim()).filter(Boolean),
        logoUrl,
      });
      setName(''); setMascot(''); setAliases(''); setFile(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch (e: any) {
      setError(e?.message || 'Logo not saved.');
    } finally {
      setProgress(null);
    }
  };

  const replace = async (f?: File) => {
    if (!f || !replacing) return;
    setProgress(0);
    try {
      const logoUrl = await uploadLogo(f, setProgress);
      await setDoc(doc(db, 'schools', replacing.id), { logoUrl }, { merge: true });
    } catch (e: any) {
      setError(e?.message || 'Logo not saved.');
    } finally {
      setProgress(null);
      setReplacing(null);
      if (replaceRef.current) replaceRef.current.value = '';
    }
  };

  const shown = schools.filter((s) => !query || s.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="bg-[#141414] border border-white/10 rounded-xl p-4 space-y-3">
        <p className="text-white font-bold">Add a school logo</p>
        <p className="text-white/50 text-sm -mt-1">
          Use the school name exactly as it's typed on the scoreboard. Every game with that school shows the logo automatically.
        </p>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="School name, e.g. Westfield" className={input} />
        <input value={mascot} onChange={(e) => setMascot(e.target.value)} placeholder="Mascot (optional), e.g. Shamrocks" className={input} />
        <input value={aliases} onChange={(e) => setAliases(e.target.value)} placeholder="Other names (optional), e.g. WHS, Westfield High School" className={input} />
        <input ref={fileRef} type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full flex items-center justify-center gap-3 border border-dashed border-white/25 hover:border-[#00BFFF] rounded-lg py-4 text-white/80 cursor-pointer"
        >
          {file ? (
            <>
              <img src={URL.createObjectURL(file)} alt="" className="w-10 h-10 object-contain" />
              <span className="text-sm truncate max-w-[60%]">{file.name}</span>
            </>
          ) : (
            <>
              <Upload size={18} /> Choose logo (PNG with a clear background looks best)
            </>
          )}
        </button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          onClick={add}
          disabled={progress !== null}
          className="w-full flex items-center justify-center gap-2 bg-[#00BFFF] hover:bg-[#33CCFF] disabled:opacity-50 text-black font-display font-semibold uppercase rounded-lg py-3 cursor-pointer"
        >
          {progress !== null && <Loader2 size={16} className="animate-spin" />}
          {progress !== null ? `Uploading ${progress}%` : 'Save school'}
        </button>
      </div>

      <input ref={replaceRef} type="file" accept="image/*" className="hidden" onChange={(e) => replace(e.target.files?.[0])} />
      {schools.length > 6 && (
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search schools" className={input} />
      )}
      <ul className="space-y-2">
        {shown.map((s) => (
          <li key={s.id} className="flex items-center gap-3 bg-[#111] border border-white/10 rounded-lg px-3 py-2.5">
            <TeamLogo name={s.name} url={s.logoUrl} className="w-10 h-10" />
            <div className="min-w-0 flex-1">
              <p className="text-white font-bold text-sm truncate">{s.name}</p>
              <p className="text-white/40 text-xs truncate">{[s.mascot, ...(s.aliases || [])].filter(Boolean).join(', ')}</p>
            </div>
            <button
              onClick={() => { setReplacing(s); replaceRef.current?.click(); }}
              className="text-xs text-white/70 hover:text-white border border-white/15 rounded px-2.5 py-1.5 cursor-pointer"
            >
              {replacing?.id === s.id && progress !== null ? `${progress}%` : 'Change logo'}
            </button>
            <button
              onClick={() => confirm(`Remove ${s.name}'s logo?`) && deleteDoc(doc(db, 'schools', s.id))}
              className="p-2 text-white/40 hover:text-red-400 cursor-pointer"
              aria-label={`Remove ${s.name}`}
            >
              <Trash2 size={15} />
            </button>
          </li>
        ))}
      </ul>
      {schools.length === 0 && <p className="text-white/40 text-sm text-center">No schools yet. Add the teams you cover most.</p>}
    </div>
  );
}
