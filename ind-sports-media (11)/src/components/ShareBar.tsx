import { useState } from 'react';
import { Share2, Link2, Check, Copy } from 'lucide-react';

interface ShareBarProps {
  url: string;
  text: string; // headline or update text used in the post
  compact?: boolean;
}

const enc = encodeURIComponent;

/**
 * One-tap sharing for an article or a single live update.
 * On phones the "Share" button opens the phone's own share sheet, which
 * includes Instagram, TikTok, Messages, etc. Desktop gets direct links.
 */
export default function ShareBar({ url, text, compact = false }: ShareBarProps) {
  const [copied, setCopied] = useState<'link' | 'caption' | null>(null);
  const caption = `${text}\n\n${url}\n#INDSportsMedia #IndianaHighSchoolSports`;
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const copy = async (value: string, which: 'link' | 'caption') => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(which);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      window.prompt('Copy this:', value);
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title: text, text, url });
    } catch {
      /* user closed the sheet */
    }
  };

  const btn =
    'inline-flex items-center gap-1.5 rounded border border-white/15 bg-white/5 hover:border-[#00BFFF]/60 hover:text-white text-white/70 transition-colors cursor-pointer font-display font-bold uppercase tracking-wider';
  const size = compact ? 'px-2 py-1 text-[10px]' : 'px-3 py-2 text-[11px]';

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canNativeShare && (
        <button onClick={nativeShare} className={`${btn} ${size} !bg-[#00BFFF] !text-black !border-[#00BFFF]`}>
          <Share2 size={compact ? 12 : 14} /> Share
        </button>
      )}
      <a
        className={`${btn} ${size}`}
        href={`https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        X
      </a>
      <a
        className={`${btn} ${size}`}
        href={`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Facebook
      </a>
      <a
        className={`${btn} ${size}`}
        href={`https://www.threads.net/intent/post?text=${enc(`${text} ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Threads
      </a>
      <button onClick={() => copy(url, 'link')} className={`${btn} ${size}`}>
        {copied === 'link' ? <Check size={12} /> : <Link2 size={12} />} {copied === 'link' ? 'Copied' : 'Link'}
      </button>
      {!compact && (
        <button onClick={() => copy(caption, 'caption')} className={`${btn} ${size}`} title="Copy a ready-made caption for Instagram or TikTok">
          {copied === 'caption' ? <Check size={12} /> : <Copy size={12} />} {copied === 'caption' ? 'Copied' : 'IG caption'}
        </button>
      )}
    </div>
  );
}
