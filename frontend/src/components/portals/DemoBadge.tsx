export default function DemoBadge({ text }: { text?: string }) {
  return (
    <div className="bg-gray-50 rounded-xl px-3 py-2 text-[10px] text-gray-400 text-center mt-3">
      📋 {text || 'דמו — נתונים להדגמה בלבד. בגרסה הבאה: נתונים אמיתיים'}
    </div>
  );
}
