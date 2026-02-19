import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiArrowRight, FiPlay, FiPause, FiVolume2, FiFileText, FiZap, FiSearch, FiHeadphones } from 'react-icons/fi';
import { api } from '../services/api';
import { BILL_STAGE_LABELS } from '../types';

// ==================== TTS HOOK ====================

function useTextToSpeech(text: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const play = useCallback(() => {
    if (!text) return;
    stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'he-IL';
    utterance.rate = 0.9;

    // Try to get Hebrew voice
    const voices = window.speechSynthesis.getVoices();
    const heVoice = voices.find(v => v.lang.startsWith('he'));
    if (heVoice) utterance.voice = heVoice;

    const estimatedDuration = text.length * 80; // rough ms per char
    const startTime = Date.now();

    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(100);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setProgress(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min(95, (elapsed / estimatedDuration) * 100));
    }, 200);
  }, [text, stop]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      play();
    }
  }, [isPlaying, play, stop]);

  useEffect(() => stop, [stop]);

  return { isPlaying, progress, toggle };
}

// ==================== EXPLORE CARD COMPONENT ====================

function ExploreCard({
  icon,
  title,
  subtitle,
  gradient,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  gradient: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`bg-gradient-to-bl ${gradient} rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow`}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 md:px-8 md:pt-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white">
            {icon}
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-black text-white">{title}</h3>
            <p className="text-white/60 text-xs md:text-sm">{subtitle}</p>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="px-6 pb-6 md:px-8 md:pb-8">
        {children}
      </div>
    </div>
  );
}

// ==================== MAIN PAGE ====================

