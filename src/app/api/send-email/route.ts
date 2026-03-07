import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import * as Sentry from '@sentry/nextjs'

// Validate environment variables
if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY not configured');
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    if (!resend) {
      return NextResponse.json(
        { error: 'Email service not configured' }, 
        { status: 503 }
      );
    }

    const { to, subject, html, from } = await request.json();
    
    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, html' }, 
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: from || 'Talent Marketplace <noreply@yourdomain.com>',
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    if (error) {
      Sentry.captureException(error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Email sending error:', error);
    Sentry.captureException(error);
    return NextResponse.json(
      { error: 'Failed to send email' }, 
      { status: 500 }
    );
  }
}