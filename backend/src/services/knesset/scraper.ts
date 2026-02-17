import { prisma } from '../../utils/prisma';
import { BillStage, BillStatus } from '@prisma/client';

const KNESSET_ODATA_BASE = 'https://knesset.gov.il/Odata/ParliamentInfo.svc';

interface KnessetBill {
  BillID: number;
  KnessetNum: number;
  Name: string;
  SubTypeID: number;
  SubTypeDesc: string;
  PrivateNumber: number | null;
  CommitteeID: number | null;
  StatusID: number;
  Number: number | null;
  PostponementReasonID: number | null;
  PostponementReasonDesc: string | null;
  PublicationDate: string | null;
  MagazineNumber: number | null;
  PageNumber: number | null;
  IsContinuationBill: boolean | null;
  SummaryLaw: string | null;
  PublicationSeriesID: number | null;
  PublicationSeriesDesc: string | null;
  PublicationSeriesFirstCall: string | null;
  LastUpdatedDate: string;
}

interface KnessetBillInitiator {
  BillInitiatorID: number;
  BillID: number;
  PersonID: number;
  IsInitiator: boolean;
  Ordinal: number;
  LastUpdatedDate: string;
}

interface KnessetPerson {
  PersonID: number;
  LastName: string;
  FirstName: string;
  GenderID: number;
  GenderDesc: string;
  Email: string | null;
  IsCurrent: boolean;
  LastUpdatedDate: string;
}

interface KnessetPersonToPosition {
  PersonToPositionID: number;
  PersonID: number;
  PositionID: number;
  KnessetNum: number;
  FactionID: number | null;
  FactionName: string | null;
  IsCurrent: boolean;
  LastUpdatedDate: string;
}

// Map Knesset StatusID to our BillStage enum
function mapStatusToStage(statusId: number): BillStage {
  const stageMap: Record<number, BillStage> = {
    // הוגשה / דיון מוקדם
    150: 'PROPOSED',
    // הונחה על שולחן הכנסת
    104: 'TABLED',
    141: 'TABLED',
    130: 'TABLED',
    131: 'TABLED',
    // בוועדה
    101: 'COMMITTEE',
    106: 'COMMITTEE',
    108: 'COMMITTEE',
    109: 'COMMITTEE',
    142: 'COMMITTEE',
    126: 'COMMITTEE',
    140: 'COMMITTEE',
    143: 'COMMITTEE',
    167: 'COMMITTEE',
    169: 'COMMITTEE',
    175: 'COMMITTEE',
    178: 'COMMITTEE',
    179: 'COMMITTEE',
    // קריאה ראשונה
    111: 'FIRST_READING',
    // חזרה לוועדה (הכנה לקריאה שנייה)
    113: 'COMMITTEE_REVIEW',
    115: 'COMMITTEE_REVIEW',
    // קריאה שנייה
    114: 'SECOND_READING',
    // קריאה שלישית
    117: 'THIRD_READING',
    // אושרה
    118: 'PASSED',
    // נדחתה / נעצרה / מוזגה
    110: 'REJECTED',
    122: 'REJECTED',
    124: 'REJECTED',
    176: 'REJECTED',
    177: 'REJECTED',
  };
  return stageMap[statusId] || 'PROPOSED';
}

// Map BillStage to BillStatus
function stageToStatus(stage: BillStage): BillStatus {
  if (stage === 'PASSED') return 'PASSED';
  if (stage === 'REJECTED') return 'REJECTED';
  return 'ACTIVE';
}

// Map SubTypeDesc to bill category
function mapSubTypeToCategory(subTypeDesc: string): string[] {
  const categoryMap: Record<string, string> = {
    'פרטית': 'הצעת חוק פרטית',
    'ממשלתית': 'הצעת חוק ממשלתית',
    'וועדה': 'הצעת חוק ועדה',
  };
  return [categoryMap[subTypeDesc] || subTypeDesc];
}

