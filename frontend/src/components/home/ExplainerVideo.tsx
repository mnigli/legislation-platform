import { useState, useEffect, useCallback } from 'react';
import { FiPlay, FiPause, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// ==================== SIMULATION STAGES ====================

interface SimStage {
  id: string;
  label: string;
  icon: string;
  scene: 'submit' | 'table' | 'committee' | 'first' | 'back' | 'second' | 'passed' | 'celebrate';
  title: string;
  subtitle: string;
  day: number;
  bg: string;
}

const STAGES: SimStage[] = [
  {
    id: 'submit',
    label: 'הגשה',
    icon: '📝',
    scene: 'submit',
    title: 'ח"כ דנה לוי מגישה הצעת חוק',
    subtitle: 'הצעת חוק חינוך חינם לגיל הרך, התשפ"ה-2025',
    day: 0,
    bg: 'from-slate-900 via-blue-900 to-knesset-blue',
  },
  {
    id: 'table',
    label: 'הנחה',
    icon: '🏛️',
    scene: 'table',
    title: 'הונחה על שולחן הכנסת',
    subtitle: 'ההצעה מופיעה ברשימת הצעות החוק הרשמית של הכנסת',
    day: 14,
    bg: 'from-indigo-900 via-blue-900 to-slate-900',
  },
  {
    id: 'committee',
    label: 'ועדה',
    icon: '👥',
    scene: 'committee',
    title: 'דיון בוועדת החינוך',
    subtitle: 'חברי הוועדה דנים בהצעה, שומעים מומחים ומשנים סעיפים',
    day: 59,
    bg: 'from-violet-900 via-purple-900 to-indigo-900',
  },
  {
    id: 'first',
    label: 'קריאה ראשונה',
    icon: '🗳️',
    scene: 'first',
    title: 'הצבעה — קריאה ראשונה',
    subtitle: 'מליאת הכנסת מצביעה: 67 בעד, 41 נגד — ההצעה עברה!',
    day: 89,
    bg: 'from-blue-900 via-knesset-blue to-indigo-900',
  },
  {
    id: 'back',
    label: 'חזרה לוועדה',
    icon: '🔄',
    scene: 'back',
    title: 'חזרה לוועדה להכנה לקריאה שנייה',
    subtitle: 'הוועדה מעדנת את הנוסח בהתאם להערות חברי הכנסת',
    day: 149,
    bg: 'from-purple-900 via-fuchsia-900 to-violet-900',
  },
  {
    id: 'second',
    label: 'קריאה שנייה ושלישית',
    icon: '⚖️',
    scene: 'second',
    title: 'הצבעה סופית — קריאה שנייה ושלישית',
    subtitle: 'מליאת הכנסת מצביעה: 72 בעד, 38 נגד — החוק אושר!',
    day: 171,
    bg: 'from-knesset-blue via-blue-800 to-blue-900',
  },
  {
    id: 'passed',
    label: 'אישור',
    icon: '✅',
    scene: 'passed',
    title: 'החוק פורסם ברשומות',
    subtitle: 'חוק חינוך חינם לגיל הרך, התשפ"ה-2025 — נכנס לתוקף',
    day: 178,
    bg: 'from-emerald-900 via-green-900 to-teal-900',
  },
  {
    id: 'celebrate',
    label: 'השפעה',
    icon: '🎉',
    scene: 'celebrate',
    title: 'מ-178 ימים של תהליך — לחוק שמשנה חיים',
    subtitle: 'בחוקית תוכלו לעקוב אחרי כל שלב, לדרג ולהשפיע על תהליך החקיקה',
    day: 178,
    bg: 'from-knesset-blue via-indigo-900 to-violet-900',
  },
];

const STAGE_DURATION = 4500;

// ==================== SUB COMPONENTS ====================

function StageProgressBar({ stages, current }: { stages: SimStage[]; current: number }) {
  return (
    <div className="flex items-center gap-0.5 md:gap-1">
      {stages.map((stage, i) => {
        const isActive = i === current;
        const isPast = i < current;
        return (
          <div key={stage.id} className="flex items-center">
            <div className={`
              w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-500
              ${isActive ? 'bg-knesset-gold text-knesset-blue scale-125 shadow-lg shadow-yellow-500/30' : ''}
              ${isPast ? 'bg-green-500 text-white' : ''}
              ${!isActive && !isPast ? 'bg-white/10 text-white/40' : ''}
            `}>
              {isPast ? '✓' : stage.icon}
            </div>
            {i < stages.length - 1 && (
              <div className={`w-2 md:w-6 lg:w-10 h-0.5 transition-all duration-500 ${isPast ? 'bg-green-500' : 'bg-white/10'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function VoteAnimation({ forVotes, againstVotes, passed }: { forVotes: number; againstVotes: number; passed: boolean }) {
  const total = forVotes + againstVotes;
  const forPct = Math.round((forVotes / total) * 100);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Vote bar */}
      <div className="flex rounded-xl overflow-hidden h-10 md:h-12 shadow-lg mb-3">
        <div
          className="bg-gradient-to-l from-green-400 to-green-600 flex items-center justify-center transition-all duration-1000"
          style={{ width: `${forPct}%` }}
        >
          <span className="text-white font-black text-sm md:text-lg">{forVotes} בעד</span>
        </div>
        <div
          className="bg-gradient-to-l from-red-600 to-red-400 flex items-center justify-center transition-all duration-1000"
          style={{ width: `${100 - forPct}%` }}
        >
          <span className="text-white font-black text-sm md:text-lg">{againstVotes} נגד</span>
        </div>
      </div>
      <div className={`text-center text-lg md:text-xl font-black ${passed ? 'text-green-400' : 'text-red-400'}`}>
        {passed ? '✅ ההצעה אושרה!' : '❌ ההצעה נדחתה'}
      </div>
    </div>
  );
}

function DocumentAnimation() {
  return (
    <div className="relative w-48 md:w-64 mx-auto">
      {/* Document */}
      <div className="bg-white rounded-lg shadow-2xl p-4 md:p-6 transform hover:scale-105 transition-transform">
        <div className="flex items-center gap-2 mb-3 border-b pb-2">
          <div className="w-8 h-8 bg-knesset-blue rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">כ</span>
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold text-gray-800">הצעת חוק</p>
            <p className="text-[8px] md:text-[10px] text-gray-400">כנסת ה-25</p>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 bg-gray-200 rounded w-full" />
          <div className="h-1.5 bg-gray-200 rounded w-5/6" />
          <div className="h-1.5 bg-gray-200 rounded w-4/6" />
          <div className="h-1.5 bg-blue-100 rounded w-full mt-3" />
          <div className="h-1.5 bg-blue-100 rounded w-5/6" />
          <div className="h-1.5 bg-gray-200 rounded w-3/6 mt-3" />
          <div className="h-1.5 bg-gray-200 rounded w-full" />
        </div>
        <div className="mt-4 flex items-center gap-1">
          <span className="text-yellow-500 text-xs">★★★★</span>
          <span className="text-gray-300 text-xs">★</span>
          <span className="text-[9px] text-gray-400 mr-1">4.0</span>
        </div>
      </div>
      {/* Stamp effect */}
      <div className="absolute -top-2 -left-2 md:-top-3 md:-left-3 bg-knesset-gold text-knesset-blue rounded-full w-10 h-10 md:w-14 md:h-14 flex items-center justify-center font-black text-xs md:text-sm shadow-lg transform -rotate-12 animate-pulse">
        חדש
      </div>
    </div>
  );
}

function CommitteeScene() {
  const members = ['👩‍💼', '👨‍💼', '👩‍⚖️', '👨‍⚖️', '👩‍💼'];
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Committee table */}
      <div className="flex items-end gap-2 md:gap-4">
        {members.map((m, i) => (
          <div
            key={i}
            className="flex flex-col items-center animate-pulse"
            style={{ animationDelay: `${i * 200}ms`, animationDuration: '2s' }}
          >
            <span className="text-2xl md:text-4xl">{m}</span>
            <div className="w-8 md:w-12 h-1.5 bg-amber-700 rounded-full mt-1" />
          </div>
        ))}
      </div>
      {/* Table */}
      <div className="w-48 md:w-72 h-6 md:h-8 bg-gradient-to-l from-amber-800 to-amber-900 rounded-lg shadow-inner flex items-center justify-center">
        <span className="text-amber-200 text-[10px] md:text-xs font-bold">שולחן הוועדה</span>
      </div>
      {/* Speech bubbles */}
      <div className="flex gap-2 md:gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-1.5 text-[10px] md:text-xs text-white/80 animate-bounce" style={{ animationDelay: '0ms', animationDuration: '3s' }}>
          "צריך לתקן סעיף 3"
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-1.5 text-[10px] md:text-xs text-white/80 animate-bounce" style={{ animationDelay: '500ms', animationDuration: '3s' }}>
          "מוסיף תקציב"
        </div>
      </div>
    </div>
  );
}

function CelebrationScene() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2 text-3xl md:text-5xl">
        {['🎉', '🏛️', '⭐', '📊', '🎉'].map((e, i) => (
          <span
            key={i}
            className="animate-bounce"
            style={{ animationDelay: `${i * 150}ms`, animationDuration: '1s' }}
          >
            {e}
          </span>
        ))}
      </div>
      <div className="flex gap-2 md:gap-3 flex-wrap justify-center mt-2">
        {['דרגו הצעות', 'עקבו בזמן אמת', 'השפיעו על החקיקה'].map((text, i) => (
          <div
            key={text}
            className="bg-knesset-gold/20 border border-knesset-gold/40 text-knesset-gold px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold animate-pulse"
            style={{ animationDelay: `${i * 300}ms` }}
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}

function OfficialSealScene() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-bl from-emerald-500 to-green-700 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30 animate-pulse" style={{ animationDuration: '2s' }}>
          <span className="text-4xl md:text-6xl">✅</span>
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 md:w-10 md:h-10 bg-knesset-gold rounded-full flex items-center justify-center shadow-lg">
          <span className="text-sm md:text-lg">🏛️</span>
        </div>
      </div>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 md:px-6 py-2 md:py-3 mt-2">
        <p className="text-[10px] md:text-xs text-white/50 text-center">רשומות • ספר החוקים</p>
        <p className="text-xs md:text-sm font-bold text-white text-center">חוק חינוך חינם לגיל הרך</p>
        <p className="text-[10px] md:text-xs text-green-400 font-bold text-center mt-1">תקף מיום פרסומו</p>
      </div>
    </div>
  );
}

// ==================== RENDER SCENE ====================

function SceneRenderer({ scene }: { scene: SimStage['scene'] }) {
  switch (scene) {
    case 'submit':
      return <DocumentAnimation />;
    case 'table':
      return (
        <div className="flex flex-col items-center gap-3">
          <div className="text-5xl md:text-7xl">🏛️</div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-2 md:w-3 h-8 md:h-12 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
        </div>
      );
    case 'committee':
      return <CommitteeScene />;
    case 'first':
      return <VoteAnimation forVotes={67} againstVotes={41} passed={true} />;
    case 'back':
      return (
        <div className="flex flex-col items-center gap-3">
          <div className="text-4xl md:text-6xl animate-spin" style={{ animationDuration: '3s' }}>🔄</div>
          <div className="flex gap-2">
            <div className="bg-white/10 rounded-lg px-3 py-2 text-[10px] md:text-xs text-white/70">נוסח מעודכן</div>
            <div className="bg-white/10 rounded-lg px-3 py-2 text-[10px] md:text-xs text-white/70">תיקוני סעיפים</div>
            <div className="bg-white/10 rounded-lg px-3 py-2 text-[10px] md:text-xs text-white/70">תקציב מאושר</div>
          </div>
        </div>
      );
    case 'second':
      return <VoteAnimation forVotes={72} againstVotes={38} passed={true} />;
    case 'passed':
      return <OfficialSealScene />;
    case 'celebrate':
      return <CelebrationScene />;
    default:
      return null;
  }
}

// ==================== MAIN COMPONENT ====================

export default function ExplainerVideo() {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const goNext = useCallback(() => {
    setCurrent((prev) => {
      if (prev >= STAGES.length - 1) {
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
        return prev + (100 / (STAGE_DURATION / 50));
      });
    }, 50);
    return () => clearInterval(interval);
  }, [playing, goNext]);

  const stage = STAGES[current];

  const handlePlayPause = () => {
    if (!playing && current >= STAGES.length - 1) {
      setCurrent(0);
      setProgress(0);
    }
    setPlaying(!playing);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-2xl select-none" style={{ aspectRatio: '2/1' }}>
      {/* Background */}
      <div className={`bg-gradient-to-bl ${stage.bg} transition-all duration-700 ease-in-out absolute inset-0`} />

      {/* Content */}
      <div className="relative h-full flex flex-col">
        {/* Top bar — HUD style */}
        <div className="flex items-center justify-between px-4 md:px-8 pt-4 md:pt-6">
          {/* Day counter */}
          <div className="flex items-center gap-2">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl px-3 md:px-4 py-1.5 md:py-2 flex items-center gap-2">
              <span className="text-knesset-gold text-xs md:text-sm font-bold">📅</span>
              <div>
                <p className="text-[9px] md:text-[11px] text-white/50 leading-none">יום</p>
                <p className="text-lg md:text-2xl font-black text-white leading-none">{stage.day}</p>
              </div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-xl px-3 md:px-4 py-1.5 md:py-2 hidden md:block">
              <p className="text-[9px] md:text-[11px] text-white/50 leading-none">סימולטור חקיקה</p>
              <p className="text-xs md:text-sm font-bold text-knesset-gold leading-tight">כנסת ה-25</p>
            </div>
          </div>

          {/* Stage progress (top-right) */}
          <StageProgressBar stages={STAGES} current={current} />
        </div>

        {/* Main scene area */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-16 pb-16 md:pb-20">
          {/* Scene visual */}
          <div className="mb-4 md:mb-6">
            <SceneRenderer scene={stage.scene} />
          </div>

          {/* Title & subtitle */}
          <h3 className="text-lg md:text-3xl lg:text-4xl font-black text-white mb-2 md:mb-3 text-center max-w-3xl leading-tight">
            {stage.title}
          </h3>
          <p className="text-xs md:text-lg text-white/60 text-center max-w-2xl leading-relaxed">
            {stage.subtitle}
          </p>
        </div>
      </div>

      {/* Controls bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-md px-4 md:px-8 py-3 md:py-4">
        {/* Progress bars */}
        <div className="flex gap-1 mb-2 md:mb-3">
          {STAGES.map((s, i) => (
            <button
              key={s.id}
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
              {current + 1} / {STAGES.length}
            </span>
            <span className="text-white/30 text-[10px] md:text-xs hidden md:inline">
              | {stage.label}
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
              disabled={current >= STAGES.length - 1}
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
