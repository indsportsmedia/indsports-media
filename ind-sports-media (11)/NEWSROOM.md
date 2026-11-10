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
