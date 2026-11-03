import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const COOKIE = 'pfom_admin';
function secret() { return process.env.SESSION_SECRET || ''; }
function sign(value: string) { return createHmac('sha256', secret()).update(value).digest('hex'); }
export function validAdminPassword(password: string) { return Boolean(process.env.ADMIN_PASSWORD) && password.length > 0 && password === process.env.ADMIN_PASSWORD; }
export function makeSession() { const value = `admin:${Date.now() + 8 * 60 * 60 * 1000}`; return `${value}.${sign(value)}`; }
export function isSessionValid(token?: string) {
  if (!token || !secret()) return false;
  const dot = token.lastIndexOf('.'); if (dot < 0) return false;
  const value = token.slice(0, dot), signature = token.slice(dot + 1), expected = sign(value);
  try { if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false; } catch { return false; }
  const [role, expires] = value.split(':'); return role === 'admin' && Number(expires) > Date.now();
}
export async function requireAdmin() {
  const jar = await cookies();
  return isSessionValid(jar.get(COOKIE)?.value);
}
export const ADMIN_COOKIE = COOKIE;
