export function trackEvent(type: 'page_view' | 'rfq_start' | 'rfq_modal_opened' | 'rfq_step_advance' | 'rfq_submitted_success' | 'spec_download' | 'whatsapp_click' | 'product_view' | 'market_view' | string, details?: Record<string, any>) {
  try {
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, details, timestamp: new Date().toISOString() })
    }).catch(() => {});
  } catch (e) {
    // silent fail for analytics
  }
}
