# IND Sports Media — Newsroom & live coverage

## For the team (game night)

1. On your phone, open **indsports.media/newsroom** and tap **Sign in with Google**.
   (Tip: "Add to Home Screen" so it opens like an app.)
2. **Starting a game:** tap **Live → Start live coverage**, enter a headline like
   "LIVE: Westfield vs. Carmel", pick the sport, add a cover photo, and tap **Publish**.
3. **During the game:** on the **Live** tab, type what happened, tap **Add photo or video**,
   and tap **Post update**. Fans on the story page see it instantly — no refresh.
   - Pin the big play to the top with the pin icon. Delete mistakes with the trash icon.
   - Every update has its own Share buttons and link.
4. **After the game:** go to **Stories → Edit**, write the recap in the Story box,
   tap **Update**, then **Live → End live coverage**. The live feed stays on the page under the recap.

Sharing: on a phone, the blue **Share** button opens your phone's share sheet
(Instagram, TikTok, Messages, etc.). **IG caption** copies a ready-to-paste caption with the link.

## Keeping score (indsports.media/score)

Open **/score** on your phone (or tap **Scorekeeper** in the Newsroom). Sign in with Google.

- **New game:** pick Football, Basketball or Volleyball, choose both schools from your Schools list
  (logos fill in), add venue and time. Tap **Start game (go live)** at kickoff.
- **Football:** TD / PAT / 2-PT / FG / Safety buttons for each team, quarter, ball, down and distance,
  ball on, red zone. No game clock to babysit; fans see the quarter.
- **Basketball:** +1 / +2 / +3, team fouls, and a clock you only Start and Stop. Every fan's screen
  counts down on its own. Changing quarters resets to 8:00 (OT 4:00).
- **Volleyball:** tap the big number to add a point. When a set is won (25, win by 2; set 5 to 15)
  an **End set** button appears. The match goes Final automatically at 3 sets.
- **Undo** reverses your last tap, as many times as you need.
- **No signal?** Keep tapping. The top bar says "No signal, saving on phone" and everything sends
  when signal returns. Keep the page open until it says **Saved**.
- **Two phones:** one person can keep score on /score while another posts photos in the Newsroom
  or the scoreboard's Sideline Console. Score taps only change the score, so they can't erase
  each other. (Avoid changing the score in the old Sideline Console during a game.)
- **Live story:** on the game screen tap **Create live story for this game** (or link an existing
  live story). With **Auto-post to story** on, the story gets updates automatically:
  football = kickoff, every score, end of each quarter, halftime, final; basketball = tip-off,
  end of each quarter, halftime, final; volleyball = first serve, each set result, final.
  **Undo** also deletes the auto-post. The story page shows a live score box at the top.
  Photos and notes still go in through the Newsroom **Live** tab as usual.
- **End game** marks it Final. Archive or delete old and sample games from the game's screen.

## School logos

Newsroom → **Schools** → type the school name exactly as it appears on the scoreboard
(e.g. "Westfield"), pick the logo, **Save school**. Every game with that school — scoreboard,
score ticker, game cards — shows the logo automatically, including games already created.
Add other spellings under "Other names" (e.g. "WHS, Westfield High School").
Transparent PNGs look best. "Change logo" swaps it everywhere at once.

## For admins

- Add or remove people in the **Team** tab. They must use the same Google email they sign in with.
- **Writer** = can post, edit, publish. **Admin** = writer + can manage the team.
- The scoreboard's Sideline Operator Console now uses the same Google sign-in (the old PIN is gone).

## One-time Firebase setup (project `pelagic-airline-s1ttq`)

1. **Authentication → Sign-in method → Google → Enable.**
   **Authentication → Settings → Authorized domains:** add `indsports.media` (and `www.indsports.media`).
2. **Storage → Get started** (Blaze plan, location `us-central1`, production mode).
3. **Firestore → Rules:** paste the contents of `firestore.rules` → Publish.
4. **Storage → Rules:** paste the contents of `storage.rules` → Publish.
5. **Create the first admin:** Firestore → Data → Start collection `staff` →
   Document ID = your Google email in lowercase → fields `name` (string) and `role` (string) = `admin`.
   Everyone else can then be added from the Newsroom Team tab.

## How it fits together

| Piece | Where |
|---|---|
| Newsroom (team tools) | `src/components/Newsroom.tsx` at `/newsroom` |
| Public story / live page | `src/components/ArticlePage.tsx` at `/news/{slug}` |
| Articles list | `src/components/ArticlesSection.tsx` (reads Firestore `articles`) |
| Data + uploads | `src/lib/articles.ts` |
| Team sign-in | `src/lib/staff.ts` (Firestore `staff/{email}`) |
| Social preview cards | `netlify/edge-functions/news-preview.ts` |
| Security | `firestore.rules`, `storage.rules` |

Firestore data:
- `articles/{slug}` — title, excerpt, body, sport, coverUrl, coverType, status (draft/published), isLive, authorName, authorEmail, timestamps
- `articles/{slug}/updates/{id}` — text, mediaUrl, mediaType, authorName, pinned, createdAt
- `staff/{email}` — name, role (admin/writer)
