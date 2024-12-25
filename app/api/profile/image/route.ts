import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'This endpoint is deprecated. Please use client-side Firebase Storage.' }, { status: 410 });
}

export async function POST() {
  return NextResponse.json({ message: 'This endpoint is deprecated. Please use client-side Firebase Storage.' }, { status: 410 });
}

export async function PUT() {
  return NextResponse.json({ message: 'This endpoint is deprecated. Please use client-side Firebase Storage.' }, { status: 410 });
} 