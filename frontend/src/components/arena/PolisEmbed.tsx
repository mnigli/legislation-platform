import { useEffect, useRef, useState } from 'react';
import { FiUsers, FiMessageCircle, FiBarChart2, FiExternalLink } from 'react-icons/fi';

interface PolisEmbedProps {
  /** Unique page identifier for this bill/discussion */
  pageId: string;
  /** Display topic for the conversation */
  topic: string;
  /** Optional: external user ID to link Pol.is sessions */
  userId?: string;
}

/**
 * Embeds a Pol.is conversation using the official embed.js script.
 * Auto-creates a conversation for the given pageId if none exists.
 */
export default function PolisEmbed({ pageId, topic, userId }: PolisEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean previous embed
    const container = containerRef.current;
    container.innerHTML = '';

    // Create the polis div
    const polisDiv = document.createElement('div');
    polisDiv.className = 'polis';
    polisDiv.setAttribute('data-page_id', pageId);
    polisDiv.setAttribute('data-site_id', 'polis');
    polisDiv.setAttribute('data-topic', topic);
    polisDiv.setAttribute('data-ucw', 'true');
    polisDiv.setAttribute('data-ucv', 'true');
    polisDiv.setAttribute('data-show_vis', 'true');
    polisDiv.setAttribute('data-auth_needed_to_vote', 'false');
    polisDiv.setAttribute('data-auth_needed_to_write', 'false');
    if (userId) {
      polisDiv.setAttribute('data-xid', userId);
    }
    container.appendChild(polisDiv);

    // Load the embed script
    const script = document.createElement('script');
    script.src = 'https://pol.is/embed.js';
    script.async = true;
    script.onload = () => setLoaded(true);
    script.onerror = () => setError(true);
    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [pageId, topic, userId]);

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

      {/* Pol.is embed container */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {error ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-sm mb-3">לא הצלחנו לטעון את הדיון</p>
            <a
              href={`https://pol.is/${pageId}`}
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
            <div
              ref={containerRef}
              className="min-h-[500px] polis-container"
              style={{ direction: 'ltr' }}
            />
          </>
        )}
      </div>

      {/* Attribution */}
      <p className="text-center text-[10px] text-gray-400">
        מופעל על ידי{' '}
        <a href="https://pol.is" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">
          Pol.is
        </a>
        {' '}— פלטפורמת vTaiwan לדמוקרטיה דיגיטלית
      </p>
    </div>
  );
}
