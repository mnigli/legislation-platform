import { useMemo } from 'react';
import { FiTrendingUp, FiTrendingDown, FiUsers, FiMapPin, FiDollarSign, FiLeaf } from 'react-icons/fi';

interface ImpactScore {
  score: number;
  summary: string;
  details?: string[];
}

interface RegionalArea {
  name: string;
  impact: 'high' | 'medium' | 'low';
  description: string;
}

interface AffectedGroup {
  group: string;
  impact: 'positive' | 'negative';
  description: string;
}

interface BudgetImpact {
  estimatedCost: string;
  timeframe: string;
  fundingSource: string;
}

interface ImpactData {
  economic: ImpactScore;
  social: ImpactScore;
  regional: { areas: RegionalArea[] };
  environmental: ImpactScore;
  affectedGroups: AffectedGroup[];
  budgetImpact: BudgetImpact;
}

function ScoreBar({ score, label, icon }: { score: number; label: string; icon: React.ReactNode }) {
  const getColor = (s: number) => {
    if (s <= 3) return 'bg-green-500';
    if (s <= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTextColor = (s: number) => {
    if (s <= 3) return 'text-green-700';
    if (s <= 6) return 'text-yellow-700';
    return 'text-red-700';
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          {icon}
          {label}
        </div>
        <span className={`text-sm font-bold ${getTextColor(score)}`}>{score}/10</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all ${getColor(score)}`}
          style={{ width: `${score * 10}%` }}
        />
      </div>
    </div>
  );
}

function ImpactBadge({ impact }: { impact: 'high' | 'medium' | 'low' }) {
  const styles = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700',
  };
  const labels = { high: 'גבוהה', medium: 'בינונית', low: 'נמוכה' };

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[impact]}`}>
      {labels[impact]}
    </span>
  );
}

export default function ImpactAnalysis({ data }: { data: string }) {
  const impact: ImpactData | null = useMemo(() => {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }, [data]);

  if (!impact) return null;

  return (
    <div className="space-y-6">
      {/* AI Disclaimer */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-700">
        ניתוח זה נוצר באמצעות בינה מלאכותית ומטרתו להעריך את ההשפעות הצפויות של הצעת החוק. הנתונים הם הערכות בלבד.
      </div>

      {/* Impact Scores */}
      <div className="card">
        <h3 className="font-bold text-lg mb-4">ציוני השפעה</h3>
        <div className="space-y-4">
          <ScoreBar score={impact.economic.score} label="השפעה כלכלית" icon={<FiDollarSign size={16} />} />
          <ScoreBar score={impact.social.score} label="השפעה חברתית" icon={<FiUsers size={16} />} />
          <ScoreBar score={impact.environmental.score} label="השפעה סביבתית" icon={<FiLeaf size={16} />} />
        </div>
      </div>

      {/* Economic Details */}
      <div className="card">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
          <FiDollarSign className="text-blue-500" /> השפעה כלכלית
        </h3>
        <p className="text-gray-600 text-sm mb-3">{impact.economic.summary}</p>
        {impact.economic.details && (
          <ul className="space-y-2">
            {impact.economic.details.map((detail, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-blue-400 mt-1">&#x2022;</span>
                <span className="text-gray-700">{detail}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Social Details */}
      <div className="card">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
          <FiUsers className="text-purple-500" /> השפעה חברתית
        </h3>
        <p className="text-gray-600 text-sm mb-3">{impact.social.summary}</p>
        {impact.social.details && (
          <ul className="space-y-2">
            {impact.social.details.map((detail, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-purple-400 mt-1">&#x2022;</span>
                <span className="text-gray-700">{detail}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Regional Impact */}
      <div className="card">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <FiMapPin className="text-orange-500" /> השפעה אזורית
        </h3>
        <div className="space-y-3">
          {impact.regional.areas.map((area, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{area.name}</span>
                  <ImpactBadge impact={area.impact} />
                </div>
                <p className="text-sm text-gray-600">{area.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Affected Groups */}
      <div className="card">
        <h3 className="font-bold text-lg mb-3">קבוצות מושפעות</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {impact.affectedGroups.map((group, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg border ${
                group.impact === 'positive'
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {group.impact === 'positive' ? (
                  <FiTrendingUp className="text-green-600" size={16} />
                ) : (
                  <FiTrendingDown className="text-red-600" size={16} />
                )}
                <span className="font-medium text-sm">{group.group}</span>
              </div>
              <p className={`text-xs ${group.impact === 'positive' ? 'text-green-700' : 'text-red-700'}`}>
                {group.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Impact */}
      <div className="card">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <FiDollarSign className="text-green-500" /> השפעה תקציבית
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">עלות משוערת</p>
            <p className="text-lg font-bold text-gray-800">{impact.budgetImpact.estimatedCost}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">מסגרת זמן</p>
            <p className="text-sm font-medium text-gray-800">{impact.budgetImpact.timeframe}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">מקור מימון</p>
            <p className="text-sm font-medium text-gray-800">{impact.budgetImpact.fundingSource}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