export default function BillExplorePage() {
  const { id } = useParams<{ id: string }>();

  const { data: billRes, isLoading } = useQuery({
    queryKey: ['bill', id],
    queryFn: () => api.getBill(id!),
    enabled: !!id,
  });

  const bill = billRes?.data;

  // Extract clean summary text for TTS
  const summaryText = bill?.summaryHe
    ? bill.summaryHe.replace(/##?\s*.+/g, '').replace(/[-*#]/g, '').replace(/\n+/g, ' ').trim()
    : 'הצעת חוק זו עוסקת בנושא חשוב לאזרחי ישראל. התקציר המלא ייווצר בקרוב באמצעות בינה מלאכותית.';

  const tts = useTextToSpeech(summaryText);

  // Parse impact analysis
  let impactData: any = null;
  if (bill?.impactAnalysisHe) {
    try { impactData = JSON.parse(bill.impactAnalysisHe); } catch {}
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-72 bg-gray-200 rounded-3xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 text-lg">הצעת החוק לא נמצאה</p>
        <Link to="/" className="text-knesset-blue font-bold mt-4 inline-block">חזרה לדף הבית</Link>
      </div>
    );
  }

  const stageLabel = BILL_STAGE_LABELS[bill.currentStage as keyof typeof BILL_STAGE_LABELS] || bill.currentStage;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/" className="text-knesset-blue hover:underline text-sm font-medium flex items-center gap-1 mb-4">
          <FiArrowRight size={14} />
          חזרה לדף הבית
        </Link>
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="bg-knesset-blue text-white text-xs font-bold px-3 py-1 rounded-full">{stageLabel}</span>
          {bill.categories.map((cat: string) => (
            <span key={cat} className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">{cat}</span>
          ))}
          <span className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">🤖 הסבר AI</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-2 leading-tight">
          {bill.titleHe}
        </h1>
        {bill.proposerName && (
          <p className="text-gray-500">
            הוגשה ע"י {bill.proposerName.split(',')[0].trim()}
            {bill.proposerParty && <span className="text-gray-400"> • {bill.proposerParty.substring(0, 30)}</span>}
          </p>
        )}
      </div>

      {/* 4 Explore Cards — 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        {/* Card 1: Summary */}
        <ExploreCard
          icon={<FiFileText size={20} />}
          title="תקציר הצעת החוק"
          subtitle="מה ההצעה אומרת בשפה פשוטה?"
          gradient="from-knesset-blue via-blue-700 to-indigo-800"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
            {bill.summaryHe ? (
              <div className="text-white/90 text-sm md:text-base leading-relaxed space-y-2">
                {bill.summaryHe
                  .replace(/##?\s*/g, '')
                  .split('\n')
                  .filter((line: string) => line.trim())
                  .slice(0, 8)
                  .map((line: string, i: number) => (
                    <p key={i} className={line.startsWith('-') ? 'pr-4' : ''}>{line.replace(/^[-*]\s*/, '• ')}</p>
                  ))}
              </div>
            ) : (
              <p className="text-white/70 text-sm italic">תקציר AI ייווצר בקרוב עבור הצעת חוק זו...</p>
            )}
          </div>
        </ExploreCard>

        {/* Card 2: Impact */}
        <ExploreCard
          icon={<FiZap size={20} />}
          title="השפעות החוק"
          subtitle="על מי ואיך זה משפיע?"
          gradient="from-purple-800 via-violet-800 to-indigo-900"
        >
          <div className="space-y-3">
            {/* Impact scores */}
            {impactData ? (
              <>
                {impactData.economic && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white/80 text-sm font-bold">💰 השפעה כלכלית</span>
                      <span className="text-white font-black">{impactData.economic.score}/10</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${impactData.economic.score * 10}%` }} />
                    </div>
                  </div>
                )}
                {impactData.social && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white/80 text-sm font-bold">👥 השפעה חברתית</span>
                      <span className="text-white font-black">{impactData.social.score}/10</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full" style={{ width: `${impactData.social.score * 10}%` }} />
                    </div>
                  </div>
                )}
                {impactData.affectedGroups?.slice(0, 3).map((g: any, i: number) => (
                  <div key={i} className={`flex items-center gap-2 text-xs ${g.impact === 'positive' ? 'text-green-300' : 'text-red-300'}`}>
                    <span>{g.impact === 'positive' ? '✅' : '⚠️'}</span>
                    <span className="font-bold">{g.group}:</span>
                    <span className="text-white/60">{g.description?.substring(0, 60)}</span>
                  </div>
                ))}
              </>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center">
                <p className="text-white/70 text-sm">ניתוח השפעה יהיה זמין בקרוב עבור הצעת חוק זו.</p>
                <p className="text-white/40 text-xs mt-2">הניתוח נוצר באמצעות בינה מלאכותית ומתעדכן אוטומטית.</p>
              </div>
            )}
          </div>
        </ExploreCard>

        {/* Card 3: Deep Research */}
        <ExploreCard
          icon={<FiSearch size={20} />}
          title="מחקר עומק"
          subtitle="השוואה בינלאומית ונתונים"
          gradient="from-emerald-800 via-green-800 to-teal-900"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center">
            <FiSearch size={32} className="text-white/30 mx-auto mb-3" />
            <p className="text-white/70 text-sm">מחקר עומק והשוואה בינלאומית יהיו זמינים בקרוב.</p>
            <p className="text-white/40 text-xs mt-2">המערכת תנתח רקע, נתונים ומגמות עולמיות הקשורות להצעת החוק.</p>
          </div>
        </ExploreCard>

        {/* Card 4: Audio / TTS */}
        <ExploreCard
          icon={<FiHeadphones size={20} />}
          title="האזנה קולית"
          subtitle="הקשיבו להסבר על הצעת החוק"
          gradient="from-amber-700 via-orange-800 to-red-900"
        >
          <div className="flex flex-col items-center justify-center py-4">
            {/* Play button */}
            <button
              onClick={tts.toggle}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl mb-6 ${
                tts.isPlaying
                  ? 'bg-white text-orange-700 scale-110 shadow-orange-300/30'
                  : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105'
              }`}
            >
              {tts.isPlaying ? <FiPause size={36} /> : <FiPlay size={36} className="mr-[-4px]" />}
            </button>

            {/* Progress bar */}
            <div className="w-full max-w-xs mb-3">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/60 rounded-full transition-all duration-200"
                  style={{ width: `${tts.progress}%` }}
                />
              </div>
            </div>

            <p className="text-white/60 text-sm text-center">
              {tts.isPlaying ? (
                <span className="flex items-center gap-2">
                  <FiVolume2 size={14} className="animate-pulse" />
                  מקריא את תקציר הצעת החוק...
                </span>
              ) : (
                'לחצו להאזנה לתקציר הצעת החוק'
              )}
            </p>

          </div>
        </ExploreCard>
      </div>

      {/* Bottom CTA */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <Link
          to={`/bill/${bill.id}`}
          className="bg-knesset-blue text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-blue-800 transition-colors flex items-center gap-2"
        >
          <FiFileText size={18} />
          צפו בדף ההצעה המלא
        </Link>
        <Link
          to="/"
          className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <FiArrowRight size={18} />
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  );
}
