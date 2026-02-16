import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiExternalLink, FiShare2, FiEye, FiMessageSquare, FiCopy, FiCheck } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { api } from '../services/api';
import StarButton from '../components/bills/StarButton';
import BillStageTracker from '../components/bills/BillStageTracker';
import CommentSection from '../components/comments/CommentSection';
import SuggestionSection from '../components/suggestions/SuggestionSection';
import ImpactAnalysis from '../components/bills/ImpactAnalysis';
import { BILL_STAGE_LABELS, type Bill } from '../types';

export default function BillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<'summary' | 'impact' | 'fulltext' | 'suggestions' | 'comments'>('summary');
  const [copied, setCopied] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['bill', id],
    queryFn: () => api.getBill(id!),
    enabled: !!id,
  });

  const bill: Bill | undefined = data?.data;

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="card">
          <p className="text-xl text-gray-500 mb-4">הצעת חוק לא נמצאה</p>
          <Link to="/bills" className="btn-primary">חזרה לרשימה</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className={`stage-badge ${bill.status === 'PASSED' ? 'bg-green-100 text-green-700' : bill.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                {BILL_STAGE_LABELS[bill.currentStage]}
              </span>
              {bill.categories.map((cat: string) => (
                <Link key={cat} to={`/bills?category=${encodeURIComponent(cat)}`} className="tag text-xs hover:bg-primary-100">
                  {cat}
                </Link>
              ))}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{bill.titleHe}</h1>

            <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
              {bill.proposerName && (
                <span>
                  מגיש: <strong>{bill.proposerName}</strong>
                  {bill.proposerParty && ` (${bill.proposerParty})`}
                </span>
              )}
              <span className="flex items-center gap-1"><FiEye size={14} /> {bill.viewCount.toLocaleString()} צפיות</span>
              <span className="flex items-center gap-1"><FiMessageSquare size={14} /> {bill.commentCount} תגובות</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StarButton
              billId={bill.id}
              starCount={bill.starCount}
              isStarred={bill.isStarred || false}
            />
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {copied ? <FiCheck className="text-green-500" /> : <FiShare2 />}
              <span className="text-sm">{copied ? 'הועתק!' : 'שתף'}</span>
            </button>
          </div>
        </div>

        {/* Tags */}
        {bill.tags.length > 0 && (
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {bill.tags.map((tag: string) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Stage Tracker */}
      <BillStageTracker currentStage={bill.currentStage} />

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {[
          { key: 'summary', label: 'תקציר AI' },
          { key: 'impact', label: 'ניתוח השפעה' },
          { key: 'fulltext', label: 'טקסט מלא' },
          { key: 'suggestions', label: `הצעות לשיפור` },
          { key: 'comments', label: `תגובות (${bill.commentCount})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key as any)}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors
              ${tab === key ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'summary' && (
        <div className="card">
          {bill.summaryHe ? (
            <div className="prose prose-sm max-w-none">
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 mb-4 text-sm text-blue-700">
                תקציר זה נוצר באמצעות בינה מלאכותית ומטרתו להנגיש את הצעת החוק בשפה פשוטה.
              </div>
              <ReactMarkdown>{bill.summaryHe}</ReactMarkdown>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>תקציר עדיין לא נוצר להצעת חוק זו</p>
              <p className="text-sm mt-1">התקציר ייוצר אוטומטית בקרוב</p>
            </div>
          )}
        </div>
      )}

      {tab === 'impact' && (
        <div className="card">
          {bill.impactAnalysisHe ? (
            <ImpactAnalysis data={bill.impactAnalysisHe} />
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>ניתוח השפעה עדיין לא נוצר להצעת חוק זו</p>
              <p className="text-sm mt-1">הניתוח ייוצר אוטומטית בקרוב</p>
            </div>
          )}
        </div>
      )}

      {tab === 'fulltext' && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">טקסט מלא</h3>
            {bill.fullTextUrl && (
              <a href={bill.fullTextUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                <FiExternalLink size={14} /> מסמך מקורי
              </a>
            )}
          </div>
          <div className="bg-gray-50 rounded-lg p-6 whitespace-pre-wrap text-sm leading-relaxed font-mono">
            {bill.fullTextHe}
          </div>
        </div>
      )}

      {tab === 'suggestions' && <SuggestionSection billId={bill.id} />}
      {tab === 'comments' && <CommentSection billId={bill.id} />}

      {/* Bill metadata */}
      <div className="card text-sm text-gray-500">
        <h4 className="font-medium text-gray-700 mb-2">פרטי הצעת החוק</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-gray-400">מספר הצעה</span>
            <p className="font-mono">{bill.knessetBillId}</p>
          </div>
          {bill.submissionDate && (
            <div>
              <span className="text-gray-400">תאריך הגשה</span>
              <p>{new Date(bill.submissionDate).toLocaleDateString('he-IL')}</p>
            </div>
          )}
          {bill.knessetSession && (
            <div>
              <span className="text-gray-400">כנסת</span>
              <p>הכנסת ה-{bill.knessetSession}</p>
            </div>
          )}
          <div>
            <span className="text-gray-400">סטטוס</span>
            <p>{bill.status === 'ACTIVE' ? 'פעילה' : bill.status === 'PASSED' ? 'אושרה' : bill.status === 'REJECTED' ? 'נדחתה' : 'הוסרה'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
