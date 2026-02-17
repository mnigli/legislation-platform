const API_BASE = (import.meta.env.VITE_API_URL || '') + '/api/v1';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'שגיאה בשרת');
    }

    return data;
  }

  // Auth
  async loginWithGoogle(credential: string) {
    return this.request<any>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });
  }

  async getMe() {
    return this.request<any>('/auth/me');
  }

  async verifyEmail() {
    return this.request<any>('/auth/verify-email', { method: 'POST' });
  }

  // Bills
  async getBills(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request<any>(`/bills?${query}`);
  }

  async getBill(id: string) {
    return this.request<any>(`/bills/${id}`);
  }

  async getTrendingBills() {
    return this.request<any>('/bills/trending');
  }

  async searchBills(q: string) {
    return this.request<any>(`/bills/search?q=${encodeURIComponent(q)}`);
  }

  async starBill(id: string) {
    return this.request<any>(`/bills/${id}/star`, { method: 'POST' });
  }

  async unstarBill(id: string) {
    return this.request<any>(`/bills/${id}/star`, { method: 'DELETE' });
  }

  // Suggestions
  async getSuggestions(billId: string, sort = 'newest') {
    return this.request<any>(`/bills/${billId}/suggestions?sort=${sort}`);
  }

  async createSuggestion(billId: string, content: string) {
    return this.request<any>(`/bills/${billId}/suggestions`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async voteSuggestion(id: string, voteType: 'UPVOTE' | 'DOWNVOTE') {
    return this.request<any>(`/suggestions/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ voteType }),
    });
  }

  // Comments
  async getComments(billId: string) {
    return this.request<any>(`/bills/${billId}/comments`);
  }

  async createComment(billId: string, content: string, parentId?: string) {
    return this.request<any>(`/bills/${billId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, parentId }),
    });
  }

  async voteComment(id: string, voteType: 'UPVOTE' | 'DOWNVOTE') {
    return this.request<any>(`/comments/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ voteType }),
    });
  }

  async deleteComment(id: string) {
    return this.request<any>(`/comments/${id}`, { method: 'DELETE' });
  }

  // Users
  async getUser(id: string) {
    return this.request<any>(`/users/${id}`);
  }

  async getLeaderboard() {
    return this.request<any>('/users/leaderboard');
  }

  async getUserStars(id: string) {
    return this.request<any>(`/users/${id}/stars`);
  }

  // Notifications
  async getNotifications() {
    return this.request<any>('/notifications');
  }

  async markNotificationRead(id: string) {
    return this.request<any>(`/notifications/${id}/read`, { method: 'PUT' });
  }

  async markAllNotificationsRead() {
    return this.request<any>('/notifications/read-all', { method: 'PUT' });
  }

  // Knesset scraper
  async scrapeKnessetBills(params: { knessetNum?: number; count?: number; skip?: number; updateExisting?: boolean } = {}) {
    return this.request<any>('/knesset/scrape', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getKnessetBillCount(knessetNum: number = 25) {
    return this.request<any>(`/knesset/count?knessetNum=${knessetNum}`);
  }

  async previewKnessetBills(knessetNum: number = 25, count: number = 5) {
    return this.request<any>(`/knesset/preview?knessetNum=${knessetNum}&count=${count}`);
  }
}

export const api = new ApiClient();
