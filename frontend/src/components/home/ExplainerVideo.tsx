import { useState, useEffect, useCallback } from 'react';
import { FiPlay, FiPause, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Slide {
  emoji: string;
  title: string;
  body: string;
  bg: string;
  accent: string;
}

const SLIDES: Slide[] = [
  {
    emoji: '🏛️',
    title: 'כל שנה מוגשות מאות הצעות חוק',
    body: 'בכנסת ישראל מוגשות מדי שנה כ-350 הצעות חוק חדשות.\nאבל מי באמת קורא אותן? מי מבין את ההשפעה שלהן על חיי היומיום?',
    bg: 'from-slate-900 via-knesset-blue to-blue-900',
    accent: 'text-blue-300',
  },
  {
    emoji: '😕',
    title: 'השפה המשפטית חוסמת אזרחים',
    body: 'הצעות חוק נכתבות בשפה משפטית מורכבת.\nרוב האזרחים לא מבינים מה בדיוק מוצע — ולא יכולים להשפיע על התהליך.',
    bg: 'from-red-900 via-rose-800 to-pink-900',
    accent: 'text-rose-300',
  },
  {
    emoji: '💡',
    title: 'הפתרון: חוקית — הגיטהב של החקיקה',
    body: 'כמו שגיטהב שינה את עולם התוכנה ואפשר לכל מפתח לשתף קוד — חוקית מאפשרת לכל אזרח להשתתף בתהליך החקיקה.',
    bg: 'from-knesset-blue via-indigo-800 to-violet-900',
    accent: 'text-knesset-gold',
  },
  {
    emoji: '🤖',
    title: 'תקצירים בשפה פשוטה עם AI',
    body: 'כל הצעת חוק מהכנסת מופיעה בפלטפורמה עם תקציר אוטומטי בשפה פשוטה שנוצר באמצעות בינה מלאכותית — כדי שכולם יבינו.',
    bg: 'from-purple-900 via-violet-800 to-indigo-900',
    accent: 'text-violet-300',
  },
  {
    emoji: '⭐',
    title: 'דרגו, הגיבו, והציעו שיפורים',
    body: 'תנו כוכבים להצעות שחשובות לכם.\nכתבו תגובות והציעו שיפורים — בדיוק כמו Pull Request בגיטהב.\nכל קול נשמע.',
    bg: 'from-amber-900 via-orange-800 to-yellow-900',
    accent: 'text-amber-300',
  },
  {
    emoji: '📊',
    title: 'דשבורדים עם נתוני אמת',
    body: 'כמה זמן לוקח לחוק לעבור? מי שיאני החקיקה? איך ישראל משתווה לעולם?\nהכל שקוף, הכל פתוח, הכל מבוסס נתונים אמיתיים.',
    bg: 'from-emerald-900 via-teal-800 to-cyan-900',
    accent: 'text-emerald-300',
  },
  {
    emoji: '🇮🇱',
    title: 'חוקית — כי חקיקה היא לא רק של פוליטיקאים',
    body: 'הצטרפו עכשיו והשפיעו על החוקים שמעצבים את חייכם.\nדמוקרטיה מתחילה כשאזרחים מבינים, משתתפים ומשפיעים.',
    bg: 'from-knesset-blue via-blue-800 to-indigo-900',
    accent: 'text-knesset-gold',
  },
];

const SLIDE_DURATION = 5000; // 5 seconds per slide

export default function ExplainerVideo() {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const goNext = useCallback(() => {
    setCurrent((prev) => {
      if (prev >= SLIDES.length - 1) {
        setPlaying(false);
        return prev;
      }
      return prev + 1;
    });
    setProgress(0);
  }, []);

  const goPrev = useCallback(() => {
    setCurrent((prev) => Math.max(0, prev - 1));
    setProgress(0);
  }, []);

  // Auto-advance timer
  useEffect(() => {
    if (!playing) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goNext();
          return 0;
        }
        return prev + (100 / (SLIDE_DURATION / 50));
      });
    }, 50);

    return () => clearInterval(interval);
  }, [playing, goNext]);

  const slide = SLIDES[current];

  const handlePlayPause = () => {
    if (!playing && current >= SLIDES.length - 1) {
      setCurrent(0);
      setProgress(0);
    }
    setPlaying(!playing);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-2xl select-none">
      {/* Main slide area */}
      <div
        className={`bg-gradient-to-bl ${slide.bg} transition-all duration-700 ease-in-out`}
        style={{ minHeight: '420px' }}
      >
        <div className="flex flex-col items-center justify-center text-center px-8 py-16 md:px-16 md:py-20">
          {/* Animated emoji */}
          <div className="text-7xl md:text-8xl mb-8 animate-bounce" style={{ animationDuration: '2s' }}>
            {slide.emoji}
          </div>

          {/* Title */}
          <h3
            className="text-2xl md:text-4xl font-black text-white mb-6 max-w-3xl leading-tight transition-opacity duration-500"
            key={`title-${current}`}
          >
            {slide.title}
          </h3>

          {/* Body text */}
          <div className="max-w-2xl" key={`body-${current}`}>
            {slide.body.split('\n').map((line, i) => (
              <p key={i} className={`text-lg md:text-xl ${slide.accent} mb-2 leading-relaxed transition-opacity duration-500`}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Controls bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md px-6 py-4">
        {/* Progress bars */}
        <div className="flex gap-1.5 mb-3">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); setProgress(0); }}
              className="flex-1 h-1 rounded-full overflow-hidden bg-white/20 cursor-pointer"
            >
              <div
                className="h-full bg-knesset-gold rounded-full transition-all"
                style={{
                  width: i < current ? '100%' : i === current ? `${progress}%` : '0%',
                  transitionDuration: i === current ? '50ms' : '300ms',
                }}
              />
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayPause}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              {playing ? <FiPause size={18} /> : <FiPlay size={18} />}
            </button>
            <span className="text-white/60 text-sm font-medium">
              {current + 1} / {SLIDES.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              disabled={current === 0}
              className="w-9 h-9 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-colors"
            >
              <FiChevronRight size={18} />
            </button>
            <button
              onClick={() => { goNext(); }}
              disabled={current >= SLIDES.length - 1}
              className="w-9 h-9 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-colors"
            >
              <FiChevronLeft size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
