# 🎁 Birthday Surprise

A little website that goes: gift box → photo puzzle → sparkles → Happy Birthday banner → polaroid wall → make-a-wish cake → a letter.

## Run it

```bash
npm install
npm run dev
```

Open the link it prints (it also shows a Network URL you can open on your phone if you're on the same Wi-Fi).

## Make it yours (all in `src/config.js`)

1. **Her name, your name, and the subtitle**: edit `name`, `fromName` and `subtitle`.
2. **Puzzle photo**: put a photo of you two in `public/photos/` (e.g. `us.jpg`), then set `puzzleImage: 'photos/us.jpg'`.
   A square-ish photo works best. Pick one with lots of detail so the pieces are easy to tell apart.
3. **Polaroids**: the wall is grouped by college year. Put photos in `public/photos/` and add them under the right year in `years`, each with a caption. `pos` (like `'50% 40%'`) picks which part of the photo stays in the frame.
4. **Letter**: write your message in `letter`. Each string is one paragraph.
5. **Music (optional)**: put an mp3 at `public/music.mp3`. It starts when she taps the gift. If there's no file, the music button just doesn't show up.

Tip: big phone photos (5–10 MB) load slowly. Resize them to about 1200px wide first, using any online "compress jpg" tool.

## Share it with her

```bash
npm run build
```

Drag the `dist` folder onto https://app.netlify.com/drop and you'll get a free link to send her.
(Vercel or GitHub Pages also work.)

## What she'll see

- **Gift**: tap it and it bursts open with sparkles.
- **Puzzle**: drag a piece onto another to swap them, or tap two pieces. Each piece that lands in the right spot sparkles. It's a 3×3 grid, and "hold to peek" shows the full photo.
- **Solved**: the seams close, a light sweeps across the photo and it explodes into sparkles.
- **Celebration**: confetti, swinging flag bunting, her name in shimmering gold, and floating balloons.
- **Polaroid wall**: the photos get tossed onto the page. She can drag them around or tap one to see it bigger.
- **Cake**: tap the flames, or let her blow into her mic for real.
- **Letter**: an envelope opens and your letter types itself out.
