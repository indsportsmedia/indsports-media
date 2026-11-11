import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

type PromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

let deferred: PromptEvent | null = null;
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e as PromptEvent;
    window.dispatchEvent(new Event('ind-install-ready'));
  });
}

const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || (navigator as any).standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

/**
 * "Install app" button. Android/Chrome/Edge: opens the install prompt.
 * iPhone/iPad: shows the two-tap Add to Home Screen steps (Apple has no prompt).
 * Hidden once the app is installed.
 */
export default function InstallApp({ appName = 'IND Sports', className = '' }: { appName?: string; className?: string }) {
  const [ready, setReady] = useState(!!deferred);
  const [iosHelp, setIosHelp] = useState(false);
  const [installed, setInstalled] = useState(isStandalone());

  useEffect(() => {
    const onReady = () => setReady(true);
    const onInstalled = () => setInstalled(true);
    window.addEventListener('ind-install-ready', onReady);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('ind-install-ready', onReady);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed || (!ready && !isIOS())) return null;

  const click = async () => {
    if (deferred) {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      if (outcome === 'accepted') setInstalled(true);
      deferred = null;
      setReady(false);
    } else {
      setIosHelp(true);
    }
  };

  return (
    <>
      <button onClick={click} className={`inline-flex items-center gap-2 cursor-pointer ${className}`}>
        <Download size={16} /> Install the {appName} app
      </button>
      {iosHelp && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-end sm:items-center justify-center p-4" onClick={() => setIosHelp(false)}>
          <div className="w-full max-w-sm bg-[#121416] border border-[#262A2F] rounded-xl p-5 text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-display font-semibold uppercase text-white text-lg">Add {appName} to your iPhone</p>
              <button onClick={() => setIosHelp(false)} className="text-white/60 p-1 cursor-pointer" aria-label="Close"><X size={18} /></button>
            </div>
            <ol className="space-y-2 text-white/85 text-[15px] list-decimal pl-5">
              <li>Open this page in <strong>Safari</strong>.</li>
              <li>Tap the <strong>Share</strong> button (the square with an arrow).</li>
              <li>Scroll down and tap <strong>Add to Home Screen</strong>, then <strong>Add</strong>.</li>
            </ol>
            <p className="text-[#9AA1A9] text-sm mt-3">It opens full screen from your home screen, like any other app.</p>
          </div>
        </div>
      )}
    </>
  );
}
