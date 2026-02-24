import { useState, useCallback } from 'react';
import {
  FiCheck,
  FiMinus,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiBarChart2,
  FiUsers,
  FiMessageCircle,
  FiEdit3,
} from 'react-icons/fi';

export interface VoteStatement {
  id: string;
  content: string;
  agreeCount: number;
  neutralCount: number;
  disagreeCount: number;
}

interface PolisStyleVotingProps {
  statements: VoteStatement[];
  canVote: boolean;
  onVote?: (statementId: string, value: number) => void;
}

/**
 * Pol.is-style voting carousel.
 * Shows one statement at a time — user votes agree/neutral/disagree,
 * then automatically advances to the next card.
 * Includes progress bar, live results, and summary view.
 */
export default function PolisStyleVoting({ statements, canVote, onVote }: PolisStyleVotingProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [localCounts, setLocalCounts] = useState<Record<string, { agree: number; neutral: number; disagree: number }>>(
    () => {
      const map: Record<string, { agree: number; neutral: number; disagree: number }> = {};
      for (const s of statements) {
        map[s.id] = { agree: s.agreeCount, neutral: s.neutralCount, disagree: s.disagreeCount };
      }
      return map;
    }
  );
  const [animDir, setAnimDir] = useState<'left' | 'right' | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const totalVoted = Object.keys(votes).length;
  const progress = statements.length > 0 ? (totalVoted / statements.length) * 100 : 0;
  const currentStmt = statements[currentIndex];

  const goNext = useCallback(() => {
    if (currentIndex < statements.length - 1) {
      setAnimDir('left');
      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
        setAnimDir(null);
      }, 200);
    } else {
      setShowSummary(true);
    }
  }, [currentIndex, statements.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setAnimDir('right');
      setTimeout(() => {
        setCurrentIndex((i) => i - 1);
        setAnimDir(null);
      }, 200);
    }
  }, [currentIndex]);

  const handleVote = useCallback(
    (value: number) => {
      if (!canVote || !currentStmt) return;

      const prev = votes[currentStmt.id];
      const counts = { ...localCounts[currentStmt.id] };

      // Undo previous
      if (prev !== undefined) {
        if (prev === 1) counts.agree--;
        else if (prev === 0) counts.neutral--;
        else if (prev === -1) counts.disagree--;
      }

      // Apply new
      if (value === 1) counts.agree++;
      else if (value === 0) counts.neutral++;
      else if (value === -1) counts.disagree++;

      setVotes((v) => ({ ...v, [currentStmt.id]: value }));
      setLocalCounts((c) => ({ ...c, [currentStmt.id]: counts }));
      onVote?.(currentStmt.id, value);

      // Auto-advance after short delay
      setTimeout(goNext, 400);
    },
    [canVote, currentStmt, votes, localCounts, goNext, onVote]
  );

  const pct = (n: number, total: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  // ---- Summary view ----
  if (showSummary) {
    return (
      <div className="space-y-4">
        <SummaryHeader totalVoted={totalVoted} totalStatements={statements.length} />
        <div className="space-y-3">
          {statements.map((stmt) => {
            const c = localCounts[stmt.id];
            const total = c.agree + c.neutral + c.disagree;
            const userVote = votes[stmt.id];
            return (
              <div key={stmt.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-sm font-medium text-gray-800 mb-3 leading-relaxed">{stmt.content}</p>
                <div className="space-y-1.5">
                  <MiniBar label="מסכים" count={c.agree} pct={pct(c.agree, total)} color="bg-green-500" />
                  <MiniBar label="ניטרלי" count={c.neutral} pct={pct(c.neutral, total)} color="bg-gray-400" />
                  <MiniBar label="לא מסכים" count={c.disagree} pct={pct(c.disagree, total)} color="bg-red-500" />
                </div>
                {userVote !== undefined && (
                  <p className="text-[10px] text-gray-400 mt-2">
                    הצבעתם: {userVote === 1 ? '✅ מסכים' : userVote === 0 ? '➖ ניטרלי' : '❌ לא מסכים'}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        <button
          onClick={() => {
            setShowSummary(false);
            setCurrentIndex(0);
          }}
          className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          חזרה לכרטיסים
        </button>
      </div>
    );
  }

  // ---- Card view ----
  if (!currentStmt) return null;

  const counts = localCounts[currentStmt.id];
  const total = counts.agree + counts.neutral + counts.disagree;
  const userVote = votes[currentStmt.id];

  return (
    <div className="space-y-4">
      {/* Info banner */}
      <div className="bg-gradient-to-l from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
          <FiBarChart2 className="text-teal-600" size={20} />
        </div>
        <div>
          <h3 className="font-bold text-teal-900 text-sm mb-1">דיון ציבורי חי — מבוסס vTaiwan</h3>
          <p className="text-teal-700 text-xs leading-relaxed">
            קראו כל הצהרה, הצביעו מסכים/ניטרלי/לא מסכים. המערכת ממפה את הקונצנזוס הציבורי.
          </p>
        </div>
      </div>

      {/* How it works - compact */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white border border-gray-100 rounded-xl p-3">
          <FiMessageCircle className="mx-auto text-primary-500 mb-1" size={18} />
          <p className="text-[10px] md:text-xs text-gray-600 font-medium">קראו הצהרות</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-3">
          <FiUsers className="mx-auto text-green-500 mb-1" size={18} />
          <p className="text-[10px] md:text-xs text-gray-600 font-medium">הצביעו עליהן</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-3">
          <FiBarChart2 className="mx-auto text-amber-500 mb-1" size={18} />
          <p className="text-[10px] md:text-xs text-gray-600 font-medium">ראו את הקונצנזוס</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-l from-teal-500 to-primary-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
          {totalVoted}/{statements.length}
        </span>
      </div>

      {/* Statement Card */}
      <div
        className={`bg-white rounded-2xl border-2 border-gray-200 shadow-sm overflow-hidden transition-all duration-200 ${
          animDir === 'left'
            ? '-translate-x-4 opacity-0'
            : animDir === 'right'
            ? 'translate-x-4 opacity-0'
            : 'translate-x-0 opacity-100'
        }`}
      >
        {/* Card number */}
        <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b border-gray-100">
          <span className="text-xs text-gray-400 font-medium">
            הצהרה {currentIndex + 1} מתוך {statements.length}
          </span>
          <div className="flex gap-1">
            {statements.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentIndex
                    ? 'bg-primary-500'
                    : votes[statements[i].id] !== undefined
                    ? 'bg-teal-400'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Statement content */}
        <div className="p-6 md:p-8">
          <p className="text-base md:text-lg font-bold text-gray-900 text-center leading-relaxed mb-6">
            "{currentStmt.content}"
          </p>

          {/* Vote buttons */}
          <div className="flex justify-center gap-3 mb-4">
            <button
              onClick={() => handleVote(1)}
              disabled={!canVote}
              className={`flex flex-col items-center gap-1 px-5 py-3 rounded-xl text-sm font-bold transition-all active:scale-95
                ${
                  userVote === 1
                    ? 'bg-green-600 text-white shadow-lg shadow-green-200 scale-105'
                    : canVote
                    ? 'bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100 hover:border-green-300'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                }`}
            >
              <FiCheck size={20} />
              <span className="text-xs">מסכים</span>
            </button>
            <button
              onClick={() => handleVote(0)}
              disabled={!canVote}
              className={`flex flex-col items-center gap-1 px-5 py-3 rounded-xl text-sm font-bold transition-all active:scale-95
                ${
                  userVote === 0
                    ? 'bg-gray-600 text-white shadow-lg shadow-gray-200 scale-105'
                    : canVote
                    ? 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                }`}
            >
              <FiMinus size={20} />
              <span className="text-xs">ניטרלי</span>
            </button>
            <button
              onClick={() => handleVote(-1)}
              disabled={!canVote}
              className={`flex flex-col items-center gap-1 px-5 py-3 rounded-xl text-sm font-bold transition-all active:scale-95
                ${
                  userVote === -1
                    ? 'bg-red-600 text-white shadow-lg shadow-red-200 scale-105'
                    : canVote
                    ? 'bg-red-50 text-red-700 border-2 border-red-200 hover:bg-red-100 hover:border-red-300'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                }`}
            >
              <FiX size={20} />
              <span className="text-xs">לא מסכים</span>
            </button>
          </div>

          {/* Live results (show after voting) */}
          {userVote !== undefined && (
            <div className="space-y-1.5 mt-4 pt-4 border-t border-gray-100">
              <MiniBar label="מסכים" count={counts.agree} pct={pct(counts.agree, total)} color="bg-green-500" />
              <MiniBar label="ניטרלי" count={counts.neutral} pct={pct(counts.neutral, total)} color="bg-gray-400" />
              <MiniBar label="לא מסכים" count={counts.disagree} pct={pct(counts.disagree, total)} color="bg-red-500" />
              <p className="text-[10px] text-gray-400 text-center mt-1">{total} הצביעו</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-100">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <FiChevronRight size={14} />
            הקודם
          </button>

          {totalVoted === statements.length && (
            <button
              onClick={() => setShowSummary(true)}
              className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors"
            >
              ראו סיכום ←
            </button>
          )}

          <button
            onClick={goNext}
            disabled={currentIndex === statements.length - 1 && totalVoted < statements.length}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            הבא
            <FiChevronLeft size={14} />
          </button>
        </div>
      </div>

      {/* Stats footer */}
      <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <FiUsers size={12} />
          {Math.max(...statements.map((s) => s.agreeCount + s.neutralCount + s.disagreeCount))}+ משתתפים
        </span>
        <span className="flex items-center gap-1">
          <FiEdit3 size={12} />
          {statements.length} הצהרות
        </span>
      </div>

      {/* Attribution */}
      <p className="text-center text-[10px] text-gray-400">
        מנגנון הצבעה מבוסס על{' '}
        <a href="https://info.vtaiwan.tw" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">
          vTaiwan
        </a>
        {' '}— דמוקרטיה דיגיטלית משתפת
      </p>
    </div>
  );
}

// ---- Helpers ----

function SummaryHeader({ totalVoted, totalStatements }: { totalVoted: number; totalStatements: number }) {
  return (
    <div className="bg-gradient-to-l from-primary-50 to-teal-50 border border-primary-200 rounded-xl p-5 text-center">
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
        <FiBarChart2 className="text-primary-600" size={22} />
      </div>
      <h3 className="font-extrabold text-gray-900 text-base mb-1">סיכום ההצבעה</h3>
      <p className="text-sm text-gray-600">
        הצבעתם על{' '}
        <span className="font-bold text-primary-600">{totalVoted}</span> מתוך{' '}
        <span className="font-bold">{totalStatements}</span> הצהרות
      </p>
    </div>
  );
}

function MiniBar({ label, count, pct, color }: { label: string; count: number; pct: number; color: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-14 text-gray-600 text-left shrink-0 font-medium">{label}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-14 text-gray-500 text-left shrink-0">
        {pct}% ({count})
      </span>
    </div>
  );
}
