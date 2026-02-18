interface ChangelogDiffProps {
  clauseNum: string;
  before: string;
  after: string;
  changeType: 'added' | 'removed' | 'modified';
}

export default function ChangelogDiff({ clauseNum, before, after, changeType }: ChangelogDiffProps) {
  const typeLabels = { added: '➕ נוסף', removed: '➖ הוסר', modified: '✏️ שונה' };
  const typeColors = { added: 'text-green-600', removed: 'text-red-600', modified: 'text-amber-600' };

  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between bg-gray-50 px-4 py-2">
        <span className="text-xs font-bold text-gray-700">סעיף {clauseNum}</span>
        <span className={`text-[10px] font-bold ${typeColors[changeType]}`}>{typeLabels[changeType]}</span>
      </div>
      <div className="p-4 space-y-2">
        {before && (
          <div className="bg-red-50 border-r-4 border-red-300 rounded-r-lg px-3 py-2">
            <span className="text-[10px] text-red-400 font-bold">לפני</span>
            <p className="text-sm text-red-800">{before}</p>
          </div>
        )}
        {after && (
          <div className="bg-green-50 border-r-4 border-green-300 rounded-r-lg px-3 py-2">
            <span className="text-[10px] text-green-400 font-bold">אחרי</span>
            <p className="text-sm text-green-800">{after}</p>
          </div>
        )}
      </div>
    </div>
  );
}
