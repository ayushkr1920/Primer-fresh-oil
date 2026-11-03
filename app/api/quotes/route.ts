import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { db, ensureSchema } from '@/lib/db';
export const dynamic = 'force-dynamic';
const str = (v: unknown, max: number) => typeof v === 'string' ? v.trim().slice(0,max) : '';
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const full_name=str(body.full_name,100), business_name=str(body.business_name,150), business_email=str(body.business_email,254), phone=str(body.phone,30), products_requested=str(body.products_requested,500), quantity=str(body.quantity,50), quantity_unit=str(body.quantity_unit,30), packaging_preference=str(body.packaging_preference,150), application=str(body.application,100), delivery_region=str(body.delivery_region,150), message=str(body.message,2000);
    if (full_name.length<2 || business_name.length<2 || !products_requested || !quantity || !quantity_unit) return NextResponse.json({error:'Please complete all required fields.'},{status:400});
    if (!business_email && !phone) return NextResponse.json({error:'Please provide a business email or phone number so the team can contact you.'},{status:400});
    if (business_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(business_email)) return NextResponse.json({error:'Please enter a valid email address.'},{status:400});
    if (phone && !/^[+\d() .-]{7,30}$/.test(phone)) return NextResponse.json({error:'Please enter a valid phone number.'},{status:400});
    if (body.privacy_consent !== true && body.privacy_consent !== 'on' && body.privacy_consent !== 'true') return NextResponse.json({error:'Please confirm that your details may be used to respond to your inquiry.'},{status:400});
    await ensureSchema();
    const reference_number='PFOM-'+new Date().getUTCFullYear()+'-'+randomBytes(4).toString('hex').toUpperCase();
    const { rows }=await db().query(`INSERT INTO quote_requests(reference_number,full_name,business_name,business_email,phone,products_requested,quantity,quantity_unit,packaging_preference,application,delivery_region,message) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING reference_number`,[reference_number,full_name,business_name,business_email,phone,products_requested,quantity,quantity_unit,packaging_preference,application,delivery_region,message]);
    return NextResponse.json({ok:true,reference_number:rows[0].reference_number},{status:201});
  } catch(e) { console.error('Quote submission failed:',e); return NextResponse.json({error:'We could not save your inquiry right now. Please try again shortly or contact the company directly.'},{status:500}); }
}
