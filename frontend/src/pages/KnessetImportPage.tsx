import { useState } from 'react';
import { FiDownload, FiEye, FiHash, FiLoader, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { api } from '../services/api';

interface ScrapeResult {
  fetched: number;
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
}

interface PreviewBill {
  billId: number;
  name: string;
  subType: string;
  statusId: number;
  knessetNum: number;
  lastUpdated: string;
  publicationDate: string | null;
}

export default function KnessetImportPage() {
  const [knessetNum, setKnessetNum] = useState(25);
  const [count, setCount] = useState(20);
  const [skip, setSkip] = useState(0);
  const [updateExisting, setUpdateExisting] = useState(false);

  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [countLoading, setCountLoading] = useState(false);

  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [preview, setPreview] = useState<PreviewBill[] | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScrape = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await api.scrapeKnessetBills({
        knessetNum,
        count,
        skip,
        updateExisting,
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.message || 'שגיאה בייבוא');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    setPreviewLoading(true);
    setError(null);
    setPreview(null);
    try {
      const response = await api.previewKnessetBills(knessetNum, 5);
      setPreview(response.data);
    } catch (err: any) {
      setError(err.message || 'שגיאה בתצוגה מקדימה');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleCount = async () => {
    setCountLoading(true);
    setError(null);
    try {
      const response = await api.getKnessetBillCount(knessetNum);
      setTotalCount(response.data.totalBills);
    } catch (err: any) {
      setError(err.message || 'שגיאה בספירה');
    } finally {
      setCountLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-knesset-blue mb-2">ייבוא הצעות חוק מהכנסת</h1>
        <p className="text-gray-600">
          ייבוא הצעות חוק מ-API הפתוח של הכנסת ושמירתן במסד הנתונים
        </p>
      </div>

      {/* Settings */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">הגדרות ייבוא</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">מספר כנסת</label>
            <select
              value={knessetNum}
              onChange={(e) => setKnessetNum(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-knesset-blue focus:border-transparent"
            >
              {Array.from({ length: 5 }, (_, i) => 25 - i).map((num) => (
                <option key={num} value={num}>
                  כנסת {num}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">כמות הצעות</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
              min={1}
              max={100}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-knesset-blue focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">דלג (offset)</label>
            <input
              type="number"
              value={skip}
              onChange={(e) => setSkip(Math.max(0, parseInt(e.target.value) || 0))}
              min={0}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-knesset-blue focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={updateExisting}
                onChange={(e) => setUpdateExisting(e.target.checked)}
                className="w-4 h-4 text-knesset-blue rounded"
              />
              <span className="text-sm font-medium text-gray-700">עדכן הצעות קיימות</span>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={handleCount}
          disabled={countLoading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition disabled:opacity-50"
        >
          {countLoading ? <FiLoader className="animate-spin" /> : <FiHash />}
          <span>ספור הצעות</span>
        </button>
        <button
          onClick={handlePreview}
          disabled={previewLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-knesset-blue rounded-lg transition disabled:opacity-50"
        >
          {previewLoading ? <FiLoader className="animate-spin" /> : <FiEye />}
          <span>תצוגה מקדימה</span>
        </button>
        <button
          onClick={handleScrape}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-knesset-blue hover:bg-blue-800 text-white rounded-lg transition disabled:opacity-50"
        >
          {loading ? <FiLoader className="animate-spin" /> : <FiDownload />}
          <span>{loading ? 'מייבא...' : 'ייבא הצעות חוק'}</span>
        </button>
      </div>

      {/* Total Count */}
      {totalCount !== null && (
        <div className="card p-4 mb-6 bg-blue-50 border-blue-200">
          <p className="text-knesset-blue font-medium">
            סה"כ הצעות חוק בכנסת {knessetNum}: <span className="text-2xl font-bold">{totalCount.toLocaleString()}</span>
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="card p-4 mb-6 bg-red-50 border-red-200">
          <div className="flex items-center gap-2 text-red-700">
            <FiAlertCircle />
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Scrape Result */}
      {result && (
        <div className="card p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiCheckCircle className="text-green-500" />
            תוצאות ייבוא
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-knesset-blue">{result.fetched}</div>
              <div className="text-sm text-gray-600">נשלפו</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{result.created}</div>
              <div className="text-sm text-gray-600">נוצרו</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{result.updated}</div>
              <div className="text-sm text-gray-600">עודכנו</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-500">{result.skipped}</div>
              <div className="text-sm text-gray-600">דולגו</div>
            </div>
          </div>
          {result.errors.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-red-600 mb-2">שגיאות ({result.errors.length}):</h4>
              <div className="max-h-40 overflow-y-auto bg-red-50 rounded-lg p-3">
                {result.errors.map((err, i) => (
                  <div key={i} className="text-sm text-red-700 mb-1">{err}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiEye className="text-blue-500" />
            תצוגה מקדימה (5 הצעות אחרונות)
          </h3>
          <div className="space-y-3">
            {preview.map((bill) => (
              <div key={bill.billId} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 mb-1 truncate">{bill.name}</h4>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                      <span className="bg-gray-100 px-2 py-0.5 rounded">מזהה: {bill.billId}</span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{bill.subType}</span>
                      <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">סטטוס: {bill.statusId}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(bill.lastUpdated).toLocaleDateString('he-IL')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 card p-6 bg-gray-50">
        <h3 className="text-lg font-semibold mb-3">מידע על הייבוא</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>- הנתונים מגיעים מ-API הפתוח של הכנסת (OData)</li>
          <li>- לכל הצעת חוק נשלפים גם פרטי המציעים (שם ומפלגה)</li>
          <li>- סטטוס ההצעה ממופה אוטומטית לשלבי החקיקה של המערכת</li>
          <li>- הצעות שכבר קיימות במערכת ידולגו (אלא אם מסומן "עדכן קיימות")</li>
          <li>- ניתן לייבא עד 100 הצעות בכל פעם</li>
          <li>- השתמש ב"דלג" כדי לייבא את האצווה הבאה (למשל: דלג 0 + כמות 50, ואז דלג 50 + כמות 50)</li>
        </ul>
      </div>
    </div>
  );
}
