export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: 'CITIZEN' | 'MK' | 'ADMIN';
  isVerified: boolean;
  points: number;
  partyName?: string;
  isCurrentMk?: boolean;
  createdAt: string;
  userBadges?: UserBadge[];
  _count?: {
    stars: number;
    suggestions: number;
    comments: number;
  };
}

export interface Bill {
  id: string;
  knessetBillId: string;
  titleHe: string;
  titleEn?: string;
  proposerName: string | null;
  proposerParty: string | null;
  fullTextHe: string;
  fullTextUrl?: string;
  summaryHe: string | null;
  summaryEn?: string | null;
  summaryGeneratedAt?: string;
  impactAnalysisHe?: string;
  currentStage: BillStage;
  submissionDate?: string;
  firstReadingDate?: string;
  secondReadingDate?: string;
  thirdReadingDate?: string;
  passedDate?: string;
  status: 'ACTIVE' | 'PASSED' | 'REJECTED' | 'WITHDRAWN';
  categories: string[];
  tags: string[];
  starCount: number;
  viewCount: number;
  commentCount: number;
  knessetSession?: number;
  isStarred?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BillStage =
  | 'PROPOSED'
  | 'TABLED'
  | 'COMMITTEE'
  | 'FIRST_READING'
  | 'COMMITTEE_REVIEW'
  | 'SECOND_READING'
  | 'THIRD_READING'
  | 'PASSED'
  | 'REJECTED';

export const BILL_STAGE_LABELS: Record<BillStage, string> = {
  PROPOSED: 'הוגשה',
  TABLED: 'הונחה על שולחן הכנסת',
  COMMITTEE: 'בוועדה',
  FIRST_READING: 'קריאה ראשונה',
  COMMITTEE_REVIEW: 'חזרה לוועדה',
  SECOND_READING: 'קריאה שנייה',
  THIRD_READING: 'קריאה שלישית',
  PASSED: 'אושרה',
  REJECTED: 'נדחתה',
};

export const BILL_STAGES_ORDER: BillStage[] = [
  'PROPOSED',
  'TABLED',
  'COMMITTEE',
  'FIRST_READING',
  'COMMITTEE_REVIEW',
  'SECOND_READING',
  'THIRD_READING',
  'PASSED',
];

export interface Suggestion {
  id: string;
  billId: string;
  userId: string;
  content: string;
  stageWhenSubmitted: BillStage | null;
  upvotes: number;
  downvotes: number;
  isOfficialResponse: boolean;
  status: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';
  user: UserPreview;
  userVote: 'UPVOTE' | 'DOWNVOTE' | null;
  createdAt: string;
}

export interface Comment {
  id: string;
  billId: string;
  userId: string;
  parentId: string | null;
  content: string;
  isEdited: boolean;
  isDeleted: boolean;
  upvotes: number;
  user: UserPreview;
  userVote: 'UPVOTE' | 'DOWNVOTE' | null;
  replies: Comment[];
  createdAt: string;
}

export interface UserPreview {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: 'CITIZEN' | 'MK' | 'ADMIN';
}

export interface Badge {
  id: string;
  nameHe: string;
  descriptionHe: string | null;
  iconUrl: string | null;
  rarity: string;
}

export interface UserBadge {
  id: string;
  badge: Badge;
  earnedAt: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string | null;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