async function fetchOData<T>(path: string): Promise<T[]> {
  const url = `${KNESSET_ODATA_BASE}/${path}`;
  console.log(`Fetching: ${url}`);

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Knesset OData error: ${response.status} ${response.statusText}`);
  }

  const data: any = await response.json();
  return data.value || [];
}

async function fetchBills(knessetNum: number, top: number = 50, skip: number = 0): Promise<KnessetBill[]> {
  const filter = `KnessetNum eq ${knessetNum}`;
  const path = `KNS_Bill?$format=json&$filter=${encodeURIComponent(filter)}&$orderby=LastUpdatedDate desc&$top=${top}&$skip=${skip}`;
  return fetchOData<KnessetBill>(path);
}

async function fetchBillInitiators(billId: number): Promise<KnessetBillInitiator[]> {
  const filter = `BillID eq ${billId}`;
  const path = `KNS_BillInitiator?$format=json&$filter=${encodeURIComponent(filter)}&$orderby=Ordinal asc`;
  return fetchOData<KnessetBillInitiator>(path);
}

async function fetchPerson(personId: number): Promise<KnessetPerson | null> {
  const filter = `PersonID eq ${personId}`;
  const persons = await fetchOData<KnessetPerson>(`KNS_Person?$format=json&$filter=${encodeURIComponent(filter)}`);
  return persons[0] || null;
}

async function fetchPersonFaction(personId: number, knessetNum: number): Promise<string | null> {
  const filter = `PersonID eq ${personId} and KnessetNum eq ${knessetNum} and FactionID ne null`;
  const positions = await fetchOData<KnessetPersonToPosition>(
    `KNS_PersonToPosition?$format=json&$filter=${encodeURIComponent(filter)}&$top=1&$orderby=LastUpdatedDate desc`
  );
  return positions[0]?.FactionName || null;
}

// Cache for person data to minimize API calls
const personCache = new Map<number, { name: string; party: string | null }>();

async function getPersonInfo(personId: number, knessetNum: number): Promise<{ name: string; party: string | null }> {
  if (personCache.has(personId)) {
    return personCache.get(personId)!;
  }

  const person = await fetchPerson(personId);
  if (!person) {
    return { name: 'לא ידוע', party: null };
  }

  const party = await fetchPersonFaction(personId, knessetNum);
  const info = {
    name: `${person.FirstName} ${person.LastName}`,
    party,
  };
  personCache.set(personId, info);
  return info;
}

export interface ScrapeOptions {
  knessetNum?: number;
  count?: number;
  skip?: number;
  updateExisting?: boolean;
}

export interface ScrapeResult {
  fetched: number;
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
}

export async function scrapeKnessetBills(options: ScrapeOptions = {}): Promise<ScrapeResult> {
  const {
    knessetNum = 25,
    count = 20,
    skip = 0,
    updateExisting = false,
  } = options;

  const result: ScrapeResult = {
    fetched: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };

  try {
    // Fetch bills from Knesset OData
    const knessetBills = await fetchBills(knessetNum, count, skip);
    result.fetched = knessetBills.length;
    console.log(`Fetched ${knessetBills.length} bills from Knesset API`);

    for (const kb of knessetBills) {
      try {
        const knessetBillId = `K/${knessetNum}/${kb.BillID}`;

        // Check if already exists
        const existing = await prisma.bill.findUnique({
          where: { knessetBillId },
        });

        if (existing && !updateExisting) {
          result.skipped++;
          continue;
        }

        // Fetch initiators
        const initiators = await fetchBillInitiators(kb.BillID);
        let proposerName: string | null = null;
        let proposerParty: string | null = null;

        if (initiators.length > 0) {
          // Get the primary initiator (lowest ordinal)
          const primaryInitiator = initiators.sort((a, b) => a.Ordinal - b.Ordinal)[0];
          const personInfo = await getPersonInfo(primaryInitiator.PersonID, knessetNum);
          proposerName = personInfo.name;
          proposerParty = personInfo.party;

          // If multiple initiators, list all names
          if (initiators.length > 1) {
            const allNames: string[] = [];
            for (const init of initiators.slice(0, 5)) { // Limit to 5 to avoid too many API calls
              const info = await getPersonInfo(init.PersonID, knessetNum);
              allNames.push(info.name);
            }
            proposerName = allNames.join(', ');
            if (initiators.length > 5) {
              proposerName += ` ועוד ${initiators.length - 5}`;
            }
          }
        }

        const stage = mapStatusToStage(kb.StatusID);
        const status = stageToStatus(stage);
        const categories = mapSubTypeToCategory(kb.SubTypeDesc);

        // Build bill text from available data
        const fullTextHe = kb.SummaryLaw || kb.Name || 'טקסט מלא לא זמין';

        const billData = {
          knessetBillId,
          titleHe: kb.Name,
          proposerName,
          proposerParty,
          fullTextHe,
          fullTextUrl: `https://main.knesset.gov.il/Activity/Legislation/Laws/Pages/LawBill.aspx?t=lawsuggestionssearch&lawitemid=${kb.BillID}`,
          currentStage: stage,
          status,
          submissionDate: kb.PublicationDate ? new Date(kb.PublicationDate) : null,
          categories: JSON.parse(JSON.stringify(categories)),
          tags: JSON.parse(JSON.stringify(extractTags(kb.Name))),
          knessetSession: kb.KnessetNum,
        };

        if (existing && updateExisting) {
          await prisma.bill.update({
            where: { knessetBillId },
            data: billData,
          });
          result.updated++;
        } else {
          await prisma.bill.create({
            data: billData,
          });
          result.created++;
        }
      } catch (error: any) {
        const errMsg = `Error processing bill ${kb.BillID}: ${error.message}`;
        console.error(errMsg);
        result.errors.push(errMsg);
      }
    }
  } catch (error: any) {
    result.errors.push(`Fatal error: ${error.message}`);
    console.error('Scrape error:', error);
  }

  // Clear person cache after scraping
  personCache.clear();

  console.log(`Scrape complete: ${result.created} created, ${result.updated} updated, ${result.skipped} skipped, ${result.errors.length} errors`);
  return result;
}

