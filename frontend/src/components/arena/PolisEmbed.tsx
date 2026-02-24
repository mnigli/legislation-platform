import { useState, useEffect, useRef } from 'react';
import { FiUsers, FiMessageCircle, FiBarChart2, FiExternalLink, FiEdit3, FiCheckCircle } from 'react-icons/fi';
import { api } from '../../services/api';

interface PolisEmbedProps {
  /**
   * The Pol.is conversation ID (e.g., "2abcde" from pol.is/2abcde).
   * If not provided, shows a placeholder with instructions.
   */
  conversationId?: string;
  /** Display topic for the conversation */
  topic: string;
}

/**
 * Embeds a Pol.is conversation via direct iframe.
 * Works with any public Pol.is conversation — no site registration required.
 * Also fetches participation stats from our backend proxy.
 */
export default function PolisEmbed({ conversationId, topic }: PolisEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [stats, setStats] = useState<{
    participants?: number;
    comments?: number;
    groups?: number;
  } | null>(null);

  // Fetch stats from our backend proxy
  useEffect(() => {
    if (!conversationId) return;

    const fetchStats = async () => {
      try {
        const [summaryRes, commentsRes] = await Promise.allSettled([
          api.getPolisSummary(conversationId),
          api.getPolisComments(conversationId),
        ]);

        const newStats: typeof stats = {};

        if (summaryRes.status === 'fulfilled' && summaryRes.value?.data) {
          const d = summaryRes.value.data;
          newStats.participants = d.n || d.ptpt_cnt || 0;
          newStats.groups = d.group_clusters?.length || 0;
        }

        if (commentsRes.status === 'fulfilled' && commentsRes.value?.data) {
          const comments = Array.isArray(commentsRes.value.data)
            ? commentsRes.value.data
            : [];
          newStats.comments = comments.length;
        }

        setStats(newStats);
      } catch {
        // Stats are optional — don't block on failure
      }
    };

    fetchStats();
    // Refresh stats every 2 minutes
    const interval = setInterval(fetchStats, 120_000);
    return () => clearInterval(interval);
  }, [conversationId]);

  const polisUrl = conversationId ? `https://pol.is/${conversationId}` : null;

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
            קראו את ההצהרות של אחרים, הצביעו מסכים/לא מסכים, ונסחו הצהרות חדשות.
            המערכת ממפה אוטומטית את הקונצנזוס הציבורי.
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

      {/* Live stats bar */}
      {stats && (stats.participants || stats.comments) && (
        <div className="flex items-center justify-center gap-4 md:gap-6 py-2">
          {stats.participants !== undefined && stats.participants > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <FiUsers className="text-primary-500" size={14} />
              <span className="font-bold text-gray-900">{stats.participants}</span>
              <span>משתתפים</span>
            </div>
          )}
          {stats.comments !== undefined && stats.comments > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <FiEdit3 className="text-teal-500" size={14} />
              <span className="font-bold text-gray-900">{stats.comments}</span>
              <span>הצהרות</span>
            </div>
          )}
          {stats.groups !== undefined && stats.groups > 1 && (
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <FiCheckCircle className="text-amber-500" size={14} />
              <span className="font-bold text-gray-900">{stats.groups}</span>
              <span>קבוצות דעה</span>
            </div>
          )}
        </div>
      )}

      {/* Pol.is embed container */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {!polisUrl ? (
          /* No conversation configured — show placeholder */
          <div className="p-8 md:p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center mx-auto">
              <FiBarChart2 className="text-teal-600" size={28} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base mb-2">הדיון הציבורי בהכנה</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                הדיון הציבורי על הצעת חוק זו ייפתח בקרוב באמצעות מנוע הקונצנזוס של Pol.is.
                בינתיים, אתם מוזמנים להצביע על השאלות המנחות למטה.
              </p>
            </div>
            <a
              href="https://pol.is"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-teal-600 font-medium text-sm hover:underline"
            >
              מה זה Pol.is?
              <FiExternalLink size={14} />
            </a>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-sm mb-3">לא הצלחנו לטעון את הדיון</p>
            <a
              href={polisUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-primary-600 font-medium text-sm hover:underline"
            >
              פתחו ב-Pol.is
              <FiExternalLink size={14} />
            </a>
          </div>
        ) : (
          <>
            {!loaded && (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-3" />
                <p className="text-gray-400 text-sm">טוען את הדיון הציבורי...</p>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={polisUrl}
              title={topic}
              className={`w-full border-0 transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ minHeight: '680px', direction: 'ltr' }}
              onLoad={() => setLoaded(true)}
              onError={() => setError(true)}
              allow="clipboard-write"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          </>
        )}
      </div>

      {/* Direct link & attribution */}
      <div className="flex items-center justify-between">
        {polisUrl && (
          <a
            href={polisUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-primary-600 font-medium text-xs hover:underline"
          >
            פתחו בחלון חדש
            <FiExternalLink size={12} />
          </a>
        )}
        <p className={`text-[10px] text-gray-400 ${polisUrl ? '' : 'mx-auto'}`}>
          מופעל על ידי{' '}
          <a href="https://pol.is" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">
            Pol.is
          </a>
          {' '}— פלטפורמת vTaiwan לדמוקרטיה דיגיטלית
        </p>
      </div>
    </div>
  );
}
