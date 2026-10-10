// ✨ Everything you need to personalize lives in this file. ✨
//
// Photos: drop your images into  public/photos/  and update the file names below.
// (jpg, png, webp all work — e.g. "photos/us-at-the-beach.jpg")

export const config = {
  // Her name (shown on the intro, the banner and the letter)
  name: "Pearl",

  // Your name (signs the letter)
  fromName: "Your Best Friend",

  // Line under her name on the celebration screen
  subtitle: "another year of being my friend",

  // The photo she has to piece together. A square-ish photo of the two of you works best.
  puzzleImage: "photos/puzzle-collage.jpg",

  // The polaroid wall, one block per college year (oldest first).
  // `pos` (optional) picks which part of the photo stays in the polaroid crop: 'x% y%'
  years: [
    {
      label: "1st year",
      title: "where it all started",
      photos: [
        {
          src: "photos/y1-formal.jpg",
          caption:
            "POV: dressed formal, acting like we had college figured out",
          pos: "50% 40%",
        },
        {
          src: "photos/y1-selfie.jpg",
          caption: "POV: proud CHARUSATians, zero chill",
          pos: "50% 38%",
          highlight: true,
        },
      ],
    },
    {
      label: "2nd year",
      title: "the colourful chaos era",
      photos: [
        {
          src: "photos/y2-rain.jpg",
          caption:
            "POV: Ganesh Chaturthi on campus — dressed in our best, and the rain came for darshan too",
          pos: "50% 40%",
        },
        {
          src: "photos/y2-holi.jpg",
          caption: "POV: Holi, and we both chose violence",
          pos: "50% 35%",
        },
        {
          src: "photos/y2-puppy.jpg",
          caption: "POV: she found a new favourite and I got replaced",
          pos: "50% 30%",
        },
        {
          src: "photos/y2-garba.jpg",
          caption:
            "POV: “I’m not coming to garba,” she said… then made me her photographer all night — and we still got one of our best pics together",
          pos: "47% 50%",
          highlight: true,
        },
      ],
    },
    {
      label: "3rd year",
      title: "best friends, officially",
      photos: [
        {
          src: "photos/y3-plushie-selfie.jpg",
          caption:
            "POV: first gift you actually loved — a teddy, because my last one matched your ex’s (jk… mostly)",
          pos: "30% 50%",
          highlight: true,
        },
        {
          src: "photos/y3-plushie.jpg",
          caption: "POV: one teddy, one very happy best friend",
          pos: "50% 26%",
        },
        {
          src: "photos/y3-tee-signing.jpg",
          caption:
            "POV: signature day — tees full of scribbles, and a camera roll full of good shots",
          pos: "50% 30%",
        },
        {
          src: "photos/y3-traditional.jpg",
          caption: "POV: traditional day, and we cleaned up nice for once",
          pos: "50% 30%",
        },
        {
          src: "photos/y3-laughing.jpg",
          caption: "POV: our best candid ever — no posing, just real laughs",
          pos: "50% 30%",
        },
      ],
    },
    {
      label: "4th year",
      title: "final year, forever friends",
      photos: [
        {
          src: "photos/y4-piggyback.jpg",
          caption:
            "POV: been carrying her problems since 1st year — final year, I carried her too",
          pos: "50% 45%",
        },
        {
          src: "photos/y4-silly-selfie.jpg",
          caption:
            "POV: four years later, same silly faces. some things never change",
          pos: "50% 50%",
        },
        {
          src: "photos/y4-mirror-flowers.jpg",
          caption:
            "POV: our first serious fight… and we still met to celebrate my Bangalore send-off. fights end, best friends don’t.",
          pos: "50% 50%",
          highlight: true,
        },
        {
          src: "photos/y4-pose.jpg",
          caption:
            "POV: our last photo on campus as students — signature pose, one final time",
          pos: "50% 40%",
        },
      ],
    },
    {
      num: "+", // shown instead of a year number
      label: "bonus",
      title: "few random bakchodi",
      photos: [
        {
          src: "photos/bonus-class-nap.jpg",
          caption:
            "POV: the lecture was so boring, the notebook became a pillow",
          pos: "50% 50%",
        },
        {
          src: "photos/bonus-dessert.jpg",
          caption:
            "POV: one fight with the bf, way too many tears, one call to me — and we rode 15 km just for ice cream",
          pos: "50% 55%",
        },
        {
          src: "photos/bonus-bottle-dance.jpg",
          caption:
            "POV: Jamal Kudu with a liquor bottle… oh sorry, a Coolberg bottle",
          pos: "50% 50%",
        },
        {
          src: "photos/bonus-pout-selfie.jpg",
          caption: "POV: she brought the pout, he brought the attitude",
          pos: "50% 80%",
        },
        {
          src: "photos/bonus-canteen.jpg",
          caption: "POV: canteen break is the real lecture",
          pos: "50% 65%",
        },
      ],
    },
  ],

  // Shown at the end of the polaroid wall
  wallOutro: "four years of chapters, and the best ones are still unwritten.",

  // Number of candles on the cake
  candles: 3,

  // Your letter — one string per paragraph. Write from the heart 💛
  letter: [
    "Happy birthday! Another year older, same chaos — and honestly, I wouldn’t have it any other way.",
    "I still have that bottle full of letters you gave me — easily one of the best gifts I’ve ever got. And those shoes — I was totally shocked, such a good gift. Thank you for both, they mean a lot.",
    "Hope this year brings you lots of happiness and good food. And yes, I know you have a boyfriend now — but don’t forget or ignore us. We are here! Have the best day!",
  ],

  // Line above your name at the end of the letter
  letterSignoff: "cheers to many more,",

  // Optional background music: put an mp3 at  public/music.mp3  (leave as is if you don't want music)
  music: "music.mp3",
};
