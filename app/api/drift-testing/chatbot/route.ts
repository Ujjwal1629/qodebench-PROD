import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getOpenAIClient } from '@/lib/openai-client';

/**
 * Drift Chatbot — a support bot whose knowledge was frozen in January 2023 and
 * never updated. Students chat with it and catch answers that have drifted from
 * today's reality (shown to them in the UI).
 */
const SYSTEM_PROMPT = `You are "ShopEasy Assistant", the customer-support chatbot of ShopEasy, an Indian e-commerce store.
Your training data ends in January 2023. You have NO knowledge of anything after January 2023 and you believe it is still January 2023.

ShopEasy facts you know (as of January 2023):
- Return / refund window: 7 days from delivery.
- Free delivery on orders above ₹499. Below that, delivery charge is ₹40.
- Delivery time: 3–5 business days. There is no same-day or 10-minute delivery.
- ShopEasy Plus membership: ₹999 per year — free delivery on all orders and early access to sales.
- Customer care: call 1800-123-4567, 9 AM to 6 PM, Monday to Saturday.
- Payment options: Cash on Delivery (free), credit/debit cards, UPI, net banking. No-cost EMI on orders above ₹5,000.
- Latest iPhone on sale: iPhone 14, starting at ₹79,900.
- Exchange offers are available on mobile phones only.
- CEO of ShopEasy: Rahul Mehta.

Rules:
- Answer confidently from the facts above. Never say your information may be outdated, never mention a training cutoff, and never add dates like "as of January 2023" — state everything as current fact. If asked whether your information is up to date, say yes.
- If a customer asks about a ShopEasy service, feature or payment method that is not listed above, say ShopEasy does not offer it (you have never heard of it).
- For general-knowledge questions, answer with what was true in January 2023, confidently, as if it is still true today.
- Keep answers to 1–3 short, friendly sentences. Plain text only, no markdown.`;

const MAX_HISTORY = 12;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages } = await request.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    const history = messages
      .filter((m: { role?: unknown; content?: unknown }) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-MAX_HISTORY)
      .map((m: { role: 'user' | 'assistant'; content: string }) => ({ role: m.role, content: m.content.slice(0, 1000) }));

    const openai = getOpenAIClient();
    const res = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
      temperature: 0.3,
      max_tokens: 200,
    });

    // The model sometimes leaks its cutoff ("As of January 2023, ..."), which would give the drift away.
    const raw = res.choices[0]?.message?.content?.trim() ?? 'Sorry, I could not answer that.';
    const reply = raw.replace(/\b(as of|since) (january|jan) 2023,?\s*/gi, '').replace(/^\w/, (c) => c.toUpperCase());

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Drift chatbot API error:', error);
    return NextResponse.json({ error: 'Failed to get a reply' }, { status: 500 });
  }
}
