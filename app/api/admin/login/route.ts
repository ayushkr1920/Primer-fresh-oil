import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, makeSession, validAdminPassword } from '@/lib/auth';
export async function POST(req: NextRequest) {
  if (!process.env.SESSION_SECRET || !process.env.ADMIN_PASSWORD) return NextResponse.json({error:'Admin login is not configured. Set SESSION_SECRET and ADMIN_PASSWORD.'},{status:503});
  try { const {password}=await req.json(); if(typeof password!=='string'||!validAdminPassword(password)) return NextResponse.json({error:'Invalid password.'},{status:401}); const res=NextResponse.json({ok:true}); res.cookies.set(ADMIN_COOKIE,makeSession(),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:8*60*60}); return res; } catch { return NextResponse.json({error:'Invalid request.'},{status:400}); }
}