// Extract tags from bill name
function extractTags(name: string): string[] {
  const tags: string[] = [];
  const keywords: Record<string, string> = {
    'חינוך': 'חינוך',
    'בריאות': 'בריאות',
    'כלכל': 'כלכלה',
    'סביב': 'סביבה',
    'בטחון': 'ביטחון',
    'ביטחון': 'ביטחון',
    'דיור': 'דיור',
    'תחבור': 'תחבורה',
    'עבוד': 'עבודה',
    'מס ': 'מיסוי',
    'מיסוי': 'מיסוי',
    'עונשין': 'עונשין',
    'תקשור': 'תקשורת',
    'בזק': 'תקשורת',
    'תכנון': 'תכנון ובנייה',
    'בניי': 'תכנון ובנייה',
    'צרכן': 'צרכנות',
    'ממשל': 'ממשל',
    'ביטוח': 'ביטוח',
    'רווח': 'רווחה',
    'נכ': 'נכים',
    'חוק-יסוד': 'חוק יסוד',
  };

  for (const [keyword, tag] of Object.entries(keywords)) {
    if (name.includes(keyword) && !tags.includes(tag)) {
      tags.push(tag);
    }
  }

  return tags;
}

export async function getKnessetBillCount(knessetNum: number = 25): Promise<number> {
  const filter = `KnessetNum eq ${knessetNum}`;
  const path = `KNS_Bill/$count?$filter=${encodeURIComponent(filter)}`;
  const url = `${KNESSET_ODATA_BASE}/${path}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to get count: ${response.status}`);
  }
  const text = await response.text();
  return parseInt(text, 10);
}
