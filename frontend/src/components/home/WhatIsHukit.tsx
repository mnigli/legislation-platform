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
    title: 'הפתרון: חוקית',
    body: 'פלטפורמה שהופכת את החקיקה הישראלית לנגישה, שקופה ומשתפת.\nכל אזרח יכול להשתתף בתהליך החקיקה.',
    bg: 'from-knesset-blue via-indigo-800 to-violet-900',
    accent: 'text-knesset-gold',
  },
  {
    emoji: '🤖',
    title: 'תקצירים בשפה פשוטה עם AI',
    body: 'כל הצעת חוק מהכנסת מופיעה בפלטפורמה עם תקציר אוטומטי\nבשפה פשוטה שנוצר באמצעות בינה מלאכותית — כדי שכולם יבינו.',
    bg: 'from-purple-900 via-violet-800 to-indigo-900',
    accent: 'text-violet-300',
  },
  {
    emoji: '⭐',
    title: 'שלב 1: דרגו והציעו שיפורים',
    body: 'קראו תקצירים של הצעות חוק בשפה פשוטה.\nדרגו מ-1 עד 5 כוכבים והציעו שיפורים לנוסח.\nהצעות עם דירוג גבוה עולות לזירת הדיונים.',
    bg: 'from-amber-900 via-orange-800 to-yellow-900',
    accent: 'text-amber-300',
  },
  {
    emoji: '🏟️',
    title: 'שלב 2: זירת הדיונים',
    body: 'הצעות חוק חשובות מגיעות לזירת הדיונים.\nשם תמצאו ניתוח מעמיק: נקודות מחלוקת, בעלי עניין, ומה פתוח לשינוי.\nהצביעו על שאלות מפתח וקבעו את העמדה הציבורית.',
    bg: 'from-teal-900 via-cyan-800 to-blue-900',
    accent: 'text-cyan-300',
  },
  {
    emoji: '🗳️',
    title: 'הצבעה ציבורית על שאלות מפתח',
    body: 'בזירת הדיונים, כל שאלה נפתחת להצבעה: מסכים, ניטרלי, או לא מסכים.\nהתוצאות מראות את הקונצנזוס הציבורי בזמן אמת.\nגם חברי כנסת ולוביסטים חושפים את עמדותיהם.',
    bg: 'from-indigo-900 via-purple-800 to-pink-900',
    accent: 'text-purple-300',
  },
  {
    emoji: '🇮🇱',
    title: 'חוקית — כי חקיקה היא לא רק של פוליטיקאים',
    body: 'הצטרפו עכשיו והשפיעו על החוקים שמעצבים את חייכם.\nדמוקרטיה מתחילה כשאזרחים מבינים, משתתפים ומשפיעים.',
    bg: 'from-knesset-blue via-blue-800 to-indigo-900',
    accent: 'text-knesset-gold',
  },
];

const SLIDE_DURATION = 5000;

export default function WhatIsHukit() {
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
    <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl select-none min-h-[400px] md:min-h-0 md:aspect-[2/1]">
      {/* Main slide area */}
      <div className={`bg-gradient-to-bl ${slide.bg} transition-all duration-700 ease-in-out absolute inset-0`} />

      <div className="relative min-h-[400px] md:min-h-0 md:h-full flex flex-col items-center justify-center text-center px-4 md:px-20 pb-16 pt-6">
        {/* Animated emoji */}
        <div className="text-4xl md:text-7xl mb-3 md:mb-6 animate-bounce" style={{ animationDuration: '2s' }}>
          {slide.emoji}
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-4xl font-black text-white mb-2 md:mb-5 max-w-4xl leading-snug">
          {slide.title}
        </h3>

        {/* Body text */}
        <div className="max-w-3xl">
          {slide.body.split('\n').map((line, i) => (
            <p key={i} className={`text-xs md:text-xl ${slide.accent} mb-1 md:mb-2 leading-relaxed`}>
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Controls bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-md px-4 md:px-8 py-3 md:py-4">
        {/* Progress bars */}
        <div className="flex gap-1 mb-2 md:mb-3">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); setProgress(0); }}
              className="flex-1 h-1 md:h-1.5 rounded-full overflow-hidden bg-white/15 cursor-pointer"
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
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={handlePlayPause}
              className="w-8 h-8 md:w-10 md:h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              {playing ? <FiPause size={16} /> : <FiPlay size={16} />}
            </button>
            <span className="text-white/50 text-xs md:text-sm font-medium">
              {current + 1} / {SLIDES.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2">
            <button
              onClick={goPrev}
              disabled={current === 0}
              className="w-8 h-8 md:w-9 md:h-9 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-colors"
            >
              <FiChevronRight size={16} />
            </button>
            <button
              onClick={goNext}
              disabled={current >= SLIDES.length - 1}
              className="w-8 h-8 md:w-9 md:h-9 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-colors"
            >
              <FiChevronLeft size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
