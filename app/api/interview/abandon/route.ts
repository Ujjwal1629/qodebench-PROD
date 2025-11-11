import { NextRequest, NextResponse } from 'next/server';
import { abandonInterview } from '@/app/actions/interviews';
import { verifyInterviewAPIAccess } from '@/lib/utils/api-access-checks';

export async function POST(request: NextRequest) {
  try {
    // SECURITY CHECK: Verify user has access to interview prep
    const { user, error: accessError } = await verifyInterviewAPIAccess();
    if (accessError) return accessError;

    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    await abandonInterview(sessionId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error abandoning interview:', error);
    return NextResponse.json({ error: 'Failed to abandon interview' }, { status: 500 });
  }
}
