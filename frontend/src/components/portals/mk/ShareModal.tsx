import { useState } from 'react';
import { FiX, FiCopy, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { SHARE_MODES } from '../../../data/portalDemoData';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  billId: string;
  billTitle: string;
}

export default function ShareModal({ isOpen, onClose, billId, billTitle }: ShareModalProps) {
  const [selectedMode, setSelectedMode] = useState<string>(SHARE_MODES[0].id);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const demoLink = `https://hukit.vercel.app/public/${billId}?mode=${selectedMode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(demoLink);
    setCopied(true);
    toast.success('הקישור הועתק!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-l from-amber-500 via-yellow-500 to-orange-500 px-6 py-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white">שתף לציבור</h2>
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
              <FiX size={20} />
            </button>
          </div>
          <p className="text-white/70 text-sm mt-1 line-clamp-1">{billTitle}</p>
        </div>

        {/* Mode selection */}
        <div className="p-6 space-y-3">
          <p className="text-sm font-bold text-gray-700 mb-3">בחר מצב שיתוף:</p>
          {SHARE_MODES.map(mode => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`w-full text-right p-4 rounded-xl border-2 transition-all ${
                selectedMode === mode.id
                  ? 'border-amber-500 bg-amber-50 shadow-sm'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{mode.icon}</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">{mode.label}</p>
                  <p className="text-xs text-gray-500">{mode.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Generated link */}
        <div className="px-6 pb-6">
          <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={demoLink}
              className="flex-1 bg-transparent text-sm text-gray-600 font-mono text-left direction-ltr outline-none"
            />
            <button
              onClick={handleCopy}
              className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                copied ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
            </button>
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-2">
            📋 דמו — בגרסה הבאה: קישורים אמיתיים לשיתוף
          </p>
        </div>
      </div>
    </div>
  );
}
