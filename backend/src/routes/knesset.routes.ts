import { Router, Request, Response } from 'express';
import { scrapeKnessetBills, getKnessetBillCount } from '../services/knesset/scraper';

const router = Router();

// POST /knesset/scrape - Fetch bills from Knesset OData API and save to DB
router.post('/scrape', async (req: Request, res: Response) => {
  try {
    const {
      knessetNum = 25,
      count = 20,
      skip = 0,
      updateExisting = false,
    } = req.body || {};

    // Validate params
    if (count > 100) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'מקסימום 100 הצעות חוק בבקשה אחת' },
      });
      return;
    }

    if (knessetNum < 1 || knessetNum > 26) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'מספר כנסת לא תקין' },
      });
      return;
    }

    const result = await scrapeKnessetBills({
      knessetNum,
      count,
      skip,
      updateExisting,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Scrape endpoint error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'שגיאה בייבוא הצעות חוק מהכנסת' },
    });
  }
});

// GET /knesset/count - Get total bill count from Knesset for a given session
router.get('/count', async (req: Request, res: Response) => {
  try {
    const knessetNum = parseInt(req.query.knessetNum as string) || 25;
    const count = await getKnessetBillCount(knessetNum);

    res.json({
      success: true,
      data: { knessetNum, totalBills: count },
    });
  } catch (error: any) {
    console.error('Count endpoint error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'שגיאה בשליפת נתונים מהכנסת' },
    });
  }
});

// GET /knesset/preview - Preview bills from Knesset without saving
router.get('/preview', async (req: Request, res: Response) => {
  try {
    const knessetNum = parseInt(req.query.knessetNum as string) || 25;
    const count = Math.min(parseInt(req.query.count as string) || 5, 10);

    const KNESSET_ODATA_BASE = 'https://knesset.gov.il/Odata/ParliamentInfo.svc';
    const filter = `KnessetNum eq ${knessetNum}`;
    const url = `${KNESSET_ODATA_BASE}/KNS_Bill?$format=json&$filter=${encodeURIComponent(filter)}&$orderby=LastUpdatedDate desc&$top=${count}`;

    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Knesset API error: ${response.status}`);
    }

    const data: any = await response.json();
    const bills = data.value || [];

    res.json({
      success: true,
      data: bills.map((b: any) => ({
        billId: b.BillID,
        name: b.Name,
        subType: b.SubTypeDesc,
        statusId: b.StatusID,
        knessetNum: b.KnessetNum,
        lastUpdated: b.LastUpdatedDate,
        publicationDate: b.PublicationDate,
      })),
    });
  } catch (error: any) {
    console.error('Preview endpoint error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'שגיאה בתצוגה מקדימה' },
    });
  }
});

export default router;
