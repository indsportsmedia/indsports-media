import InquiryForm from './InquiryForm';

const INCLUDED = [
  {
    title: 'Live game coverage',
    body: 'Score, clock and play-by-play updates with photos and clips, posted from the sideline to a page fans can share while the game is on.',
  },
  {
    title: 'Sideline photography',
    body: 'Action, bench and student-section photos in a game gallery, so families, boosters and your communications team have shots worth using.',
  },
  {
    title: 'Highlight video',
    body: 'Vertical clips for social media the same night, plus longer highlight cuts for athletes building a recruiting profile.',
  },
  {
    title: 'Previews and recaps',
    body: 'Written stories before and after big games, with names, numbers and quotes, published on indsports.media under your sport.',
  },
  {
    title: 'Athlete features',
    body: 'Profiles of the athletes driving your program, with photos and highlights that live on a page they can send to coaches.',
  },
  {
    title: 'Social distribution',
    body: 'Every game we cover is posted across IND on Instagram, TikTok, X, Facebook and YouTube, tagged to your school.',
  },
];

const STEPS = [
  { title: 'Send us your schedule', body: 'Tell us which games matter most: rivalry nights, senior night, sectionals.' },
  { title: 'We handle credentials', body: 'We coordinate press access and sideline placement with your athletic office ahead of time.' },
  { title: 'Game night', body: 'Our crew covers the game live on indsports.media and social, start to finish.' },
  { title: 'After the final', body: 'Photos, highlights and the recap go up, and we send your office the links.' },
];

export default function PartnersPage({ onOpenScores }: { onOpenScores: () => void }) {
  return (
    <div className="bg-black text-white">
      {/* Header */}
      <section className="border-b border-rule">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-14 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <p className="text-ind font-semibold mb-3">For athletic directors and college programs</p>
            <h1 className="font-display font-bold text-[42px] sm:text-[60px] leading-[1.04] max-w-[18ch]">
              Professional coverage for your program, with no extra work for your staff.
            </h1>
            <p className="mt-5 text-white/75 text-lg leading-relaxed max-w-[60ch]">
              IND Sports Media is an Indianapolis-based crew covering high school and college sports across Indiana. We
              bring the cameras, the live updates and the audience. You get coverage your athletes, families and
              community will actually see.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#partner-form" className="bg-ind hover:bg-white text-black font-display font-bold text-xl px-6 py-2.5 rounded-sm transition-colors">
                Start a partnership
              </a>
              <button onClick={onOpenScores} className="border border-white/30 hover:border-white font-display font-bold text-xl px-6 py-2.5 rounded-sm transition-colors cursor-pointer">
                See live coverage
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="font-display font-bold text-3xl sm:text-4xl mb-8">What a partnership includes</h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 border-t border-rule">
          {INCLUDED.map((i) => (
            <div key={i.title} className="border-b border-rule py-6">
              <dt className="font-display font-bold text-2xl text-white">{i.title}</dt>
              <dd className="mt-2 text-white/70 leading-relaxed max-w-[44ch]">{i.body}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* How it works — a real sequence, so it's numbered */}
      <section className="bg-panel border-y border-rule">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-8">How it works</h2>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <span className="font-display font-extrabold text-5xl text-ind tabular leading-none">{i + 1}</span>
                <p className="mt-3 font-display font-bold text-xl">{s.title}</p>
                <p className="mt-1.5 text-white/70 leading-relaxed">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* High school / college */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="border-l-2 border-ind pl-6">
          <h3 className="font-display font-bold text-2xl">High school programs</h3>
          <p className="mt-2 text-white/70 leading-relaxed max-w-[52ch]">
            Regular-season home games, rivalry nights and every round of the IHSAA tournament. We work within your
            school's media policies and credential process.
          </p>
        </div>
        <div className="border-l-2 border-ind pl-6">
          <h3 className="font-display font-bold text-2xl">College programs</h3>
          <p className="mt-2 text-white/70 leading-relaxed max-w-[52ch]">
            Game coverage and athlete content for small-college and NAIA programs that want more reach in Indiana,
            especially with the high school athletes they're recruiting.
          </p>
        </div>
      </section>

      {/* Form */}
      <section id="partner-form" className="border-t border-rule scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <h2 className="font-display font-bold text-3xl sm:text-4xl">Let's talk about your season</h2>
            <p className="mt-3 text-white/70 leading-relaxed">
              Tell us about your program and the games you want covered. We'll follow up to set up a call.
            </p>
            <div className="mt-6 space-y-1 text-[15px]">
              <a href="mailto:admin@indsports.media" className="block text-white hover:text-ind">admin@indsports.media</a>
              <a href="tel:+13174201722" className="block text-white hover:text-ind tabular">(317) 420-1722</a>
            </div>
          </div>
          <div className="lg:col-span-8">
            <InquiryForm />
          </div>
        </div>
      </section>
    </div>
  );
}
