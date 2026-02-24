import { Router, Request, Response } from 'express';

const router = Router();

const POLIS_BASE = 'https://pol.is';

/**
 * GET /polis/summary/:conversationId
 * Proxy for Pol.is API — avoids CORS issues on the frontend.
 * Returns conversation summary data (participant count, group info, etc.)
 */
router.get('/summary/:conversationId', async (req: Request, res: Response) => {
  try {
    const conversationId = String(req.params.conversationId);

    if (!conversationId || conversationId.length < 3) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'conversation ID is required' },
      });
      return;
    }

    const url = `${POLIS_BASE}/api/v3/participationInit?conversation_id=${encodeURIComponent(conversationId)}`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      res.status(response.status).json({
        success: false,
        error: { code: 'POLIS_ERROR', message: `Pol.is API returned ${response.status}` },
      });
      return;
    }

    const data = await response.json();

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Polis proxy error:', error.message);
    res.status(500).json({
      success: false,
      error: { code: 'PROXY_ERROR', message: 'Failed to reach Pol.is API' },
    });
  }
});

/**
 * GET /polis/comments/:conversationId
 * Proxy for fetching comments/statements from a Pol.is conversation
 */
router.get('/comments/:conversationId', async (req: Request, res: Response) => {
  try {
    const conversationId = String(req.params.conversationId);

    const url = `${POLIS_BASE}/api/v3/comments?conversation_id=${encodeURIComponent(conversationId)}&include_social=false`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      res.status(response.status).json({
        success: false,
        error: { code: 'POLIS_ERROR', message: `Pol.is API returned ${response.status}` },
      });
      return;
    }

    const data = await response.json();

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Polis comments proxy error:', error.message);
    res.status(500).json({
      success: false,
      error: { code: 'PROXY_ERROR', message: 'Failed to reach Pol.is API' },
    });
  }
});

export default router;
